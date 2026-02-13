import { RateLimitEntry,RateLimitStore } from "./store.interface";

export class MemoryStore implements RateLimitStore {
  private store: Map<string, RateLimitEntry> = new Map();

  get(key: string): RateLimitEntry | undefined {
    return this.store.get(key);
  }

  set(key: string, entry: RateLimitEntry): void {
    this.store.set(key, entry);
  }

  delete(key: string): void {
    this.store.delete(key);
  }
}