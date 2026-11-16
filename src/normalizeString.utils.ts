import { toLower } from 'lodash-es';

/**
 * Normalizes a given string by converting it to lower case, removing leading/trailing spaces,
 * trimming empty strings, and handling null/undefined inputs gracefully.
 *
 * @param {string | null | undefined} str - The string to normalize.
 * @param {boolean} [trim=false] - Whether to trim the string.
 * @returns {string | null} The normalized string, or null if the input was null or undefined.
 */
export const normalizeString = (str: string | null | undefined, trim = false): string | null => {
  if (str === null || str === undefined) {
    return null;
  }

  if (typeof str !== 'string') {
    throw new Error('Input must be a string');
  }

  return toLower(trim ? str.trim() : str);
};
