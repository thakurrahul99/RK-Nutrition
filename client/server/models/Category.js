import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  description: { type: String, default: '', trim: true },
  tagline: { type: String, default: '', trim: true },
  image: { type: String, default: '', trim: true },
  isActive: { type: Boolean, default: true, index: true },
  displayOrder: { type: Number, default: 1, index: true },
  seoTitle: { type: String, default: '', trim: true },
  seoDescription: { type: String, default: '', trim: true }
}, { 
  timestamps: true 
});

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;
