import { LRUCache } from 'https://deno.land/x/undici/headers/cache/lru.ts';

/**
 * Calculates the rate and throughput based on given events using a sliding time window.
 * Adds caching for better performance.
 */
export class RateCalculator {
  private readonly windowSeconds: number;
  private eventCount = 0;
  private totalBytes = 0;
  private startTime: number;
  private cache: LRUCache<string, number>;

  constructor(windowSeconds = 60, cacheSize = 1000) {
    this.windowSeconds = windowSeconds;
    this.cache = new LRUCache(cacheSize);
    this.resetWindow();
  }

  /**
   * Reset the calculator's window to start a new window.
   * @private
   */
  private resetWindow(): void {
    this.startTime = Date.now();
    this.eventCount = 0;
    this.totalBytes = 0;
  }

  /**
   * Increment the event count and total bytes for an event with the given size.
   * @param size - Size of the event in bytes.
   */
  public increment(size: number): void {
    this.eventCount++;
    this.totalBytes += size;

    const key = this.getCacheKey();
    const cachedRate = this.cache.get(key);
    if (cachedRate) {
      this.eventCount = cachedRate;
    }

    const now = Date.now();
    if (now - this.startTime >= this.windowSeconds * 1000) {
      this.resetWindow();
    }

    this.cache.set(key, this.eventCount);
  }

  /**
   * Get the current rate in events per second.
   */
  public getEventRate(): number {
    return this.cache.has(this.getCacheKey()) ? this.cache.get(this.getCacheKey()) : 0;
  }

  /**
   * Get the current throughput in bytes per second.
   */
  public getThroughput(): number {
    const elapsedSeconds = (Date.now() - this.startTime) / 1000;
    return this.totalBytes / elapsedSeconds;
  }

  /**
   * Generate a cache key for the current window.
   * @private
   */
  private getCacheKey(): string {
    return `rate-${this.windowSeconds}-${Math.floor(this.startTime / 1000)}`;
  }
}
