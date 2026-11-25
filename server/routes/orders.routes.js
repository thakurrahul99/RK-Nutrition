import { Router } from 'express';
import mongoose from 'mongoose';
import { getDb, saveDb, addLog, Order, Product, Coupon, Cart, User } from '../config/db.js';
import { authenticateToken, requireClientAdmin, optionalAuthenticateToken } from '../middleware/auth.js';
import { apiMutationLimiter } from '../middleware/rateLimiter.js';
import { isValidEmail, isValidPhone, sanitizeInput } from '../utils/security.js';
import { sendOrderConfirmationEmail } from '../utils/mailer.js';

const router = Router();

// Public order-lookup rate limiter: per-IP sliding window
const publicLookupAttempts = new Map();
const PUBLIC_LOOKUP_WINDOW_MS = 15 * 60 * 1000;
const PUBLIC_LOOKUP_MAX_ATTEMPTS = 10;

// Helper to look up an order from MongoDB first, then fallback to db.orders
async function findOrder(id, db) {
  let order = null;

  if (mongoose.connection.readyState === 1) {
    try {
      const doc = await Order.findOne({
        $or: [
          { id },
          { orderNumber: Number(id) || -1 },
          ...(mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }] : [])
        ]
      }).lean();
      if (doc) {
        order = doc;
      }
    } catch (e) {
      console.warn('[Orders Route] Order lookup in MongoDB failed:', e.message);
    }
  }

  if (!order) {
    order = (db.orders || []).find((o) => o.id === id || String(o.orderNumber) === id || String(o._id) === id) || null;
  }

  return order;
}

// Helper to restore product inventory for a cancelled order (awaited & synchronized)
async function restoreOrderInventory(order, db) {
  for (const item of order.items || []) {
    const qty = Math.max(1, Number(item.quantity) || 1);
    const product = (db.products || []).find((p) => p.id === item.productId || p.slug === item.productId);
    if (product) {
      if (product.stock !== undefined) {
        product.stock += qty;
        if (product.stock > 0 && product.availability === 'out-of-stock') {
          product.availability = 'in-stock';
        }
      }

      let matchedVariant = null;
      if (item.variant) {
        matchedVariant = (product.variants || []).find(
          (v) => v.name.toLowerCase() === item.variant.toLowerCase() || v.sku === item.sku
        );
        if (matchedVariant && matchedVariant.stock !== undefined) {
          matchedVariant.stock += qty;
        }
      }

      if (mongoose.connection.readyState === 1) {
        try {
          if (matchedVariant) {
            await Product.findOneAndUpdate(
              { $or: [{ id: product.id }, { sku: product.sku }], 'variants.id': matchedVariant.id },
              { $inc: { stock: qty, 'variants.$.stock': qty }, $set: { availability: product.availability } }
            );
          } else {
            await Product.findOneAndUpdate(
              { $or: [{ id: product.id }, { sku: product.sku }] },
              { $inc: { stock: qty }, $set: { availability: product.availability } }
            );
          }
        } catch (e) {
          console.warn('Product stock sync on cancel error:', e.message);
        }
      }
    }
  }
}

// Helper to synchronize order changes across MongoDB and local cache
async function syncOrderUpdate(order, db) {
  if (mongoose.connection.readyState === 1) {
    try {
      const { _id, __v, ...updateData } = order;
      await Order.findOneAndUpdate(
        { $or: [{ id: order.id }, { orderNumber: order.orderNumber }] },
        { $set: updateData },
        { new: true, upsert: true }
      );
    } catch (err) {
      console.error('[Orders Route] MongoDB syncOrderUpdate error:', err.message);
    }
  }

  db.orders = db.orders || [];
  const idx = db.orders.findIndex((o) => o.id === order.id || o.orderNumber === order.orderNumber);
  if (idx !== -1) {
    db.orders[idx] = order;
  } else {
    db.orders.unshift(order);
  }
  saveDb(db);
}

// GET /api/orders (Client Admin list with search and filters)
router.get('/', authenticateToken, requireClientAdmin, async (req, res) => {
  try {
    const { status, paymentMethod, paymentStatus, search, page = 1, limit = 500 } = req.query;
    let orders = [];

    // 1. Authoritative lookup from MongoDB Atlas
    if (mongoose.connection.readyState === 1) {
      try {
        const mongoOrders = await Order.find().sort({ createdAt: -1 }).lean();
        if (Array.isArray(mongoOrders)) {
          orders = mongoOrders;
          // Keep in-memory cache synchronized with authoritative MongoDB state
          const db = getDb();
          db.orders = mongoOrders;
          saveDb(db);
        }
      } catch (e) {
        console.warn('[Orders Route] MongoDB query failed, falling back to cache:', e.message);
      }
    }

    // 2. Fallback to cache if MongoDB is offline or disconnected
    if (!orders || orders.length === 0) {
      const db = getDb();
      orders = [...(db.orders || [])];
    }

    if (status && status !== 'all') {
      orders = orders.filter((o) => o.orderStatus?.toLowerCase() === status.toLowerCase());
    }

    if (paymentMethod && paymentMethod !== 'all') {
      orders = orders.filter((o) => o.paymentMethod?.toLowerCase() === paymentMethod.toLowerCase());
    }

    if (paymentStatus && paymentStatus !== 'all') {
      orders = orders.filter((o) => o.paymentStatus?.toLowerCase() === paymentStatus.toLowerCase());
    }

    if (search) {
      const q = search.trim().toLowerCase();
      orders = orders.filter(
        (o) =>
          o.id?.toLowerCase().includes(q) ||
          String(o.orderNumber || '').includes(q) ||
          o.customer?.name?.toLowerCase().includes(q) ||
          o.customer?.email?.toLowerCase().includes(q) ||
          o.customer?.phone?.includes(q) ||
          o.tracking?.trackingNumber?.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 500);
    const totalCount = orders.length;
    const paginatedOrders = orders.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({
      success: true,
      count: totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      orders: paginatedOrders
    });
  } catch (err) {
    console.error('Orders listing error:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve orders.' });
  }
});

// GET /api/orders/my-orders (Customer Order History)
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = (req.user.email || '').toLowerCase();
    let orders = [];

    if (mongoose.connection.readyState === 1) {
      try {
        orders = await Order.find({
          $or: [
            { userId: userId },
            { 'customer.email': userEmail }
          ]
        }).sort({ createdAt: -1 }).lean();
      } catch (e) {
        console.warn('MongoDB my-orders query error:', e.message);
      }
    }

    if (!orders || orders.length === 0) {
      const db = getDb();
      orders = (db.orders || []).filter(
        (o) => o.userId === userId || o.customer?.email?.toLowerCase() === userEmail
      );
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    console.error('My-orders error:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve customer orders.' });
  }
});

// GET /api/orders/public/:id (Public tracking with phone number verification)
router.get('/public/:id', async (req, res) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();
    const attempt = publicLookupAttempts.get(ip);

    if (!attempt || now - attempt.firstAttemptTime >= PUBLIC_LOOKUP_WINDOW_MS) {
      publicLookupAttempts.set(ip, { count: 1, firstAttemptTime: now });
    } else if (attempt.count >= PUBLIC_LOOKUP_MAX_ATTEMPTS) {
      const remainingSecs = Math.ceil((PUBLIC_LOOKUP_WINDOW_MS - (now - attempt.firstAttemptTime)) / 1000);
      return res.status(429).json({
        success: false,
        error: `Too many lookup attempts. Please retry in ${remainingSecs} seconds.`
      });
    } else {
      attempt.count += 1;
      publicLookupAttempts.set(ip, attempt);
    }

    const { id } = req.params;
    const phone = String(req.query.phone || '').replace(/\D/g, '');
    if (phone.length < 10) {
      return res.status(400).json({ success: false, error: 'Enter the 10-digit mobile number used for this order.' });
    }

    // Production orders are stored in MongoDB; retain the cache lookup for legacy/local orders.
    let order = null;
    if (mongoose.connection.readyState === 1) {
      order = await Order.findOne({
        $or: [{ id }, { orderNumber: Number(id) || -1 }]
      }).lean();
    }

    if (!order) {
      const db = getDb();
      order = (db.orders || []).find((o) => o.id === id || String(o.orderNumber) === id) || null;
    }

    const orderPhone = String(order?.customer?.phone || '').replace(/\D/g, '');
    if (!order || phone.slice(-10) !== orderPhone.slice(-10)) {
      return res.status(401).json({
        success: false,
        error: 'Unable to verify order details. Please verify your order ID and registered phone number.'
      });
    }

    return res.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        customer: order.customer,
        items: order.items,
        subtotal: order.subtotal,
        discount: order.discount,
        couponCode: order.couponCode,
        shippingFee: order.shippingFee,
        tax: order.tax || 0,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        tracking: order.tracking,
        createdAt: order.createdAt
      }
    });
  } catch (err) {
    console.error('Public order lookup error:', err);
    return res.status(500).json({ success: false, error: 'Unable to retrieve this order right now. Please try again.' });
  }
});

// GET /api/orders/:id (Order Details)
router.get('/:id', optionalAuthenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const order = await findOrder(id, db);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }

    // Authorization check: Admin or Order owner
    const isAdmin = req.user?.role === 'CLIENT_ADMIN' || req.user?.role === 'SUPER_ADMIN';
    const isOwner = req.user && (order.userId === req.user.id || order.customer?.email?.toLowerCase() === (req.user.email || '').toLowerCase());

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ success: false, error: 'Access denied: You cannot view this order.' });
    }

    res.json({
      success: true,
      order
    });
  } catch (err) {
    console.error('Order retrieval error:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve order details.' });
  }
});

// POST /api/orders (Customer Checkout Creation)
router.post('/', apiMutationLimiter, authenticateToken, async (req, res) => {
  try {
    const { customer, items, paymentMethod, couponCode } = req.body;
    const db = getDb();

    // 1. Customer Details Validation
    if (!customer || !customer.name || !customer.phone || !customer.address || !customer.city || !customer.pincode) {
      return res.status(400).json({ success: false, error: 'Full delivery name, phone, address, city, and PIN code are required.' });
    }

    const cleanEmail = (customer.email || req.user?.email || '').trim().toLowerCase();
    const cleanPhone = customer.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({ success: false, error: 'Valid 10-digit phone number is required.' });
    }

    // 2. Items Validation
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart is empty. Please add products.' });
    }

    let subtotal = 0;
    const verifiedItems = [];
    const prepaidRequiring = [];
    const stockUpdates = [];

    // 3. Authoritative Inventory and Pricing Verification
    for (const item of items) {
      const product = (db.products || []).find((p) => p.id === item.productId || p.slug === item.productId);
      if (!product || product.status !== 'published') {
        return res.status(400).json({ success: false, error: `Product "${item.productId}" is no longer available.` });
      }

      const qty = Math.max(1, Number(item.quantity) || 1);

      // Resolve variant
      let variant = null;
      if (item.variantId) {
        variant = (product.variants || []).find((v) => v.id === item.variantId);
      } else if (item.variant && item.variant.id) {
        variant = (product.variants || []).find((v) => v.id === item.variant.id);
      } else if (item.variantName && item.variantName !== 'Standard') {
        variant = (product.variants || []).find((v) => v.name.toLowerCase() === item.variantName.toLowerCase());
      }

      // Check stock
      const availableStock = variant ? variant.stock : product.stock;
      if (availableStock < qty) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for "${product.name}${variant ? ' (' + variant.name + ')' : ''}". Available: ${availableStock}, requested: ${qty}.`
        });
      }

      const price = variant?.salePrice || variant?.price || product.salePrice || product.price || 0;
      const itemTotal = price * qty;
      subtotal += itemTotal;

      if (product.paymentRule === 'PREPAID_ONLY' || product.paymentRule === 'COD_DISABLED') {
        prepaidRequiring.push(product.name);
      }

      verifiedItems.push({
        productId: product.id,
        name: product.name,
        variant: variant ? variant.name : (item.variantName || 'Standard'),
        flavour: variant?.flavour || '',
        sku: variant?.sku || product.sku,
        price,
        quantity: qty,
        total: itemTotal,
        image: (product.images && product.images[0]) || product.image || ''
      });

      stockUpdates.push({ product, variant, qty });
    }

    // 4. Mixed Cart Payment Rule Check
    const normalizedMethod = (paymentMethod || 'COD').toUpperCase();
    if (normalizedMethod === 'COD' && prepaidRequiring.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Cash on Delivery is unavailable for this order because the following product(s) require prepaid payment: ${prepaidRequiring.join(', ')}.`
      });
    }

    // 5. Validate & Calculate Coupon (before mutating stock)
    let discount = 0;
    let appliedCoupon = null;
    let targetCoupon = null;
    if (couponCode) {
      const cleanCode = couponCode.trim().toUpperCase();
      const coupon = (db.coupons || []).find((c) => c.code.toUpperCase() === cleanCode);
      if (coupon && coupon.isActive) {
        const notExpired = !coupon.expiryDate || new Date(coupon.expiryDate) >= new Date();
        const minMet = !coupon.minCartValue || subtotal >= coupon.minCartValue;
        const underGlobalMax = !coupon.maxUses || (coupon.usedCount || 0) < coupon.maxUses;
        const customerUses = (coupon.usedByCustomers || []).filter((uid) => uid === req.user.id).length;
        const underCustomerLimit = !coupon.perCustomerLimit || customerUses < coupon.perCustomerLimit;

        if (notExpired && minMet && underGlobalMax && underCustomerLimit) {
          if (coupon.discountType === 'percentage') {
            discount = Math.round((subtotal * coupon.discountValue) / 100);
          } else {
            discount = Math.min(coupon.discountValue, subtotal);
          }
          appliedCoupon = coupon.code;
          targetCoupon = coupon;
        }
      }
    }

    // 6. Shipping and Total
    const freeShippingThreshold = db.storeSettings?.freeShippingThreshold || 999;
    const standardShippingFee = db.storeSettings?.shippingFee || 99;
    const shippingFee = subtotal >= freeShippingThreshold ? 0 : standardShippingFee;
    const total = Math.max(0, subtotal - discount + shippingFee);

    // 7. Atomic Inventory & Coupon Claim (with full rollback on failure)
    const deductedMongo = [];
    let claimedMongoCoupon = false;

    const rollbackDeductions = async () => {
      for (const d of deductedMongo) {
        try {
          if (d.variantId) {
            await Product.findOneAndUpdate(
              { id: d.productId, 'variants.id': d.variantId },
              { $inc: { 'variants.$.stock': d.qty, stock: d.stockDeducted }, $set: { availability: 'in-stock' } }
            );
          } else {
            await Product.findOneAndUpdate(
              { id: d.productId },
              { $inc: { stock: d.qty }, $set: { availability: 'in-stock' } }
            );
          }
        } catch (rbErr) {
          console.error('[Orders] Stock rollback error:', rbErr.message);
        }
      }
      if (claimedMongoCoupon && targetCoupon) {
        try {
          await Coupon.findOneAndUpdate(
            { code: targetCoupon.code },
            { $inc: { usedCount: -1 } }
          );
        } catch (rbErr) {
          console.error('[Orders] Coupon rollback error:', rbErr.message);
        }
      }
    };

    if (mongoose.connection.readyState === 1) {
      if (targetCoupon) {
        const claimed = await Coupon.findOneAndUpdate(
          {
            code: targetCoupon.code,
            isActive: true,
            $or: [
              { maxUses: { $lte: 0 } },
              { $expr: { $lt: ['$usedCount', '$maxUses'] } }
            ]
          },
          {
            $inc: { usedCount: 1 },
            $push: { usedByCustomers: req.user.id }
          },
          { returnDocument: 'after' }
        );
        if (!claimed) {
          return res.status(400).json({
            success: false,
            error: `Coupon "${targetCoupon.code}" has reached its usage limit or is inactive.`
          });
        }
        claimedMongoCoupon = true;
      }

      for (const { product, variant, qty } of stockUpdates) {
        let updatedProd = null;
        if (variant) {
          const canDeductParent = typeof product.stock === 'number' && product.stock >= qty;
          const stockDeducted = canDeductParent ? qty : 0;
          updatedProd = await Product.findOneAndUpdate(
            {
              id: product.id,
              variants: { $elemMatch: { id: variant.id, stock: { $gte: qty } } }
            },
            {
              $inc: {
                'variants.$.stock': -qty,
                ...(stockDeducted > 0 ? { stock: -stockDeducted } : {})
              }
            },
            { returnDocument: 'after' }
          );
          if (!updatedProd) {
            await rollbackDeductions();
            return res.status(400).json({
              success: false,
              error: `Insufficient stock for "${product.name} (${variant.name})".`
            });
          }
          deductedMongo.push({ productId: product.id, variantId: variant.id, qty, stockDeducted });
        } else {
          updatedProd = await Product.findOneAndUpdate(
            { id: product.id, stock: { $gte: qty } },
            { $inc: { stock: -qty } },
            { returnDocument: 'after' }
          );
          if (!updatedProd) {
            await rollbackDeductions();
            return res.status(400).json({
              success: false,
              error: `Insufficient stock for "${product.name}".`
            });
          }
          deductedMongo.push({ productId: product.id, variantId: null, qty, stockDeducted: qty });
        }

        if (updatedProd.stock <= 0 && updatedProd.availability !== 'out-of-stock') {
          await Product.updateOne({ id: product.id }, { $set: { availability: 'out-of-stock' } }).catch(() => {});
        }
      }
    } else if (process.env.NODE_ENV === 'production') {
      return res.status(503).json({
        success: false,
        error: 'Order processing service is temporarily reconnecting to the database. Please try again shortly.'
      });
    }

    // 8. Generate Order Reference
    let maxOrderNumber = 1000;
    if (mongoose.connection.readyState === 1) {
      try {
        const topOrder = await Order.findOne().sort({ orderNumber: -1 }).select('orderNumber').lean();
        if (topOrder && typeof topOrder.orderNumber === 'number') {
          maxOrderNumber = Math.max(maxOrderNumber, topOrder.orderNumber);
        }
      } catch (e) {
        console.warn('Could not query top order number from Mongo:', e.message);
      }
    }
    if (Array.isArray(db.orders) && db.orders.length > 0) {
      const localMax = Math.max(...db.orders.map((o) => o.orderNumber || 1000));
      maxOrderNumber = Math.max(maxOrderNumber, localMax);
    }
    const newOrderNumber = maxOrderNumber + 1;
    const newOrderId = `ORD-${new Date().getFullYear()}-${newOrderNumber}`;

    const newOrder = {
      id: newOrderId,
      orderNumber: newOrderNumber,
      userId: req.user?.id || null,
      customer: {
        name: sanitizeInput(customer.name.trim()),
        email: cleanEmail,
        phone: cleanPhone,
        address: sanitizeInput(customer.address.trim()),
        city: sanitizeInput(customer.city.trim()),
        state: sanitizeInput(customer.state?.trim() || ''),
        pincode: sanitizeInput(customer.pincode.trim())
      },
      items: verifiedItems,
      subtotal,
      discount,
      couponCode: appliedCoupon,
      shippingFee,
      tax: 0,
      total,
      paymentMethod: normalizedMethod,
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING',
      tracking: {
        carrier: '',
        trackingNumber: '',
        shippedAt: null,
        estimatedDelivery: ''
      },
      createdAt: new Date().toISOString()
    };

    // Persist to MongoDB as authoritative source of truth (rollback inventory/coupon on failure)
    if (mongoose.connection.readyState === 1) {
      try {
        await Order.create(newOrder);
      } catch (orderErr) {
        await rollbackDeductions();
        throw orderErr;
      }
    }

    // Synchronize in-memory cache only after DB persistence succeeded
    for (const { product, variant, qty } of stockUpdates) {
      if (variant && variant.stock !== undefined) {
        variant.stock = Math.max(0, variant.stock - qty);
      }
      if (product.stock !== undefined) {
        product.stock = Math.max(0, product.stock - qty);
        if (product.stock <= 0) {
          product.availability = 'out-of-stock';
        }
      }
    }
    if (targetCoupon) {
      targetCoupon.usedCount = (targetCoupon.usedCount || 0) + 1;
      targetCoupon.usedByCustomers = targetCoupon.usedByCustomers || [];
      targetCoupon.usedByCustomers.push(req.user.id);
    }

    db.orders = db.orders || [];
    db.orders.unshift(newOrder);
    saveDb(db);

    // 9. Automatic Delivery Address Saving to Customer Profile
    if (req.user?.id) {
      try {
        const user = (db.users || []).find((u) => u.id === req.user.id);
        const normAddr = customer.address.trim().toLowerCase();
        const normCity = customer.city.trim().toLowerCase();
        const normPin = customer.pincode.trim().toLowerCase();

        let newAddress = null;

        if (user) {
          user.addresses = user.addresses || [];
          const alreadyExists = user.addresses.some(
            (a) =>
              (a.addressLine1 || '').trim().toLowerCase() === normAddr &&
              (a.city || '').trim().toLowerCase() === normCity &&
              (a.postalCode || '').trim().toLowerCase() === normPin
          );

          if (!alreadyExists) {
            newAddress = {
              id: `addr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              fullName: customer.name.trim(),
              phone: cleanPhone,
              addressLine1: customer.address.trim(),
              addressLine2: '',
              city: customer.city.trim(),
              state: customer.state?.trim() || '',
              postalCode: customer.pincode.trim(),
              country: 'India',
              isDefault: user.addresses.length === 0
            };
            user.addresses.push(newAddress);
            if (!user.phone && cleanPhone) {
              user.phone = cleanPhone;
            }
            saveDb(db);
          }
        }

        // Also persist to MongoDB User collection
        if (mongoose.connection.readyState === 1) {
          try {
            const mongoUser = await User.findOne({ id: req.user.id });
            if (mongoUser) {
              mongoUser.addresses = mongoUser.addresses || [];
              const mongoExists = mongoUser.addresses.some(
                (a) =>
                  (a.addressLine1 || '').trim().toLowerCase() === normAddr &&
                  (a.city || '').trim().toLowerCase() === normCity &&
                  (a.postalCode || '').trim().toLowerCase() === normPin
              );

              if (!mongoExists) {
                const mongoAddress = newAddress || {
                  id: `addr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                  fullName: customer.name.trim(),
                  phone: cleanPhone,
                  addressLine1: customer.address.trim(),
                  addressLine2: '',
                  city: customer.city.trim(),
                  state: customer.state?.trim() || '',
                  postalCode: customer.pincode.trim(),
                  country: 'India',
                  isDefault: mongoUser.addresses.length === 0
                };
                mongoUser.addresses.push(mongoAddress);
                if (!mongoUser.phone && cleanPhone) {
                  mongoUser.phone = cleanPhone;
                }
                await mongoUser.save();
              }
            }
          } catch (mErr) {
            console.warn('[Orders] MongoDB address auto-save warning:', mErr.message);
          }
        }
      } catch (addrErr) {
        console.warn('[Orders] Address auto-save warning:', addrErr.message);
      }
    }

    // Dispatch confirmation email
    if (newOrder.customer.email) {
      await sendOrderConfirmationEmail(newOrder).catch(() => {});
    }

    addLog('INFO', 'ORDERS', `Order created: ${newOrder.id} for ${newOrder.customer.name} (₹${newOrder.total}) via ${newOrder.paymentMethod}`, req.user);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      order: newOrder
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ success: false, error: 'Failed to create order.' });
  }
});

// PUT /api/orders/:id/cancel (Cancel Order & Restore Inventory)
router.put('/:id/cancel', optionalAuthenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const order = await findOrder(id, db);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }

    // Authorization
    const isAdmin = req.user?.role === 'CLIENT_ADMIN' || req.user?.role === 'SUPER_ADMIN';
    const isOwner = req.user && (
      order.userId === req.user.id ||
      (order.customer?.email && req.user.email && order.customer.email.toLowerCase() === req.user.email.toLowerCase()) ||
      (order.customer?.phone && req.user.phone && order.customer.phone.replace(/\D/g, '') === String(req.user.phone).replace(/\D/g, ''))
    );

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ success: false, error: 'Unauthorized to cancel this order.' });
    }

    if (order.orderStatus === 'CANCELLED') {
      return res.status(400).json({ success: false, error: 'Order has already been cancelled.' });
    }

    if (['SHIPPED', 'DELIVERED'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, error: `Order cannot be cancelled in "${order.orderStatus}" status.` });
    }

    const nowIso = new Date().toISOString();
    const canceller = req.user ? `${req.user.name} (${req.user.role})` : 'Customer';

    if (mongoose.connection.readyState === 1) {
      const claimedCancel = await Order.findOneAndUpdate(
        { id: order.id, orderStatus: { $nin: ['CANCELLED', 'SHIPPED', 'DELIVERED'] } },
        { $set: { orderStatus: 'CANCELLED', cancelledAt: nowIso, cancelledBy: canceller } },
        { returnDocument: 'after' }
      );
      if (!claimedCancel) {
        return res.status(400).json({
          success: false,
          error: 'Order has already been cancelled or cannot be cancelled in its current status.'
        });
      }
    }

    // Restore stock back to products (awaited)
    await restoreOrderInventory(order, db);

    order.orderStatus = 'CANCELLED';
    order.cancelledAt = nowIso;
    order.cancelledBy = canceller;

    await syncOrderUpdate(order, db);

    addLog('INFO', 'ORDERS', `Order ${order.id} cancelled. Inventory restored.`, req.user);

    res.json({
      success: true,
      message: 'Order has been cancelled and stock has been restored.',
      order
    });
  } catch (err) {
    console.error('Order cancellation error:', err);
    res.status(500).json({ success: false, error: 'Failed to cancel order.' });
  }
});

// PUT /api/orders/:id/status (Client Admin Update Status)
router.put('/:id/status', authenticateToken, requireClientAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus, carrier, trackingNumber, estimatedDelivery } = req.body;
    const db = getDb();

    const order = await findOrder(id, db);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }

    // If changing to CANCELLED from another status, atomically claim & restore inventory
    if (orderStatus && orderStatus === 'CANCELLED' && order.orderStatus !== 'CANCELLED') {
      const nowIso = new Date().toISOString();
      const canceller = `${req.user.name} (${req.user.role})`;
      if (mongoose.connection.readyState === 1) {
        const claimed = await Order.findOneAndUpdate(
          { id: order.id, orderStatus: { $ne: 'CANCELLED' } },
          { $set: { orderStatus: 'CANCELLED', cancelledAt: nowIso, cancelledBy: canceller } },
          { returnDocument: 'after' }
        );
        if (!claimed) {
          return res.status(400).json({ success: false, error: 'Order has already been cancelled.' });
        }
      }
      await restoreOrderInventory(order, db);
      order.cancelledAt = nowIso;
      order.cancelledBy = canceller;
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    if (!order.tracking) {
      order.tracking = { carrier: '', trackingNumber: '', shippedAt: null, estimatedDelivery: '' };
    }

    if (carrier !== undefined) order.tracking.carrier = carrier.trim();
    if (trackingNumber !== undefined) {
      order.tracking.trackingNumber = trackingNumber.trim();
      if (trackingNumber.trim() && !order.tracking.shippedAt) {
        order.tracking.shippedAt = new Date().toISOString();
        if (order.orderStatus === 'PENDING' || order.orderStatus === 'CONFIRMED') {
          order.orderStatus = 'SHIPPED';
        }
      }
    }
    if (estimatedDelivery !== undefined) {
      order.tracking.estimatedDelivery = estimatedDelivery.trim();
    }

    await syncOrderUpdate(order, db);

    addLog('INFO', 'ORDERS', `Order ${order.id} updated: Status=${order.orderStatus}, Payment=${order.paymentStatus} by ${req.user.name}`);

    res.json({
      success: true,
      order
    });
  } catch (err) {
    console.error('Order status update error:', err);
    res.status(500).json({ success: false, error: 'Failed to update order status.' });
  }
});

// PUT /api/orders/:id/tracking (Client Admin Update Courier Tracking)
router.put('/:id/tracking', authenticateToken, requireClientAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { carrier, trackingNumber, estimatedDelivery } = req.body;
    const db = getDb();

    const order = await findOrder(id, db);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }

    if (!order.tracking) {
      order.tracking = { carrier: '', trackingNumber: '', shippedAt: null, estimatedDelivery: '' };
    }

    if (carrier !== undefined) order.tracking.carrier = carrier.trim();
    if (trackingNumber !== undefined) {
      order.tracking.trackingNumber = trackingNumber.trim();
      if (trackingNumber.trim() && !order.tracking.shippedAt) {
        order.tracking.shippedAt = new Date().toISOString();
        if (order.orderStatus === 'PENDING' || order.orderStatus === 'CONFIRMED') {
          order.orderStatus = 'SHIPPED';
        }
      }
    }
    if (estimatedDelivery !== undefined) {
      order.tracking.estimatedDelivery = estimatedDelivery.trim();
    }

    await syncOrderUpdate(order, db);

    addLog('INFO', 'ORDERS', `Tracking updated for Order ${order.id}: ${order.tracking.carrier} - ${order.tracking.trackingNumber} by ${req.user.name}`);

    res.json({
      success: true,
      order
    });
  } catch (err) {
    console.error('Order tracking update error:', err);
    res.status(500).json({ success: false, error: 'Failed to update order tracking.' });
  }
});

// DELETE /api/orders/:id (Client Admin / Super Admin Delete Order)
router.delete('/:id', authenticateToken, requireClientAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const order = await findOrder(id, db);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }

    if (mongoose.connection.readyState === 1) {
      await Order.deleteOne({
        $or: [
          { id: order.id },
          { orderNumber: order.orderNumber },
          ...(mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }] : [])
        ]
      }).catch((e) => console.warn('Order delete Mongo error:', e.message));
    }

    db.orders = (db.orders || []).filter((o) => o.id !== order.id && o.orderNumber !== order.orderNumber);
    saveDb(db);

    addLog('WARN', 'ORDERS', `Deleted order ${order.id} by ${req.user.name}`);

    res.json({
      success: true,
      message: `Order #${order.id} deleted successfully.`
    });
  } catch (err) {
    console.error('Order delete error:', err);
    res.status(500).json({ success: false, error: 'Failed to delete order.' });
  }
});

export default router;
