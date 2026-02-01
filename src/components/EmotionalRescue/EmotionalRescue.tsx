import { useReducer, useCallback } from 'react';
import { rescueReducer, INITIAL_RESCUE_STATE } from './rescueReducer';
import { EmotionSelector } from './EmotionSelector';
import { RelaxationPhase } from './RelaxationPhase';
import { CheckInPrompt } from './CheckInPrompt';
import { CognitivePhase } from './CognitivePhase';
import { CompletedPhase } from './CompletedPhase';
import type { EmotionType, CheckInResult } from './types';
import './EmotionalRescue.css';

interface EmotionalRescueProps {
  onClose: () => void;
}

export function EmotionalRescue({ onClose }: EmotionalRescueProps) {
  const [state, dispatch] = useReducer(rescueReducer, INITIAL_RESCUE_STATE);

  const handleSelectEmotion = useCallback((emotion: EmotionType) => {
    dispatch({ type: 'SELECT_EMOTION', emotion });
  }, []);

  const handleRelaxationComplete = useCallback(() => {
    dispatch({ type: 'COMPLETE_RELAXATION' });
  }, []);

  const handleCheckIn = useCallback((result: CheckInResult) => {
    dispatch({ type: 'CHECK_IN', result });
  }, []);

  const handleReflectionComplete = useCallback(() => {
    dispatch({ type: 'COMPLETE_REFLECTION' });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' });
    onClose();
  }, [onClose]);

  return (
    <div className="emotional-rescue">
      <button className="emotional-rescue__leave" onClick={onClose}>
        離開
      </button>

      {state.phase === 'selecting' && (
        <EmotionSelector onSelect={handleSelectEmotion} />
      )}

      {state.phase === 'relaxing' && state.selectedEmotion && (
        <RelaxationPhase
          emotion={state.selectedEmotion}
          onComplete={handleRelaxationComplete}
        />
      )}

      {state.phase === 'checking' && (
        <CheckInPrompt onResult={handleCheckIn} />
      )}

      {state.phase === 'reflecting' && state.selectedEmotion && (
        <CognitivePhase
          emotion={state.selectedEmotion}
          onComplete={handleReflectionComplete}
        />
      )}

      {state.phase === 'completed' && state.selectedEmotion && (
        <CompletedPhase
          emotion={state.selectedEmotion}
          checkInResult={state.checkInResult}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
