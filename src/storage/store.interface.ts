export interface RateLimitEntry {
  count: number;
  firstRequestAt: number;
  blockedUntil?: number;
}

export interface RateLimitStore {
  get(key: string): RateLimitEntry | undefined;
  set(key: string, entry: RateLimitEntry): void;
  delete(key: string): void;
}
