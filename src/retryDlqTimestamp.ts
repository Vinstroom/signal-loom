import { ZonedDateTime } from '@js-joda/core';

/**
 * Generates a timestamp string in ISO format with timezone offset for a given instant.
 * @param instant The instant to generate the timestamp for.
 * @returns The timestamp string.
 */
export function generateDlqTimestamp(instant: ZonedDateTime): string {
  return instant.toISO();
}

/**
 * Parses an ISO timestamp string with timezone offset into a zoned date-time.
 * @param timestamp The timestamp string to parse.
 * @returns The parsed zoned date-time.
 */
export function parseDlqTimestamp(timestamp: string): ZonedDateTime {
  return ZonedDateTime.parse(timestamp, 'yyyy-MM-dd HH:mm:ss.SSSXXX');
}
