/**
 * A cache decorator for managing retries with a dead-letter queue.
 *
 * This decorator uses the provided cache (retryCache) to store and retrieve retry
 * related information. It implements a simple LRU (Least Recently Used) cache to
 * manage the stored data.
 *
 * @param retryCache - The cache instance to use for storing and retrieving retry data.
 */
function retryCacheDecorator(retryCache: import('./retryCache').RetryCache) {
  return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const key = `${target.constructor.name}.${propertyKey}`;

      // Check if the result is in the cache
      const cachedResult = await retryCache.get(key);

      if (cachedResult) {
        console.log(`Using cached result for ${key}`);
        return cachedResult;
      }

      // If not in cache, execute the method and store the result
      console.log(`Executing ${key} and caching result`);
      const result = await originalMethod.apply(this, args);
      await retryCache.set(key, result);
      return result;
    };

    return descriptor;
  };
}

export default retryCacheDecorator;
