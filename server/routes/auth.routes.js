import 'dotenv/config';
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { getDb, saveDb, addLog, User } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { isValidEmail, isValidPhone, sanitizeInput } from '../utils/security.js';
import { sendPasswordResetEmail } from '../utils/mailer.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET must be configured before starting the server.');

// Helper to compute avatar initials
const getInitials = (name) => {
  if (!name) return 'RK';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// POST /api/auth/register (Customer Registration)
router.post('/register', authRateLimiter, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Full name is required (minimum 2 characters).' });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone ? phone.trim() : '';

    // Check if user already exists
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, error: 'Account service is temporarily unavailable. Please try again shortly.' });
    }
    const userExists = await User.findOne({ email: cleanEmail }).select('_id');

    if (userExists) {
      return res.status(400).json({ success: false, error: 'An account with this email address already exists.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const avatarInitials = getInitials(name);
    const userId = `usr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const newUserObj = {
      id: userId,
      name: sanitizeInput(name),
      email: cleanEmail,
      passwordHash,
      role: 'CUSTOMER',
      phone: cleanPhone,
      avatarInitials,
      addresses: [],
      isActive: true,
      createdAt: new Date().toISOString()
    };

    // Persist to MongoDB and update the shared in-memory cache used by authentication,
    // profile, and address-book middleware/routes in this hybrid data layer.
    await User.create(newUserObj);
    const db = getDb();
    db.users = Array.isArray(db.users) ? db.users : [];
    db.users.push(newUserObj);
    saveDb(db);

    addLog('INFO', 'AUTH', `New customer account registered: ${cleanEmail}`);

    const token = jwt.sign(
      {
        id: newUserObj.id,
        email: newUserObj.email,
        role: newUserObj.role,
        name: newUserObj.name
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: newUserObj.id,
        name: newUserObj.name,
        email: newUserObj.email,
        role: newUserObj.role,
        phone: newUserObj.phone,
        avatarInitials: newUserObj.avatarInitials
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, error: 'Registration failed. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', authRateLimiter, async (req, res) => {
  try {
    const { email, password, requestedPortal } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = null;

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, error: 'Login service is temporarily unavailable. Please try again shortly.' });
    }
    user = await User.findOne({ email: normalizedEmail });

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

    // Portal matching checks
    if (requestedPortal === 'SUPER_ADMIN' && user.role !== 'SUPER_ADMIN') {
      addLog('WARN', 'AUTH', `${user.name} (${user.role}) attempted unauthorized access to Super Admin portal.`);
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: This account does not possess Super Admin privileges.'
      });
    }

    if (requestedPortal === 'CLIENT_ADMIN' && user.role !== 'CLIENT_ADMIN' && user.role !== 'SUPER_ADMIN') {
      addLog('WARN', 'AUTH', `${user.name} attempted unauthorized access to Client Admin portal.`);
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: This account does not possess Store Management privileges.'
      });
    }

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
        phone: user.phone || '',
        avatarInitials: user.avatarInitials || getInitials(user.name)
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Login service encountered an error.' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', authRateLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    let userFound = false;
    let userName = 'Customer';

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: cleanEmail });
      if (user) {
        user.resetPasswordToken = token;
        user.resetPasswordExpires = expires;
        await user.save();
        userFound = true;
        userName = user.name || userName;
      }
    }

    const db = getDb();
    const cachedUser = (db.users || []).find((u) => u.email.toLowerCase() === cleanEmail);
    if (cachedUser) {
      cachedUser.resetPasswordToken = token;
      cachedUser.resetPasswordExpires = expires.toISOString();
      saveDb(db);
      userFound = true;
      userName = cachedUser.name || userName;
    }

    if (userFound) {
      const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
      const resetUrl = `${origin}/reset-password?token=${token}`;
      await sendPasswordResetEmail({ to: cleanEmail, name: userName, resetUrl });
      addLog('INFO', 'AUTH', `Password reset token generated for ${cleanEmail}`);
    }

    res.json({
      success: true,
      message: 'If that email exists in our records, a password reset link has been dispatched.'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ success: false, error: 'Failed to process password reset request.' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', authRateLimiter, async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, error: 'Reset token is required.' });
    }

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, error: 'New password must be at least 8 characters long.' });
    }

    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }
      });
      if (user) {
        user.passwordHash = bcrypt.hashSync(newPassword, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
      }
    }

    const db = getDb();
    const cachedUser = (db.users || []).find(
      (u) => u.resetPasswordToken === token && new Date(u.resetPasswordExpires) > new Date()
    );

    if (cachedUser) {
      cachedUser.passwordHash = bcrypt.hashSync(newPassword, 10);
      cachedUser.resetPasswordToken = null;
      cachedUser.resetPasswordExpires = null;
      saveDb(db);
    }

    if (!user && !cachedUser) {
      return res.status(400).json({
        success: false,
        error: 'Password reset link is invalid or has expired. Please request a new one.'
      });
    }

    addLog('INFO', 'AUTH', `Password successfully reset via token.`);
    res.json({ success: true, message: 'Password has been successfully reset. You may now sign in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, error: 'Failed to reset password.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  const db = getDb();
  let user = (db.users || []).find((u) => u.id === req.user.id);

  if (mongoose.connection.readyState === 1) {
    try {
      const mongoUser = await User.findOne({ id: req.user.id }).lean();
      if (mongoUser) {
        user = { ...(user || {}), ...mongoUser };
      }
    } catch {
      // fallback to in-memory user
    }
  }

  res.json({
    success: true,
    user: {
      ...req.user,
      name: user?.name || req.user.name,
      phone: user?.phone || req.user.phone,
      addresses: user?.addresses || req.user.addresses || []
    }
  });
});

// PUT /api/auth/profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const db = getDb();
    const userIdx = (db.users || []).findIndex((u) => u.id === req.user.id);

    if (userIdx === -1) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    if (name) db.users[userIdx].name = sanitizeInput(name.trim());
    if (phone !== undefined) db.users[userIdx].phone = phone.trim();

    if (email) {
      const cleanEmail = email.trim().toLowerCase();
      if (!isValidEmail(cleanEmail)) {
        return res.status(400).json({ success: false, error: 'Invalid email format.' });
      }
      const inUse = db.users.some((u) => u.email.toLowerCase() === cleanEmail && u.id !== req.user.id);
      if (inUse) {
        return res.status(400).json({ success: false, error: 'Email is already in use by another account.' });
      }
      db.users[userIdx].email = cleanEmail;
    }

    db.users[userIdx].avatarInitials = getInitials(db.users[userIdx].name);
    saveDb(db);

    if (mongoose.connection.readyState === 1) {
      await User.findOneAndUpdate({ id: req.user.id }, {
        name: db.users[userIdx].name,
        email: db.users[userIdx].email,
        phone: db.users[userIdx].phone,
        avatarInitials: db.users[userIdx].avatarInitials
      });
    }

    addLog('INFO', 'AUTH', `User profile updated: ${db.users[userIdx].email}`);

    res.json({
      success: true,
      user: {
        id: db.users[userIdx].id,
        name: db.users[userIdx].name,
        email: db.users[userIdx].email,
        phone: db.users[userIdx].phone || '',
        role: db.users[userIdx].role,
        avatarInitials: db.users[userIdx].avatarInitials
      }
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ success: false, error: 'Failed to update profile.' });
  }
});

// PUT /api/auth/password
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Current and new password are required.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, error: 'New password must be at least 8 characters long.' });
    }

    const db = getDb();
    const user = (db.users || []).find((u) => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    const isValid = bcrypt.compareSync(currentPassword, user.passwordHash);
    if (!isValid) {
      return res.status(400).json({ success: false, error: 'Incorrect current password.' });
    }

    const newHash = bcrypt.hashSync(newPassword, 10);
    user.passwordHash = newHash;
    saveDb(db);

    if (mongoose.connection.readyState === 1) {
      await User.findOneAndUpdate({ id: req.user.id }, { passwordHash: newHash });
    }

    addLog('INFO', 'AUTH', `Password changed successfully for user: ${user.email}`);
    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ success: false, error: 'Failed to change password.' });
  }
});

// GET /api/auth/addresses (Customer Address Book)
router.get('/addresses', authenticateToken, (req, res) => {
  const db = getDb();
  const user = (db.users || []).find((u) => u.id === req.user.id);
  res.json({
    success: true,
    addresses: user?.addresses || []
  });
});

// POST /api/auth/addresses (Add Address)
router.post('/addresses', authenticateToken, async (req, res) => {
  const { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = req.body;

  if (!fullName || !phone || !addressLine1 || !city || !postalCode) {
    return res.status(400).json({ success: false, error: 'Full delivery address fields required.' });
  }

  const db = getDb();
  const user = (db.users || []).find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

  user.addresses = user.addresses || [];

  if (isDefault) {
    user.addresses.forEach((addr) => { addr.isDefault = false; });
  }

  const newAddress = {
    id: `addr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    fullName: fullName.trim(),
    phone: phone.trim(),
    addressLine1: addressLine1.trim(),
    addressLine2: addressLine2?.trim() || '',
    city: city.trim(),
    state: state?.trim() || '',
    postalCode: postalCode.trim(),
    country: country?.trim() || 'India',
    isDefault: isDefault || user.addresses.length === 0
  };

  user.addresses.push(newAddress);
  saveDb(db);

  if (mongoose.connection.readyState === 1) {
    await User.findOneAndUpdate({ id: req.user.id }, { addresses: user.addresses }).catch(() => {});
  }

  res.status(201).json({
    success: true,
    address: newAddress,
    addresses: user.addresses
  });
});

// PUT /api/auth/addresses/:id (Update Address)
router.put('/addresses/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const user = (db.users || []).find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

  const addrIdx = (user.addresses || []).findIndex((a) => a.id === id || String(a._id) === id);
  if (addrIdx === -1) {
    return res.status(404).json({ success: false, error: 'Address not found.' });
  }

  const { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = req.body;
  if (isDefault) {
    user.addresses.forEach((a) => { a.isDefault = false; });
  }

  const existingAddr = user.addresses[addrIdx];
  user.addresses[addrIdx] = {
    ...existingAddr,
    ...(fullName !== undefined ? { fullName: sanitizeInput(String(fullName).trim()) } : {}),
    ...(phone !== undefined ? { phone: String(phone).trim() } : {}),
    ...(addressLine1 !== undefined ? { addressLine1: sanitizeInput(String(addressLine1).trim()) } : {}),
    ...(addressLine2 !== undefined ? { addressLine2: sanitizeInput(String(addressLine2).trim()) } : {}),
    ...(city !== undefined ? { city: sanitizeInput(String(city).trim()) } : {}),
    ...(state !== undefined ? { state: sanitizeInput(String(state).trim()) } : {}),
    ...(postalCode !== undefined ? { postalCode: sanitizeInput(String(postalCode).trim()) } : {}),
    ...(country !== undefined ? { country: sanitizeInput(String(country).trim()) } : {}),
    ...(isDefault !== undefined ? { isDefault: Boolean(isDefault) } : {}),
    id: existingAddr.id || id
  };

  saveDb(db);

  if (mongoose.connection.readyState === 1) {
    await User.findOneAndUpdate({ id: req.user.id }, { addresses: user.addresses }).catch(() => {});
  }

  res.json({
    success: true,
    address: user.addresses[addrIdx],
    addresses: user.addresses
  });
});

// DELETE /api/auth/addresses/:id (Remove Address)
router.delete('/addresses/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const user = (db.users || []).find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

  user.addresses = (user.addresses || []).filter((a) => a.id !== id && String(a._id) !== id);
  saveDb(db);

  if (mongoose.connection.readyState === 1) {
    await User.findOneAndUpdate({ id: req.user.id }, { addresses: user.addresses }).catch(() => {});
  }

  res.json({
    success: true,
    message: 'Address removed successfully.',
    addresses: user.addresses
  });
});

export default router;
