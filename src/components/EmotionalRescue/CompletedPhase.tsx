import type { EmotionType, CheckInResult } from './types';
import { EMOTION_OPTIONS, ENCOURAGEMENT_BY_EMOTION } from './constants';
import './CompletedPhase.css';

interface CompletedPhaseProps {
  emotion: EmotionType;
  checkInResult: CheckInResult | null;
  onReset: () => void;
}

const CHECK_IN_DISPLAY: Record<CheckInResult, { emoji: string; label: string }> = {
  better: { emoji: '😊', label: '好多了' },
  okay: { emoji: '😐', label: '還好' },
  'still-bad': { emoji: '😔', label: '還是很難受' },
};

export function CompletedPhase({ emotion, checkInResult, onReset }: CompletedPhaseProps) {
  const emotionOption = EMOTION_OPTIONS.find((e) => e.type === emotion)!;
  const encouragement = ENCOURAGEMENT_BY_EMOTION[emotion];
  const afterDisplay = CHECK_IN_DISPLAY[checkInResult ?? 'better'];

  return (
    <div className="completed-phase">
      <div className="completed-phase__aura" />

      <h2 className="completed-phase__tagline">No one can move your light</h2>
      <p className="completed-phase__encouragement">{encouragement}</p>

      <div className="completed-phase__comparison">
        <div className="completed-phase__before">
          <div className="completed-phase__orb completed-phase__orb--before" />
          <span>開始時：{emotionOption.emoji} {emotionOption.label}</span>
        </div>
        <div className="completed-phase__arrow">→</div>
        <div className="completed-phase__after">
          <div className="completed-phase__orb completed-phase__orb--after" />
          <span>現在：{afterDisplay.emoji} {afterDisplay.label}</span>
        </div>
      </div>

      <button className="completed-phase__reset" onClick={onReset}>
        返回首頁
      </button>
    </div>
  );
}
