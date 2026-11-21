import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticateToken, requireClientAdmin } from '../middleware/auth.js';
import { addLog } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

const router = Router();

// Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e4)}`;
    cb(null, `${uniqueSuffix}-${cleanName}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image formats (.jpg, .png, .webp, .svg) are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// POST /api/upload
router.post('/', authenticateToken, requireClientAdmin, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, error: 'File size exceeds 5MB limit.' });
      }
      return res.status(400).json({ success: false, error: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please choose an image file to upload.' });
    }

    const publicUrl = `/uploads/${req.file.filename}`;
    addLog('INFO', 'MEDIA', `Asset uploaded: ${req.file.filename} (${Math.round(req.file.size / 1024)} KB) by ${req.user.name}`);

    res.json({
      success: true,
      url: publicUrl,
      filename: req.file.filename,
      size: `${Math.round(req.file.size / 1024)} KB`,
      mimetype: req.file.mimetype
    });
  });
});

export default router;
