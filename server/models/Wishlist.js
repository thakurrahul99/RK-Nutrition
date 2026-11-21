import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId: { type: String, unique: true, index: true, required: true },
  productIds: [{ type: String, index: true }]
}, { timestamps: true });

export const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;
