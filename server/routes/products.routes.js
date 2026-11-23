import { Router } from 'express';
import mongoose from 'mongoose';
import { getDb, saveDb, addLog, Product, Review } from '../config/db.js';
import { authenticateToken, requireClientAdmin, optionalAuthenticateToken } from '../middleware/auth.js';
import { sanitizeInput } from '../utils/security.js';

const router = Router();

// GET /api/products (Public & Admin Storefront)
router.get('/', optionalAuthenticateToken, async (req, res) => {
  try {
    const { scope, category, featured, search, sort, page = 1, limit = 50 } = req.query;
    const db = getDb();
    let items = [...(db.products || [])];

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
          p.category?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sort === 'price-low') {
      items.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sort === 'price-high') {
      items.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sort === 'newest') {
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 50);
    const totalCount = items.length;
    const paginatedItems = items.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({
      success: true,
      count: totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      products: paginatedItems
    });
  } catch (err) {
    console.error('Products fetch error:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve products.' });
  }
});

// GET /api/products/:id (Single Product Details)
router.get('/:id', optionalAuthenticateToken, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const product = (db.products || []).find((p) => p.id === id || p.slug === id);

  const isAdmin = req.user?.role === 'CLIENT_ADMIN' || req.user?.role === 'SUPER_ADMIN';
  if (!product || (!isAdmin && (product.status !== 'published' || product.visibility === false))) {
    return res.status(404).json({ success: false, error: 'Product not found.' });
  }

  // Attach reviews for this product
  const reviews = (db.reviews || []).filter(
    (r) => (r.productId === product.id || r.productId === product.slug) && r.status === 'approved'
  );
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 5.0;

  res.json({
    success: true,
    product: {
      ...product,
      reviewsCount: reviews.length,
      rating: parseFloat(avgRating)
    }
  });
});

// Helper to sanitize and normalize formulation variants
const sanitizeVariantsList = (rawVariants, productSku, productPrice, defaultStock = 20) => {
  if (!Array.isArray(rawVariants)) return [];
  return rawVariants
    .filter((v) => v && (v.name || v.flavour || v.size || v.sku || v.price))
    .map((v, idx) => {
      const flavour = sanitizeInput(v.flavour?.trim() || '');
      const size = sanitizeInput(v.size?.trim() || '');
      const autoName = [flavour, size].filter(Boolean).join(' - ') || `Option ${idx + 1}`;
      const name = sanitizeInput(v.name?.trim() || autoName);
      const autoSku = `${productSku}-V${idx + 1}${flavour ? '-' + flavour.replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toUpperCase() : ''}`;
      const sku = sanitizeInput(v.sku?.trim() || autoSku).toUpperCase();
      const price = (v.price !== undefined && v.price !== null && v.price !== '' && !isNaN(Number(v.price)))
        ? Number(v.price)
        : Number(productPrice) || 0;
      const salePrice = (v.salePrice !== undefined && v.salePrice !== null && v.salePrice !== '' && !isNaN(Number(v.salePrice)))
        ? Number(v.salePrice)
        : null;
      const stock = (v.stock !== undefined && v.stock !== null && v.stock !== '' && !isNaN(Number(v.stock)))
        ? Number(v.stock)
        : defaultStock;

      return {
        id: v.id || `var-${Date.now()}-${idx + 1}`,
        name,
        flavour,
        size,
        sku,
        price,
        salePrice,
        stock
      };
    });
};

// POST /api/products (Create Product - Admin)
router.post('/', authenticateToken, requireClientAdmin, async (req, res) => {
  try {
    const db = getDb();
    const data = req.body;

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

    const sku = (data.sku || `RK-${Date.now().toString().slice(-6)}`).trim().toUpperCase();
    if (db.products.some((p) => p.sku === sku)) {
      return res.status(400).json({ success: false, error: `SKU "${sku}" is already assigned to another product.` });
    }

    // Check MongoDB for collision if connected
    if (mongoose.connection.readyState === 1) {
      const existingInMongo = await Product.findOne({ $or: [{ slug }, { id: slug }, { sku }] }).select('name slug sku');
      if (existingInMongo) {
        if (existingInMongo.slug === slug || existingInMongo.id === slug) {
          return res.status(400).json({ success: false, error: `Product slug "${slug}" is already in use by "${existingInMongo.name}".` });
        }
        if (existingInMongo.sku === sku) {
          return res.status(400).json({ success: false, error: `SKU "${sku}" is already assigned to "${existingInMongo.name}".` });
        }
      }
    }

    const price = Number(data.price);
    if (isNaN(price) || price < 0) {
      return res.status(400).json({ success: false, error: 'Valid price is required.' });
    }

    const stock = typeof data.stock === 'number' && !isNaN(data.stock) ? data.stock : 50;
    const sanitizedVariants = sanitizeVariantsList(data.variants, sku, price, stock);

    const now = new Date().toISOString();
    const newProduct = {
      id: slug,
      name: sanitizeInput(data.name.trim()),
      slug,
      category: (data.category || 'protein').toLowerCase(),
      sku,
      price,
      salePrice: data.salePrice !== undefined && data.salePrice !== null && data.salePrice !== '' && !isNaN(Number(data.salePrice)) ? Number(data.salePrice) : null,
      stock,
      lowStockThreshold: typeof data.lowStockThreshold === 'number' && !isNaN(data.lowStockThreshold) ? data.lowStockThreshold : 10,
      shippingWeightKg: typeof data.shippingWeightKg === 'number' && !isNaN(data.shippingWeightKg) ? data.shippingWeightKg : 1.0,
      paymentRule: data.paymentRule || 'ALL',
      shortDescription: sanitizeInput(data.shortDescription?.trim() || ''),
      fullDescription: sanitizeInput(data.fullDescription?.trim() || ''),
      description: sanitizeInput(data.shortDescription?.trim() || data.fullDescription?.trim() || ''),
      images: Array.isArray(data.images) ? data.images : [],
      variants: sanitizedVariants,
      servingInfo: sanitizeInput(data.servingInfo?.trim() || ''),
      ingredients: sanitizeInput(data.ingredients?.trim() || ''),
      nutritionFacts: sanitizeInput(data.nutritionFacts?.trim() || ''),
      allergenInfo: sanitizeInput(data.allergenInfo?.trim() || ''),
      usageInstructions: sanitizeInput(data.usageInstructions?.trim() || ''),
      storageInstructions: sanitizeInput(data.storageInstructions?.trim() || ''),
      status: data.status === 'draft' ? 'draft' : 'published',
      featured: Boolean(data.featured),
      visibility: data.visibility !== false,
      availability: data.availability || 'in-stock',
      seoTitle: sanitizeInput(data.seoTitle?.trim() || `${data.name.trim()} — RK Nutrition`),
      seoDescription: sanitizeInput(data.seoDescription?.trim() || data.shortDescription?.trim() || ''),
      createdAt: now,
      updatedAt: now
    };

    if (mongoose.connection.readyState === 1) {
      await Product.create(newProduct);
    }

    db.products.unshift(newProduct);
    saveDb(db);

    addLog('INFO', 'PRODUCTS', `Created product: ${newProduct.name} (${newProduct.sku}) by ${req.user.name}`);

    res.status(201).json({
      success: true,
      product: newProduct
    });
  } catch (err) {
    console.error('Product create error:', err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'field';
      const val = err.keyValue ? err.keyValue[field] : '';
      return res.status(400).json({
        success: false,
        error: `A product with this ${field.toUpperCase()} ("${val}") already exists.`
      });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors || {}).map((e) => e.message);
      return res.status(400).json({
        success: false,
        error: messages.join('. ') || 'Validation error saving product.'
      });
    }
    res.status(500).json({ success: false, error: err.message || 'Failed to create product.' });
  }
});

// PUT /api/products/:id (Update Product - Admin)
router.put('/:id', authenticateToken, requireClientAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const index = db.products.findIndex((p) => p.id === id || p.slug === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    const existing = db.products[index];
    const data = req.body;

    if (data.sku && data.sku.trim().toUpperCase() !== existing.sku) {
      const newSku = data.sku.trim().toUpperCase();
      if (db.products.some((p) => p.sku === newSku && p.id !== existing.id)) {
        return res.status(400).json({ success: false, error: `SKU "${newSku}" is already in use.` });
      }
      if (mongoose.connection.readyState === 1) {
        const mongoDuplicate = await Product.findOne({ sku: newSku, id: { $ne: existing.id } });
        if (mongoDuplicate) {
          return res.status(400).json({ success: false, error: `SKU "${newSku}" is already assigned to "${mongoDuplicate.name}".` });
        }
      }
      existing.sku = newSku;
    }

    if (data.name) existing.name = sanitizeInput(data.name.trim());
    if (data.category) existing.category = data.category.toLowerCase();
    if (data.price !== undefined) existing.price = Number(data.price);
    if (data.salePrice !== undefined) existing.salePrice = data.salePrice !== '' && data.salePrice !== null ? Number(data.salePrice) : null;
    if (data.stock !== undefined) {
      existing.stock = Number(data.stock);
      if (existing.stock <= 0) existing.availability = 'out-of-stock';
      else if (existing.availability === 'out-of-stock') existing.availability = 'in-stock';
    }
    if (data.lowStockThreshold !== undefined) existing.lowStockThreshold = Number(data.lowStockThreshold);
    if (data.shippingWeightKg !== undefined) existing.shippingWeightKg = Number(data.shippingWeightKg);
    if (data.paymentRule) existing.paymentRule = data.paymentRule;
    if (data.shortDescription !== undefined) existing.shortDescription = sanitizeInput(data.shortDescription.trim());
    if (data.fullDescription !== undefined) existing.fullDescription = sanitizeInput(data.fullDescription.trim());
    if (Array.isArray(data.images)) existing.images = data.images;
    if (Array.isArray(data.variants)) {
      existing.variants = sanitizeVariantsList(data.variants, existing.sku, existing.price, existing.stock);
    }
    if (data.servingInfo !== undefined) existing.servingInfo = sanitizeInput(data.servingInfo.trim());
    if (data.ingredients !== undefined) existing.ingredients = sanitizeInput(data.ingredients.trim());
    if (data.nutritionFacts !== undefined) existing.nutritionFacts = sanitizeInput(data.nutritionFacts.trim());
    if (data.allergenInfo !== undefined) existing.allergenInfo = sanitizeInput(data.allergenInfo.trim());
    if (data.usageInstructions !== undefined) existing.usageInstructions = sanitizeInput(data.usageInstructions.trim());
    if (data.storageInstructions !== undefined) existing.storageInstructions = sanitizeInput(data.storageInstructions.trim());
    if (data.status) existing.status = data.status;
    if (data.featured !== undefined) existing.featured = Boolean(data.featured);
    if (data.visibility !== undefined) existing.visibility = Boolean(data.visibility);
    if (data.availability) existing.availability = data.availability;
    if (data.seoTitle !== undefined) existing.seoTitle = sanitizeInput(data.seoTitle.trim());
    if (data.seoDescription !== undefined) existing.seoDescription = sanitizeInput(data.seoDescription.trim());

    existing.updatedAt = new Date().toISOString();
    db.products[index] = existing;
    saveDb(db);

    if (mongoose.connection.readyState === 1) {
      await Product.findOneAndUpdate({ id: existing.id }, existing);
    }

    addLog('INFO', 'PRODUCTS', `Updated product: ${existing.name} (${existing.sku}) by ${req.user.name}`);

    res.json({
      success: true,
      product: existing
    });
  } catch (err) {
    console.error('Product update error:', err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'field';
      const val = err.keyValue ? err.keyValue[field] : '';
      return res.status(400).json({
        success: false,
        error: `A product with this ${field.toUpperCase()} ("${val}") already exists.`
      });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors || {}).map((e) => e.message);
      return res.status(400).json({
        success: false,
        error: messages.join('. ') || 'Validation error updating product.'
      });
    }
    res.status(500).json({ success: false, error: err.message || 'Failed to update product.' });
  }
});

// POST /api/products/:id/duplicate (Duplicate Product - Admin)
router.post('/:id/duplicate', authenticateToken, requireClientAdmin, async (req, res) => {
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
    status: 'draft',
    createdAt: now,
    updatedAt: now
  };

  db.products.unshift(duplicatedProduct);
  saveDb(db);

  if (mongoose.connection.readyState === 1) {
    await Product.create(duplicatedProduct).catch(() => {});
  }

  addLog('INFO', 'PRODUCTS', `Duplicated product: ${source.name} -> ${duplicatedProduct.name} by ${req.user.name}`);

  res.status(201).json({
    success: true,
    product: duplicatedProduct
  });
});

// DELETE /api/products/:id (Delete Product - Admin)
router.delete('/:id', authenticateToken, requireClientAdmin, async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const index = db.products.findIndex((p) => p.id === id || p.slug === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Product not found.' });
  }

  const deleted = db.products.splice(index, 1)[0];
  saveDb(db);

  if (mongoose.connection.readyState === 1) {
    await Product.deleteOne({ id: deleted.id }).catch(() => {});
  }

  addLog('INFO', 'PRODUCTS', `Deleted product: ${deleted.name} (${deleted.sku}) by ${req.user.name}`);

  res.json({
    success: true,
    deletedId: deleted.id,
    deletedName: deleted.name
  });
});

// GET /api/products/:id/reviews (Product Reviews)
router.get('/:id/reviews', (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const reviews = (db.reviews || []).filter(
    (r) => (r.productId === id || r.productId?.toLowerCase() === id.toLowerCase()) && r.status === 'approved'
  );

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 5.0;

  res.json({
    success: true,
    count: reviews.length,
    averageRating: parseFloat(avgRating),
    reviews
  });
});

// POST /api/products/:id/reviews (Customer Submit Review)
router.post('/:id/reviews', optionalAuthenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, userEmail, rating, title, comment } = req.body;

    const rateNum = Number(rating);
    if (!rateNum || rateNum < 1 || rateNum > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5 stars.' });
    }

    if (!comment || comment.trim().length < 5) {
      return res.status(400).json({ success: false, error: 'Review comment must be at least 5 characters.' });
    }

    const reviewerName = req.user?.name || userName?.trim() || 'Verified Athlete';
    const reviewerEmail = req.user?.email || userEmail?.trim() || '';

    const db = getDb();

    // Check if customer is a verified purchaser
    const isVerified = (db.orders || []).some(
      (o) =>
        (o.customer?.email?.toLowerCase() === reviewerEmail.toLowerCase() || o.userId === req.user?.id) &&
        (o.orderStatus === 'DELIVERED' || o.orderStatus === 'CONFIRMED' || o.paymentStatus === 'PAID') &&
        (o.items || []).some((it) => it.productId === id || it.productId?.toLowerCase() === id.toLowerCase())
    );

    const newReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      productId: id,
      userId: req.user?.id || null,
      userName: sanitizeInput(reviewerName),
      userEmail: reviewerEmail.toLowerCase(),
      rating: rateNum,
      title: sanitizeInput(title?.trim() || ''),
      comment: sanitizeInput(comment.trim()),
      isVerifiedPurchase: isVerified,
      status: 'approved', // Auto-approved by default for responsiveness
      createdAt: new Date().toISOString()
    };

    db.reviews = db.reviews || [];
    db.reviews.unshift(newReview);
    saveDb(db);

    if (mongoose.connection.readyState === 1) {
      await Review.create(newReview).catch(() => {});
    }

    addLog('INFO', 'REVIEWS', `New review added for product ${id} by ${reviewerName} (${rateNum} stars)`);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your product review has been published.',
      review: newReview
    });
  } catch (err) {
    console.error('Review submit error:', err);
    res.status(500).json({ success: false, error: 'Failed to submit review.' });
  }
});

// PUT /api/products/reviews/:reviewId/status (Admin Moderate Review)
router.put('/reviews/:reviewId/status', authenticateToken, requireClientAdmin, (req, res) => {
  const { reviewId } = req.params;
  const { status } = req.body;

  if (!['approved', 'pending', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid review status.' });
  }

  const db = getDb();
  const rev = (db.reviews || []).find((r) => r.id === reviewId);
  if (!rev) return res.status(404).json({ success: false, error: 'Review not found.' });

  rev.status = status;
  saveDb(db);

  res.json({ success: true, review: rev });
});

// DELETE /api/products/reviews/:reviewId (Admin Delete Review)
router.delete('/reviews/:reviewId', authenticateToken, requireClientAdmin, (req, res) => {
  const { reviewId } = req.params;
  const db = getDb();
  db.reviews = (db.reviews || []).filter((r) => r.id !== reviewId);
  saveDb(db);
  res.json({ success: true, message: 'Review deleted.' });
});

export default router;
