import jwt from 'jsonwebtoken';
import { getDb } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'rk_nutrition_super_secure_jwt_secret_2026_xyz';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication token missing. Please sign in.'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired session token. Please sign in again.'
      });
    }

    const db = getDb();
    const user = db.users.find((u) => u.id === decoded.id);
    if (!user) {
      return res.status(403).json({
        success: false,
        error: 'User account no longer active.'
      });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarInitials: user.avatarInitials
    };
    next();
  });
};

// Client Admin or Super Admin
export const requireClientAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }

  if (req.user.role !== 'CLIENT_ADMIN' && req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({
      success: false,
      error: 'Access denied: Store administration permission required.'
    });
  }

  next();
};

// Super Admin ONLY (Developer / System Level)
export const requireSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }

  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({
      success: false,
      error: 'Access denied: Developer / Super Admin authorization required.'
    });
  }

  next();
};
