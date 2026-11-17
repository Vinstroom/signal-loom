import { validate } from 'validate';
import { RateShapingConfig } from './rateShapingConfig';
import { DeliveryLogConfig } from './rateShapingDeliveryLogs';

/**
 * Validates the input for rate shaping and delivery logs configuration.
 *
 * @param config - The rate shaping and delivery logs configuration to validate.
 * @param schema - The validation schema.
 *
 * @throws {Error} If validation fails.
 */
function validateRateShapingDeliveryLogsConfig(
  config: RateShapingConfig & DeliveryLogConfig,
  schema: object
) {
  const result = validate(config, schema);
  if (!result.valid) {
    throw new Error(`Invalid rate shaping and delivery logs configuration: ${result.errors}`);
  }
}

export default validateRateShapingDeliveryLogsConfig;
