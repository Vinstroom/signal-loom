/**
 * Calculates a score for the rate at which events are processed, based on a given target rate.
 *
 * @param targetRate - The desired rate of event processing (events per second).
 * @param currentRate - The current rate of event processing (events per second).
 * @param bufferTime - Time window over which to calculate the current rate (in seconds).
 * @returns A score between 0 and 100, where 100 indicates the current rate is equal to the target rate.
 */
function rateScoring(targetRate: number, currentRate: number, bufferTime: number): number {
  const currentRateAdjusted = currentRate * bufferTime;
  const targetRateAdjusted = targetRate * bufferTime;

  if (targetRateAdjusted === 0) {
    return 100; // No target rate means current rate is always perfect.
  }

  const score = (targetRateAdjusted / (targetRateAdjusted + currentRateAdjusted)) * 100;
  return score;
}

export { rateScoring };
