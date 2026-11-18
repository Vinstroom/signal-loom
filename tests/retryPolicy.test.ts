import { assert } from 'node:assert';
import { RetryPolicy } from '../src/retryPolicy.js';

describe('RetryPolicy', () => {
  it('should contain all expected enum values', () => {
    const expectedValues = [
      RetryPolicy.NO_RETRY,
      RetryPolicy.EXPONENTIAL_BACKOFF,
      RetryPolicy.FIXED_DELAY,
      RetryPolicy.JITTERED_EXPONENTIAL_BACKOFF,
    ];

    assert.deepStrictEqual(
      Object.values(RetryPolicy),
      expectedValues,
      'All expected retry policy values should be present'
    );
  });

  it('should have descriptive string representations', () => {
    const policyDescriptions = {
      [RetryPolicy.NO_RETRY]: 'No retries will be attempted.',
      [RetryPolicy.EXPONENTIAL_BACKOFF]: 'Retry with exponential backoff up to maxAttempts.',
      [RetryPolicy.FIXED_DELAY]: 'Retry with fixed delay between each attempt up to maxAttempts.',
      [RetryPolicy.JITTERED_EXPONENTIAL_BACKOFF]: 'Retry with jittered exponential backoff up to maxAttempts.',
    };

    for (const [policy, description] of Object.entries(policyDescriptions)) {
      assert.strictEqual(
        RetryPolicy[policy],
        description,
        `RetryPolicy.${policy} should match the expected description`
      );
    }
  });

  it('should not contain any unexpected values', () => {
    const unexpectedValues = [
      'INVALID_POLICY',
      'CUSTOM_POLICY',
      'UNKNOWN_POLICY',
    ];

    for (const value of unexpectedValues) {
      assert.strictEqual(
        !Object.values(RetryPolicy).includes(value),
        true,
        `Unexpected value ${value} should not exist in RetryPolicy`
      );
    }
  });
});
