import { EventEmitter } from 'events';
import { rateCalculator } from './rateCalculator';
import { rateShapingConfig } from './rateShapingConfig';
import { deliveryLogEntry } from './rateShapingDeliveryLogs_2';

/**
 * A generator function that iterates through events based on rate shaping rules and logs delivery events.
 * It uses an EventEmitter to emit delivery log entries.
 */
export function* rateShapingIterator(events: Iterator<string>, emitter: EventEmitter) {
  const config = rateShapingConfig();
  const logger = config.logger;

  for (const event of events) {
    const rate = rateCalculator(event);
    const shapedEvents = yield* shapeEvents(event, rate, config, logger);
    yield* shapedEvents;
  }
}

/**
 * Shapes events based on the configured rate limit and logs delivery events.
 * @param event - The current event to shape.
 * @param rate - The calculated rate for the event.
 * @param config - The rate shaping configuration.
 * @param logger - The logger to use for delivery logs.
 * @yields shapedEvents - The shaped events to yield next.
 */
function* shapeEvents(
  event: string,
  rate: number,
  config: rateShapingConfig,
  logger: (entry: deliveryLogEntry) => void
): Generator<string, void, undefined> {
  const rateLimit = config.rateLimit;

  if (rate > rateLimit) {
    const delay = (rate - rateLimit) * 1000;
    logger({ event, action: 'throttle', delay });
    yield new Promise((resolve) => setTimeout(resolve, delay));
  }

  logger({ event, action: 'deliver' });
  yield event;
}
