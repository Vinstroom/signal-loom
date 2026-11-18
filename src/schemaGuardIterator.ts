// src/schemaGuardIterator.ts

/**
 * Creates an iterator that yields a schema guarded event.
 *
 * @template T - The event type.
 * @param {AsyncIterable<T>} eventStream - The input event stream.
 * @param {import('./schemaGuard').SchemaGuardConfig} schemaGuardConfig - The schema guard configuration.
 * @param {import('./schemaValidator').SchemaValidator} schemaValidator - The schema validator.
 * @yield {Promise<T>} - The schema guarded event.
 */
export default async function* schemaGuardIterator<T>(
  eventStream: AsyncIterable<T>,
  schemaGuardConfig: import('./schemaGuard').SchemaGuardConfig,
  schemaValidator: import('./schemaValidator').SchemaValidator
): AsyncIterableIterator<Promise<T>> {
  for await (const event of eventStream) {
    const { isValid, error } = await schemaValidator.validate(event, schemaGuardConfig.schema);

    if (!isValid) {
      // Handle invalid event according to schemaGuardConfig.retryBackoff and schemaGuardConfig.deadLetterQueue
      throw new Error(`Schema validation failed: ${error.message}`);
    }

    yield event;
  }
}
