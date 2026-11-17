/**
 * Represents the configuration for filter rules.
 */
export interface FilterRuleConfig {
  /**
   * An array of filter rules.
   */
  rules: FilterRule[];
}

/**
 * A single filter rule in the configuration.
 */
export interface FilterRule {
  /**
   * The name of the filter rule.
   */
  name: string;

  /**
   * The pattern to match against the incoming event.
   */
  pattern: string | RegExp;

  /**
   * The action to take if the pattern matches.
   */
  action: 'allow' | 'deny';
}
