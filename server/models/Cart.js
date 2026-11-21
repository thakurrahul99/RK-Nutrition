import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  variantId: { type: String, default: null },
  quantity: { type: Number, required: true, min: 1, default: 1 }
});

const cartSchema = new mongoose.Schema({
  userId: { type: String, unique: true, index: true, required: true },
  items: [cartItemSchema],
  appliedCoupon: { type: String, default: null }
}, { timestamps: true });

export const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
export default Cart;
