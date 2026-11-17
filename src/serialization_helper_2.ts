/**
 * Serialization helper for payload transforms.
 * Provides typed, reversible serialization/deserialization of
 * structured payloads (objects, arrays, primitives) using JSON
 * with optional date-reviver support.
 */

export class SerializationHelper {
  /**
   * Serialize a value to a JSON string.
   * Throws if the value is not serializable (circular references, BigInt, etc.).
   */
  static serialize<T>(value: T): string {
    try {
      return JSON.stringify(value);
    } catch (err) {
      throw new Error(
        `SerializationHelper.serialize: failed to serialize – ${(err as Error).message}`,
      );
    }
  }

  /**
   * Deserialize a JSON string back to a value.
   * Optionally revives date strings (ISO 8601) into Date objects.
   */
  static deserialize<T>(json: string, reviveDates = false): T {
    try {
      return JSON.parse(json, reviveDates ? SerializationHelper.#dateReviver : undefined) as T;
    } catch (err) {
      throw new Error(
        `SerializationHelper.deserialize: failed to parse – ${(err as Error).message}`,
      );
    }
  }

  /**
   * Safe serialization: returns null on failure instead of throwing.
   */
  static trySerialize<T>(value: T): string | null {
    try {
      return SerializationHelper.serialize(value);
    } catch {
      return null;
    }
  }

  /**
   * Safe deserialization: returns null on failure instead of throwing.
   */
  static tryDeserialize<T>(json: string, reviveDates = false): T | null {
    try {
      return SerializationHelper.deserialize<T>(json, reviveDates);
    } catch {
      return null;
    }
  }

  /**
   * Revive ISO date strings into Date objects during JSON.parse.
   */
  static #dateReviver(_key: string, value: unknown): unknown {
    if (typeof value === 'string') {
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
      if (isoDateRegex.test(value)) {
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) {
          return parsed;
        }
      }
    }
    return value;
  }
}
