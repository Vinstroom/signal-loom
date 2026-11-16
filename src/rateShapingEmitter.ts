// src/rateShapingEmitter.ts

import { EventEmitter } from 'events';

enum EventTypes {
  RateLimited = 'rateLimited',
  Delivered = 'delivered',
  Failed = 'failed',
}

/**
 * Event emitter for rate shaping, throughput calculation, and delivery logs.
 */
export class RateShapingEmitter extends EventEmitter {
  private readonly _rateLimitWindowMs = 60_000; // 1 minute window for rate limiting
  private _emittedEvents = 0;
  private _lastResetTime = Date.now();

  /**
   * Update emitter event count and reset if needed.
   */
  private updateEventCount(): void {
    const now = Date.now();
    if (now - this._lastResetTime >= this._rateLimitWindowMs) {
      this._emittedEvents = 0;
      this._lastResetTime = now;
    }
  }

  /**
   * Get the emitter's current rate of events per second.
   */
  get throughput(): number {
    this.updateEventCount();
    const elapsedTime = Date.now() - this._lastResetTime;
    return this._emittedEvents / (elapsedTime / 1000);
  }

  /**
   * Emit rateLimited event with retryAfter and details if rate limit is exceeded.
   * @param details Additional details about the rate limit exceeded event.
   */
  emitRateLimited(details: string): void {
    this.updateEventCount();
    if (this._emittedEvents >= 60) { // Adjust rate limit as needed
      this.emit(EventTypes.RateLimited, { retryAfter: this._rateLimitWindowMs, details });
    } else {
      this._emittedEvents++;
    }
  }

  /**
   * Emit Delivered event with payload.
   * @param payload The payload that was successfully delivered.
   */
  emitDelivered(payload: any): void {
    this._emittedEvents++;
    this.emit(EventTypes.Delivered, payload);
  }

  /**
   * Emit Failed event with error.
   * @param error The error that occurred while processing the event.
   */
  emitFailed(error: Error): void {
    this.emit(EventTypes.Failed, error);
  }
}
