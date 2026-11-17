/**
 * Utility functions for normalizing strings related to payload transforms.
 */
export const normalizeString = {
  /**
   * Removes whitespace, converts to lowercase, and replaces non-ASCII characters with their ASCII equivalents.
   * @param str - The string to normalize.
   * @returns The normalized string.
   */
  toAsciiLowercase(str: string): string {
    return str.replace(/\s+/g, '').toLowerCase().replace(/[^\x00-\x7F]/g, '');
  },

  /**
   * Truncates a string to a specified length, appending an ellipsis if necessary.
   * @param str - The string to truncate.
   * @param length - The maximum length of the truncated string.
   * @returns The truncated string.
   */
  truncate(str: string, length: number): string {
    if (str.length <= length) {
      return str;
    }
    return `${str.slice(0, length)}...`;
  },
};
