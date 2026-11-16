import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { withSchemaGuardCache } from '../src/schemaGuard.js';

describe('withSchemaGuardCache', () => {
  it('should return true when the underlying guard returns true', () => {
    const guard = withSchemaGuardCache(() => true);
    assert(guard({}));
  });

  it('should return false when the underlying guard returns false', () => {
    const guard = withSchemaGuardCache(() => false);
    assert(!guard({}));
  });

  it('should memoize results for the same input', () => {
    const fake = new Set();
    const guard = withSchemaGuardCache((input: any) => {
      if (fake.has(input)) return false;
      fake.add(input);
      return true;
    });
    const obj = { a: 1 };
    assert(guard(obj));
    assert(!guard(obj));
  });

  it('should differentiate different inputs', () => {
    const callCount: number[] = [0];
    const guard = withSchemaGuardCache(() => {
      callCount[0]++;
      return true;
    });
    guard({ a: 1 });
    guard({ b: 2 });
    assert.strictEqual(callCount[0], 2);
  });

  it('should return cached result before ttl expires', () => {
    const callCount: number[] = [0];
    const guard = withSchemaGuardCache(
      () => {
        callCount[0]++;
        return true;
      },
      10000 // long ttl
    );
    guard({ x: 1 });
    guard({ x: 1 });
    assert.strictEqual(callCount[0], 1);
  });

  it('should re-evaluate after ttl expires', async () => {
    const callCount: number[] = [0];
    const guard = withSchemaGuardCache(
      () => {
        callCount[0]++;
        return true;
      },
      1 // 1 ms ttl
    );
    guard({ x: 1 });
    await new Promise(resolve => setTimeout(resolve, 5));
    guard({ x: 1 });
    assert.strictEqual(callCount[0], 2);
  });

  it('should not cache across different primitive values', () => {
    const callCount: number[] = [0];
    const guard = withSchemaGuardCache(() => {
      callCount[0]++;
      return true;
    });
    guard(1);
    guard(2);
    assert.strictEqual(callCount[0], 2);
  });

  it('should handle null and undefined', () => {
    const callCount: number[] = [0];
    const guard = withSchemaGuardCache((input: any) => {
      callCount[0]++;
      return input === null;
    });
    assert(guard(null));
    assert(!guard(undefined));
    assert.strictEqual(callCount[0], 2);
  });

  it('should handle deep objects correctly', () => {
    const callCount: number[] = [0];
    const guard = withSchemaGuardCache(() => {
      callCount[0]++;
      return true;
    });
    const obj1 = { nested: { deep: 1 } };
    const obj2 = { nested: { deep: 1 } };
    guard(obj1);
    guard(obj2);
    assert.strictEqual(callCount[0], 1);
  });
});
