/**
 * Formats a dead-letter queue message for logging or external processing.
 *
 * @param dlqMessage - The dead-letter queue message to format.
 * @param timestampFormat - The date format for the timestamp (default: ISO 8601).
 * @returns The formatted dead-letter queue message.
 */
export const retryDlqFormatter = (
  dlqMessage: { topic: string; message: string; timestamp: Date },
  timestampFormat: string = 'YYYY-MM-DD HH:mm:ss.SSS'
) => {
  const { topic, message, timestamp } = dlqMessage;
  return {
    topic,
    message,
    timestamp: timestamp.toISOString(),
    formattedTimestamp: timestamp.toLocaleString('en-US', { timezone: 'UTC', format: timestampFormat }),
  };
};
