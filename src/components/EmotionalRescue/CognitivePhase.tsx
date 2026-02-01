import { useState, useEffect } from 'react';
import type { EmotionType } from './types';
import { getQuestionsForEmotion } from './constants';
import './CognitivePhase.css';

interface CognitivePhaseProps {
  emotion: EmotionType;
  onComplete: () => void;
}

const AUTO_ADVANCE_MS = 10000;

export function CognitivePhase({ emotion, onComplete }: CognitivePhaseProps) {
  const questions = getQuestionsForEmotion(emotion);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLastQuestion = currentIndex >= questions.length - 1;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLastQuestion) {
        onComplete();
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }, AUTO_ADVANCE_MS);

    return () => clearTimeout(timer);
  }, [currentIndex, isLastQuestion, onComplete]);

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const question = questions[currentIndex];

  return (
    <div className="cognitive-phase">
      <div className="cognitive-phase__guardian-light" />
      <div className="cognitive-phase__content">
        <p className="cognitive-phase__question">{question.text}</p>
        {question.hint && (
          <p className="cognitive-phase__hint">{question.hint}</p>
        )}
      </div>
      <button
        className="cognitive-phase__next"
        onClick={handleNext}
        aria-label={isLastQuestion ? '完成' : '下一步'}
      >
        {isLastQuestion ? '完成' : '下一步'}
      </button>
    </div>
  );
}
