import { Router } from 'express';
import mongoose from 'mongoose';
import { getDb, saveDb, addLog, Coupon } from '../config/db.js';
import { authenticateToken, requireClientAdmin } from '../middleware/auth.js';
import { sanitizeInput } from '../utils/security.js';

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
router.post('/', authenticateToken, requireClientAdmin, async (req, res) => {
  const { code, discountType, discountValue, minCartValue, maxUses, perCustomerLimit, expiryDate, description, isActive } = req.body;
  const db = getDb();

  if (!code || !code.trim()) {
    return res.status(400).json({ success: false, error: 'Coupon code is required.' });
  }

  const cleanCode = code.trim().toUpperCase();
  if ((db.coupons || []).some((c) => c.code.toUpperCase() === cleanCode)) {
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
    perCustomerLimit: Number(perCustomerLimit) || 1,
    usedByCustomers: [],
    expiryDate: expiryDate || '2027-12-31',
    isActive: isActive !== false,
    description: sanitizeInput(description?.trim() || '')
  };

  db.coupons = db.coupons || [];
  db.coupons.unshift(newCoupon);
  saveDb(db);

  if (mongoose.connection.readyState === 1) {
    await Coupon.create(newCoupon).catch(() => {});
  }

  addLog('INFO', 'DISCOUNTS', `Created coupon: ${newCoupon.code} by ${req.user.name}`);

  res.status(201).json({
    success: true,
    coupon: newCoupon
  });
});

// PUT /api/discounts/:id (Update coupon)
router.put('/:id', authenticateToken, requireClientAdmin, async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const index = (db.coupons || []).findIndex((c) => c.id === id);

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
  if (data.perCustomerLimit !== undefined) existing.perCustomerLimit = Number(data.perCustomerLimit);
  if (data.expiryDate) existing.expiryDate = data.expiryDate;
  if (data.isActive !== undefined) existing.isActive = Boolean(data.isActive);
  if (data.description !== undefined) existing.description = sanitizeInput(data.description.trim());

  db.coupons[index] = existing;
  saveDb(db);

  if (mongoose.connection.readyState === 1) {
    await Coupon.findOneAndUpdate({ id: existing.id }, existing).catch(() => {});
  }

  addLog('INFO', 'DISCOUNTS', `Updated coupon: ${existing.code} by ${req.user.name}`);

  res.json({
    success: true,
    coupon: existing
  });
});

// DELETE /api/discounts/:id (Delete coupon)
router.delete('/:id', authenticateToken, requireClientAdmin, async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const index = (db.coupons || []).findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Coupon not found.' });
  }

  const deleted = db.coupons.splice(index, 1)[0];
  saveDb(db);

  if (mongoose.connection.readyState === 1) {
    await Coupon.deleteOne({ id }).catch(() => {});
  }

  addLog('INFO', 'DISCOUNTS', `Deleted coupon: ${deleted.code} by ${req.user.name}`);

  res.json({
    success: true,
    message: `Coupon ${deleted.code} deleted successfully.`
  });
});

// POST /api/discounts/validate (Public / Customer Cart coupon validation)
router.post('/validate', (req, res) => {
  const { code } = req.body;
  const subtotal = req.body.cartSubtotal !== undefined ? req.body.cartSubtotal : req.body.subtotal;
  if (!code || !code.trim()) {
    return res.status(400).json({ success: false, error: 'Coupon code is required.' });
  }

  const cleanCode = code.trim().toUpperCase();
  const db = getDb();
  const coupon = (db.coupons || []).find((c) => c.code.toUpperCase() === cleanCode);

  if (!coupon || !coupon.isActive) {
    return res.status(400).json({ success: false, error: 'Invalid or inactive coupon code.' });
  }

  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    return res.status(400).json({ success: false, error: 'This coupon code has expired.' });
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return res.status(400).json({ success: false, error: 'This coupon usage limit has been reached.' });
  }

  const subtotalNum = Number(subtotal) || 0;
  if (coupon.minCartValue && subtotalNum < coupon.minCartValue) {
    return res.status(400).json({
      success: false,
      error: `Add items worth ₹${coupon.minCartValue - subtotalNum} more to apply this coupon (Minimum order value: ₹${coupon.minCartValue}).`
    });
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((subtotalNum * coupon.discountValue) / 100);
  } else {
    discount = Math.min(coupon.discountValue, subtotalNum);
  }

  res.json({
    success: true,
    coupon: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: discount,
      minCartValue: coupon.minCartValue,
      description: coupon.description
    }
  });
});

export default router;
