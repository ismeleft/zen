import type { EmotionType } from './types';
import { EMOTION_OPTIONS } from './constants';
import './EmotionSelector.css';

interface EmotionSelectorProps {
  onSelect: (emotion: EmotionType) => void;
}

export function EmotionSelector({ onSelect }: EmotionSelectorProps) {
  return (
    <div className="emotion-selector">
      <p className="emotion-selector__guide">讓我們一起守護你的光</p>
      <div className="emotion-selector__grid">
        {EMOTION_OPTIONS.map((option) => (
          <button
            key={option.type}
            className="emotion-selector__item"
            onClick={() => onSelect(option.type)}
            aria-label={option.label}
          >
            <span className="emotion-selector__emoji">{option.emoji}</span>
            <span className="emotion-selector__label">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
