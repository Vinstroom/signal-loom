import { test, assert } from 'node:test';
import { isPotentialReplay } from '../src/isReplay.ts';

test('isPotentialReplay returns false for empty replay-id header', () => {
  const headers = {
    'replay-id': '',
  };
  assert.strictEqual(isPotentialReplay(headers), false);
});

test('isPotentialReplay returns false for whitespace-only replay-id header', () => {
  const headers = {
    'replay-id': '   ',
  };
  assert.strictEqual(isPotentialReplay(headers), false);
});

test('isPotentialReplay returns false for special character-only replay-id header', () => {
  const headers = {
    'replay-id': '!@#$%^&*()',
  };
  assert.strictEqual(isPotentialReplay(headers), false);
});

test('isPotentialReplay returns true for valid replay-id header', () => {
  const headers = {
    'replay-id': 'replay-123',
  };
  assert.strictEqual(isPotentialReplay(headers), true);
});

test('isPotentialReplay returns true for replay-id header with special characters and whitespace', () => {
  const headers = {
    'replay-id': ' replay-123   ',
  };
  assert.strictEqual(isPotentialReplay(headers), true);
});
