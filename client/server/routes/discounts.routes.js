import { Router } from 'express';
import { getDb, saveDb, addLog } from '../config/db.js';
import { authenticateToken, requireClientAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/discounts (Client Admin lists coupons)
router.get('/', authenticateToken, requireClientAdmin, (req, res) => {
  const db = getDb();
  res.json({
    success: true,
    coupons: db.coupons || []
  });
});

// POST /api/discounts (Create coupon)
router.post('/', authenticateToken, requireClientAdmin, (req, res) => {
  const { code, discountType, discountValue, minCartValue, maxUses, expiryDate, description, isActive } = req.body;
  const db = getDb();

  if (!code || !code.trim()) {
    return res.status(400).json({ success: false, error: 'Coupon code is required.' });
  }

  const cleanCode = code.trim().toUpperCase();
  if (db.coupons.some((c) => c.code.toUpperCase() === cleanCode)) {
    return res.status(400).json({ success: false, error: `Coupon code "${cleanCode}" already exists.` });
  }

  const val = Number(discountValue);
  if (isNaN(val) || val <= 0) {
    return res.status(400).json({ success: false, error: 'Discount value must be a positive number.' });
  }

  if (discountType === 'percentage' && (val < 1 || val > 90)) {
    return res.status(400).json({ success: false, error: 'Percentage discount must be between 1% and 90%.' });
  }

  const newCoupon = {
    id: `coup-${Date.now()}`,
    code: cleanCode,
    discountType: discountType === 'fixed' ? 'fixed' : 'percentage',
    discountValue: val,
    minCartValue: Number(minCartValue) || 0,
    maxUses: Number(maxUses) || 100,
    usedCount: 0,
    expiryDate: expiryDate || '2027-12-31',
    isActive: isActive !== false,
    description: description?.trim() || ''
  };

  db.coupons.unshift(newCoupon);
  saveDb(db);
  addLog('INFO', 'DISCOUNTS', `Created coupon: ${newCoupon.code} by ${req.user.name}`);

  res.status(201).json({
    success: true,
    coupon: newCoupon
  });
});

// PUT /api/discounts/:id (Update coupon)
router.put('/:id', authenticateToken, requireClientAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const index = db.coupons.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Coupon not found.' });
  }

  const existing = db.coupons[index];
  const data = req.body;

  if (data.code && data.code.trim().toUpperCase() !== existing.code) {
    const cleanCode = data.code.trim().toUpperCase();
    if (db.coupons.some((c) => c.code.toUpperCase() === cleanCode && c.id !== existing.id)) {
      return res.status(400).json({ success: false, error: `Coupon code "${cleanCode}" already exists.` });
    }
    existing.code = cleanCode;
  }

  if (data.discountType) existing.discountType = data.discountType;
  if (data.discountValue !== undefined) existing.discountValue = Number(data.discountValue);
  if (data.minCartValue !== undefined) existing.minCartValue = Number(data.minCartValue);
  if (data.maxUses !== undefined) existing.maxUses = Number(data.maxUses);
  if (data.expiryDate) existing.expiryDate = data.expiryDate;
  if (data.isActive !== undefined) existing.isActive = Boolean(data.isActive);
  if (data.description !== undefined) existing.description = data.description.trim();

  db.coupons[index] = existing;
  saveDb(db);
  addLog('INFO', 'DISCOUNTS', `Updated coupon: ${existing.code} by ${req.user.name}`);

  res.json({
    success: true,
    coupon: existing
  });
});

// DELETE /api/discounts/:id (Delete coupon)
router.delete('/:id', authenticateToken, requireClientAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const index = db.coupons.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Coupon not found.' });
  }

  const deleted = db.coupons.splice(index, 1)[0];
  saveDb(db);
  addLog('INFO', 'DISCOUNTS', `Deleted coupon: ${deleted.code} by ${req.user.name}`);

  res.json({
    success: true,
    deletedCode: deleted.code
  });
});

// POST /api/discounts/validate (Public / Store checkout)
router.post('/validate', (req, res) => {
  const { code, cartSubtotal } = req.body;

  if (!code || !code.trim()) {
    return res.status(400).json({ success: false, error: 'Please enter a coupon code.' });
  }

  const db = getDb();
  const cleanCode = code.trim().toUpperCase();
  const coupon = db.coupons.find((c) => c.code.toUpperCase() === cleanCode);

  if (!coupon) {
    return res.status(404).json({ success: false, error: 'Invalid coupon code.' });
  }

  if (!coupon.isActive) {
    return res.status(400).json({ success: false, error: 'This coupon is no longer active.' });
  }

  // Check expiry
  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    return res.status(400).json({ success: false, error: 'This coupon has expired.' });
  }

  // Check usage limit
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return res.status(400).json({ success: false, error: 'This coupon has reached its maximum usage limit.' });
  }

  // Check minimum cart value
  const subtotal = Number(cartSubtotal) || 0;
  if (coupon.minCartValue && subtotal < coupon.minCartValue) {
    return res.status(400).json({
      success: false,
      error: `Minimum cart value of ₹${coupon.minCartValue} required for this coupon (Current: ₹${subtotal}).`
    });
  }

  // Calculate discount amount
  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
  } else {
    discountAmount = Math.min(coupon.discountValue, subtotal);
  }

  res.json({
    success: true,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount,
    description: coupon.description,
    newSubtotal: subtotal - discountAmount
  });
});

export default router;
