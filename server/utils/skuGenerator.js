import mongoose from 'mongoose';
import Counter from '../models/Counter.js';
import Product from '../models/Product.js';
import { saveDb } from '../config/db.js';

export const CATEGORY_SKU_PREFIXES = {
  protein: 'PRO',
  'mass-gainer': 'GAI',
  gainer: 'GAI',
  'pre-workout': 'PRE',
  preworkout: 'PRE',
  creatine: 'CRE'
};

/**
 * Returns standardized 3-letter category SKU prefix
 */
export const getCategorySkuPrefix = (category = '') => {
  const norm = String(category).toLowerCase().trim().replace(/_/g, '-');
  if (CATEGORY_SKU_PREFIXES[norm]) {
    return CATEGORY_SKU_PREFIXES[norm];
  }
  if (norm.includes('mass') || norm.includes('gainer')) return 'GAI';
  if (norm.includes('pre')) return 'PRE';
  if (norm.includes('creatine')) return 'CRE';
  if (norm.includes('protein') || norm.includes('whey') || norm.includes('isolate')) return 'PRO';

  // Generic 3-letter alphanumeric fallback
  const clean = norm.replace(/[^a-z0-9]/g, '').toUpperCase();
  return (clean.slice(0, 3) || 'GEN').padEnd(3, 'X');
};

/**
 * Formats full SKU according to RK Nutrition standard: RK-CATEGORY-0001
 */
export const formatSku = (category, sequenceNumber) => {
  const prefix = getCategorySkuPrefix(category);
  const numStr = String(sequenceNumber).padStart(4, '0');
  return `RK-${prefix}-${numStr}`;
};

/**
 * Scans MongoDB and memory cache for the highest numeric sequence in SKUs of format RK-[A-Z]+-(\d{4,})
 */
export const getMaxExistingSkuSequence = async (db) => {
  let maxSeq = 0;

  // 1. Check in-memory/file cache
  const products = (db && Array.isArray(db.products)) ? db.products : [];
  for (const p of products) {
    if (typeof p.sku === 'string') {
      const match = p.sku.match(/^RK-[A-Z]+-(\d{4,})$/i);
      if (match && match[1]) {
        const val = parseInt(match[1], 10);
        if (!isNaN(val) && val > maxSeq) {
          maxSeq = val;
        }
      }
    }
  }

  // 2. Check MongoDB if connected
  if (mongoose.connection.readyState === 1) {
    try {
      const docs = await Product.find({ sku: { $regex: /^RK-[A-Z]+-\d{4,}$/i } }).select('sku').lean();
      for (const d of docs) {
        if (typeof d.sku === 'string') {
          const match = d.sku.match(/^RK-[A-Z]+-(\d{4,})$/i);
          if (match && match[1]) {
            const val = parseInt(match[1], 10);
            if (!isNaN(val) && val > maxSeq) {
              maxSeq = val;
            }
          }
        }
      }
    } catch (e) {
      console.warn('[SKU Generator] Failed to scan MongoDB for max SKU sequence:', e.message);
    }
  }

  return maxSeq;
};

/**
 * Checks if a SKU is already taken in MongoDB or local cache
 */
export const isSkuTaken = async (sku, db) => {
  if (!sku) return false;
  const cleanSku = sku.trim().toUpperCase();

  // Local cache check
  const products = (db && Array.isArray(db.products)) ? db.products : [];
  if (products.some((p) => p.sku?.trim().toUpperCase() === cleanSku)) {
    return true;
  }

  // MongoDB check
  if (mongoose.connection.readyState === 1) {
    try {
      const exists = await Product.exists({ sku: cleanSku });
      if (exists) return true;
    } catch (e) {
      console.warn('[SKU Generator] Error checking SKU collision in Mongo:', e.message);
    }
  }

  return false;
};

/**
 * Peeks the next sequence without incrementing counter (for form preview)
 */
export const peekNextProductSequence = async (db) => {
  let currentSeq = 0;

  if (mongoose.connection.readyState === 1) {
    try {
      const counterDoc = await Counter.findById('product_sku').lean();
      if (counterDoc && typeof counterDoc.seq === 'number') {
        currentSeq = counterDoc.seq;
      }
    } catch (e) {
      console.warn('[SKU Generator] Error reading counter doc:', e.message);
    }
  }

  if (db && db.counters && typeof db.counters.product_sku === 'number') {
    currentSeq = Math.max(currentSeq, db.counters.product_sku);
  }

  const maxExisting = await getMaxExistingSkuSequence(db);
  currentSeq = Math.max(currentSeq, maxExisting);

  return currentSeq + 1;
};

/**
 * Atomically allocates the next unique sequential SKU for the given category
 */
export const allocateNextProductSku = async (category, db) => {
  const prefix = getCategorySkuPrefix(category);
  let allocatedSeq = 0;
  let candidateSku = '';
  let attempts = 0;

  while (attempts < 50) {
    attempts++;

    if (mongoose.connection.readyState === 1) {
      try {
        const maxExisting = await getMaxExistingSkuSequence(db);
        const doc = await Counter.findOneAndUpdate(
          { _id: 'product_sku' },
          { $inc: { seq: 1 } },
          { returnDocument: 'after', upsert: true }
        );

        if (doc && doc.seq <= maxExisting) {
          // Fast-forward counter if behind existing products
          const adjusted = await Counter.findOneAndUpdate(
            { _id: 'product_sku' },
            { $set: { seq: maxExisting + 1 } },
            { returnDocument: 'after' }
          );
          allocatedSeq = adjusted.seq;
        } else if (doc) {
          allocatedSeq = doc.seq;
        }
      } catch (e) {
        console.warn('[SKU Generator] Mongo atomic increment error, falling back to cache:', e.message);
      }
    }

    if (!allocatedSeq) {
      // Memory / cache fallback
      db.counters = db.counters || {};
      const maxExisting = await getMaxExistingSkuSequence(db);
      const current = Math.max(db.counters.product_sku || 0, maxExisting);
      allocatedSeq = current + 1;
      db.counters.product_sku = allocatedSeq;
      saveDb(db);
    }

    candidateSku = `RK-${prefix}-${String(allocatedSeq).padStart(4, '0')}`;

    // Verify candidate SKU is not taken
    const taken = await isSkuTaken(candidateSku, db);
    if (!taken) {
      // Update cache counter to keep in sync
      if (db) {
        db.counters = db.counters || {};
        db.counters.product_sku = Math.max(db.counters.product_sku || 0, allocatedSeq);
        saveDb(db);
      }
      return { sku: candidateSku, sequence: allocatedSeq };
    }
    // If taken, loop again to allocate next sequence
  }

  // Emergency fallback if loop limit reached
  const emergencySeq = (allocatedSeq || 1000) + 1;
  const emergencySku = `RK-${prefix}-${String(emergencySeq).padStart(4, '0')}`;
  return { sku: emergencySku, sequence: emergencySeq };
};
