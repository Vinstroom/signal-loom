FILENAME: schemaValidator.ts
COMMIT: feat: Adds input validator for schema guards

import Ajv, { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import { SchemaGuardConfig } from "./schemaGuardConfig.js";
import { SchemaGuardError } from "./schemaGuardErrors.js";

export class SchemaValidator {
  private ajvInstance: Ajv;
  private validate: ValidateFunction;

  constructor(config: SchemaGuardConfig) {
    this.ajvInstance = new Ajv({ allErrors: true });
    addFormats(this.ajvInstance);
    this.validate = this.ajvInstance.compile(config.schema);
  }

  public validateSchema(input: any): void {
    const validate = this.validate;
    const valid = validate(input);

    if (!valid) {
      throw new SchemaGuardError(validate.errors);
    }
  }
}
