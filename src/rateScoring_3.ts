/**
 * Calculates a score for the given rate based on the rate limits and current usage.
 *
 * @param rateLimit - The maximum allowed rate.
 * @param intervalSeconds - The interval in seconds over which the rate limit applies.
 * @param currentUsage - The current usage within the interval.
 * @returns A score between 0 and 1, with 1 indicating no rate limit exceeded.
 */
export function calculateRateScore(rateLimit: number, intervalSeconds: number, currentUsage: number): number {
  const rate = currentUsage / intervalSeconds;
  const excess = Math.max(rate - rateLimit, 0);
  const score = 1 - (excess / rateLimit);
  return Math.max(score, 0);
}
