// src/retryBackoff.ts

import { EventEmitter } from 'events';

/** Custom error type for failed retries. */
class MaxRetriesExceededError extends Error {
  constructor(public retries: number, message: string) {
    super(message);
  }
}

/** Options for backoff strategy. */
type BackoffOptions = {
  maxAttempts?: number;
  initialDelay?: number;
  delayIncreaseFactor?: number;
  jitterFactor?: number;
  maxDelay?: number;
};

/** Emits an event with delay and retries if necessary. */
class RetryBackoffEmitter extends EventEmitter {
  private options: Required<BackoffOptions>;
  private attemptCount = 0;

  constructor(options: BackoffOptions = {}) {
    super();
    this.options = {
      maxAttempts: 5,
      initialDelay: 1000,
      delayIncreaseFactor: 2,
      jitterFactor: 0.2,
      maxDelay: 60000,
      ...options,
    };
  }

  private getDelay(): number {
    const { attemptCount, options } = this;
    const baseDelay = options.initialDelay * Math.pow(options.delayIncreaseFactor, attemptCount - 1);
    const jitter = baseDelay * options.jitterFactor * (Math.random() - 0.5);
    return Math.min(baseDelay + jitter, options.maxDelay);
  }

  /** Emit an event with retry and exponential backoff strategy. */
  public emitWithRetry(event: string, ...args: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.emit(event, ...args, (err?: Error) => {
        if (err) {
          this.attemptCount++;
          if (this.attemptCount <= this.options.maxAttempts) {
            setTimeout(() => {
              this.emitWithRetry(event, ...args)
                .then(resolve)
                .catch(reject);
            }, this.getDelay());
          } else {
            reject(new MaxRetriesExceededError(this.attemptCount, 'Max retries exceeded'));
          }
        } else {
          resolve();
        }
      });
    });
  }

  /** Reset the number of attempts. */
  public resetAttemptCount(): void {
    this.attemptCount = 0;
  }
}

export default RetryBackoffEmitter;
