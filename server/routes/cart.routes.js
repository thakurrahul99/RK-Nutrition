import { Router } from 'express';
import mongoose from 'mongoose';
import { getDb, saveDb, Cart, Product, Coupon } from '../config/db.js';
import { authenticateToken, optionalAuthenticateToken } from '../middleware/auth.js';

const router = Router();

// In-memory cart store for guest sessions or offline mode
const memoryCarts = new Map();

// Helper to calculate full cart state with authoritative database pricing and inventory
const calculateCartDetails = (cartItems, appliedCouponCode = null) => {
  const db = getDb();
  let subtotal = 0;
  const verifiedItems = [];
  const warnings = [];

  for (const item of cartItems) {
    const product = (db.products || []).find((p) => p.id === item.productId || p.slug === item.productId);
    if (!product || product.status !== 'published' || product.visibility === false) {
      warnings.push(`Item "${item.productId}" is no longer available.`);
      continue;
    }

    const qty = Math.max(1, Number(item.quantity) || 1);
    let variant = null;
    if (item.variantId) {
      variant = (product.variants || []).find((v) => v.id === item.variantId);
    } else if (item.variant && item.variant.id) {
      variant = (product.variants || []).find((v) => v.id === item.variant.id);
    }

    // Check stock
    const availableStock = variant ? variant.stock : product.stock;
    if (availableStock < qty) {
      warnings.push(`Only ${availableStock} units available for "${product.name}${variant ? ' (' + variant.name + ')' : ''}".`);
    }

    const price = variant?.salePrice || variant?.price || product.salePrice || product.price || 0;
    const itemTotal = price * qty;
    subtotal += itemTotal;

    verifiedItems.push({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: (product.images && product.images[0]) || product.image || '',
      variant: variant ? { id: variant.id, name: variant.name, sku: variant.sku, price } : null,
      sku: variant?.sku || product.sku,
      price,
      quantity: qty,
      itemTotal,
      stock: availableStock,
      paymentRule: product.paymentRule || 'ALL'
    });
  }

  // Calculate discount
  let discountAmount = 0;
  let activeCoupon = null;

  if (appliedCouponCode) {
    const coupon = (db.coupons || []).find(
      (c) => c.code.toUpperCase() === appliedCouponCode.trim().toUpperCase() && c.isActive
    );

    if (coupon) {
      const isNotExpired = !coupon.expiryDate || new Date(coupon.expiryDate) >= new Date();
      const meetsMinVal = !coupon.minCartValue || subtotal >= coupon.minCartValue;

      if (isNotExpired && meetsMinVal) {
        if (coupon.discountType === 'percentage') {
          discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
        } else {
          discountAmount = Math.min(coupon.discountValue, subtotal);
        }
        activeCoupon = {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          description: coupon.description
        };
      }
    }
  }

  // Shipping
  const freeShippingThreshold = db.storeSettings?.freeShippingThreshold || 999;
  const standardShippingFee = db.storeSettings?.shippingFee || 99;
  const shippingFee = (subtotal === 0 || subtotal >= freeShippingThreshold) ? 0 : standardShippingFee;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  return {
    items: verifiedItems,
    itemCount: verifiedItems.reduce((acc, it) => acc + it.quantity, 0),
    subtotal,
    discountAmount,
    shippingFee,
    total,
    appliedCoupon: activeCoupon,
    warnings
  };
};

// GET /api/cart (Fetch Customer Cart)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = null;

    if (mongoose.connection.readyState === 1) {
      cart = await Cart.findOne({ userId });
    }
    if (!cart) {
      cart = memoryCarts.get(userId) || { userId, items: [], appliedCoupon: null };
    }

    const calculated = calculateCartDetails(cart.items || [], cart.appliedCoupon);

    res.json({
      success: true,
      cart: {
        userId,
        ...calculated
      }
    });
  } catch (err) {
    console.error('Cart fetch error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch cart.' });
  }
});

// POST /api/cart/add (Add to Cart)
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, variantId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, error: 'Product ID is required.' });
    }

    let cart = memoryCarts.get(userId) || { userId, items: [], appliedCoupon: null };
    if (mongoose.connection.readyState === 1) {
      const dbCart = await Cart.findOne({ userId });
      if (dbCart) cart = { userId, items: dbCart.items, appliedCoupon: dbCart.appliedCoupon };
    }

    const existingIdx = cart.items.findIndex(
      (it) => it.productId === productId && (it.variantId || null) === (variantId || null)
    );

    const addQty = Math.max(1, parseInt(quantity, 10) || 1);

    if (existingIdx > -1) {
      cart.items[existingIdx].quantity += addQty;
    } else {
      cart.items.push({ productId, variantId: variantId || null, quantity: addQty });
    }

    memoryCarts.set(userId, cart);

    if (mongoose.connection.readyState === 1) {
      await Cart.findOneAndUpdate({ userId }, cart, { upsert: true });
    }

    const calculated = calculateCartDetails(cart.items, cart.appliedCoupon);

    res.json({
      success: true,
      message: 'Item added to cart.',
      cart: { userId, ...calculated }
    });
  } catch (err) {
    console.error('Cart add error:', err);
    res.status(500).json({ success: false, error: 'Failed to add item to cart.' });
  }
});

// PUT /api/cart/update (Update Quantity)
router.put('/update', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, variantId, quantity } = req.body;

    let cart = memoryCarts.get(userId) || { userId, items: [], appliedCoupon: null };
    if (mongoose.connection.readyState === 1) {
      const dbCart = await Cart.findOne({ userId });
      if (dbCart) cart = { userId, items: dbCart.items, appliedCoupon: dbCart.appliedCoupon };
    }

    const itemIdx = cart.items.findIndex(
      (it) => it.productId === productId && (it.variantId || null) === (variantId || null)
    );

    if (itemIdx === -1) {
      return res.status(404).json({ success: false, error: 'Item not in cart.' });
    }

    const newQty = parseInt(quantity, 10);
    if (newQty <= 0) {
      cart.items.splice(itemIdx, 1);
    } else {
      cart.items[itemIdx].quantity = newQty;
    }

    memoryCarts.set(userId, cart);
    if (mongoose.connection.readyState === 1) {
      await Cart.findOneAndUpdate({ userId }, cart, { upsert: true });
    }

    const calculated = calculateCartDetails(cart.items, cart.appliedCoupon);

    res.json({
      success: true,
      cart: { userId, ...calculated }
    });
  } catch (err) {
    console.error('Cart update error:', err);
    res.status(500).json({ success: false, error: 'Failed to update cart.' });
  }
});

// DELETE /api/cart/remove (Remove Item)
router.delete('/remove', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, variantId } = req.body;

    let cart = memoryCarts.get(userId) || { userId, items: [], appliedCoupon: null };
    if (mongoose.connection.readyState === 1) {
      const dbCart = await Cart.findOne({ userId });
      if (dbCart) cart = { userId, items: dbCart.items, appliedCoupon: dbCart.appliedCoupon };
    }

    cart.items = cart.items.filter(
      (it) => !(it.productId === productId && (it.variantId || null) === (variantId || null))
    );

    memoryCarts.set(userId, cart);
    if (mongoose.connection.readyState === 1) {
      await Cart.findOneAndUpdate({ userId }, cart, { upsert: true });
    }

    const calculated = calculateCartDetails(cart.items, cart.appliedCoupon);

    res.json({
      success: true,
      message: 'Item removed from cart.',
      cart: { userId, ...calculated }
    });
  } catch (err) {
    console.error('Cart remove error:', err);
    res.status(500).json({ success: false, error: 'Failed to remove item.' });
  }
});

// DELETE /api/cart/clear (Empty Cart)
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const emptyCart = { userId, items: [], appliedCoupon: null };
    memoryCarts.set(userId, emptyCart);

    if (mongoose.connection.readyState === 1) {
      await Cart.findOneAndUpdate({ userId }, emptyCart, { upsert: true });
    }

    res.json({
      success: true,
      message: 'Cart cleared.',
      cart: { userId, items: [], itemCount: 0, subtotal: 0, total: 0 }
    });
  } catch (err) {
    console.error('Cart clear error:', err);
    res.status(500).json({ success: false, error: 'Failed to clear cart.' });
  }
});

// POST /api/cart/sync (Merge Guest LocalStorage Cart into User DB Cart)
router.post('/sync', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { items = [] } = req.body;

    let cart = memoryCarts.get(userId) || { userId, items: [], appliedCoupon: null };
    if (mongoose.connection.readyState === 1) {
      const dbCart = await Cart.findOne({ userId });
      if (dbCart) cart = { userId, items: dbCart.items, appliedCoupon: dbCart.appliedCoupon };
    }

    // Merge incoming items
    for (const guestItem of items) {
      const existing = cart.items.find(
        (it) => it.productId === guestItem.productId && (it.variantId || null) === (guestItem.variantId || null)
      );
      if (existing) {
        existing.quantity += guestItem.quantity || 1;
      } else {
        cart.items.push({
          productId: guestItem.productId,
          variantId: guestItem.variantId || null,
          quantity: guestItem.quantity || 1
        });
      }
    }

    memoryCarts.set(userId, cart);
    if (mongoose.connection.readyState === 1) {
      await Cart.findOneAndUpdate({ userId }, cart, { upsert: true });
    }

    const calculated = calculateCartDetails(cart.items, cart.appliedCoupon);

    res.json({
      success: true,
      cart: { userId, ...calculated }
    });
  } catch (err) {
    console.error('Cart sync error:', err);
    res.status(500).json({ success: false, error: 'Failed to sync cart.' });
  }
});

// POST /api/cart/validate (Public / Customer Live Cart Validation for Checkout)
router.post('/validate', (req, res) => {
  try {
    const { items = [], couponCode = null } = req.body;

    const formattedItems = (items || []).map((it) => ({
      productId: it.productId || it.id,
      variantId: it.variantId || it.variant?.id || null,
      quantity: it.quantity || 1
    }));

    const calculated = calculateCartDetails(formattedItems, couponCode);

    res.json({
      success: true,
      ...calculated
    });
  } catch (err) {
    console.error('Cart validate error:', err);
    res.status(500).json({ success: false, error: 'Validation failed.' });
  }
});

export default router;
