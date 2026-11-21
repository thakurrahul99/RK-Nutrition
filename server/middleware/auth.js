import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { getDb } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be configured before authentication middleware loads.');
}

const TOKEN_OPTIONS = { algorithms: ['HS256'] };

const resolveActiveUser = (decoded) => {
  if (!decoded?.id) return null;
  const db = getDb();
  return (db.users || []).find((user) => user.id === decoded.id && user.isActive !== false) || null;
};

const attachUser = (req, user) => {
  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarInitials: user.avatarInitials
  };
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication token missing. Please sign in.'
    });
  }

  jwt.verify(token, JWT_SECRET, TOKEN_OPTIONS, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired session token. Please sign in again.'
      });
    }

    const user = resolveActiveUser(decoded);
    if (!user) {
      return res.status(403).json({
        success: false,
        error: 'User account is inactive or no longer available.'
      });
    }

    attachUser(req, user);
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

// Optional authentication: public routes remain public, valid admin tokens unlock admin-only records.
export const optionalAuthenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) return next();

  jwt.verify(token, JWT_SECRET, TOKEN_OPTIONS, (err, decoded) => {
    if (err) return next();
    const user = resolveActiveUser(decoded);
    if (user) attachUser(req, user);
    next();
  });
};
