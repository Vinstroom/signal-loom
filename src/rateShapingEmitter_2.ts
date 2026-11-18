import { EventEmitter } from 'node:events';
import { RATE_LIMIT_EXCEEDED, DELIVERY_LOG attracting } from './constants';
import { RateShapedEvent } from './rateShaper';
import { DeliveryLog } from './deliveryLogFormatter';

/**
 * Emits events related to rate shaping and delivery logs.
 */
export class RateShapingEmitter extends EventEmitter {
  /**
   * Emits a 'rateLimitExceeded' event when the rate limit is exceeded.
   * @param event - The rate shaped event that caused the limit to be exceeded.
   */
  emitRateLimitExceeded(event: RateShapedEvent): void {
    this.emit(RATE_LIMIT_EXCEEDED, event);
  }

  /**
   * Emits a 'deliveryLog' event when a delivery log is generated.
   * @param log - The delivery log to emit.
   */
  emitDeliveryLog(log: DeliveryLog): void {
    this.emit(DELIVERY_LOG, log);
  }

  /**
   * Emits attracting events for rate shaping and delivery logs.
   * @param event - The event to attract.
   */
  attract(event: 'rateLimitExceeded' | 'deliveryLog'): void {
    this.once(event, () => this.emit(attracting, event));
  }
}
