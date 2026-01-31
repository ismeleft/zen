import { useState, useCallback, useEffect } from 'react';
import type { EmotionType, RelaxStep } from './types';
import { getRelaxStepsForEmotion, BREATHING_PATTERNS } from './constants';
import { useBreathingTimer } from '../../hooks/useBreathingTimer';
import './RelaxationPhase.css';

interface RelaxationPhaseProps {
  emotion: EmotionType;
  onComplete: () => void;
}

/** 呼吸階段的中文對應 */
const PHASE_LABELS: Record<string, string> = {
  idle: '',
  inhale: '吸',
  hold: '停',
  exhale: '呼',
  holdAfterExhale: '停',
};

function BreathingStep({ step, onStepComplete }: { step: RelaxStep; onStepComplete: () => void }) {
  const pattern = BREATHING_PATTERNS[step.breathingPattern!];
  const { phase, count, isActive, currentCycle, totalCycles, start } = useBreathingTimer({
    phases: pattern.phases,
    cycles: pattern.cycles,
    onComplete: onStepComplete,
  });

  useEffect(() => {
    start();
  }, [start]);

  return (
    <div className="relax-breathing">
      <p className="relax-breathing__pattern-name">{pattern.label}</p>
      <div className={`relax-breathing__orb relax-breathing__orb--${phase}`}>
        <span className="relax-breathing__phase-label">{PHASE_LABELS[phase]}</span>
        {isActive && <span className="relax-breathing__count">{count}</span>}
      </div>
      {isActive && (
        <p className="relax-breathing__progress">{currentCycle} / {totalCycles}</p>
      )}
    </div>
  );
}

function GroundingStep({ step, onStepComplete }: { step: RelaxStep; onStepComplete: () => void }) {
  const [promptIndex, setPromptIndex] = useState(0);
  const prompts = step.prompts!;
  const duration = (step.promptDurationSeconds ?? 8) * 1000;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (promptIndex >= prompts.length - 1) {
        onStepComplete();
      } else {
        setPromptIndex((prev) => prev + 1);
      }
    }, duration);
    return () => clearTimeout(timer);
  }, [promptIndex, prompts.length, duration, onStepComplete]);

  return (
    <div className="relax-grounding">
      <p className="relax-grounding__prompt">{prompts[promptIndex]}</p>
    </div>
  );
}

function VisualizationStep({ step, onStepComplete }: { step: RelaxStep; onStepComplete: () => void }) {
  const [promptIndex, setPromptIndex] = useState(0);
  const prompts = step.prompts!;
  const duration = (step.promptDurationSeconds ?? 6) * 1000;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (promptIndex >= prompts.length - 1) {
        onStepComplete();
      } else {
        setPromptIndex((prev) => prev + 1);
      }
    }, duration);
    return () => clearTimeout(timer);
  }, [promptIndex, prompts.length, duration, onStepComplete]);

  return (
    <div className="relax-visualization">
      <p className="relax-visualization__prompt">{prompts[promptIndex]}</p>
    </div>
  );
}

export function RelaxationPhase({ emotion, onComplete }: RelaxationPhaseProps) {
  const steps = getRelaxStepsForEmotion(emotion);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleStepComplete = useCallback(() => {
    if (currentStepIndex >= steps.length - 1) {
      onComplete();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [currentStepIndex, steps.length, onComplete]);

  const currentStep = steps[currentStepIndex];

  return (
    <div className="relaxation-phase">
      <p className="relaxation-phase__guide">穩住你的氣場</p>
      {currentStep.type === 'breathing' && (
        <BreathingStep key={currentStepIndex} step={currentStep} onStepComplete={handleStepComplete} />
      )}
      {currentStep.type === 'grounding' && (
        <GroundingStep key={currentStepIndex} step={currentStep} onStepComplete={handleStepComplete} />
      )}
      {currentStep.type === 'visualization' && (
        <VisualizationStep key={currentStepIndex} step={currentStep} onStepComplete={handleStepComplete} />
      )}
    </div>
  );
}
