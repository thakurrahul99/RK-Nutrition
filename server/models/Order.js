import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  variant: { type: String, default: '', trim: true },
  flavour: { type: String, default: '', trim: true },
  sku: { type: String, default: '', uppercase: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  total: { type: Number, required: true, min: 0 }
});

const customerDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  pincode: { type: String, required: true, trim: true }
});

const orderSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  orderNumber: { type: Number, unique: true, required: true, index: true },
  userId: { type: String, index: true, default: null },
  customer: customerDetailsSchema,
  items: [orderItemSchema],
  subtotal: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  couponCode: { type: String, default: null, trim: true },
  shippingFee: { type: Number, default: 0, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  paymentMethod: { 
    type: String, 
    enum: ['COD', 'UPI', 'CARD'], 
    required: true,
    index: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'], 
    default: 'PENDING',
    index: true 
  },
  orderStatus: { 
    type: String, 
    enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], 
    default: 'PENDING',
    index: true 
  },
  tracking: {
    carrier: { type: String, default: '', trim: true },
    trackingNumber: { type: String, default: '', trim: true },
    shippedAt: { type: Date, default: null },
    estimatedDelivery: { type: String, default: '', trim: true }
  },
  paymentDetails: {
    gateway: { type: String, default: 'razorpay' },
    gatewayOrderId: { type: String, default: '' },
    gatewayPaymentId: { type: String, default: '' },
    signature: { type: String, default: '' },
    verifiedAt: { type: Date, default: null }
  },
  notes: { type: String, default: '', trim: true }
}, { 
  timestamps: true 
});

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
