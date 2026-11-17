/**
 * Enum representing the possible retry policies.
 */
export enum RetryPolicy {
  /**
   * No retries will be attempted.
   */
  NO_RETRY,

  /**
   * Retry with exponential backoff up to maxAttempts.
   */
  EXPONENTIAL_BACKOFF,

  /**
   * Retry with fixed delay between each attempt up to maxAttempts.
   */
  FIXED_DELAY,

  /**
   * Retry with jittered exponential backoff up to maxAttempts.
   */
  JITTERED_EXPONENTIAL_BACKOFF,
}
