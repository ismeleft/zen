import type { EmotionType } from './types';
import { EMOTION_OPTIONS } from './constants';
import './EmotionSelector.css';

interface EmotionSelectorProps {
  onSelect: (emotion: EmotionType) => void;
}

export function EmotionSelector({ onSelect }: EmotionSelectorProps) {
  return (
    <div className="emotion-selector">
      <p className="emotion-selector__guide">你現在感覺如何？</p>
      <div className="emotion-selector__grid">
        {EMOTION_OPTIONS.map((option) => (
          <button
            key={option.type}
            className="emotion-selector__item"
            onClick={() => onSelect(option.type)}
            aria-label={option.label}
            data-emotion={option.type}
          >
            <div className="emotion-blob" data-emotion={option.type}></div>
            <span className="emotion-selector__label">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
