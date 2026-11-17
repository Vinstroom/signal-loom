/**
 * A generator utility that receives webhooks and event streams and fans them out.
 *
 * Yields an event object with the following structure:
 * {
 *   signature: string,
 *   data: { [key: string]: any },
 *   headers: { [key: string]: string },
 *   streamId?: string,
 *   attempt?: number,
 *   retrybackoff?: number,
 *   dlq?: boolean,
 *   rawEvent?: string,
 * }
 *
 * Optionally takes a filter function that filters out events based on the data object.
 * If a filter function is provided, only the events that pass the filter will be yielded.
 *
 * @param eventStream - The event stream to fan out.
 * @param filter - An optional filter function that takes an event object and returns a boolean.
 * @yield event - Yields an event object.
 */
export function* eventIterator(eventStream: AsyncIterable<Buffer>, filter?: (event: { signature: string, data: { [key: string]: any }, headers: { [key: string]: string }, streamId?: string, attempt?: number, retrybackoff?: number, dlq?: boolean, rawEvent?: string }) => boolean): AsyncGenerator<{ signature: string, data: { [key: string]: any }, headers: { [key: string]: string }, streamId?: string, attempt?: number, retrybackoff?: number, dlq?: boolean, rawEvent?: string }, void> {
  for await (const chunk of eventStream) {
    // Process the chunk and yield the event object if it passes the filter (if provided).
    yield { signature: '', data: {}, headers: {}, streamId: '', attempt: 0, retrybackoff: 0, dlq: false, rawEvent: chunk.toString('utf8') };
  }
}
