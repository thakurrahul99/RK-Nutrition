import { Router } from 'express';
import mongoose from 'mongoose';
import { getDb, saveDb, addLog, Order, StoreSettings } from '../config/db.js';
import { authenticateToken, requireClientAdmin, requireSuperAdmin } from '../middleware/auth.js';
import { verifyWebhookSignature } from '../utils/security.js';

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

  // Online payments remain disabled until secure gateway order creation and verification are implemented.
  const isGatewayReady = false;

  res.json({
    success: true,
    codAllowed,
    codBlockedReason,
    allowedMethods,
    isGatewayReady,
    gatewayWarning: !isGatewayReady
      ? 'Online payments are temporarily disabled until secure gateway integration is completed.'
      : null
  });
});

// POST /api/payments/create-order
// Online checkout is deliberately unavailable until a real gateway order is created server-side.
router.post('/create-order', (req, res) => {
  res.status(503).json({
    success: false,
    error: 'Online payments are temporarily unavailable. Please choose Cash on Delivery.'
  });
});

// POST /api/payments/verify
// Verification is disabled until server-created gateway orders are bound to internal orders.
router.post('/verify', (req, res) => {
  res.status(503).json({
    success: false,
    verified: false,
    error: 'Online payment verification is not enabled yet.'
  });
});

// POST /api/payments/webhook (Raw-body signature validation)
router.post('/webhook', (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const db = getDb();
    const secret = db.gatewayConfig?.webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      return res.status(503).json({ success: false, error: 'Webhook secret is not configured.' });
    }
    if (!signature || !req.rawBody) {
      return res.status(400).json({ success: false, error: 'Missing webhook signature or raw payload.' });
    }

    if (!verifyWebhookSignature(req.rawBody, signature, secret)) {
      return res.status(400).json({ success: false, error: 'Invalid webhook signature.' });
    }

    const event = req.body?.event;
    addLog('INFO', 'PAYMENTS', `Verified Razorpay webhook received: ${event || 'unknown event'}`);
    return res.json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(500).json({ status: 'error' });
  }
});

export default router;
