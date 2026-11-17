/**
 * Generates an iterator for retry/backoff with exponential backoff.
 * @param initialBackoff - Initial delay in milliseconds.
 * @param maxAttempts - Maximum number of attempts.
 * @param maxBackoff - Maximum delay in milliseconds.
 * @yields Delay in milliseconds for each attempt.
 */
export function* exponentialBackoff(
  initialBackoff: number,
  maxAttempts: number,
  maxBackoff: number
) {
  let currentBackoff = initialBackoff;
  let attempt = 1;

  while (attempt <= maxAttempts) {
    yield currentBackoff;
    currentBackoff = Math.min(currentBackoff * 2, maxBackoff);
    attempt++;
  }
}
