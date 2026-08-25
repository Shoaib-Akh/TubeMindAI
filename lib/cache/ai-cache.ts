import crypto from "crypto";

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class InMemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTtlMs = 1000 * 60 * 60 * 24 * 7; // 7 days

  generateKey(prefix: string, content: string | object): string {
    const raw = typeof content === "string" ? content : JSON.stringify(content);
    const hash = crypto.createHash("sha256").update(raw).digest("hex");
    return `${prefix}:${hash}`;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs?: number): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + (ttlMs || this.defaultTtlMs),
    });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const aiCache = new InMemoryCache();
