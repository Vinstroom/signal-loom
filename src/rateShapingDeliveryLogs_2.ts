/**
 * Represents an error related to rate shaping delivery logs.
 */
export class RateShapingDeliveryLogsError extends Error {
  /**
   * Creates an instance of RateShapingDeliveryLogsError.
   *
   * @param message - The error message.
   * @param logs - The delivery logs that caused the error.
   */
  constructor(message: string, public readonly logs: string[]) {
    super(message);
    this.name = 'RateShapingDeliveryLogsError';
  }
}

/**
 * Helps create error instances with predefined messages.
 */
export const rateShapingDeliveryLogsError = {
  /**
   * Creates an instance of RateShapingDeliveryLogsError with a message indicating that no logs were found.
   *
   * @param logs - The delivery logs that were expected to be found.
   */
  noLogsFound(logs: string[]): RateShapingDeliveryLogsError {
    return new RateShapingDeliveryLogsError(`No delivery logs found for rate shaping: ${logs.join(', ')}`, logs);
  },

  /**
   * Creates an instance of RateShapingDeliveryLogsError with a message indicating that the maximum number of logs was exceeded.
   *
   * @param logs - The delivery logs that caused the limit to be exceeded.
   * @param limit - The maximum number of logs allowed.
   */
  maxLogsExceeded(logs: string[], limit: number): RateShapingDeliveryLogsError {
    return new RateShapingDeliveryLogsError(`Maximum number of delivery logs exceeded for rate shaping: ${logs.join(', ')}. Limit: ${limit}`, logs);
  },
};
