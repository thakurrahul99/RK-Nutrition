import { Router } from 'express';
import { getDb, saveDb, addLog } from '../config/db.js';
import { authenticateToken, requireClientAdmin, requireSuperAdmin } from '../middleware/auth.js';

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
router.put('/methods', authenticateToken, requireClientAdmin, (req, res) => {
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
  addLog('INFO', 'PAYMENTS', `Payment methods updated by ${req.user.name}`);

  res.json({
    success: true,
    paymentMethods: db.paymentMethods
  });
});

// POST /api/payments/validate-cart (Mixed cart payment rules validation)
router.post('/validate-cart', (req, res) => {
  const { items } = req.body; // [{ productId, quantity }]
  const db = getDb();

  if (!Array.isArray(items) || items.length === 0) {
    return res.json({
      success: true,
      allowedMethods: ['COD', 'UPI', 'CARD'],
      codAllowed: db.paymentMethods.cod.enabled,
      codBlockedReason: null,
      summary: 'Empty cart'
    });
  }

  const resolvedProducts = [];
  const missingProductIds = [];

  for (const item of items) {
    const prod = db.products.find((p) => p.id === item.productId || p.slug === item.productId);
    if (prod) {
      resolvedProducts.push({ ...prod, cartQuantity: item.quantity || 1 });
    } else {
      missingProductIds.push(item.productId);
    }
  }

  // Check global enable statuses
  const isCodGloballyEnabled = Boolean(db.paymentMethods?.cod?.enabled);
  const isUpiGloballyEnabled = Boolean(db.paymentMethods?.upi?.enabled);
  const isCardGloballyEnabled = Boolean(db.paymentMethods?.card?.enabled);

  // Evaluate mixed-cart rules
  let codAllowed = isCodGloballyEnabled;
  let codBlockedReason = null;
  const prepaidRequiringItems = [];
  const codOnlyItems = [];

  for (const prod of resolvedProducts) {
    const rule = prod.paymentRule || 'ALL';

    if (rule === 'PREPAID_ONLY' || rule === 'COD_DISABLED') {
      prepaidRequiringItems.push(prod.name);
    } else if (rule === 'COD_ONLY') {
      codOnlyItems.push(prod.name);
    }
  }

  if (!isCodGloballyEnabled) {
    codAllowed = false;
    codBlockedReason = 'Cash on Delivery is currently disabled in store settings.';
  } else if (prepaidRequiringItems.length > 0) {
    codAllowed = false;
    codBlockedReason = `The following item(s) require prepaid payment: ${prepaidRequiringItems.join(', ')}. Cash on Delivery cannot be offered for this mixed cart.`;
  }

  // Compute allowed payment methods array
  const allowedMethods = [];
  if (codAllowed) allowedMethods.push('COD');
  if (isUpiGloballyEnabled && codOnlyItems.length === 0) allowedMethods.push('UPI');
  if (isCardGloballyEnabled && codOnlyItems.length === 0) allowedMethods.push('CARD');

  // Gateway status warning
  const isGatewayReady = Boolean(db.gatewayConfig?.isConfigured);
  const gatewayWarning = !isGatewayReady 
    ? 'Online payment gateway credentials are not yet configured by the Super Admin. Only verified offline methods or configured modes are active.' 
    : null;

  res.json({
    success: true,
    codAllowed,
    codBlockedReason,
    allowedMethods,
    isGatewayReady,
    gatewayWarning,
    prepaidRequiringItems,
    codOnlyItems,
    missingProductIds
  });
});

// GET /api/payments/gateway-config (Protected)
router.get('/gateway-config', authenticateToken, (req, res) => {
  const db = getDb();
  const cfg = db.gatewayConfig || {};

  // If user is SUPER_ADMIN, return keys (mask secret)
  if (req.user.role === 'SUPER_ADMIN') {
    return res.json({
      success: true,
      config: {
        provider: cfg.provider || 'razorpay',
        mode: cfg.mode || 'test',
        keyId: cfg.keyId || '',
        keySecretMasked: cfg.keySecret ? `••••••••••••${cfg.keySecret.slice(-4)}` : '',
        webhookSecretMasked: cfg.webhookSecret ? `••••••••${cfg.webhookSecret.slice(-4)}` : '',
        isConfigured: Boolean(cfg.isConfigured),
        statusMessage: cfg.statusMessage || ''
      }
    });
  }

  // Client Admin gets ONLY public configuration status (zero secrets)
  res.json({
    success: true,
    config: {
      provider: cfg.provider || 'razorpay',
      mode: cfg.mode || 'test',
      isConfigured: Boolean(cfg.isConfigured),
      statusMessage: cfg.statusMessage || ''
    }
  });
});

// PUT /api/payments/gateway-config (STRICTLY SUPER_ADMIN ONLY)
router.put('/gateway-config', authenticateToken, requireSuperAdmin, (req, res) => {
  const { provider, mode, keyId, keySecret, webhookSecret } = req.body;
  const db = getDb();

  const cfg = db.gatewayConfig || {};

  if (provider) cfg.provider = provider;
  if (mode) cfg.mode = mode;
  if (keyId !== undefined) cfg.keyId = keyId.trim();
  if (keySecret !== undefined && keySecret.trim()) cfg.keySecret = keySecret.trim();
  if (webhookSecret !== undefined) cfg.webhookSecret = webhookSecret.trim();

  // Validate if configured
  if (cfg.keyId && cfg.keySecret) {
    cfg.isConfigured = true;
    cfg.statusMessage = `Connected to ${cfg.provider.toUpperCase()} in ${cfg.mode.toUpperCase()} mode.`;
  } else {
    cfg.isConfigured = false;
    cfg.statusMessage = 'Payment Gateway credentials pending Super Admin configuration.';
  }

  db.gatewayConfig = cfg;
  saveDb(db);
  addLog('INFO', 'SECURITY', `Payment gateway credentials updated for ${cfg.provider} by Super Admin (${req.user.name})`);

  res.json({
    success: true,
    message: 'Gateway configuration updated successfully.',
    config: {
      provider: cfg.provider,
      mode: cfg.mode,
      keyId: cfg.keyId,
      keySecretMasked: cfg.keySecret ? `••••••••••••${cfg.keySecret.slice(-4)}` : '',
      isConfigured: cfg.isConfigured,
      statusMessage: cfg.statusMessage
    }
  });
});

export default router;
