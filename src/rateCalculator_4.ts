// src/rateCalculator.ts

import { SchemaGuardConfig } from './schemaGuardConfig';
import { SchemaGuardState } from './schemaGuardStateMachine';

/**
 * Calculates the rate or throughput related to schema guards.
 */
export class RateCalculator {
  private config: SchemaGuardConfig;

  constructor(config: SchemaGuardConfig) {
    this.config = config;
  }

  /**
   * Calculates the allowed rate per second for schema guards based on the config.
   * @returns The allowed rate per second.
   */
  public calculateAllowedRatePerSecond(): number {
    if (this.config.rateLimit === undefined) {
      return Number.POSITIVE_INFINITY; // No rate limit, unlimited rate.
    }

    return this.config.rateLimit.rate;
  }

  /**
   * Calculates the maximum retries allowed for schema guards based on the config.
   * @param state - The current schema guard state.
   * @returns The maximum retries allowed.
   */
  public calculateMaxRetries(state: SchemaGuardState): number {
    if (state.attempts <= this.config.rateLimit.windowSize) {
      return this.config.rateLimit.maxRetries;
    }

    // For older failed attempts, use the exponential backoff config.
    const backoffConfig = this.config.exponentialBackoff;
    if (!backoffConfig) {
      return 0; // No retries allowed for older failed attempts.
    }

    const initialSleep = backoffConfig.initialSleep;
    const multiplier = backoffConfig.multiplier;
    let maxRetries = 0;

    let sleep = initialSleep;
    while (state.lastFailedAttempt - state.firstFailedAttempt <= sleep) {
      maxRetries++;
      sleep *= multiplier;
    }

    return maxRetries;
  }
}
