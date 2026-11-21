import { Router } from 'express';
import { getDb, saveDb, addLog } from '../config/db.js';
import { authenticateToken, requireClientAdmin } from '../middleware/auth.js';

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
router.put('/settings', authenticateToken, requireClientAdmin, (req, res) => {
  const db = getDb();
  const updates = req.body;

  db.storeSettings = {
    ...db.storeSettings,
    ...updates
  };

  saveDb(db);
  addLog('INFO', 'STORE', `Store operations settings updated by ${req.user.name}`);

  res.json({
    success: true,
    settings: db.storeSettings
  });
});

// GET /api/store/reports (Client Admin sales & operations analytics)
router.get('/reports', authenticateToken, requireClientAdmin, (req, res) => {
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
      const p = db.products.find((prod) => prod.id === it.productId || prod.slug === it.productId);
      if (p && categorySales[p.category] !== undefined) {
        categorySales[p.category] += it.quantity || 1;
      }
    }
  }

  // Low stock items
  const lowStockProducts = db.products.filter(
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
});

// GET /api/store/inquiries (Client Admin lists customer messages)
router.get('/inquiries', authenticateToken, requireClientAdmin, (req, res) => {
  const db = getDb();
  res.json({
    success: true,
    inquiries: db.inquiries || []
  });
});

// POST /api/store/inquiries (Public Contact Form submission)
router.post('/inquiries', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
  }

  const db = getDb();
  const newInquiry = {
    id: `inq-${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    subject: subject?.trim() || 'General Inquiry',
    message: message.trim(),
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };

  db.inquiries.unshift(newInquiry);
  saveDb(db);
  addLog('INFO', 'INQUIRY', `Customer inquiry received from ${newInquiry.name} (${newInquiry.email})`);

  res.status(201).json({
    success: true,
    message: 'Your inquiry has been received. Our team will respond within 24-48 business hours.',
    inquiry: newInquiry
  });
});

// PUT /api/store/inquiries/:id (Client Admin toggles resolved status)
router.put('/inquiries/:id', authenticateToken, requireClientAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = getDb();

  const inq = db.inquiries.find((i) => i.id === id);
  if (!inq) {
    return res.status(404).json({ success: false, error: 'Inquiry not found.' });
  }

  if (status) inq.status = status;
  saveDb(db);

  res.json({ success: true, inquiry: inq });
});

export default router;
