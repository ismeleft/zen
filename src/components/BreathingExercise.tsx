import React, { useState } from "react";
import { useBreathingTimer } from "../hooks/useBreathingTimer";
import "./BreathingExercise.css";

export const BreathingExercise: React.FC = () => {
  const [targetCycles, setTargetCycles] = useState(5);
  const [isCompleted, setIsCompleted] = useState(false);

  const { phase, count, isActive, currentCycle, start, stop } = useBreathingTimer({
    phases: [4, 7, 8, 0],
    cycles: targetCycles,
    onComplete: () => setIsCompleted(true),
  });

  const handleStart = () => {
    setIsCompleted(false);
    start();
  };

  const handleStop = () => {
    setIsCompleted(false);
    stop();
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetCycles(parseInt(event.target.value, 10));
  };

  const phaseTextMap: Record<string, string> = {
    inhale: "吸氣",
    hold: "屏息",
    exhale: "呼氣",
    holdAfterExhale: "屏息",
  };

  return (
    <div className="breathing-container">
      {/* idle 狀態的文字 */}
      {phase === "idle" && (
        <div className="idle-message">
          {isCompleted ? "✓ 完成" : "準備好了嗎？"}
        </div>
      )}

      {/* 呼吸圓圈（只在非 idle 時顯示） */}
      {phase !== "idle" && (
        <div className={`breath-circle ${phase}`}>
          <div className="center-content">
            <div className="instruction-text">{count}</div>
            <div className="phase-text">{phaseTextMap[phase] || phase}</div>
          </div>
        </div>
      )}

      {/* 進度圓點指示器 */}
      {isActive && (
        <div className="progress-dots">
          {Array.from({ length: targetCycles }, (_, i) => (
            <span
              key={i}
              className={`progress-dot ${i < currentCycle ? 'active' : ''}`}
            />
          ))}
        </div>
      )}

      {/* 控制區 */}
      <div className="controls">
        {!isActive && (
          <div className="slider-group">
            <label htmlFor="target-cycles">目標循環次數</label>
            <input
              id="target-cycles"
              type="range"
              min="1"
              max="10"
              value={targetCycles}
              onChange={handleSliderChange}
              className="cycles-slider"
            />
            <span className="cycles-value">{targetCycles}</span>
          </div>
        )}

        {!isActive ? (
          <button className="btn-start" onClick={handleStart}>
            開始呼吸
          </button>
        ) : (
          <button className="btn-stop" onClick={handleStop}>
            停止
          </button>
        )}
      </div>
    </div>
  );
};
