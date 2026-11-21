import 'dotenv/config';
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb, saveDb, addLog } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET must be configured before starting the server.');

// POST /api/auth/login
router.post('/login', authRateLimiter, (req, res) => {
  const { email, password, requestedPortal } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required.'
    });
  }

  const db = getDb();
  const normalizedEmail = email.trim().toLowerCase();
  const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    addLog('WARN', 'AUTH', `Failed login attempt for non-existent account: ${normalizedEmail}`);
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials. Please verify your email and password.'
    });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordValid) {
    addLog('WARN', 'AUTH', `Failed password attempt for user: ${normalizedEmail}`);
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials. Please verify your email and password.'
    });
  }

  // Check portal matching if specified
  if (requestedPortal === 'SUPER_ADMIN' && user.role !== 'SUPER_ADMIN') {
    addLog('WARN', 'AUTH', `Client Admin ${normalizedEmail} attempted unauthorized access to Super Admin portal.`);
    return res.status(403).json({
      success: false,
      error: 'Unauthorized: This account does not possess Super Admin privileges.'
    });
  }

  // Issue JWT Token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  addLog('INFO', 'AUTH', `Successful login: ${user.name} (${user.role})`);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarInitials: user.avatarInitials
    }
  });
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// PUT /api/auth/profile
router.put('/profile', authenticateToken, (req, res) => {
  const { name, email } = req.body;
  const db = getDb();

  const userIdx = db.users.findIndex((u) => u.id === req.user.id);
  if (userIdx === -1) {
    return res.status(404).json({ success: false, error: 'User not found.' });
  }

  if (name) db.users[userIdx].name = name.trim();
  if (email) {
    const cleanEmail = email.trim().toLowerCase();
    // Check uniqueness
    const inUse = db.users.some((u) => u.email.toLowerCase() === cleanEmail && u.id !== req.user.id);
    if (inUse) {
      return res.status(400).json({ success: false, error: 'Email is already in use.' });
    }
    db.users[userIdx].email = cleanEmail;
  }

  saveDb(db);
  addLog('INFO', 'AUTH', `User profile updated: ${db.users[userIdx].email}`);

  res.json({
    success: true,
    user: {
      id: db.users[userIdx].id,
      name: db.users[userIdx].name,
      email: db.users[userIdx].email,
      role: db.users[userIdx].role,
      avatarInitials: db.users[userIdx].avatarInitials
    }
  });
});

// PUT /api/auth/password
router.put('/password', authenticateToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, error: 'Current and new password are required.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ success: false, error: 'New password must be at least 8 characters long.' });
  }

  const db = getDb();
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found.' });
  }

  const isValid = bcrypt.compareSync(currentPassword, user.passwordHash);
  if (!isValid) {
    return res.status(400).json({ success: false, error: 'Incorrect current password.' });
  }

  user.passwordHash = bcrypt.hashSync(newPassword, 10);
  saveDb(db);
  addLog('INFO', 'AUTH', `Password changed successfully for user: ${user.email}`);

  res.json({ success: true, message: 'Password updated successfully.' });
});

export default router;
