import { Router } from 'express';
import mongoose from 'mongoose';
import { getDb, saveDb, addLog, Category } from '../config/db.js';
import { authenticateToken, requireClientAdmin } from '../middleware/auth.js';

const router = Router();

// Helper to generate a clean URL-friendly slug
const generateSlug = (text) => {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// GET /api/categories (Public Storefront)
// Returns only active categories, sorted by displayOrder
router.get('/', (req, res) => {
  const { search } = req.query;
  const db = getDb();
  let categories = (db.categories || []).filter(
    (c) =>
      c.isActive !== false &&
      !c.id?.startsWith('cat-test-') &&
      !c.slug?.startsWith('test-cat-') &&
      !c.slug?.includes('test-cat') &&
      c.name?.toLowerCase() !== 'specialty creatine'
  );

  if (search) {
    const q = search.trim().toLowerCase();
    categories = categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
  }

  // Sort by displayOrder ascending, fallback to name
  categories.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999) || a.name.localeCompare(b.name));

  // Attach real-time product count for active/published products
  const enriched = categories.map((cat) => {
    const productCount = (db.products || []).filter(
      (p) =>
        p.status === 'published' &&
        p.visibility !== false &&
        (p.category?.toLowerCase() === cat.slug.toLowerCase() ||
          p.category?.toLowerCase() === cat.id.toLowerCase() ||
          p.categoryId === cat.id)
    ).length;

    let image = cat.image || '';
    if (!image) {
      if (cat.slug === 'protein') image = '/images/products/RK Nutrition Whey Protein Poster.png';
      else if (cat.slug === 'mass-gainer') image = '/images/products/RK Nutrition Mass Gainer Showcase.png';
      else if (cat.slug === 'pre-workout') image = '/images/products/RK Nutrition Pre-Workout Energy Poster.png';
      else if (cat.slug === 'creatine') image = '/images/products/Electric Blue Creatine Power Ad.png';
    }

    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      tagline: cat.tagline || '',
      image,
      displayOrder: cat.displayOrder || 1,
      productCount
    };
  });

  res.json({
    success: true,
    count: enriched.length,
    categories: enriched
  });
});

// GET /api/categories/admin (Client Admin - All categories with full metrics)
router.get('/admin', authenticateToken, requireClientAdmin, (req, res) => {
  const { search } = req.query;
  const db = getDb();
  let categories = [...(db.categories || [])];

  if (search) {
    const q = search.trim().toLowerCase();
    categories = categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
  }

  // Sort by displayOrder ascending
  categories.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999) || a.name.localeCompare(b.name));

  // Compute total and published product counts
  const enriched = categories.map((cat) => {
    const assignedProducts = (db.products || []).filter(
      (p) =>
        p.category?.toLowerCase() === cat.slug.toLowerCase() ||
        p.category?.toLowerCase() === cat.id.toLowerCase() ||
        p.categoryId === cat.id
    );

    const publishedCount = assignedProducts.filter(
      (p) => p.status === 'published' && p.visibility !== false
    ).length;

    return {
      ...cat,
      productCount: assignedProducts.length,
      publishedProductCount: publishedCount
    };
  });

  res.json({
    success: true,
    count: enriched.length,
    categories: enriched
  });
});

// PUT /api/categories/reorder (Client Admin - Batch update display order)
// MUST BE REGISTERED BEFORE /:idOrSlug to avoid route conflict
router.put('/reorder', authenticateToken, requireClientAdmin, (req, res) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return res.status(400).json({ success: false, error: 'orderedIds array is required.' });
  }

  const db = getDb();
  const idToOrder = {};
  orderedIds.forEach((id, index) => {
    idToOrder[id] = index + 1;
  });

  db.categories.forEach((cat) => {
    if (idToOrder[cat.id] !== undefined) {
      cat.displayOrder = idToOrder[cat.id];
      cat.updatedAt = new Date().toISOString();
    }
  });

  // Re-sort
  db.categories.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));

  saveDb(db);
  addLog('INFO', 'CATEGORIES', `Category display order updated by ${req.user.name}`);

  res.json({
    success: true,
    message: 'Categories reordered successfully.',
    categories: db.categories
  });
});

// GET /api/categories/:idOrSlug (Single Category)
router.get('/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  const db = getDb();
  const q = idOrSlug.trim().toLowerCase();

  const category = (db.categories || []).find(
    (c) => c.id.toLowerCase() === q || c.slug.toLowerCase() === q
  );

  if (!category || category.isActive === false) {
    return res.status(404).json({ success: false, error: 'Category not found.' });
  }

  // Count products
  const productCount = (db.products || []).filter(
    (p) =>
      p.status === 'published' &&
      p.visibility !== false &&
      (p.category?.toLowerCase() === category.slug.toLowerCase() ||
        p.category?.toLowerCase() === category.id.toLowerCase() ||
        p.categoryId === category.id)
  ).length;

  res.json({
    success: true,
    category: {
      ...category,
      productCount
    }
  });
});

// POST /api/categories (Client Admin - Create new category)
router.post('/', authenticateToken, requireClientAdmin, (req, res) => {
  const { name, slug, description, tagline, image, isActive, displayOrder } = req.body;
  const db = getDb();

  // Validate name
  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Category name must be at least 2 characters long.'
    });
  }

  const cleanName = name.trim();

  // Validate duplicate name
  if ((db.categories || []).some((c) => c.name.toLowerCase() === cleanName.toLowerCase())) {
    return res.status(400).json({
      success: false,
      error: `A category named "${cleanName}" already exists.`
    });
  }

  // Generate or sanitize slug
  const finalSlug = slug && slug.trim() ? generateSlug(slug) : generateSlug(cleanName);
  if (!finalSlug) {
    return res.status(400).json({
      success: false,
      error: 'Valid category slug could not be generated from the name.'
    });
  }

  // Validate duplicate slug
  if ((db.categories || []).some((c) => c.slug.toLowerCase() === finalSlug.toLowerCase())) {
    return res.status(400).json({
      success: false,
      error: `Category slug "${finalSlug}" is already in use.`
    });
  }

  // Determine display order
  let order = Number(displayOrder);
  if (isNaN(order) || order <= 0) {
    const existingOrders = (db.categories || []).map((c) => c.displayOrder || 0);
    order = existingOrders.length > 0 ? Math.max(...existingOrders) + 1 : 1;
  }

  const now = new Date().toISOString();
  const newCategory = {
    id: `cat-${finalSlug}`,
    name: cleanName,
    slug: finalSlug,
    description: description ? description.trim() : '',
    tagline: tagline ? tagline.trim() : '',
    image: image ? image.trim() : '',
    isActive: isActive !== false,
    displayOrder: order,
    createdAt: now,
    updatedAt: now
  };

  if (!db.categories) db.categories = [];
  db.categories.push(newCategory);
  
  // Re-sort categories by order
  db.categories.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));

  saveDb(db);
  if (mongoose.connection.readyState === 1) {
    Category.create(newCategory).catch(() => {});
  }
  addLog('INFO', 'CATEGORIES', `Category created: "${newCategory.name}" (${newCategory.slug}) by ${req.user.name}`);

  res.status(201).json({
    success: true,
    category: newCategory
  });
});

// PUT /api/categories/:id (Client Admin - Update category)
router.put('/:id', authenticateToken, requireClientAdmin, (req, res) => {
  const { id } = req.params;
  const { name, slug, description, tagline, image, isActive, displayOrder } = req.body;
  const db = getDb();

  const index = (db.categories || []).findIndex(
    (c) => c.id === id || c.slug === id
  );

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Category not found.' });
  }

  const existing = db.categories[index];
  const oldSlug = existing.slug;

  // Name update validation
  if (name !== undefined) {
    const cleanName = name.trim();
    if (cleanName.length < 2) {
      return res.status(400).json({ success: false, error: 'Category name must be at least 2 characters.' });
    }
    // Check duplicate name on other categories
    const nameConflict = db.categories.some(
      (c) => c.id !== existing.id && c.name.toLowerCase() === cleanName.toLowerCase()
    );
    if (nameConflict) {
      return res.status(400).json({ success: false, error: `Another category named "${cleanName}" already exists.` });
    }
    existing.name = cleanName;
  }

  // Slug update validation
  let newSlug = oldSlug;
  if (slug !== undefined && slug.trim() && slug.trim().toLowerCase() !== oldSlug.toLowerCase()) {
    newSlug = generateSlug(slug);
    const slugConflict = db.categories.some(
      (c) => c.id !== existing.id && c.slug.toLowerCase() === newSlug.toLowerCase()
    );
    if (slugConflict) {
      return res.status(400).json({ success: false, error: `Category slug "${newSlug}" is already in use by another category.` });
    }
    existing.slug = newSlug;

    // Cascade slug update to all assigned products
    let migratedProductsCount = 0;
    (db.products || []).forEach((prod) => {
      if (prod.category?.toLowerCase() === oldSlug.toLowerCase() || prod.category === existing.id) {
        prod.category = newSlug;
        prod.updatedAt = new Date().toISOString();
        migratedProductsCount++;
      }
    });

    if (migratedProductsCount > 0) {
      addLog('INFO', 'CATEGORIES', `Updated ${migratedProductsCount} products from old category slug "${oldSlug}" to "${newSlug}"`);
    }
  }

  if (description !== undefined) existing.description = description.trim();
  if (tagline !== undefined) existing.tagline = tagline.trim();
  if (image !== undefined) existing.image = image.trim();
  if (isActive !== undefined) existing.isActive = Boolean(isActive);
  if (displayOrder !== undefined && !isNaN(Number(displayOrder))) {
    existing.displayOrder = Number(displayOrder);
  }

  existing.updatedAt = new Date().toISOString();
  db.categories[index] = existing;

  // Re-sort
  db.categories.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));

  saveDb(db);
  if (mongoose.connection.readyState === 1) {
    Category.findOneAndUpdate({ id: existing.id }, existing).catch(() => {});
  }
  addLog('INFO', 'CATEGORIES', `Category updated: "${existing.name}" by ${req.user.name}`);

  res.json({
    success: true,
    category: existing
  });
});

// DELETE /api/categories/:id (Client Admin - Delete category with safety check)
router.delete('/:id', authenticateToken, requireClientAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDb();

  const index = (db.categories || []).findIndex(
    (c) => c.id === id || c.slug === id
  );

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Category not found.' });
  }

  const categoryToDelete = db.categories[index];

  // Check if any product is assigned to this category
  const assignedProducts = (db.products || []).filter(
    (p) =>
      p.category?.toLowerCase() === categoryToDelete.slug.toLowerCase() ||
      p.category?.toLowerCase() === categoryToDelete.id.toLowerCase() ||
      p.categoryId === categoryToDelete.id
  );

  if (assignedProducts.length > 0) {
    return res.status(400).json({
      success: false,
      error: `Cannot delete category "${categoryToDelete.name}". It is currently assigned to ${assignedProducts.length} product(s). Please reassign or delete these products first.`,
      assignedCount: assignedProducts.length,
      assignedProducts: assignedProducts.map((p) => ({ id: p.id, name: p.name, sku: p.sku }))
    });
  }

  // Safe to delete
  db.categories.splice(index, 1);

  // Normalize remaining display orders
  db.categories.forEach((cat, idx) => {
    cat.displayOrder = idx + 1;
  });

  saveDb(db);
  if (mongoose.connection.readyState === 1) {
    Category.deleteOne({ id: categoryToDelete.id }).catch(() => {});
  }
  addLog('INFO', 'CATEGORIES', `Category deleted: "${categoryToDelete.name}" (${categoryToDelete.slug}) by ${req.user.name}`);

  res.json({
    success: true,
    message: `Category "${categoryToDelete.name}" deleted successfully.`,
    deletedCategory: categoryToDelete
  });
});

export default router;
