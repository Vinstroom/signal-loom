/**
 * Validates payload transforms based on predefined rules.
 */
export class PayloadTransformValidator {
  /**
   * Validates the given payload transform.
   *
   * @param payloadTransform - The payload transform to validate.
   * @param rules - The validation rules.
   * @throws {Error} If the payload transform fails any of the validation rules.
   */
  static validate(payloadTransform: any, rules: Record<string, any>): void {
    Object.entries(rules).forEach(([rule, expected]) => {
      const actual = payloadTransform[rule];

      if (typeof actual !== typeof expected || actual !== expected) {
        throw new Error(`Validation rule "${rule}" failed: expected ${typeof expected}, ${expected}, got ${typeof actual}, ${actual}`);
      }
    });
  }
}
