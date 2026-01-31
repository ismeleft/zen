import type { CheckInResult } from './types';
import './CheckInPrompt.css';

interface CheckInPromptProps {
  onResult: (result: CheckInResult) => void;
}

const CHECK_IN_OPTIONS: { result: CheckInResult; emoji: string; label: string }[] = [
  { result: 'better', emoji: '😊', label: '好多了' },
  { result: 'okay', emoji: '😐', label: '還好' },
  { result: 'still-bad', emoji: '😔', label: '還是很難受' },
];

export function CheckInPrompt({ onResult }: CheckInPromptProps) {
  return (
    <div className="check-in">
      <p className="check-in__question">現在感覺如何？</p>
      <div className="check-in__options">
        {CHECK_IN_OPTIONS.map((option) => (
          <button
            key={option.result}
            className="check-in__option"
            onClick={() => onResult(option.result)}
          >
            <span className="check-in__emoji">{option.emoji}</span>
            <span className="check-in__label">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
