import { Router } from 'express';
import { getDb, saveDb, addLog } from '../config/db.js';
import { authenticateToken, requireClientAdmin } from '../middleware/auth.js';

const router = Router();

// Public order-lookup throttling: per-IP window, reset after 15 minutes.
const publicLookupAttempts = new Map();
const PUBLIC_LOOKUP_WINDOW_MS = 15 * 60 * 1000;
const PUBLIC_LOOKUP_MAX_ATTEMPTS = 8;

// GET /api/orders (Client Admin list with search and filters)
router.get('/', authenticateToken, requireClientAdmin, (req, res) => {
  const { status, paymentMethod, paymentStatus, search } = req.query;
  const db = getDb();
  let orders = [...(db.orders || [])];

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
        o.id.toLowerCase().includes(q) ||
        o.customer?.name?.toLowerCase().includes(q) ||
        o.customer?.email?.toLowerCase().includes(q) ||
        o.customer?.phone?.includes(q) ||
        o.tracking?.trackingNumber?.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: orders.length,
    orders
  });
});

// GET /api/orders/public/:id (Customer confirmation lookup; requires phone verification)
router.get('/public/:id', (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
  const now = Date.now();
  const attempt = publicLookupAttempts.get(ip);

  if (!attempt || now - attempt.firstAttemptTime >= PUBLIC_LOOKUP_WINDOW_MS) {
    publicLookupAttempts.set(ip, { count: 1, firstAttemptTime: now });
  } else if (attempt.count >= PUBLIC_LOOKUP_MAX_ATTEMPTS) {
    const remainingSecs = Math.ceil((PUBLIC_LOOKUP_WINDOW_MS - (now - attempt.firstAttemptTime)) / 1000);
    return res.status(429).json({ success: false, error: `Too many order lookup attempts. Please retry in ${remainingSecs} seconds.` });
  } else {
    attempt.count += 1;
    publicLookupAttempts.set(ip, attempt);
  }

  const { id } = req.params;
  const phone = String(req.query.phone || '').replace(/\\D/g, '');
  if (phone.length < 10) {
    return res.status(400).json({ success: false, error: 'Enter the phone number used for this order.' });
  }

  const db = getDb();
  const order = db.orders.find((o) => o.id === id || String(o.orderNumber) === id;
  const orderPhone = String(order?.customer?.phone || '').replace(/\\D/g, '');

  if (!order || phone.slice(-10) !== orderPhone.slice(-10)) {
    return res.status(401).json({ success: false, error: 'Unable to verify order details. Check your order reference and phone number.' });
  }

  res.json({
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
});

// GET /api/orders/:id (Order Details)
router.get('/:id', authenticateToken, requireClientAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const order = db.orders.find((o) => o.id === id);

  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found.' });
  }

  res.json({
    success: true,
    order
  });
});

// POST /api/orders (Customer checkout creation)
router.post('/', (req, res) => {
  const { customer, items, paymentMethod, couponCode } = req.body;
  const db = getDb();

  // Validate customer
  if (!customer || !customer.name || !customer.phone || !customer.address || !customer.city || !customer.pincode) {
    return res.status(400).json({ success: false, error: 'Full delivery and customer information required.' });
  }

  // Validate items
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Cart is empty.' });
  }

  let subtotal = 0;
  const verifiedItems = [];
  const prepaidRequiring = [];
  const stockUpdates = [];

  for (const item of items) {
    const product = db.products.find((p) => p.id === item.productId || p.slug === item.productId);
    if (!product) {
      return res.status(400).json({ success: false, error: `Product "${item.productId}" no longer available.` });
    }

    if (product.availability === 'out-of-stock') {
      return res.status(400).json({ success: false, error: `Product "${product.name}" is currently out of stock.` });
    }

    const qty = Math.max(1, Number(item.quantity) || 1);

    // Resolve variant if applicable
    let variant = null;
    if (item.variantId) {
      variant = (product.variants || []).find((v) => v.id === item.variantId);
    } else if (item.variant && item.variant.id) {
      variant = (product.variants || []).find((v) => v.id === item.variant.id);
    } else if (item.variantName && item.variantName !== 'Standard') {
      variant = (product.variants || []).find((v) => v.name.toLowerCase() === item.variantName.toLowerCase());
    }

    // Check stock limits
    if (variant && variant.stock !== undefined) {
      if (variant.stock < qty) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for "${product.name} (${variant.name})". Available: ${variant.stock}, requested: ${qty}.`
        });
      }
    } else if (product.stock !== undefined) {
      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${qty}.`
        });
      }
    }

    // Authoritative server-side price calculation
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
      variantId: variant ? variant.id : null,
      sku: variant?.sku || product.sku,
      price,
      quantity: qty,
      total: itemTotal,
      image: product.image || (product.images && product.images[0]) || ''
    });

    stockUpdates.push({
      product,
      variant,
      qty
    });
  }

  // Validate mixed-cart payment rule
  const normalizedMethod = (paymentMethod || 'COD').toUpperCase();
  if (normalizedMethod === 'COD' && prepaidRequiring.length > 0) {
    return res.status(400).json({
      success: false,
      error: `Cash on Delivery is not available for this cart because the following item(s) require prepaid payment: ${prepaidRequiring.join(', ')}.`
    });
  }

  // Verify online gateway readiness if online method chosen
  if (normalizedMethod !== 'COD') {
    const isGatewayReady = Boolean(db.gatewayConfig?.isConfigured);
    if (!isGatewayReady) {
      return res.status(400).json({
        success: false,
        error: `Online payment gateway (${normalizedMethod}) is currently in configuration/sandbox mode. Please choose Cash on Delivery or contact store support.`
      });
    }
  }

  // Deduct inventory for all items
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

  // Check discount
  let discount = 0;
  let appliedCoupon = null;
  if (couponCode) {
    const coupon = db.coupons.find((c) => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (coupon && coupon.isActive) {
      if (!coupon.expiryDate || new Date(coupon.expiryDate) >= new Date()) {
        if (!coupon.minCartValue || subtotal >= coupon.minCartValue) {
          if (coupon.discountType === 'percentage') {
            discount = Math.round((subtotal * coupon.discountValue) / 100);
          } else {
            discount = Math.min(coupon.discountValue, subtotal);
          }
          coupon.usedCount = (coupon.usedCount || 0) + 1;
          appliedCoupon = coupon.code;
        }
      }
    }
  }

  // Shipping
  const shippingFee = subtotal >= (db.storeSettings.freeShippingThreshold || 999) 
    ? 0 
    : (db.storeSettings.shippingFee || 99);

  // Total
  const total = Math.max(0, subtotal - discount + shippingFee);

  // Auto-increment order number
  const lastOrderNumber = db.orders.length > 0 ? Math.max(...db.orders.map((o) => o.orderNumber || 1000)) : 1000;
  const newOrderNumber = lastOrderNumber + 1;
  const newOrderId = `ORD-${new Date().getFullYear()}-${newOrderNumber}`;

  const newOrder = {
    id: newOrderId,
    orderNumber: newOrderNumber,
    customer: {
      name: customer.name.trim(),
      email: customer.email?.trim() || '',
      phone: customer.phone.trim(),
      address: customer.address.trim(),
      city: customer.city.trim(),
      state: customer.state?.trim() || '',
      pincode: customer.pincode.trim()
    },
    items: verifiedItems,
    subtotal,
    discount,
    couponCode: appliedCoupon,
    shippingFee,
    tax: 0,
    total,
    paymentMethod: normalizedMethod,
    paymentStatus: normalizedMethod === 'COD' ? 'PENDING' : 'PENDING',
    orderStatus: 'PENDING',
    tracking: {
      carrier: '',
      trackingNumber: '',
      shippedAt: null
    },
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);
  saveDb(db);
  addLog('INFO', 'ORDERS', `New order created: ${newOrder.id} for ${newOrder.customer.name} (₹${newOrder.total}) via ${newOrder.paymentMethod}`);

  res.status(201).json({
    success: true,
    order: newOrder
  });
});

// PUT /api/orders/:id/status (Client Admin updates status / tracking)
router.put('/:id/status', authenticateToken, requireClientAdmin, (req, res) => {
  const { id } = req.params;
  const { orderStatus, paymentStatus, carrier, trackingNumber } = req.body;
  const db = getDb();

  const index = db.orders.findIndex((o) => o.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Order not found.' });
  }

  const order = db.orders[index];

  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;

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

  db.orders[index] = order;
  saveDb(db);
  addLog('INFO', 'ORDERS', `Order ${order.id} updated: Status=${order.orderStatus}, Payment=${order.paymentStatus} by ${req.user.name}`);

  res.json({
    success: true,
    order
  });
});

export default router;
