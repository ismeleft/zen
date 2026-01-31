import type { RescueState, RescueAction } from './types';

export const INITIAL_RESCUE_STATE: RescueState = {
  phase: 'selecting',
  selectedEmotion: null,
  checkInResult: null,
  currentRelaxStepIndex: 0,
  currentQuestionIndex: 0,
};

export function rescueReducer(state: RescueState, action: RescueAction): RescueState {
  switch (action.type) {
    case 'SELECT_EMOTION':
      return {
        ...state,
        phase: 'relaxing',
        selectedEmotion: action.emotion,
        currentRelaxStepIndex: 0,
      };

    case 'COMPLETE_RELAX_STEP':
      return {
        ...state,
        currentRelaxStepIndex: state.currentRelaxStepIndex + 1,
      };

    case 'COMPLETE_RELAXATION':
      return {
        ...state,
        phase: 'checking',
      };

    case 'CHECK_IN':
      return {
        ...state,
        checkInResult: action.result,
        phase: action.result === 'better' ? 'completed' : 'reflecting',
        currentQuestionIndex: 0,
      };

    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      };

    case 'COMPLETE_REFLECTION':
      return {
        ...state,
        phase: 'completed',
      };

    case 'RESET':
      return INITIAL_RESCUE_STATE;

    default:
      return state;
  }
}
