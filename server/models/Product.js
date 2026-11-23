import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  id: { type: String, default: () => `var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}` },
  name: { type: String, default: 'Standard', trim: true },
  flavour: { type: String, trim: true, default: '' },
  size: { type: String, trim: true, default: '' },
  sku: { type: String, uppercase: true, trim: true, default: '' },
  price: { type: Number, default: 0, min: 0 },
  salePrice: { type: Number, default: null, min: 0 },
  stock: { type: Number, default: 20, min: 0 }
});

const productSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  name: { type: String, required: true, trim: true, index: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  sku: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
  brand: { type: String, default: 'RK Nutrition', trim: true },
  category: { type: String, required: true, lowercase: true, trim: true, index: true },
  categoryId: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, default: null, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  lowStockThreshold: { type: Number, default: 10, min: 0 },
  shippingWeightKg: { type: Number, default: 1.0, min: 0 },
  paymentRule: { 
    type: String, 
    enum: ['ALL', 'PREPAID_ONLY', 'COD_ONLY', 'COD_DISABLED'], 
    default: 'ALL' 
  },
  shortDescription: { type: String, default: '', trim: true },
  fullDescription: { type: String, default: '', trim: true },
  description: { type: String, default: '', trim: true },
  images: [{ type: String }],
  variants: [variantSchema],
  servingInfo: { type: String, default: '', trim: true },
  ingredients: { type: String, default: '', trim: true },
  nutritionFacts: { type: String, default: '', trim: true },
  allergenInfo: { type: String, default: '', trim: true },
  usageInstructions: { type: String, default: '', trim: true },
  storageInstructions: { type: String, default: '', trim: true },
  status: { 
    type: String, 
    enum: ['published', 'draft', 'archived'], 
    default: 'published',
    index: true 
  },
  featured: { type: Boolean, default: false, index: true },
  visibility: { type: Boolean, default: true, index: true },
  availability: { 
    type: String, 
    enum: ['in-stock', 'coming-soon', 'out-of-stock'], 
    default: 'in-stock',
    index: true 
  },
  seoTitle: { type: String, default: '', trim: true },
  seoDescription: { type: String, default: '', trim: true }
}, { 
  timestamps: true 
});

// Text index for searching
productSchema.index({ name: 'text', description: 'text', sku: 'text' });

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
