import { SchemaValidationError } from './schemaGuard.js';

export type SchemaGuardRule = {
  schema: object; // assuming JSON Schema is used
  minInstances: number;
  maxInstances: number;
  duration: number; // in milliseconds
  errorHandler?: (error: SchemaValidationError) => void;
};

export type SchemaGuardConfig = {
  rules: SchemaGuardRule[];
  defaultErrorHandler?: (error: SchemaValidationError) => void;
};
