import { sleep } from './dateUtils.js';

/**
 * Implements exponential backoff algorithm for retries.
 * Returns a promise that resolves after the calculated delay.
 * @param {number} attempt - current retry attempt
 * @param {number} maxAttempts - maximum number of attempts
 * @param {number} initialDelayMs - initial delay in milliseconds
 * @param {number} maxDelayMs - maximum delay in milliseconds
 * @param {boolean} [jitter=false] - enables random jitter for added unpredictability
 * @returns {Promise<void>}
 */
export async function retryBackoff(
  attempt: number,
  maxAttempts: number,
  initialDelayMs: number,
  maxDelayMs: number,
  jitter = false
): Promise<void> {
  const baseDelay = (initialDelayMs * 2 ** (attempt - 1)) as number;

  if (baseDelay > maxDelayMs) {
    throw new Error('Max delay exceeded');
  }

  const delay =
    jitter && Math.random() * baseDelay < 0.5
      ? baseDelay / 2
      : baseDelay;

  await sleep(delay);
}
