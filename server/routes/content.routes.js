import { Router } from 'express';
import mongoose from 'mongoose';
import { getDb, saveDb, addLog, Content } from '../config/db.js';
import { authenticateToken, requireSuperAdmin, requireClientAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/content (Public read of website branding and copy)
router.get('/', (req, res) => {
  const db = getDb();
  res.json({
    success: true,
    content: db.content
  });
});

// PUT /api/content/homepage (SUPER_ADMIN ONLY)
router.put('/homepage', authenticateToken, requireSuperAdmin, (req, res) => {
  const db = getDb();
  const { hero, sectionOrder, sectionVisibility, banner } = req.body;

  if (hero) db.content.homepage.hero = { ...db.content.homepage.hero, ...hero };
  if (Array.isArray(sectionOrder)) db.content.homepage.sectionOrder = sectionOrder;
  if (sectionVisibility) db.content.homepage.sectionVisibility = { ...db.content.homepage.sectionVisibility, ...sectionVisibility };
  if (banner) {
    db.content.homepage.banner = { ...db.content.homepage.banner, ...banner };
    if (!db.storeSettings) db.storeSettings = {};
    db.storeSettings.announcement = {
      ...db.storeSettings.announcement,
      ...banner,
      enabled: Boolean(banner.enabled ?? banner.isActive),
      isActive: Boolean(banner.isActive ?? banner.enabled)
    };
  }

  saveDb(db);
  addLog('INFO', 'CONTENT', `Homepage composition updated by Super Admin (${req.user.name})`);

  res.json({ success: true, homepage: db.content.homepage });
});

// PUT /api/content/announcement (Client Admin or Super Admin)
router.put('/announcement', authenticateToken, requireClientAdmin, (req, res) => {
  const db = getDb();
  const banner = req.body;

  if (!db.content.homepage) db.content.homepage = {};
  db.content.homepage.banner = {
    ...db.content.homepage.banner,
    ...banner,
    enabled: Boolean(banner.enabled ?? banner.isActive),
    isActive: Boolean(banner.isActive ?? banner.enabled)
  };

  if (!db.storeSettings) db.storeSettings = {};
  db.storeSettings.announcement = {
    ...db.content.homepage.banner
  };

  saveDb(db);
  addLog('INFO', 'STORE', `Announcement banner updated by ${req.user.name}`);

  res.json({ success: true, banner: db.content.homepage.banner });
});

// PUT /api/content/pages (SUPER_ADMIN ONLY)
router.put('/pages', authenticateToken, requireSuperAdmin, (req, res) => {
  const db = getDb();
  const { about, contact, faq, shippingPolicy, returnPolicy, privacyPolicy, termsOfService } = req.body;

  if (about) db.content.pages.about = { ...db.content.pages.about, ...about };
  if (contact) db.content.pages.contact = { ...db.content.pages.contact, ...contact };
  if (Array.isArray(faq)) db.content.pages.faq = faq;
  if (shippingPolicy) db.content.pages.shippingPolicy = { ...db.content.pages.shippingPolicy, ...shippingPolicy };
  if (returnPolicy) db.content.pages.returnPolicy = { ...db.content.pages.returnPolicy, ...returnPolicy };
  if (privacyPolicy) db.content.pages.privacyPolicy = { ...db.content.pages.privacyPolicy, ...privacyPolicy };
  if (termsOfService) db.content.pages.termsOfService = { ...db.content.pages.termsOfService, ...termsOfService };

  saveDb(db);
  addLog('INFO', 'CONTENT', `Informational pages updated by Super Admin (${req.user.name})`);

  res.json({ success: true, pages: db.content.pages });
});

// PUT /api/content/branding (SUPER_ADMIN ONLY)
router.put('/branding', authenticateToken, requireSuperAdmin, (req, res) => {
  const db = getDb();
  const updates = req.body;

  db.content.branding = {
    ...db.content.branding,
    ...updates,
    colors: { ...db.content.branding.colors, ...(updates.colors || {}) }
  };

  saveDb(db);
  addLog('INFO', 'BRANDING', `Visual identity palette & typography updated by Super Admin (${req.user.name})`);

  res.json({ success: true, branding: db.content.branding });
});

// PUT /api/content/navigation (SUPER_ADMIN ONLY)
router.put('/navigation', authenticateToken, requireSuperAdmin, (req, res) => {
  const db = getDb();
  const { headerLinks, footerLinks, socialLinks } = req.body;

  if (Array.isArray(headerLinks)) db.content.navigation.headerLinks = headerLinks;
  if (Array.isArray(footerLinks)) db.content.navigation.footerLinks = footerLinks;
  if (socialLinks) db.content.navigation.socialLinks = { ...db.content.navigation.socialLinks, ...socialLinks };

  saveDb(db);
  addLog('INFO', 'NAVIGATION', `Header & footer navigation updated by Super Admin (${req.user.name})`);

  res.json({ success: true, navigation: db.content.navigation });
});

// PUT /api/content/advanced (SUPER_ADMIN ONLY: Maintenance mode, analytics, SMTP, SEO)
router.put('/advanced', authenticateToken, requireSuperAdmin, (req, res) => {
  const db = getDb();
  const { analytics, smtp, maintenanceMode, maintenanceMessage, seo } = req.body;

  if (seo) db.content.advanced.seo = { ...(db.content.advanced.seo || {}), ...seo };
  if (analytics) db.content.advanced.analytics = { ...db.content.advanced.analytics, ...analytics };
  if (smtp) db.content.advanced.smtp = { ...db.content.advanced.smtp, ...smtp };
  if (maintenanceMode !== undefined) db.content.advanced.maintenanceMode = Boolean(maintenanceMode);
  if (maintenanceMessage !== undefined) db.content.advanced.maintenanceMessage = maintenanceMessage.trim();

  saveDb(db);
  addLog('WARN', 'CONFIG', `Advanced configuration & SEO metadata updated by Super Admin (${req.user.name})`);

  res.json({ success: true, advanced: db.content.advanced });
});

// GET /api/super-admin/logs (SUPER_ADMIN ONLY)
router.get('/logs', authenticateToken, requireSuperAdmin, (req, res) => {
  const db = getDb();
  res.json({
    success: true,
    logs: db.logs || []
  });
});

// GET /api/content/backup (SUPER_ADMIN ONLY: Full Database JSON Export)
router.get('/backup', authenticateToken, requireSuperAdmin, (req, res) => {
  const db = getDb();
  addLog('INFO', 'BACKUP', `Database backup snapshot generated by Super Admin (${req.user.name})`);

  res.json({
    success: true,
    database: db
  });
});

// POST /api/content/restore (SUPER_ADMIN ONLY: Restore Database from Snapshot)
router.post('/restore', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { database } = req.body;
    if (!database || typeof database !== 'object' || !Array.isArray(database.products)) {
      return res.status(400).json({ success: false, error: 'Invalid database backup structure. Products array is required.' });
    }

    const currentDb = getDb();
    const mergedUsers = Array.isArray(database.users) && database.users.length > 0
      ? database.users
      : currentDb.users;

    const restoredDb = {
      ...currentDb,
      ...database,
      users: mergedUsers
    };

    saveDb(restoredDb);
    addLog('WARN', 'BACKUP', `Database restored from backup snapshot by Super Admin (${req.user.name})`);

    res.json({
      success: true,
      message: 'Database backup snapshot successfully restored.'
    });
  } catch (err) {
    console.error('Database restore error:', err);
    res.status(500).json({ success: false, error: 'Failed to restore database backup.' });
  }
});

export default router;
