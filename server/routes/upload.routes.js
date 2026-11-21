import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { authenticateToken, requireClientAdmin } from '../middleware/auth.js';
import { addLog } from '../config/db.js';

const router = Router();

const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Only JPEG, PNG, and WebP image files are allowed.'));
  }
});

const hasValidImageSignature = (buffer, mimetype) => {
  if (!buffer || buffer.length < 12) return false;
  if (mimetype === 'image/jpeg') return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (mimetype === 'image/png') return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (mimetype === 'image/webp') return buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP';
  return false;
};

const createCloudinarySignature = (params, secret) => {
  const canonical = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
  return crypto.createHash('sha1').update(canonical + secret).digest('hex');
};

const uploadToCloudinary = async (file) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = { folder: 'rk-nutrition/products', timestamp };
  const signature = createCloudinarySignature(paramsToSign, process.env.CLOUDINARY_API_SECRET);
  const form = new FormData();
  form.append('file', new Blob([file.buffer], { type: file.mimetype }), file.originalname);
  form.append('api_key', process.env.CLOUDINARY_API_KEY);
  form.append('timestamp', String(timestamp));
  form.append('folder', paramsToSign.folder);
  form.append('signature', signature);

  const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(process.env.CLOUDINARY_CLOUD_NAME)}/image/upload`;
  const response = await fetch(endpoint, { method: 'POST', body: form });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error?.message || 'Cloudinary rejected the upload.');
  }
  return result;
};

// POST /api/upload — Admin-only Cloudinary image upload
router.post('/', authenticateToken, requireClientAdmin, (req, res) => {
  if (!cloudinaryConfigured) {
    return res.status(503).json({
      success: false,
      error: 'Image hosting is not configured. Set Cloudinary credentials on the server.'
    });
  }

  upload.single('file')(req, res, async (err) => {
    if (err) {
      const message = err.code === 'LIMIT_FILE_SIZE'
        ? 'File size exceeds 5MB limit.'
        : err.message || 'Upload rejected.';
      return res.status(400).json({ success: false, error: message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please choose an image file to upload.' });
    }

    if (!hasValidImageSignature(req.file.buffer, req.file.mimetype)) {
      return res.status(400).json({ success: false, error: 'The uploaded file is not a valid supported image.' });
    }

    try {
      const uploaded = await uploadToCloudinary(req.file);
      addLog('INFO', 'MEDIA', `Cloudinary asset uploaded (${Math.round(req.file.size / 1024)} KB) by ${req.user.name}`);
      return res.json({
        success: true,
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
        filename: uploaded.public_id,
        size: `${Math.round(req.file.size / 1024)} KB`,
        mimetype: req.file.mimetype,
        provider: 'cloudinary'
      });
    } catch (uploadError) {
      console.error('[Cloudinary] Upload failed:', uploadError.message);
      return res.status(502).json({ success: false, error: 'Image hosting upload failed. Please try again.' });
    }
  });
});

export default router;
