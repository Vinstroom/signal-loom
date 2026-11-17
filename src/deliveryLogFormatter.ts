// src/deliveryLogFormatter.ts

/**
 * Formats delivery logs for better readability.
 *
 * @param log - The log object to format.
 * @returns A formatted string.
 */
function formatDeliveryLog(log: { event: string; timestamp: Date; status: string; payload?: string }): string {
  const { event, timestamp, status, payload } = log;
  const payloadShort = payload ? `${payload.slice(0, 50)}...` : '<no payload>';

  return `
Date: ${timestamp.toISOString()}
Event: ${event}
Status: ${status}
Payload: ${payloadShort}
`.trim();
}

export { formatDeliveryLog };
