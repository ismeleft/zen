import { describe, it, expect } from 'vitest';
import { rescueReducer, INITIAL_RESCUE_STATE } from './rescueReducer';

describe('rescueReducer', () => {
  it('should start with selecting phase', () => {
    expect(INITIAL_RESCUE_STATE.phase).toBe('selecting');
    expect(INITIAL_RESCUE_STATE.selectedEmotion).toBeNull();
  });

  it('should transition to relaxing on SELECT_EMOTION', () => {
    const state = rescueReducer(INITIAL_RESCUE_STATE, {
      type: 'SELECT_EMOTION',
      emotion: 'anxious',
    });
    expect(state.phase).toBe('relaxing');
    expect(state.selectedEmotion).toBe('anxious');
    expect(state.currentRelaxStepIndex).toBe(0);
  });

  it('should advance relax step on COMPLETE_RELAX_STEP', () => {
    const relaxingState = rescueReducer(INITIAL_RESCUE_STATE, {
      type: 'SELECT_EMOTION',
      emotion: 'anxious',
    });
    const next = rescueReducer(relaxingState, { type: 'COMPLETE_RELAX_STEP' });
    expect(next.currentRelaxStepIndex).toBe(1);
    expect(next.phase).toBe('relaxing');
  });

  it('should transition to checking on COMPLETE_RELAXATION', () => {
    const relaxingState = rescueReducer(INITIAL_RESCUE_STATE, {
      type: 'SELECT_EMOTION',
      emotion: 'angry',
    });
    const state = rescueReducer(relaxingState, { type: 'COMPLETE_RELAXATION' });
    expect(state.phase).toBe('checking');
  });

  it('should go to completed if check-in result is better', () => {
    let state = rescueReducer(INITIAL_RESCUE_STATE, { type: 'SELECT_EMOTION', emotion: 'sad' });
    state = rescueReducer(state, { type: 'COMPLETE_RELAXATION' });
    state = rescueReducer(state, { type: 'CHECK_IN', result: 'better' });
    expect(state.phase).toBe('completed');
    expect(state.checkInResult).toBe('better');
  });

  it('should go to reflecting if check-in result is okay', () => {
    let state = rescueReducer(INITIAL_RESCUE_STATE, { type: 'SELECT_EMOTION', emotion: 'sad' });
    state = rescueReducer(state, { type: 'COMPLETE_RELAXATION' });
    state = rescueReducer(state, { type: 'CHECK_IN', result: 'okay' });
    expect(state.phase).toBe('reflecting');
  });

  it('should go to reflecting if check-in result is still-bad', () => {
    let state = rescueReducer(INITIAL_RESCUE_STATE, { type: 'SELECT_EMOTION', emotion: 'sad' });
    state = rescueReducer(state, { type: 'COMPLETE_RELAXATION' });
    state = rescueReducer(state, { type: 'CHECK_IN', result: 'still-bad' });
    expect(state.phase).toBe('reflecting');
  });

  it('should advance question index on NEXT_QUESTION', () => {
    let state = rescueReducer(INITIAL_RESCUE_STATE, { type: 'SELECT_EMOTION', emotion: 'sad' });
    state = rescueReducer(state, { type: 'COMPLETE_RELAXATION' });
    state = rescueReducer(state, { type: 'CHECK_IN', result: 'okay' });
    state = rescueReducer(state, { type: 'NEXT_QUESTION' });
    expect(state.currentQuestionIndex).toBe(1);
  });

  it('should transition to completed on COMPLETE_REFLECTION', () => {
    let state = rescueReducer(INITIAL_RESCUE_STATE, { type: 'SELECT_EMOTION', emotion: 'sad' });
    state = rescueReducer(state, { type: 'COMPLETE_RELAXATION' });
    state = rescueReducer(state, { type: 'CHECK_IN', result: 'okay' });
    state = rescueReducer(state, { type: 'COMPLETE_REFLECTION' });
    expect(state.phase).toBe('completed');
  });

  it('should reset to initial state on RESET', () => {
    let state = rescueReducer(INITIAL_RESCUE_STATE, { type: 'SELECT_EMOTION', emotion: 'sad' });
    state = rescueReducer(state, { type: 'RESET' });
    expect(state).toEqual(INITIAL_RESCUE_STATE);
  });
});
