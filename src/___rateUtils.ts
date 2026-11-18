// src/rateUtils.ts

/**
 * Generates a standardized timestamp string.
 * @param date - The Date to format.
 * @returns A string representing the date in YYYY-MM-DDTHH:mm:ss.SSSZ format.
 */
export function generateTimestamp(date: Date = new Date()): string {
  const offset = date.getTimezoneOffset();
  return date.toISOString().replace(/-|:|\..+/g, '').replace('T', ' ').slice(0, -offset);
}

/**
 * Calculates the elapsed time in milliseconds between two dates.
 * @param start - The start date.
 * @param end - The end date.
 * @returns The elapsed time in milliseconds.
 */
export function calculateElapsedTime(start: Date, end: Date = new Date()): number {
  return end.getTime() - start.getTime();
}

/**
 * Checks if a given time interval has exceeded a specified max duration.
 * @param start - The start date of the interval.
 * @param maxDuration - The maximum allowed duration in milliseconds.
 * @returns true if the interval has exceeded maxDuration, false otherwise.
 */
export function hasExceededMaxDuration(start: Date, maxDuration: number): boolean {
  const end = new Date();
  return calculateElapsedTime(start, end) > maxDuration;
}
