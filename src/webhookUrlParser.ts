/**
 * Parses webhook URLs into a structured format for routing and signature validation.
 * Supports both raw URLs and URLs with query parameters.
 */
export interface ParsedWebhookUrl {
  readonly url: string;
  readonly host: string;
  readonly path: string;
  readonly query: Record<string, string>;
  readonly queryParams: ReadonlyArray<[string, string]>;
}

/**
 * Parses a webhook URL string into its components.
 * @param url - The webhook URL to parse (e.g., "https://example.com/webhook?token=abc").
 * @returns Parsed URL components.
 * @throws Error if the URL cannot be parsed.
 */
export function parseWebhookUrl(url: string): ParsedWebhookUrl {
  try {
    const parsed = new URL(url);
    const queryParams = Object.entries(parsed.searchParams);
    return {
      url,
      host: parsed.hostname,
      path: parsed.pathname,
      query: Object.fromEntries(queryParams),
      queryParams,
    };
  } catch (error) {
    throw new Error(`Invalid webhook URL: ${url}`);
  }
}
