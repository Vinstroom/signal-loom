/**
 * Formats retry and dead-letter queue (DLQ) events into human-readable strings.
 * Provides structured output for debugging and monitoring.
 */
export interface RetryDlqEvent {
  attempt: number;
  maxAttempts: number;
  elapsedTimeMs: number;
  dlqReason?: string;
  originalError?: unknown;
  payloadId?: string;
  eventType?: string;
}

export interface SchemaGuardStats {
  totalChecked: number;
  passed: number;
  failed: number;
  blocked: number;
  lastFailureReason?: string;
  lastBlockedPayloadId?: string;
}

export function formatRetryEvent(event: RetryDlqEvent): string {
  const { attempt, maxAttempts, elapsedTimeMs, dlqReason, originalError, payloadId, eventType } = event;

  const timeStr = `${elapsedTimeMs}ms`;
  const attemptStr = `Attempt ${attempt} of ${maxAttempts}`;

  if (dlqReason) {
    return `⚠️ ${attemptStr} - Failed after ${timeStr} (DLQ: ${dlqReason})${payloadId ? ` (ID: ${payloadId})` : ''}`;
  }

  return `🔄 ${attemptStr} - Retrying after ${timeStr}${payloadId ? ` (ID: ${payloadId})` : ''}`;
}

export function formatDlqEntry(
  eventType: string,
  payloadId: string,
  attempts: number,
  firstAttemptTime: Date,
  lastAttemptTime: Date,
  dlqReason: string,
  originalError?: unknown
): string {
  const durationMs = lastAttemptTime.getTime() - firstAttemptTime.getTime();
  const durationStr = `${Math.round(durationMs / 1000)}s`;

  const errorStr = originalError
    ? `\n  Error: ${String(originalError)}`
    : '';

  return `📦 DLQ Entry [${eventType}] [${payloadId}]\n`
    + `  Attempts: ${attempts}\n`
    + `  Duration: ${durationStr}\n`
    + `  Reason: ${dlqReason}\n`
    + `  First Attempt: ${firstAttemptTime.toISOString()}\n`
    + `  Last Attempt: ${lastAttemptTime.toISOString()}${errorStr}`;
}

export function formatRetryStats(
  totalAttempts: number,
  totalFailed: number,
  totalSuccess: number,
  dlqEntries: number,
  avgRetryDelayMs: number
): string {
  const successRate = totalAttempts > 0
    ? `${((totalSuccess / totalAttempts) * 100).toFixed(1)}%`
    : 'N/A';

  return `📊 Retry Statistics\n`
    + `  Total Attempts: ${totalAttempts}\n`
    + `  Total Failed: ${totalFailed}\n`
    + `  Total Success: ${totalSuccess}\n`
    + `  Success Rate: ${successRate}\n`
    + `  DLQ Entries: ${dlqEntries}\n`
    + `  Avg Retry Delay: ${avgRetryDelayMs}ms`;
}

export function formatSchemaGuardStats(stats: SchemaGuardStats): string {
  const { totalChecked, passed, failed, blocked, lastFailureReason, lastBlockedPayloadId } = stats;

  const passRate = totalChecked > 0
    ? `${((passed / totalChecked) * 100).toFixed(1)}%`
    : 'N/A';

  const lines: string[] = [
    '🔍 Schema Guard Statistics',
    `  Total Checked: ${totalChecked}`,
    `  Passed: ${passed}`,
    `  Failed: ${failed}`,
    `  Blocked: ${blocked}`,
    `  Pass Rate: ${passRate}`,
  ];

  if (lastFailureReason) {
    lines.push(`  Last Failure Reason: ${lastFailureReason}`);
  }

  if (lastBlockedPayloadId) {
    lines.push(`  Last Blocked Payload ID: ${lastBlockedPayloadId}`);
  }

  return lines.join('\n');
}
