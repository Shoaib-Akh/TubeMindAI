interface RateLimitRecord {
  count: number;
  resetAt: number;
}

class TokenBucketRateLimiter {
  private records = new Map<string, RateLimitRecord>();

  /**
   * Check if an identifier (IP / User) has exceeded rate limit
   * @param key Unique identifier (IP hash)
   * @param limit Maximum requests allowed in window
   * @param windowMs Window duration in milliseconds
   */
  check(key: string, limit: number = 30, windowMs: number = 60000): { isAllowed: boolean; remaining: number; resetInSec: number } {
    const now = Date.now();
    let record = this.records.get(key);

    if (!record || now > record.resetAt) {
      record = {
        count: 1,
        resetAt: now + windowMs,
      };
      this.records.set(key, record);
      return {
        isAllowed: true,
        remaining: limit - 1,
        resetInSec: Math.ceil(windowMs / 1000),
      };
    }

    if (record.count >= limit) {
      return {
        isAllowed: false,
        remaining: 0,
        resetInSec: Math.ceil((record.resetAt - now) / 1000),
      };
    }

    record.count += 1;
    return {
      isAllowed: true,
      remaining: limit - record.count,
      resetInSec: Math.ceil((record.resetAt - now) / 1000),
    };
  }
}

export const rateLimiter = new TokenBucketRateLimiter();
