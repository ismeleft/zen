import { describe, it, expect } from 'vitest';
import {
  EMOTION_OPTIONS,
  BREATHING_PATTERNS,
  EMOTION_TO_RELAX_STEPS,
  COGNITIVE_QUESTIONS,
  ENCOURAGEMENT_BY_EMOTION,
  getQuestionsForEmotion,
  getRelaxStepsForEmotion,
} from './constants';
import type { EmotionType } from './types';

const ALL_EMOTIONS: EmotionType[] = ['anxious', 'angry', 'sad', 'exhausted', 'overwhelmed', 'lonely'];

describe('constants', () => {
  it('should define exactly 6 emotion options', () => {
    expect(EMOTION_OPTIONS).toHaveLength(6);
    const types = EMOTION_OPTIONS.map((e) => e.type);
    expect(types).toEqual(ALL_EMOTIONS);
  });

  it('should have relax steps defined for every emotion', () => {
    for (const emotion of ALL_EMOTIONS) {
      const steps = EMOTION_TO_RELAX_STEPS[emotion];
      expect(steps.length).toBeGreaterThan(0);
    }
  });

  it('should reference only valid breathing patterns in relax steps', () => {
    for (const emotion of ALL_EMOTIONS) {
      for (const step of EMOTION_TO_RELAX_STEPS[emotion]) {
        if (step.breathingPattern) {
          expect(BREATHING_PATTERNS[step.breathingPattern]).toBeDefined();
        }
      }
    }
  });

  it('should have encouragement for every emotion', () => {
    for (const emotion of ALL_EMOTIONS) {
      expect(ENCOURAGEMENT_BY_EMOTION[emotion]).toBeTruthy();
    }
  });
});

describe('getQuestionsForEmotion', () => {
  it('should return universal questions for any emotion', () => {
    const universalCount = COGNITIVE_QUESTIONS.filter((q) => q.applicableTo.length === 0).length;
    const questions = getQuestionsForEmotion('angry');
    expect(questions.length).toBeGreaterThanOrEqual(universalCount);
  });

  it('should include emotion-specific questions for anxious', () => {
    const questions = getQuestionsForEmotion('anxious');
    const hasDisasterQuestion = questions.some((q) => q.purpose === '挑戰災難化');
    expect(hasDisasterQuestion).toBe(true);
  });

  it('should not include anxious-specific questions for sad', () => {
    const questions = getQuestionsForEmotion('sad');
    const hasDisasterQuestion = questions.some((q) =>
      q.applicableTo.includes('anxious') && !q.applicableTo.includes('sad')
    );
    expect(hasDisasterQuestion).toBe(false);
  });
});

describe('getRelaxStepsForEmotion', () => {
  it('should return grounding then breathing for anxious', () => {
    const steps = getRelaxStepsForEmotion('anxious');
    expect(steps[0].type).toBe('grounding');
    expect(steps[1].type).toBe('breathing');
  });

  it('should return only breathing for angry', () => {
    const steps = getRelaxStepsForEmotion('angry');
    expect(steps).toHaveLength(1);
    expect(steps[0].type).toBe('breathing');
  });
});
