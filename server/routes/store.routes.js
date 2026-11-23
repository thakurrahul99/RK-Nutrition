import { Router } from 'express';
import mongoose from 'mongoose';
import { getDb, saveDb, addLog, Inquiry, Newsletter, StoreSettings } from '../config/db.js';
import { authenticateToken, requireClientAdmin } from '../middleware/auth.js';
import { isValidEmail, sanitizeInput } from '../utils/security.js';

const router = Router();

// GET /api/store/settings (Public or Admin)
router.get('/settings', (req, res) => {
  const db = getDb();
  res.json({
    success: true,
    settings: db.storeSettings
  });
});

// PUT /api/store/settings (Client Admin updates store settings)
router.put('/settings', authenticateToken, requireClientAdmin, async (req, res) => {
  const db = getDb();
  const updates = req.body;

  db.storeSettings = {
    ...db.storeSettings,
    ...updates
  };

  // Sync announcement to db.content.homepage.banner for storefront consumption
  if (updates.announcement) {
    if (!db.content) db.content = {};
    if (!db.content.homepage) db.content.homepage = {};
    db.content.homepage.banner = {
      ...db.content.homepage.banner,
      ...updates.announcement,
      enabled: Boolean(updates.announcement.enabled ?? updates.announcement.isActive),
      isActive: Boolean(updates.announcement.isActive ?? updates.announcement.enabled)
    };
  }

  saveDb(db);

  if (mongoose.connection.readyState === 1) {
    await StoreSettings.findOneAndUpdate({}, db.storeSettings).catch(() => {});
  }

  addLog('INFO', 'STORE', `Store operations settings updated by ${req.user.name}`);

  res.json({
    success: true,
    settings: db.storeSettings
  });
});

// GET /api/store/reports & /api/store/analytics (Sales & Inventory Analytics)
const handleReports = (req, res) => {
  const db = getDb();
  const orders = db.orders || [];

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => (o.paymentStatus === 'PAID' ? sum + o.total : sum), 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === 'PENDING').length;
  const completedOrders = orders.filter((o) => o.orderStatus === 'DELIVERED').length;

  // Breakdown by payment method
  const codOrders = orders.filter((o) => o.paymentMethod === 'COD').length;
  const prepaidOrders = orders.filter((o) => o.paymentMethod === 'UPI' || o.paymentMethod === 'CARD').length;

  // Category sales breakdown
  const categorySales = { protein: 0, 'mass-gainer': 0, 'pre-workout': 0 };
  for (const o of orders) {
    for (const it of o.items || []) {
      const p = (db.products || []).find((prod) => prod.id === it.productId || prod.slug === it.productId);
      if (p && categorySales[p.category] !== undefined) {
        categorySales[p.category] += it.quantity || 1;
      }
    }
  }

  // Low stock items
  const lowStockProducts = (db.products || []).filter(
    (p) => typeof p.stock === 'number' && p.stock <= (p.lowStockThreshold || 10)
  );

  res.json({
    success: true,
    reports: {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      codOrders,
      prepaidOrders,
      categorySales,
      lowStockProducts: lowStockProducts.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        stock: p.stock,
        threshold: p.lowStockThreshold
      }))
    }
  });
};

router.get('/reports', authenticateToken, requireClientAdmin, handleReports);
router.get('/analytics', authenticateToken, requireClientAdmin, handleReports);

// GET /api/store/inquiries (Client Admin lists customer messages)
router.get('/inquiries', authenticateToken, requireClientAdmin, (req, res) => {
  const db = getDb();
  res.json({
    success: true,
    inquiries: db.inquiries || []
  });
});

// Helper for contact inquiries
const handleInquirySubmit = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }

    const db = getDb();
    const newInquiry = {
      id: `inq-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: sanitizeInput(name.trim()),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: sanitizeInput(subject?.trim() || 'Store Inquiry'),
      message: sanitizeInput(message.trim()),
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    db.inquiries = db.inquiries || [];
    db.inquiries.unshift(newInquiry);
    saveDb(db);

    if (mongoose.connection.readyState === 1) {
      await Inquiry.create(newInquiry).catch(() => {});
    }

    addLog('INFO', 'INQUIRIES', `New contact inquiry received from ${newInquiry.name} (${newInquiry.email})`);

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting RK Nutrition. Our support staff will respond within 24 to 48 business hours.',
      inquiry: newInquiry
    });
  } catch (err) {
    console.error('Inquiry error:', err);
    res.status(500).json({ success: false, error: 'Failed to submit inquiry.' });
  }
};

// POST /api/store/inquiries & /api/store/contact
router.post('/inquiries', handleInquirySubmit);
router.post('/contact', handleInquirySubmit);

// PUT /api/store/inquiries/:id (Client Admin resolves inquiry)
router.put('/inquiries/:id', authenticateToken, requireClientAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const db = getDb();
  const index = (db.inquiries || []).findIndex((i) => i.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Inquiry not found.' });
  }

  const isResolved = String(status || '').toUpperCase() === 'RESOLVED';
  db.inquiries[index].status = isResolved ? 'RESOLVED' : 'PENDING';
  db.inquiries[index].updatedAt = new Date().toISOString();
  saveDb(db);

  if (mongoose.connection.readyState === 1) {
    await Inquiry.findOneAndUpdate({ id }, { status: db.inquiries[index].status }).catch(() => {});
  }

  addLog('INFO', 'INQUIRIES', `Updated customer inquiry #${id} status to ${db.inquiries[index].status} by ${req.user.name}`);

  res.json({
    success: true,
    inquiry: db.inquiries[index]
  });
});

// DELETE /api/store/inquiries/:id (Client Admin deletes inquiry)
router.delete('/inquiries/:id', authenticateToken, requireClientAdmin, async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const index = (db.inquiries || []).findIndex((i) => i.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Inquiry not found.' });
  }

  const deleted = db.inquiries.splice(index, 1)[0];
  saveDb(db);

  if (mongoose.connection.readyState === 1) {
    await Inquiry.deleteOne({ id }).catch(() => {});
  }

  addLog('INFO', 'INQUIRIES', `Deleted customer inquiry #${deleted.id} by ${req.user.name}`);

  res.json({
    success: true,
    message: 'Inquiry deleted successfully.'
  });
});

// POST /api/store/newsletter (Public newsletter subscription)
router.post('/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = getDb();
    db.newsletters = db.newsletters || [];

    if (!db.newsletters.some((n) => (n.email || n) === cleanEmail)) {
      const entry = { email: cleanEmail, subscribedAt: new Date().toISOString() };
      db.newsletters.push(entry);
      saveDb(db);

      if (mongoose.connection.readyState === 1) {
        await Newsletter.create({ email: cleanEmail }).catch(() => {});
      }

      addLog('INFO', 'NEWSLETTER', `New newsletter subscriber: ${cleanEmail}`);
    }

    res.json({
      success: true,
      message: 'You have been subscribed to RK Nutrition official product updates and announcements.'
    });
  } catch (err) {
    console.error('Newsletter error:', err);
    res.status(500).json({ success: false, error: 'Failed to subscribe.' });
  }
});

export default router;
