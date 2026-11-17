/**
 * Validates an incoming rule object for a filtering rule.
 * Ensures field, operator, and value are present and well-formed.
 * Returns an array of error strings; empty means valid.
 */

export interface FilterRule {
  field: string;
  operator: 'eq' | 'neq' | 'exists' | 'not_exists' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'not_contains' | 'startsWith' | 'endsWith';
  value?: unknown;
}

const VALID_OPERATORS: ReadonlySet<string> = new Set([
  'eq', 'neq', 'exists', 'not_exists', 'gt', 'gte', 'lt', 'lte', 'contains', 'not_contains', 'startsWith', 'endsWith'
]);

export function validateFilterRule(input: unknown): string[] {
  const errors: string[] = [];

  if (input === null || input === undefined || typeof input !== 'object') {
    errors.push('Filter rule must be a non-null object');
    return errors;
  }

  const rule = input as Record<string, unknown>;

  if (typeof rule.field !== 'string' || rule.field.trim().length === 0) {
    errors.push('field must be a non-empty string');
  }

  if (typeof rule.operator !== 'string' || !VALID_OPERATORS.has(rule.operator)) {
    errors.push(`operator must be one of: ${Array.from(VALID_OPERATORS).join(', ')}`);
  }

  if (rule.operator === 'exists' || rule.operator === 'not_exists') {
    if (rule.value !== undefined) {
      errors.push('value must not be provided for exists/not_exists operators');
    }
  } else if (rule.value === undefined || rule.value === null) {
    errors.push('value must be provided for this operator');
  }

  return errors;
}
