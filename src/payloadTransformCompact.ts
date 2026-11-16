import type { SchemaGuardResult } from './schemaGuardConfig.js';

/**
 * Compact representation of a payload transform operation.
 * Combines guard result, transform type, and metadata into a single flat object
 * to reduce memory overhead when processing large batches of webhook payloads.
 */
export interface PayloadTransformCompact {
  /** Schema guard result for the original payload */
  guardResult: SchemaGuardResult;
  /** Type of transform applied (if any) */
  transformType: TransformType;
  /** Millisecond timestamp of the transform operation */
  timestamp: number;
  /** Index of the rule that triggered the transform, or -1 if none */
  ruleIndex: number;
  /** Size of the original payload in bytes */
  originalSize: number;
  /** Size of the transformed payload in bytes, or 0 if no transform */
  transformedSize: number;
  /** Indicator of whether the transform was successfully applied */
  success: boolean;
}

/** Supported payload transform types */
export type TransformType = 'none' | 'json-stringify' | 'json-parse' | 'base64-encode' | 'base64-decode';

/** Fixed-size buffer for storing a batch of compact records */
export const COMPACT_RECORD_SIZE = 48; // 6 fields × 8 bytes (aligned)

/** Maximum batch size for in-memory compaction */
export const MAX_COMPACT_BATCH = 1024;

/**
 * Create a compact payload transform record from raw inputs.
 * Returns a minimal object to reduce allocation overhead.
 */
export function createCompactRecord(
  guardResult: SchemaGuardResult,
  transformType: TransformType,
  timestamp: number,
  ruleIndex: number,
  originalSize: number,
  transformedSize: number,
  success: boolean
): PayloadTransformCompact {
  return {
    guardResult,
    transformType,
    timestamp,
    ruleIndex: Math.max(-1, Math.min(ruleIndex, 2 ** 16 - 1)),
    originalSize: Math.max(0, originalSize),
    transformedSize: Math.max(0, transformedSize),
    success,
  };
}

/**
 * Estimate byte overhead for a compact record.
 * Useful for memory-aware batching decisions.
 */
export function estimateCompactMemoryUsage(records: number): number {
  return records * COMPACT_RECORD_SIZE;
}
