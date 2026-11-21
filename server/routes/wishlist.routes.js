import { Router } from 'express';
import mongoose from 'mongoose';
import { getDb, Wishlist, Product } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();
const memoryWishlists = new Map(); // userId -> Set of productIds

// GET /api/wishlist (Customer Wishlist)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    let productIds = [];

    if (mongoose.connection.readyState === 1) {
      const dbWish = await Wishlist.findOne({ userId });
      if (dbWish) productIds = dbWish.productIds || [];
    } else {
      productIds = Array.from(memoryWishlists.get(userId) || []);
    }

    const db = getDb();
    const items = (db.products || []).filter(
      (p) => productIds.includes(p.id) && p.status === 'published' && p.visibility !== false
    );

    res.json({
      success: true,
      count: items.length,
      productIds,
      products: items
    });
  } catch (err) {
    console.error('Wishlist error:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve wishlist.' });
  }
});

// POST /api/wishlist/toggle (Toggle Item in Wishlist)
router.post('/toggle', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, error: 'Product ID is required.' });
    }

    let set = memoryWishlists.get(userId) || new Set();
    let action = 'added';

    if (set.has(productId)) {
      set.delete(productId);
      action = 'removed';
    } else {
      set.add(productId);
      action = 'added';
    }

    memoryWishlists.set(userId, set);
    const productIds = Array.from(set);

    if (mongoose.connection.readyState === 1) {
      await Wishlist.findOneAndUpdate(
        { userId },
        { userId, productIds },
        { upsert: true }
      );
    }

    res.json({
      success: true,
      action,
      productId,
      wishlistIds: productIds
    });
  } catch (err) {
    console.error('Wishlist toggle error:', err);
    res.status(500).json({ success: false, error: 'Failed to update wishlist.' });
  }
});

export default router;
