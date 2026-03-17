const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const buckets = new Map();

const cleanupExpired = () => {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.expiresAt <= now) {
      buckets.delete(key);
    }
  }
};

const authRateLimit = (req, res, next) => {
  cleanupExpired();

  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
    req.socket.remoteAddress ||
    "unknown";
  const routeKey = `${req.method}:${req.path}`;
  const key = `${ip}:${routeKey}`;
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.expiresAt <= now) {
    buckets.set(key, { count: 1, expiresAt: now + ATTEMPT_WINDOW_MS });
    return next();
  }

  existing.count += 1;
  if (existing.count > MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil((existing.expiresAt - now) / 1000);
    res.setHeader("Retry-After", String(retryAfterSeconds));
    return res.status(429).json({
      code: "RATE_LIMITED",
      message: "Too many authentication attempts. Please retry shortly.",
      requestId: req.requestId
    });
  }

  return next();
};

module.exports = authRateLimit;
