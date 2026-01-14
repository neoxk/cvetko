export type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

export type Cache = {
  get: <T>(key: string) => T | null;
  set: <T>(key: string, value: T, ttlMs: number) => void;
  delete: (key: string) => void;
  clear: () => void;
};

export type TimeProvider = () => number;

export class MemoryCache implements Cache {
  private store = new Map<string, CacheEntry<unknown>>();
  private now: TimeProvider;

  constructor(now: TimeProvider = () => Date.now()) {
    this.now = now;
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) {
      return null;
    }

    if (entry.expiresAt <= this.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number): void {
    this.store.set(key, {
      value,
      expiresAt: this.now() + ttlMs,
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}
