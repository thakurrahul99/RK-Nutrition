import { Router } from 'express';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { getDb, saveDb, addLog, Order, StoreSettings } from '../config/db.js';
import { authenticateToken, requireClientAdmin, requireSuperAdmin } from '../middleware/auth.js';
import { verifyRazorpaySignature, verifyWebhookSignature } from '../utils/security.js';

const router = Router();

// GET /api/payments/methods (Public / Store checkout)
router.get('/methods', (req, res) => {
  const db = getDb();
  res.json({
    success: true,
    paymentMethods: db.paymentMethods
  });
});

// PUT /api/payments/methods (Client Admin can toggle global methods)
router.put('/methods', authenticateToken, requireClientAdmin, async (req, res) => {
  const { methods } = req.body;
  if (!methods || typeof methods !== 'object') {
    return res.status(400).json({ success: false, error: 'Invalid payment methods data.' });
  }

  const db = getDb();
  db.paymentMethods = {
    ...db.paymentMethods,
    ...methods
  };
  saveDb(db);

  if (mongoose.connection.readyState === 1) {
    await StoreSettings.findOneAndUpdate({}, { paymentMethods: db.paymentMethods }).catch(() => {});
  }

  addLog('INFO', 'PAYMENTS', `Payment methods updated by ${req.user.name}`);

  res.json({
    success: true,
    paymentMethods: db.paymentMethods
  });
});

// GET /api/payments/config (SUPER_ADMIN ONLY)
router.get('/config', authenticateToken, requireSuperAdmin, (req, res) => {
  const db = getDb();
  const cfg = db.gatewayConfig || {};

  // Mask secret in response for safety
  const maskedSecret = cfg.keySecret
    ? `${cfg.keySecret.slice(0, 4)}••••••••${cfg.keySecret.slice(-4)}`
    : '';

  res.json({
    success: true,
    gatewayConfig: {
      provider: cfg.provider || 'razorpay',
      mode: cfg.mode || 'test',
      keyId: cfg.keyId || '',
      keySecretMasked: maskedSecret,
      isConfigured: Boolean(cfg.keyId && cfg.keySecret),
      statusMessage: cfg.statusMessage || ''
    }
  });
});

// PUT /api/payments/config (SUPER_ADMIN ONLY)
router.put('/config', authenticateToken, requireSuperAdmin, async (req, res) => {
  const { provider, mode, keyId, keySecret, webhookSecret } = req.body;
  const db = getDb();

  const cfg = db.gatewayConfig || {};
  if (provider) cfg.provider = provider;
  if (mode) cfg.mode = mode;
  if (keyId !== undefined) cfg.keyId = keyId.trim();
  if (keySecret !== undefined && !keySecret.includes('••••')) {
    cfg.keySecret = keySecret.trim();
  }
  if (webhookSecret !== undefined) cfg.webhookSecret = webhookSecret.trim();

  cfg.isConfigured = Boolean(cfg.keyId && cfg.keySecret);
  cfg.statusMessage = cfg.isConfigured
    ? `Active in ${cfg.mode.toUpperCase()} mode.`
    : 'Payment Gateway credentials pending configuration.';

  db.gatewayConfig = cfg;
  saveDb(db);

  if (mongoose.connection.readyState === 1) {
    await StoreSettings.findOneAndUpdate({}, { gatewayConfig: cfg }).catch(() => {});
  }

  addLog('WARN', 'SECURITY', `Payment gateway settings updated by Super Admin (${req.user.name})`);

  res.json({
    success: true,
    gatewayConfig: {
      provider: cfg.provider,
      mode: cfg.mode,
      keyId: cfg.keyId,
      isConfigured: cfg.isConfigured,
      statusMessage: cfg.statusMessage
    }
  });
});

// POST /api/payments/validate-cart (Mixed cart payment rules validation)
router.post('/validate-cart', (req, res) => {
  const { items } = req.body;
  const db = getDb();

  if (!Array.isArray(items) || items.length === 0) {
    return res.json({
      success: true,
      allowedMethods: ['COD', 'UPI', 'CARD'],
      codAllowed: Boolean(db.paymentMethods?.cod?.enabled),
      codBlockedReason: null,
      summary: 'Empty cart'
    });
  }

  const resolvedProducts = [];
  for (const item of items) {
    const prod = (db.products || []).find((p) => p.id === item.productId || p.slug === item.productId);
    if (prod) {
      resolvedProducts.push({ ...prod, cartQuantity: item.quantity || 1 });
    }
  }

  const isCodGloballyEnabled = Boolean(db.paymentMethods?.cod?.enabled);
  const isUpiGloballyEnabled = Boolean(db.paymentMethods?.upi?.enabled);
  const isCardGloballyEnabled = Boolean(db.paymentMethods?.card?.enabled);

  let codAllowed = isCodGloballyEnabled;
  let codBlockedReason = null;
  const prepaidRequiringItems = [];

  for (const prod of resolvedProducts) {
    const rule = prod.paymentRule || 'ALL';
    if (rule === 'PREPAID_ONLY' || rule === 'COD_DISABLED') {
      prepaidRequiringItems.push(prod.name);
    }
  }

  if (!isCodGloballyEnabled) {
    codAllowed = false;
    codBlockedReason = 'Cash on Delivery is currently disabled in store settings.';
  } else if (prepaidRequiringItems.length > 0) {
    codAllowed = false;
    codBlockedReason = `The following item(s) require prepaid payment: ${prepaidRequiringItems.join(', ')}. Cash on Delivery is disabled for this mixed cart.`;
  }

  const allowedMethods = [];
  if (codAllowed) allowedMethods.push('COD');
  if (isUpiGloballyEnabled) allowedMethods.push('UPI');
  if (isCardGloballyEnabled) allowedMethods.push('CARD');

  const isGatewayReady = Boolean(db.gatewayConfig?.isConfigured || process.env.RAZORPAY_KEY_ID);

  res.json({
    success: true,
    codAllowed,
    codBlockedReason,
    allowedMethods,
    isGatewayReady,
    gatewayWarning: !isGatewayReady
      ? 'Online payments (Card & UPI) are currently in test sandbox mode.'
      : null
  });
});

// POST /api/payments/create-order (Razorpay Order Initiation)
router.post('/create-order', async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const db = getDb();

    let targetAmount = amount;
    if (orderId) {
      const order = (db.orders || []).find((o) => o.id === orderId || String(o.orderNumber) === orderId);
      if (order) targetAmount = order.total;
    }

    if (!targetAmount || targetAmount <= 0) {
      return res.status(400).json({ success: false, error: 'Valid payment amount is required.' });
    }

    const keyId = db.gatewayConfig?.keyId || process.env.RAZORPAY_KEY_ID || 'rzp_test_rknutrition';
    const razorpayOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    res.json({
      success: true,
      order: {
        id: razorpayOrderId,
        entity: 'order',
        amount: Math.round(targetAmount * 100), // in paise
        currency: 'INR',
        receipt: orderId || `rcpt_${Date.now()}`,
        status: 'created'
      },
      keyId
    });
  } catch (err) {
    console.error('Payment order creation error:', err);
    res.status(500).json({ success: false, error: 'Failed to initiate payment transaction.' });
  }
});

// POST /api/payments/verify (Cryptographic Razorpay Signature Verification)
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, internalOrderId } = req.body;
    const db = getDb();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required Razorpay verification parameters.'
      });
    }

    const keySecret = db.gatewayConfig?.keySecret || process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_sample_key';
    const isSignatureValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature, keySecret);

    if (!isSignatureValid) {
      addLog('WARN', 'PAYMENTS', `Failed payment verification attempt for Order ${internalOrderId || razorpay_order_id}`);
      return res.status(400).json({
        success: false,
        verified: false,
        error: 'Cryptographic signature verification failed. Untrusted payment payload.'
      });
    }

    // Mark internal order as PAID
    if (internalOrderId) {
      const order = (db.orders || []).find((o) => o.id === internalOrderId || String(o.orderNumber) === internalOrderId);
      if (order) {
        order.paymentStatus = 'PAID';
        order.orderStatus = 'CONFIRMED';
        order.paymentDetails = {
          gateway: 'razorpay',
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          paidAt: new Date().toISOString()
        };
        saveDb(db);

        if (mongoose.connection.readyState === 1) {
          await Order.findOneAndUpdate({ id: order.id }, order).catch(() => {});
        }

        addLog('INFO', 'PAYMENTS', `Payment verified and captured for Order ${order.id} (${razorpay_payment_id})`);
      }
    }

    res.json({
      success: true,
      verified: true,
      message: 'Payment verified successfully.'
    });
  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({ success: false, error: 'Payment verification failed.' });
  }
});

// POST /api/payments/webhook (Razorpay Webhook Listener)
router.post('/webhook', (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const db = getDb();
    const secret = db.gatewayConfig?.webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET;

    if (secret && signature) {
      const isValid = verifyWebhookSignature(JSON.stringify(req.body), signature, secret);
      if (!isValid) {
        return res.status(400).json({ success: false, error: 'Invalid webhook signature.' });
      }
    }

    const event = req.body.event;
    addLog('INFO', 'PAYMENTS', `Razorpay Webhook received: ${event}`);

    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ status: 'error' });
  }
});

export default router;
