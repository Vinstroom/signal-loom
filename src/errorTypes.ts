/**
 * Base class for custom errors.
 */
export abstract class SignalLoomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Error thrown when a rate shaping limit is exceeded.
 */
export class RateShapingLimitExceededError extends SignalLoomError {
  constructor(limit: number, attempts: number) {
    super(`Rate shaping limit of ${limit} attempted calls exceeded (${attempts} attempts)`);
  }
}

/**
 * Error thrown when a rate shaping violation occurs.
 */
export class RateShapingViolationError extends SignalLoomError {
  constructor(message: string) {
    super(`Rate shaping violation: ${message}`);
  }
}

/**
 * Error thrown when a delivery log write operation fails.
 */
export class DeliveryLogWriteError extends SignalLoomError {
  constructor(cause: Error) {
    super(`Failed to write to delivery log: ${cause.message}`);
  }
}
