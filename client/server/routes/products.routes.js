import { Router } from 'express';
import { getDb, saveDb, addLog } from '../config/db.js';
import { authenticateToken, requireClientAdmin, optionalAuthenticateToken } from '../middleware/auth.js';

const router = Router();

// GET /api/products
router.get('/', optionalAuthenticateToken, (req, res) => {
  const { scope, category, featured, search } = req.query;
  const db = getDb();
  let items = [...db.products];

  // Public visitors only receive published, visible products. Admin tokens may access drafts.
  const isAdmin = req.user?.role === 'CLIENT_ADMIN' || req.user?.role === 'SUPER_ADMIN';
  if (!isAdmin || scope === 'public') {
    items = items.filter((p) => p.status === 'published' && p.visibility !== false);
  }

  // Category filter
  if (category && category !== 'all') {
    items = items.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
  }

  // Featured filter
  if (featured === 'true') {
    items = items.filter((p) => p.featured);
    if (items.length === 0) {
      // Fallback to first 3 published
      items = db.products.filter((p) => p.status === 'published' && p.visibility !== false).slice(0, 3);
    }
  }

  // Search filter
  if (search) {
    const q = search.trim().toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: items.length,
    products: items
  });
});

// GET /api/products/:id
router.get('/:id', optionalAuthenticateToken, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const product = db.products.find((p) => p.id === id || p.slug === id);

  const isAdmin = req.user?.role === 'CLIENT_ADMIN' || req.user?.role === 'SUPER_ADMIN';
  if (!product || (!isAdmin && (product.status !== 'published' || product.visibility === false))) {
    return res.status(404).json({ success: false, error: 'Product not found.' });
  }

  res.json({
    success: true,
    product
  });
});

// POST /api/products (Create)
router.post('/', authenticateToken, requireClientAdmin, (req, res) => {
  const db = getDb();
  const data = req.body;

  // Validation
  if (!data.name || data.name.trim().length < 3) {
    return res.status(400).json({ success: false, error: 'Product name must be at least 3 characters.' });
  }

  const slug = (data.slug || data.name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (db.products.some((p) => p.slug === slug || p.id === slug)) {
    return res.status(400).json({ success: false, error: `Product slug "${slug}" is already in use.` });
  }

  const sku = (data.sku || `RK-${Date.now()}`).trim().toUpperCase();
  if (db.products.some((p) => p.sku === sku)) {
    return res.status(400).json({ success: false, error: `SKU "${sku}" is already assigned to another product.` });
  }

  const price = Number(data.price);
  if (isNaN(price) || price < 0) {
    return res.status(400).json({ success: false, error: 'Valid price is required.' });
  }

  const now = new Date().toISOString();
  const newProduct = {
    id: slug,
    name: data.name.trim(),
    slug,
    category: data.category || 'protein',
    sku,
    price,
    salePrice: data.salePrice ? Number(data.salePrice) : null,
    stock: typeof data.stock === 'number' ? data.stock : 50,
    lowStockThreshold: typeof data.lowStockThreshold === 'number' ? data.lowStockThreshold : 10,
    shippingWeightKg: typeof data.shippingWeightKg === 'number' ? data.shippingWeightKg : 1.0,
    paymentRule: data.paymentRule || 'ALL', // 'ALL' | 'PREPAID_ONLY' | 'COD_ONLY' | 'COD_DISABLED' | 'PREPAID_AND_COD'
    shortDescription: data.shortDescription?.trim() || '',
    fullDescription: data.fullDescription?.trim() || '',
    description: data.shortDescription?.trim() || data.fullDescription?.trim() || '',
    images: Array.isArray(data.images) ? data.images : [],
    variants: Array.isArray(data.variants) ? data.variants : [],
    servingInfo: data.servingInfo?.trim() || '',
    ingredients: data.ingredients?.trim() || '',
    nutritionFacts: data.nutritionFacts?.trim() || '',
    allergenInfo: data.allergenInfo?.trim() || '',
    usageInstructions: data.usageInstructions?.trim() || '',
    storageInstructions: data.storageInstructions?.trim() || '',
    status: data.status === 'draft' ? 'draft' : 'published',
    featured: Boolean(data.featured),
    visibility: data.visibility !== false,
    availability: data.availability || 'coming-soon',
    seoTitle: data.seoTitle?.trim() || `${data.name.trim()} — RK Nutrition`,
    seoDescription: data.seoDescription?.trim() || data.shortDescription?.trim() || '',
    createdAt: now,
    updatedAt: now
  };

  db.products.unshift(newProduct);
  saveDb(db);
  addLog('INFO', 'PRODUCTS', `Created product: ${newProduct.name} (${newProduct.sku}) by ${req.user.name}`);

  res.status(201).json({
    success: true,
    product: newProduct
  });
});

// PUT /api/products/:id (Update)
router.put('/:id', authenticateToken, requireClientAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const index = db.products.findIndex((p) => p.id === id || p.slug === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Product not found.' });
  }

  const existing = db.products[index];
  const data = req.body;

  // Check SKU uniqueness if changed
  if (data.sku && data.sku.trim().toUpperCase() !== existing.sku) {
    const newSku = data.sku.trim().toUpperCase();
    if (db.products.some((p) => p.sku === newSku && p.id !== existing.id)) {
      return res.status(400).json({ success: false, error: `SKU "${newSku}" is already in use.` });
    }
    existing.sku = newSku;
  }

  // Check slug uniqueness if changed
  if (data.slug && data.slug.trim().toLowerCase() !== existing.slug) {
    const newSlug = data.slug.trim().toLowerCase();
    if (db.products.some((p) => p.slug === newSlug && p.id !== existing.id)) {
      return res.status(400).json({ success: false, error: `Slug "${newSlug}" is already in use.` });
    }
    existing.slug = newSlug;
  }

  if (data.name) existing.name = data.name.trim();
  if (data.category) existing.category = data.category;
  if (data.price !== undefined) existing.price = Number(data.price);
  if (data.salePrice !== undefined) existing.salePrice = data.salePrice ? Number(data.salePrice) : null;
  if (data.stock !== undefined) existing.stock = Number(data.stock);
  if (data.lowStockThreshold !== undefined) existing.lowStockThreshold = Number(data.lowStockThreshold);
  if (data.shippingWeightKg !== undefined) existing.shippingWeightKg = Number(data.shippingWeightKg);
  if (data.paymentRule) existing.paymentRule = data.paymentRule;
  if (data.shortDescription !== undefined) existing.shortDescription = data.shortDescription.trim();
  if (data.fullDescription !== undefined) existing.fullDescription = data.fullDescription.trim();
  if (data.description !== undefined) existing.description = data.description.trim();
  if (Array.isArray(data.images)) existing.images = data.images;
  if (Array.isArray(data.variants)) existing.variants = data.variants;
  if (data.servingInfo !== undefined) existing.servingInfo = data.servingInfo.trim();
  if (data.ingredients !== undefined) existing.ingredients = data.ingredients.trim();
  if (data.nutritionFacts !== undefined) existing.nutritionFacts = data.nutritionFacts.trim();
  if (data.allergenInfo !== undefined) existing.allergenInfo = data.allergenInfo.trim();
  if (data.usageInstructions !== undefined) existing.usageInstructions = data.usageInstructions.trim();
  if (data.storageInstructions !== undefined) existing.storageInstructions = data.storageInstructions.trim();
  if (data.status) existing.status = data.status;
  if (data.featured !== undefined) existing.featured = Boolean(data.featured);
  if (data.visibility !== undefined) existing.visibility = Boolean(data.visibility);
  if (data.availability) existing.availability = data.availability;
  if (data.seoTitle !== undefined) existing.seoTitle = data.seoTitle.trim();
  if (data.seoDescription !== undefined) existing.seoDescription = data.seoDescription.trim();

  existing.updatedAt = new Date().toISOString();
  db.products[index] = existing;
  saveDb(db);
  addLog('INFO', 'PRODUCTS', `Updated product: ${existing.name} (${existing.sku}) by ${req.user.name}`);

  res.json({
    success: true,
    product: existing
  });
});

// POST /api/products/:id/duplicate
router.post('/:id/duplicate', authenticateToken, requireClientAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const source = db.products.find((p) => p.id === id || p.slug === id);

  if (!source) {
    return res.status(404).json({ success: false, error: 'Product not found to duplicate.' });
  }

  const now = new Date().toISOString();
  const duplicateId = `${source.slug || source.id}-copy-${Date.now().toString().slice(-4)}`;
  const duplicateSku = `${source.sku || 'RK'}-COPY-${Date.now().toString().slice(-3)}`;

  const duplicatedProduct = {
    ...JSON.parse(JSON.stringify(source)),
    id: duplicateId,
    slug: duplicateId,
    name: `${source.name} (Copy)`,
    sku: duplicateSku,
    status: 'draft', // duplicated items start in draft status
    createdAt: now,
    updatedAt: now
  };

  db.products.unshift(duplicatedProduct);
  saveDb(db);
  addLog('INFO', 'PRODUCTS', `Duplicated product: ${source.name} -> ${duplicatedProduct.name} by ${req.user.name}`);

  res.status(201).json({
    success: true,
    product: duplicatedProduct
  });
});

// DELETE /api/products/:id
router.delete('/:id', authenticateToken, requireClientAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const index = db.products.findIndex((p) => p.id === id || p.slug === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Product not found.' });
  }

  const deleted = db.products.splice(index, 1)[0];
  saveDb(db);
  addLog('INFO', 'PRODUCTS', `Deleted product: ${deleted.name} (${deleted.sku}) by ${req.user.name}`);

  res.json({
    success: true,
    deletedId: deleted.id,
    deletedName: deleted.name
  });
});

export default router;
