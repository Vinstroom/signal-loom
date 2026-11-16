/**
 * @file retryBackoff.ts
 * @description A helper for implementing retry with exponential backoff.
 */

/**
 * Options for the retryBackoff function.
 */
type RetryBackoffOptions = {
  initialDelay: number;
  maxRetries: number;
  backoffFactor?: number;
  randomFactor?: number;
};

/**
 * Calculates the delay for the next retry attempt with exponential backoff.
 *
 * @param {number} attempt - The current retry attempt.
 * @param {RetryBackoffOptions} options - The retry backoff options.
 * @returns {Promise<number>} The delay in milliseconds.
 */
async function retryBackoff(
  attempt: number,
  { initialDelay, maxRetries, backoffFactor = 2, randomFactor = 0.5 }: RetryBackoffOptions
): Promise<number> {
  if (attempt > maxRetries) {
    throw new Error('Max retries exceeded');
  }

  const baseDelay = initialDelay * Math.pow(backoffFactor, attempt);
  const jitter = baseDelay * randomFactor * (Math.random() - 0.5);
  const delay = Math.max(baseDelay + jitter, 0);

  return new Promise((resolve) => setTimeout(resolve, delay));
}

export { retryBackoff };
