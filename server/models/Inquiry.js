import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, default: '', trim: true },
  subject: { type: String, default: 'Store Inquiry', trim: true },
  message: { type: String, required: true, trim: true },
  status: { type: String, enum: ['PENDING', 'RESOLVED'], default: 'PENDING', index: true }
}, { timestamps: true });

export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
