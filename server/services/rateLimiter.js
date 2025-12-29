class MemoryStore {
  constructor(windowMs) {
    this.windowMs = windowMs;
    this.hits = new Map();
    
    // Clean up expired entries every minute
    setInterval(() => this.resetExpired(), 60 * 1000);
  }
  
  get(key) {
    const entry = this.hits.get(key);
    
    if (!entry) {
      return null;
    }
    
    if (Date.now() - entry.createdAt > this.windowMs) {
      this.hits.delete(key);
      return null;
    }
    
    return entry;
  }
  
  incr(key) {
    const now = Date.now();
    let entry = this.hits.get(key);
    
    if (!entry) {
      entry = { count: 1, createdAt: now, resetTime: now + this.windowMs };
      this.hits.set(key, entry);
      return entry;
    }
    
    // If window has expired, reset the count
    if (now - entry.createdAt > this.windowMs) {
      entry.count = 1;
      entry.createdAt = now;
      entry.resetTime = now + this.windowMs;
    } else {
      entry.count += 1;
    }
    
    this.hits.set(key, entry);
    return entry;
  }
  
  resetExpired() {
    const now = Date.now();
    for (const [key, entry] of this.hits.entries()) {
      if (now - entry.createdAt > this.windowMs) {
        this.hits.delete(key);
      }
    }
  }
  
  resetKey(key) {
    this.hits.delete(key);
  }
}

module.exports = function rateLimiter(options = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes default
    max = 100, // limit each IP to 100 requests per windowMs
    message = 'Too many requests, please try again later.',
    keyGenerator = (req) => req.ip,
    skipFailedRequests = false,
    skipSuccessfulRequests = false
  } = options;
  
  const store = new MemoryStore(windowMs);
  
  return function rateLimitMiddleware(req, res, next) {
    const key = keyGenerator(req);
    
    const entry = store.incr(key);
    
    const remaining = Math.max(0, max - entry.count);
    const resetTime = entry.resetTime;
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(resetTime / 1000));
    
    // Check if rate limit is exceeded
    if (entry.count > max) {
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
      res.setHeader('Retry-After', retryAfter);
      
      return res.status(429).json({
        success: false,
        error: message,
        retryAfter: retryAfter,
        remainingSeconds: retryAfter
      });
    }
    
    // Store rate limit info in app locals for debugging/info endpoint
    if (!req.app.locals.rateLimitStore) {
      req.app.locals.rateLimitStore = store;
    }
    
    next();
  };
};