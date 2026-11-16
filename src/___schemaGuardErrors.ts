// src/schemaGuardErrors.ts

/**
 * Base class for schema guard related errors.
 */
export class SchemaGuardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Error thrown when a schema guard does not match the expected schema.
 */
export class SchemaMismatchError extends SchemaGuardError {
  constructor(path: string, expected: any, actual: any) {
    super(
      `Schema mismatch at path "${path}": expected ${typeof expected}, got ${typeof actual}`
    );
    this.path = path;
    this.expected = expected;
    this.actual = actual;
  }

  path: string;
  expected: any;
  actual: any;
}

/**
 * Error thrown when a required field is missing in the payload.
 */
export class RequiredFieldMissingError extends SchemaGuardError {
  constructor(field: string) {
    super(`Required field "${field}" is missing`);
    this.field = field;
  }

  field: string;
}

/**
 * Error thrown when an invalid value is provided for a given field.
 */
export class InvalidValueError extends SchemaGuardError {
  constructor(field: string, value: any, validValues: Array<any>) {
    super(
      `Invalid value "${value}" for field "${field}". Valid values are ${validValues.join(
        ', '
      )}`
    );
    this.field = field;
    this.value = value;
    this.validValues = validValues;
  }

  field: string;
  value: any;
  validValues: Array<any>;
}
