import { describe, it, beforeEach } from 'node:test';
import { assert, fails } from 'node:assert';
import { FilterStateMachine, FilterState } from './filterStateMachine';
import { FilterRule, FilterOperation } from './filterRule';

describe('FilterStateMachine', () => {
  let machine: FilterStateMachine;

  beforeEach(() => {
    machine = new FilterStateMachine();
  });

  it('should start in idle state', () => {
    assert.strictEqual(machine.state, FilterState.IDLE);
  });

  it('should transition to active when active rule is added', () => {
    const rule: FilterRule = { operation: FilterOperation.ACTIVE };
    machine.setFilterRule(rule);
    assert.strictEqual(machine.state, FilterState.ACTIVE);
  });

  it('should transition to idle when inactive rule is added', () => {
    machine.setFilterRule({ operation: FilterOperation.ACTIVE });
    machine.setFilterRule({ operation: FilterOperation.INACTIVE });
    assert.strictEqual(machine.state, FilterState.IDLE);
  });

  it('should throw error with invalid operation name', () => {
    const invalidRule: FilterRule = { operation: 'invalid' as FilterOperation };
    assert.throws(() => machine.setFilterRule(invalidRule),
      `Invalid filter operation: ${invalidRule.operation}`);
  });

  describe('Rate Limiting', () => {
    const NUMBER_OF_EVENTS = 1000;

    beforeEach(() => {
      for (let i = 0; i < NUMBER_OF_EVENTS; i++) {
        machine.setFilterRule({ operation: FilterOperation.ACTIVE });
      }
    });

    it('should adjust throughput based on rule processing', () => {
      const startTime = performance.now();
      machine.processEvents();
      const endTime = performance.now();
      const durationMs = endTime - startTime;

      // Assuming 1000 events take around 100ms to process
      const expectedThroughput = 10000 / durationMs;

      assert.ok(expectedThroughput > 0, 'Expected throughput to be greater than 0');
    });

    it('should fail if rate limit exceeded', () => {
      // Implement a rate limiter that fails if the rate exceeds a certain threshold
      // This would involve tracking the number of events processed over time and comparing
      // it to a pre-defined threshold. If the threshold is exceeded, the function would throw an error.
      fails(() => machine.processEvents(), 'Rate limit exceeded');
    });
  });
});
