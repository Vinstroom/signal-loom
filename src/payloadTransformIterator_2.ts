/**
 * An iterator utility for applying payload transforms in a streamed fashion.
 * @template T - The type of the payload.
 */
export interface PayloadTransformIterator<T> {
  /**
   * Apply the next payload transform.
   * @param payload - The payload to transform.
   * @returns The transformed payload or undefined if the iterator is exhausted.
   */
  next(payload: T): T | undefined;

  /**
   * Check if the iterator is exhausted.
   * @returns True if the iterator is exhausted, false otherwise.
   */
  isExhausted(): boolean;
}

/**
 * Creates a new payload transform iterator.
 * @template T - The type of the payload.
 * @param transforms - The array of payload transforms to apply.
 * @returns A new payload transform iterator.
 */
export function createPayloadTransformIterator<T>(
  transforms: Array<(payload: T) => T>
): PayloadTransformIterator<T> {
  let index = 0;

  return {
    next(payload: T): T | undefined {
      if (index === transforms.length) {
        return undefined;
      }

      const transform = transforms[index];
      index++;

      return transform(payload);
    },

    isExhausted(): boolean {
      return index === transforms.length;
    },
  };
}
