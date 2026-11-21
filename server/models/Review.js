import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true, index: true },
  userId: { type: String, default: null, index: true },
  userName: { type: String, required: true, trim: true },
  userEmail: { type: String, default: '', lowercase: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, default: '', trim: true },
  comment: { type: String, required: true, trim: true },
  isVerifiedPurchase: { type: Boolean, default: false },
  status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'approved', index: true }
}, { timestamps: true });

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;
