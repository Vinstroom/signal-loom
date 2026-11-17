import { setTimeout as sleep } from 'node:timers/promises';

/**
 * Compute exponential backoff delay in milliseconds.
 * @param attempt - zero-based attempt number.
 * @param baseMs - base delay in ms (default 1000).
 * @param maxMs - maximum delay cap (default 30000).
 */
function computeDelay(attempt: number, baseMs = 1000, maxMs = 30000): number {
  const delay = baseMs * 2 ** attempt;
  return Math.min(delay, maxMs);
}

/**
 * Options for {@link filterRuleRetryBackoff}.
 */
export interface FilterRuleRetryBackoffOptions {
  /** Maximum number of retry attempts (0 means no retry). */
  maxRetries: number;
  /** Base delay in ms (default 1000). */
  baseDelayMs?: number;
  /** Maximum delay cap in ms (default 30000). */
  maxDelayMs?: number;
}

/**
 * Retry an async operation with exponential backoff only when the error
 * matches the provided predicate. Returns the result of `fn` or throws
 * the last error if all retries are exhausted.
 *
 * @example
 * const response = await filterRuleRetryBackoff(
 *   () => fetch('https://example.com/webhook'),
 *   { maxRetries: 3 },
 *   (err) => err instanceof HttpError && err.status >= 500
 * );
 */
export async function filterRuleRetryBackoff<T>(
  fn: () => Promise<T>,
  options: FilterRuleRetryBackoffOptions,
  shouldRetry: (error: unknown) => boolean,
): Promise<T> {
  const { maxRetries, baseDelayMs = 1000, maxDelayMs = 30000 } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;

      if (attempt >= maxRetries || !shouldRetry(error)) {
        throw error;
      }

      const delayMs = computeDelay(attempt, baseDelayMs, maxDelayMs);
      await sleep(delayMs);
    }
  }

  // This line is unreachable but satisfies TypeScript strictness.
  throw lastError;
}
