import mongoose from 'mongoose';

const storeSettingsSchema = new mongoose.Schema({
  storeName: { type: String, default: 'RK Nutrition Official Store', trim: true },
  contactEmail: { type: String, default: 'Kuldeeprajput5262@gmail.com', trim: true },
  supportPhone: { type: String, default: '+91 86306 63134', trim: true },
  secondaryPhone: { type: String, default: '+91 74520 13333', trim: true },
  shippingFee: { type: Number, default: 99, min: 0 },
  freeShippingThreshold: { type: Number, default: 999, min: 0 },
  taxGstPercent: { type: Number, default: 18, min: 0 },
  currency: { type: String, default: 'INR' },
  currencySymbol: { type: String, default: '₹' },
  operatingHours: { type: String, default: 'Monday – Saturday: 09:00 AM – 07:00 PM IST' },
  warehouseAddress: { type: String, default: 'A12–16, Main Patpad Ganj Industrial Area, Delhi – 110092, India' },
  announcement: {
    enabled: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    text: { type: String, default: 'OFFICIAL LAUNCH • 10% OFF ORDERS ABOVE ₹1,999 WITH CODE RK10 • FREE NATIONWIDE SHIPPING' },
    linkText: { type: String, default: 'SHOP NOW' },
    linkHref: { type: String, default: '/products' }
  },
  paymentMethods: {
    cod: {
      enabled: { type: Boolean, default: true },
      displayName: { type: String, default: 'Cash on Delivery (COD)' },
      description: { type: String, default: 'Pay with cash upon delivery.' },
      instructions: { type: String, default: 'Please keep exact cash ready.' }
    },
    upi: {
      enabled: { type: Boolean, default: true },
      displayName: { type: String, default: 'Instant UPI (Google Pay, PhonePe, Paytm)' },
      description: { type: String, default: 'Zero-fee instant transfer via UPI.' },
      instructions: { type: String, default: 'Secure dynamic UPI QR payment.' }
    },
    card: {
      enabled: { type: Boolean, default: true },
      displayName: { type: String, default: 'Credit / Debit Cards & Net Banking' },
      description: { type: String, default: 'Visa, MasterCard, RuPay & Net Banking.' },
      instructions: { type: String, default: 'Processed via secure PCI-DSS gateway.' }
    }
  },
  gatewayConfig: {
    provider: { type: String, default: 'razorpay' },
    mode: { type: String, default: 'test' },
    keyId: { type: String, default: '' },
    keySecret: { type: String, default: '' },
    webhookSecret: { type: String, default: '' },
    isConfigured: { type: Boolean, default: false }
  }
}, { timestamps: true });

export const StoreSettings = mongoose.models.StoreSettings || mongoose.model('StoreSettings', storeSettingsSchema);
export default StoreSettings;
