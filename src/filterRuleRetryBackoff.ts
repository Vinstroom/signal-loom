import { FilterRule } from './filterRule.js';
import { FilterRuleError } from './filterRuleErrors.js';

/**
 * Default backoff configuration for filter rule retries.
 */
export interface FilterRuleRetryConfig {
  /** Maximum number of retry attempts. */
  maxRetries: number;
  /** Base delay in milliseconds. */
  baseDelayMs: number;
  /** Maximum delay cap in milliseconds. */
  maxDelayMs: number;
}

/**
 * Compute the delay for a given retry attempt using exponential backoff with jitter.
 * @param attempt - Zero-based retry attempt number.
 * @param config - Retry configuration.
 * @returns Delay in milliseconds before the next retry.
 */
export function computeBackoffDelay(attempt: number, config: FilterRuleRetryConfig): number {
  const exponentialDelay = config.baseDelayMs * Math.pow(2, attempt);
  const cappedDelay = Math.min(exponentialDelay, config.maxDelayMs);
  const jitter = Math.random() * 0.5 * cappedDelay;
  return Math.floor(cappedDelay + jitter);
}

/**
 * Attempt to apply a filter rule with retries and backoff.
 * @param rule - The filter rule to apply.
 * @param payload - The payload to evaluate.
 * @param config - Retry configuration.
 * @returns True if the rule matched, throws on persistent failure.
 */
export async function applyFilterRuleWithRetry(
  rule: FilterRule,
  payload: unknown,
  config: FilterRuleRetryConfig,
): Promise<boolean> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return rule.apply(payload);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < config.maxRetries) {
        const delay = computeBackoffDelay(attempt, config);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw new FilterRuleError(`Filter rule failed after ${config.maxRetries + 1} attempts`, lastError);
}
