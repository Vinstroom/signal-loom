import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import RetryEmitter from '../src/retryEmitter.js';

describe('RetryEmitter', () => {
  it('should emit event without retry on success', async () => {
    const deadLetterQueue = mock.fn();
    const emitter = new RetryEmitter({ maxRetries: 2, retryInterval: 10, deadLetterQueue });
    const event = { type: 'test' };
    mock.method(emitter, 'emitEvent', () => {});
    await emitter.emit(event);
    assert.equal(deadLetterQueue.mock.callCount(), 0);
  });

  it('should retry on failure and succeed', async () => {
    const deadLetterQueue = mock.fn();
    const emitter = new RetryEmitter({ maxRetries: 2, retryInterval: 10, deadLetterQueue });
    let attempts = 0;
    mock.method(emitter, 'emitEvent', () => {
      attempts++;
      if (attempts < 2) throw new Error('fail');
    });
    await emitter.emit({ type: 'test' });
    assert.equal(attempts, 2);
    assert.equal(deadLetterQueue.mock.callCount(), 0);
  });

  it('should send to dead-letter queue after max retries', async () => {
    const deadLetterQueue = mock.fn();
    const emitter = new RetryEmitter({ maxRetries: 2, retryInterval: 10, deadLetterQueue });
    mock.method(emitter, 'emitEvent', () => { throw new Error('fail'); });
    const event = { type: 'test' };
    await emitter.emit(event);
    assert.equal(deadLetterQueue.mock.callCount(), 1);
    assert.deepEqual(deadLetterQueue.mock.calls[0].arguments[0], event);
  });

  it('should reset retries after successful emit', async () => {
    const deadLetterQueue = mock.fn();
    const emitter = new RetryEmitter({ maxRetries: 2, retryInterval: 10, deadLetterQueue });
    let failOnce = true;
    mock.method(emitter, 'emitEvent', () => {
      if (failOnce) {
        failOnce = false;
        throw new Error('fail');
      }
    });
    await emitter.emit({ type: 'first' });
    await emitter.emit({ type: 'second' });
    assert.equal(deadLetterQueue.mock.callCount(), 0);
  });
});
