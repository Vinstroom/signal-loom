// src/payloadTransformParser.ts

import { z } from 'zod';
import { normalizeString } from './normalizeString';
import { SchemaGuardError } from './schemaGuardErrors';

/**
 * A parser for payload transform config.
 * @module payloadTransformParser
 */

/**
 * Parses the payloadTransformConfig string into a safer, typed format.
 * @param {string} transformConfig - The raw payload transform config string.
 * @returns {ParsedPayloadTransformConfig} The parsed and validated config.
 * @throws {SchemaGuardError} If the config is invalid.
 */
export function parsePayloadTransformConfig(transformConfig: string): ParsedPayloadTransformConfig {
  const schema = z.object({
    type: z.enum(['string', 'json', 'xml']), // Add more types as needed
    params: z.record(z.string()),
  });

  try {
    const parsed = schema.parse(JSON.parse(normalizeString(transformConfig)));
    return parsed;
  } catch (error) {
    throw new SchemaGuardError(
      'PAYLOAD_TRANSORM_PARSE_ERROR',
      `Invalid payload transform config: ${error.message}`,
    );
  }
}

/**
 * The type of the parsed payload transform config.
 * @constant
 * @type {z.infer<typeof payloadTransformSchema>}
 */
export type ParsedPayloadTransformConfig = z.infer<typeof schema>;
