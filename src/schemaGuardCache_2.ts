/**
 * A simple cache decorator to store the results of schema guard validation.
 * This is a basic LRU (Least Recently Used) cache and is intended to be used
 * within the scope of a single application instance.
 */
class SchemaGuardCache {
  private cache = new Map<string, Record<string, boolean>>();

  public get(key: string): Map<string, boolean> | undefined {
    return this.cache.get(key) || new Map();
  }

  public set(key: string, value: Record<string, boolean>): void {
    this.cache.set(key, value);
    // Remove the least recently used item if cache size exceeds 1000
    if (this.cache.size > 1000) {
      const leastRecentlyUsedKey = this.cache.keys().next().value;
      this.cache.delete(leastRecentlyUsedKey);
    }
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }
}

/**
 * A caching decorator for schema guards that uses the SchemaGuardCache.
 *
 * @param schemaGuard - The schema guard to decorate.
 * @returns A new decorated schema guard with caching functionality.
 */
export function withCache<T extends SchemaGuard>(schemaGuard: T): T {
  const cache = new SchemaGuardCache();

  return {
    ...schemaGuard,
    guard: async (payload, signature) => {
      const cacheKey = `${payload.type}-${signature}`;
      const cachedResult = cache.get(cacheKey);
      if (cachedResult) {
        return cachedResult[payload.id];
      }

      const result = await schemaGuard.guard(payload, signature);
      cache.set(cacheKey, { [payload.id]: result });
      return result;
    },
  };
}
