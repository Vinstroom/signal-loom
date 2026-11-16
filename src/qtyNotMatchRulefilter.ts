// src/qtyNotMatchRulefilter.ts

// A custom error type for 'qty' filter rule evaluations.
export class QtyNotMatchRulefilterError extends Error {
  constructor(public readonly expected: number, public readonly actual: number) {
    super(`Expected quantity ${expected} but got ${actual}`);
    this.name = 'QtyNotMatchRulefilterError';
  }
}

// Helper function to throw QtyNotMatchRulefilterError when required quantity doesn't match.
export const ensureQtyMatches = (expected: number, actual: number): void => {
  if (actual !== expected) {
    throw new QtyNotMatchRulefilterError(expected, actual);
  }
};
