import { strict as assert } from 'node:assert';

// ─── Types ───────────────────────────────────────────────────────────────────
export type DlqEntry = {
  readonly id: string;
  readonly originalPayload: unknown;
  readonly error: Error | string;
  readonly timestamp: number;
  readonly retryCount: number;
  readonly rateLimit Reset?: number;
  readonly deliveryLog: string[];
};

export type RetryDlqState = {
  readonly entries: readonly DlqEntry[];
  readonly version: number;
};

// ─── Serialization helpers ───────────────────────────────────────────────────
const CURRENT_VERSION = 2;

/** Serialize a RetryDlqState to a JSON string, validating the state structure. */
export function serializeRetryDlqState(state: RetryDlqState): string {
  assertIsRetryDlqState(state);
  return JSON.stringify(state);
}

/** Deserialize a JSON string back to a RetryDlqState, performing basic validation. */
export function deserializeRetryDlqState(json: string): RetryDlqState {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('Invalid JSON for RetryDlqState');
  }
  assertIsRetryDlqState(parsed);
  return parsed;
}

/** Serialize a single DLQ entry to a compact JSON string. */
export function serializeDlqEntry(entry: DlqEntry): string {
  assertIsDlqEntry(entry);
  return JSON.stringify(entry);
}

/** Deserialize a single DLQ entry from a JSON string. */
export function deserializeDlqEntry(json: string): DlqEntry {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('Invalid JSON for DlqEntry');
  }
  assertIsDlqEntry(parsed);
  return parsed;
}

/** Helper to add rate limit reset and delivery log to a DLQ entry. */
export function addRateShapingAndLogs(entry: DlqEntry, rateLimitReset: number, deliveryLog: string): DlqEntry {
  return {
    ...entry,
    rateLimitReset,
    deliveryLog: [...(entry.deliveryLog || []), deliveryLog],
  };
}

/** Serialize a single DLQ entry with rate shaping and delivery logs to a JSON string. */
export function serializeDlqEntryWithRateShapingAndLogs(entry: DlqEntry, rateLimitReset: number, deliveryLog: string): string {
  const updatedEntry = addRateShapingAndLogs(entry, rateLimitReset, deliveryLog);
  return serializeDlqEntry(updatedEntry);
}

// ─── Internal validators ─────────────────────────────────────────────────────
// ... (other validators remain unchanged)

// New validator for DeliveryLog type
function assertIsDeliveryLog(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error('DeliveryLog must be a string');
  }
}

function assertIsDlqEntry(value: unknown): asserts value is DlqEntry {
  // ... (other validations remain unchanged)

  if (value.rateLimitReset !== undefined && (!Number.isFinite(value.rateLimitReset) || value.rateLimitReset < 0)) {
    throw new Error('DlqEntry.rateLimitReset must be a non-negative finite number or undefined');
  }

  if (value.deliveryLog !== undefined && (!Array.isArray(value.deliveryLog) || value.deliveryLog.some((log) => !assertIsDeliveryLog(log)))) {
    throw new Error('DlqEntry.deliveryLog must be an array of strings or undefined');
  }
}
