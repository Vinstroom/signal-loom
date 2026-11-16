/**
 * Helper functions for serializing and deserializing retry dead-letter queue (DLQ) data.
 */
export namespace RetryDlqSerializer {
  /**
   * Serializes a retry DLQ message to a string.
   * @param message - The retry DLQ message to serialize.
   * @returns The serialized retry DLQ message as a string.
   * @throws {Error} If serialization fails.
   */
  export function serialize(message: RetryDlqMessage): string {
    if (!message.message || !message.headers || typeof message.timestamp !== 'number' || typeof message.retryCount !== 'number') {
      throw new Error('Invalid retry DLQ message');
    }
    return JSON.stringify({ message: message.message, headers: message.headers, timestamp: message.timestamp, retryCount: message.retryCount, ...(message.lastRetryTime && { lastRetryTime: message.lastRetryTime }), ...(message.error && { error: message.error }) });
  }

  /**
   * Deserializes a retry DLQ message from a string.
   * @param serializedMessage - The serialized retry DLQ message to deserialize.
   * @returns The deserialized retry DLQ message.
   * @throws {Error} If deserialization fails.
   */
  export function deserialize(serializedMessage: string): RetryDlqMessage {
    try {
      const data = JSON.parse(serializedMessage);
      return {
        message: data.message,
        headers: data.headers,
        timestamp: data.timestamp,
        retryCount: data.retryCount,
        ...(data.lastRetryTime && { lastRetryTime: data.lastRetryTime }),
        ...(data.error && { error: data.error })
      };
    } catch {
      throw new Error('Failed to deserialize retry DLQ message');
    }
  }

  /**
   * Calculates statistics related to filtering rules from a list of retry DLQ messages.
   * @param messages - The list of retry DLQ messages to analyze.
   * @returns An object containing statistics about filtering rules.
   */
  export function analyzeFilteringRules(messages: RetryDlqMessage[]): { totalMessages: number, filteredByRule: Record<string, number>, filteredByErrors: number } {
    const stats: { totalMessages: number, filteredByRule: Record<string, number>, filteredByErrors: number } = {
      totalMessages: messages.length,
      filteredByRule: {},
      filteredByErrors: 0
    };

    for (const message of messages) {
      if (message.error) {
        stats.filteredByErrors++;
      } else {
        for (const [rule, count] of Object.entries(message.headers)) {
          if (!stats.filteredByRule[rule]) {
            stats.filteredByRule[rule] = 0;
          }
          stats.filteredByRule[rule]++;
        }
      }
    }

    return stats;
  }
}

type RetryDlqMessage = {
  message: string;
  headers: Record<string, string>;
  timestamp: number;
  retryCount: number;
  lastRetryTime?: number;
  error?: string;
};
