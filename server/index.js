import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/products.routes.js';
import categoryRoutes from './routes/categories.routes.js';
import paymentRoutes from './routes/payments.routes.js';
import discountRoutes from './routes/discounts.routes.js';
import orderRoutes from './routes/orders.routes.js';
import cartRoutes from './routes/cart.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import storeRoutes from './routes/store.routes.js';
import contentRoutes from './routes/content.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import { getDb, connectDb } from './config/db.js';

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1');

if (!process.env.JWT_SECRET || !process.env.SUPER_ADMIN_PASSWORD || !process.env.CLIENT_ADMIN_PASSWORD) {
  throw new Error('JWT_SECRET, SUPER_ADMIN_PASSWORD, and CLIENT_ADMIN_PASSWORD must be set in the server environment.');
}

// Helmet Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false // Allows inline Three.js/scripts in development
}));

// CORS Configuration
const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5175',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://www.rknutrition.com'
];

const envOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([
  ...defaultOrigins,
  'https://rknutrition.com',
  'https://rk-nutrition.vercel.app',
  'https://rk-nutrition-rahulsinghdev.vercel.app',
  'https://rk-nutrition-git-main-rahulsinghdev.vercel.app',
  ...envOrigins
])];

const isAllowedVercelOrigin = (origin) => {
  try {
    const { protocol, hostname } = new URL(origin);
    return protocol === 'https:' && (
      hostname === 'rk-nutrition.vercel.app' ||
      (hostname.startsWith('rk-nutrition-') && hostname.endsWith('.vercel.app'))
    );
  } catch {
    return false;
  }
};

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      isAllowedVercelOrigin(origin) ||
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:')
    ) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true
}));

// Body parsers. Preserve exact webhook bytes for Razorpay signature verification.
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buffer) => {
    if (req.originalUrl.startsWith('/api/payments/webhook')) {
      req.rawBody = buffer.toString('utf8');
    }
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api', authRoutes); // Seamless alias for /api/register, /api/login, /api/me
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/super-admin', contentRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'RK Nutrition Dual-Admin API Engine',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Global 404 handler for unmatched /api routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: `API endpoint ${req.originalUrl} not found.` });
  }
  next();
});

// Serve compiled client frontend if present (supports production, local builds & SPA fallback)
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(clientDistPath, 'index.html'));
    }
    next();
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error occurred.',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Production API must not accept requests until MongoDB is ready.
getDb();

if (process.env.NODE_ENV !== 'test') {
  connectDb()
    .then(() => {
      app.listen(PORT, HOST, () => {
        console.log(`[RK Nutrition Server] API listening on ${HOST}:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('[RK Nutrition Server] Startup aborted:', err.message);
      process.exit(1);
    });
} else {
  connectDb().catch((err) => console.warn('[DB Test Boot Warning]:', err.message));
}

export default app;
