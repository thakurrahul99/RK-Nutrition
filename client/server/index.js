import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/products.routes.js';
import categoryRoutes from './routes/categories.routes.js';
import paymentRoutes from './routes/payments.routes.js';
import discountRoutes from './routes/discounts.routes.js';
import orderRoutes from './routes/orders.routes.js';
import storeRoutes from './routes/store.routes.js';
import contentRoutes from './routes/content.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import { getDb } from './config/db.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET || !process.env.SUPER_ADMIN_PASSWORD || !process.env.CLIENT_ADMIN_PASSWORD) {
  throw new Error('JWT_SECRET, SUPER_ADMIN_PASSWORD, and CLIENT_ADMIN_PASSWORD must be set in the server environment.');
}

// Middleware
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/orders', orderRoutes);
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

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error occurred.',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialize database on boot
getDb();

// Start Server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`[RK Nutrition Server] Dual-Admin API running at http://127.0.0.1:${PORT}`);
});

export default app;
