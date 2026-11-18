import { assert, test } from 'node:test';
import { describe } from 'node:test';
import { SignatureVerificationResult } from '../src/signatureStats';
import { SignatureVerificationStats } from '../src/signatureStats';

describe('SignatureVerificationStats', () => {
  let stats: SignatureVerificationStats;

  beforeEach(() => {
    stats = new SignatureVerificationStats();
  });

  test('initializes with zero totals', () => {
    assert.strictEqual(stats.totalCount, 0);
    assert.strictEqual(stats.validCount, 0);
    assert.strictEqual(stats.invalidCount, 0);
  });

  test('updates valid count correctly', () => {
    stats.update(SignatureVerificationResult.Valid);
    assert.strictEqual(stats.totalCount, 1);
    assert.strictEqual(stats.validCount, 1);
    assert.strictEqual(stats.invalidCount, 0);
  });

  test('updates invalid count correctly', () => {
    stats.update(SignatureVerificationResult.Invalid);
    assert.strictEqual(stats.totalCount, 1);
    assert.strictEqual(stats.validCount, 0);
    assert.strictEqual(stats.invalidCount, 1);
  });

  test('updates total count correctly', () => {
    stats.update(SignatureVerificationResult.Valid);
    stats.update(SignatureVerificationResult.Invalid);
    assert.strictEqual(stats.totalCount, 2);
  });

  test('throws error for unknown result', () => {
    assert.throws(() => stats.update('unknown' as SignatureVerificationResult), Error, 'Unknown signature verification result: unknown');
  });
});
