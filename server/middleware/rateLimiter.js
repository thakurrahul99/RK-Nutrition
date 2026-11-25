// Simple sliding-window in-memory IP rate limiter for authentication
const loginAttempts = new Map(); // IP -> { count, firstAttemptTime }

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 15;

export const authRateLimiter = (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    return next();
  }
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
  const now = Date.now();

  const record = loginAttempts.get(ip);

  if (!record) {
    loginAttempts.set(ip, { count: 1, firstAttemptTime: now });
    return next();
  }

  // Reset if window has elapsed
  if (now - record.firstAttemptTime > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttemptTime: now });
    return next();
  }

  if (record.count >= MAX_ATTEMPTS) {
    const remainingSecs = Math.ceil((WINDOW_MS - (now - record.firstAttemptTime)) / 1000);
    return res.status(429).json({
      success: false,
      error: `Too many authentication attempts. Security rate limit active. Please retry in ${remainingSecs} seconds.`
    });
  }

  record.count += 1;
  loginAttempts.set(ip, record);
  next();
};

// Sliding-window rate limiter for sensitive mutations (orders, inquiries, coupon validation)
const mutationAttempts = new Map();
const MUTATION_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MUTATION_MAX_ATTEMPTS = 40;

export const apiMutationLimiter = (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    return next();
  }
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
  const key = `${ip}:${req.baseUrl}${req.path}`;
  const now = Date.now();
  const record = mutationAttempts.get(key);

  if (!record || now - record.firstAttemptTime > MUTATION_WINDOW_MS) {
    mutationAttempts.set(key, { count: 1, firstAttemptTime: now });
    return next();
  }

  if (record.count >= MUTATION_MAX_ATTEMPTS) {
    const remainingSecs = Math.ceil((MUTATION_WINDOW_MS - (now - record.firstAttemptTime)) / 1000);
    return res.status(429).json({
      success: false,
      error: `Too many requests. Please wait ${remainingSecs} seconds before trying again.`
    });
  }

  record.count += 1;
  mutationAttempts.set(key, record);
  next();
};
