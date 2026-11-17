import { normalizeString } from './normalizeString_2';

/**
 * Custom error type for retries with dead-letter queues.
 * Extends built-in Error class with additional properties.
 */
export class RetryDeadLetterQueueError extends Error {
  /**
   * Create a new RetryDeadLetterQueueError instance.
   * @param message - Error message.
   * @param cause - The cause of the error (if any).
   * @param retryAttempts - Number of retry attempts made before failing.
   * @param dlqMessage - The message that was sent to the dead-letter queue.
   * @param dlqMessageId - The ID of the message in the dead-letter queue.
   */
  constructor(
    message: string,
    cause?: Error,
    public readonly retryAttempts: number,
    public readonly dlqMessage?: string,
    public readonly dlqMessageId?: string,
  ) {
    super(message, cause);
    this.name = 'RetryDeadLetterQueueError';
    this.dlqMessage = dlqMessage ? normalizeString(dlqMessage) : undefined;
    this.dlqMessageId = dlqMessageId ? normalizeString(dlqMessageId) : undefined;
  }
}
