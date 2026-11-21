import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  level: { type: String, enum: ['INFO', 'WARN', 'ERROR'], default: 'INFO', index: true },
  module: { type: String, required: true, uppercase: true, index: true },
  message: { type: String, required: true },
  userId: { type: String, default: null, index: true },
  userEmail: { type: String, default: null },
  ip: { type: String, default: '' },
  userAgent: { type: String, default: '' }
}, { timestamps: true });

export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
