# Schema Guard: Design Overview

## Purpose

Schema guards ensure that incoming webhook payloads conform to a declared schema before entering the dispatch pipeline.  They act as the second line of validation after signature verification and before any filtering, rate shaping, or delivery attempts.

## Core Modules

- **`src/schemaGuard.ts`** — The main entry point. Accepts a payload and a schema definition; returns a `ValidationResult` with either a validated object or a list of errors.
- **`src/schemaValidator.ts`** — Implements the actual validation logic (type checks, required fields, pattern matching, etc.). Designed to be stateless and pure.
- **`src/schemaGuardCache.ts`** — Caches compiled schemas keyed by schema ID or hash to avoid re-compilation on every request.
- **`src/schemaGuardStateMachine.ts`** and related files — Orchestrates the lifecycle of a schema guard instance: loading, validating, error recovery, and expiration.

## Integration with the Pipeline

Schema guards are loaded once at startup via `src/configLoader.ts` and stored in a registry. When a webhook arrives, `src/index.ts` invokes the guard for the matching route:

1. **Signature verified** → `src/isSignatureValid.ts`
2. **Schema validated** → `src/schemaGuard.ts`
3. **Filter rules applied** → `src/filterRule.ts`
4. **Rate shaping** → `src/rateShaper.ts`
5. **Delivery with retries** → `src/retryPolicy.ts`

## Error Handling

Validation errors are collected and structured by `src/schemaGuard.ts`. They include the field path, expected type, and actual value. Downstream, `src/filterRuleErrors.ts` and `src/schemaGuardCache.ts` handle transient vs. permanent schema failures:

- **Transient**: Circuit breaker in `schemaGuardStateMachine` reloads the schema after a backoff.
- **Permanent**: The payload is routed to a dead-letter queue via `src/retryDlqFormatter.ts`.

## Caching Strategy

`src/schemaGuardCache.ts` uses a least-recently-used (LRU) eviction policy. It caches compiled schema validators keyed by schema version and hash. The cache is invalidated when a new config is loaded by `src/configLoader.ts`.

## Testing

See `tests/___schemaGuardStateMachine.test.ts` and `tests/schemaGuardCache.test.ts` for unit tests covering:
- Valid and invalid payloads
- Schema reloading on error
- Cache eviction and expiry
