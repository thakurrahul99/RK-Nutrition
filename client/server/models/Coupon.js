import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  discountValue: { type: Number, required: true, min: 0 },
  minCartValue: { type: Number, default: 0, min: 0 },
  maxUses: { type: Number, default: 100, min: 0 },
  usedCount: { type: Number, default: 0, min: 0 },
  perCustomerLimit: { type: Number, default: 1, min: 1 },
  usedByCustomers: [{ type: String }],
  expiryDate: { type: String, required: true },
  isActive: { type: Boolean, default: true, index: true },
  description: { type: String, default: '', trim: true }
}, { timestamps: true });

export const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
export default Coupon;
