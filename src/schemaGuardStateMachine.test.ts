import { assert } from 'node:assert';
import { schemaGuardStateMachine, SchemaGuardStateMachineEvent } from './schemaGuardStateMachine';

describe('schemaGuardStateMachine', () => {
  it('initial state is idle', () => {
    const sm = new schemaGuardStateMachine();
    assert.strictEqual(sm.state, 'IDLE');
    assert.deepStrictEqual(sm.transitions, []);
  });

  it('transitions to schemaGuard when verifySchema event is received', () => {
    const sm = new schemaGuardStateMachine();
    sm.handleEvent({ type: 'VERIFY_SCHEMA' as SchemaGuardStateMachineEvent, payload: {} });
    assert.strictEqual(sm.state, 'SCHEMA_GUARD');
    assert.deepStrictEqual(sm.transitions, ['IDLE', 'SCHEMA_GUARD']);
  });

  it('transitions to idle when schema validation succeeds', () => {
    const sm = new schemaGuardStateMachine();
    sm.handleEvent({ type: 'VERIFY_SCHEMA', payload: {} });
    sm.handleEvent({ type: 'SCHEMA_VALID', payload: {} });
    assert.strictEqual(sm.state, 'IDLE');
    assert.deepStrictEqual(sm.transitions, ['IDLE', 'SCHEMA_GUARD', 'IDLE']);
  });

  it('transitions to failed when schema validation fails', () => {
    const sm = new schemaGuardStateMachine();
    sm.handleEvent({ type: 'VERIFY_SCHEMA', payload: {} });
    sm.handleEvent({ type: 'SCHEMA_INVALID', payload: new Error('Validation failed') });
    assert.strictEqual(sm.state, 'FAILED');
    assert.deepStrictEqual(sm.transitions, ['IDLE', 'SCHEMA_GUARD', 'FAILED']);
  });
});
