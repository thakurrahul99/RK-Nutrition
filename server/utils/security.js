import crypto from 'crypto';

/**
 * Validates standard email address format
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim().toLowerCase());
}

/**
 * Validates 10-digit Indian phone number format
 */
export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 13;
}

/**
 * Sanitizes plain text inputs to prevent XSS injection
 */
export function sanitizeString(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // strip < and >
    .trim();
}

export const sanitizeInput = sanitizeString;

/**
 * Verifies Razorpay HMAC-SHA256 signature
 * Supports both (orderId, paymentId, signature, secret) and ({ orderId, paymentId, signature, secret })
 */
export function verifyRazorpaySignature(arg1, arg2, arg3, arg4) {
  let orderId, paymentId, signature, secret;
  if (typeof arg1 === 'object' && arg1 !== null) {
    ({ orderId, paymentId, signature, secret } = arg1);
  } else {
    orderId = arg1;
    paymentId = arg2;
    signature = arg3;
    secret = arg4;
  }

  if (!orderId || !paymentId || !signature || !secret) return false;
  try {
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature, 'utf-8'),
      Buffer.from(signature, 'utf-8')
    );
  } catch {
    return false;
  }
}

/**
 * Verifies Webhook HMAC-SHA256 signature
 */
export function verifyWebhookSignature(arg1, arg2, arg3) {
  let body, signature, secret;
  if (typeof arg1 === 'object' && !arg2 && !arg3) {
    ({ body, signature, secret } = arg1);
  } else {
    body = arg1;
    signature = arg2;
    secret = arg3;
  }

  if (!body || !signature || !secret) return false;
  try {
    const rawBody = typeof body === 'string' ? body : JSON.stringify(body);
    const expected = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(expected, 'utf-8'),
      Buffer.from(signature, 'utf-8')
    );
  } catch {
    return false;
  }
}

/**
 * Generates secure random crypto token (hex)
 */
export function generateSecureToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}
