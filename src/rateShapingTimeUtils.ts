/**
 * Utilities for working with timestamps in rate shaping and delivery logs.
 * Handles window calculations, timestamp normalization, and time-based rate limits.
 */

export const TIMESTAMP_PRECISION_MS = 100; // Round timestamps to milliseconds for consistency
export const DELIVERY_LOG_TIMESTAMP_KEY = 'deliveryTimestamp';
export const RATE_SHAPING_WINDOW_KEY = 'rateShapingWindow';

/**
 * Rounds a timestamp to the nearest millisecond.
 * @param timestamp The input timestamp in milliseconds.
 * @returns The rounded timestamp.
 */
export function roundToMillisecond(timestamp: number): number {
    return Math.round(timestamp / TIMESTAMP_PRECISION_MS) * TIMESTAMP_PRECISION_MS;
}

/**
 * Calculates the start of a rate shaping window given a timestamp and window duration.
 * @param timestamp The timestamp to check.
 * @param windowDurationMs The window duration in milliseconds.
 * @returns The start of the window.
 */
export function getWindowStart(timestamp: number, windowDurationMs: number): number {
    const windowStart = timestamp - (timestamp % windowDurationMs);
    return roundToMillisecond(windowStart);
}

/**
 * Formats a timestamp for delivery logs with millisecond precision.
 * @param timestamp The timestamp to format.
 * @returns ISO string with milliseconds.
 */
export function formatDeliveryTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toISOString().replace(/\.\d{3,}/, '') + '.000Z';
}

/**
 * Checks if a timestamp falls within a sliding window.
 * @param timestamp The timestamp to check.
 * @param windowStart The start of the window.
 * @param windowDurationMs The window duration.
 * @returns True if the timestamp is within the window.
 */
export function isInWindow(timestamp: number, windowStart: number, windowDurationMs: number): boolean {
    return timestamp >= windowStart && timestamp < windowStart + windowDurationMs;
}

/**
 * Calculates the remaining time until the next rate shaping window.
 * @param currentTimestamp The current timestamp.
 * @param windowDurationMs The window duration.
 * @returns The remaining time until the next window (ms).
 */
export function getRemainingWindowTime(currentTimestamp: number, windowDurationMs: number): number {
    const windowStart = getWindowStart(currentTimestamp, windowDurationMs);
    const nextWindowStart = windowStart + windowDurationMs;
    return nextWindowStart - currentTimestamp;
}
