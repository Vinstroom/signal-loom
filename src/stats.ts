/**
 * A module for calculating and tracking statistics.
 */
import { Event, SchemaGuardsResult } from './serialization';

/**
 * A class for tracking and calculating statistics.
 */
export class Stats {
  private totalEvents: number;
  private failedEventsDueToFilter: number;
  private failedEventsDueToSchemaGuard: number;
  private failedEventsDueToOther: number;

  constructor() {
    this.totalEvents = 0;
    this.failedEventsDueToFilter = 0;
    this.failedEventsDueToSchemaGuard = 0;
    this.failedEventsDueToOther = 0;
  }

  /**
   * Increment total events and track failed events based on the filter and schema guard results.
   * @param event - The event to track.
   * @param shouldDiscard - Whether the event should be discarded due to filter rules.
   * @param schemaGuardResult - The result of the schema guard check.
   */
  track(
    event: Event,
    shouldDiscard: boolean,
    schemaGuardResult: SchemaGuardsResult,
  ) {
    this.totalEvents++;

    if (shouldDiscard) {
      this.failedEventsDueToFilter++;
    } else if (schemaGuardResult.failed) {
      this.failedEventsDueToSchemaGuard++;
    } else if (event === null) {
      this.failedEventsDueToOther++;
    }
  }

  /**
   * Get the total number of events processed.
   */
  getTotalEvents(): number {
    return this.totalEvents;
  }

  /**
   * Get the number of failed events due to filter rules.
   */
  getFailedEventsDueToFilter(): number {
    return this.failedEventsDueToFilter;
  }

  /**
   * Get the number of failed events due to schema guards.
   */
  getFailedEventsDueToSchemaGuard(): number {
    return this.failedEventsDueToSchemaGuard;
  }

  /**
   * Get the number of failed events due to other reasons.
   */
  getFailedEventsDueToOther(): number {
    return this.failedEventsDueToOther;
  }

  /**
   * Reset the statistics.
   */
  reset() {
    this.totalEvents = 0;
    this.failedEventsDueToFilter = 0;
    this.failedEventsDueToSchemaGuard = 0;
    this.failedEventsDueToOther = 0;
  }

  /**
   * Calculate the schema guard pass rate as a percentage.
   */
  getSchemaGuardPassRate(): number {
    if (this.totalEvents === 0) {
      return 0;
    }
    const schemaGuardPassedEvents = this.totalEvents - this.failedEventsDueToSchemaGuard;
    return (schemaGuardPassedEvents / this.totalEvents) * 100;
  }
}
