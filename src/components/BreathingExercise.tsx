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

  const handleTargetCyclesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0 && Number.isInteger(Number(event.target.value))) {
      setTargetCycles(value);
    }
  };

  return (
    <div className="breathing-container">
      <div className={`breath-circle ${phase}`}>
        <div className="center-content">
          <div className="instruction-text">
            {phase === "idle" ? (isCompleted ? "Completed!" : "Ready?") : count}
          </div>
          {phase !== "idle" && (
            <div className="phase-text">{phase.toUpperCase()}</div>
          )}
        </div>
      </div>

      {isActive && (
        <div className="progress-text">
          {currentCycle} / {targetCycles}
        </div>
      )}

      <div className="controls">
        {!isActive && (
          <div className="input-group">
            <label htmlFor="target-cycles">Target Cycles:</label>
            <input
              id="target-cycles"
              type="number"
              min="1"
              value={targetCycles}
              onChange={handleTargetCyclesChange}
              className="cycles-input"
            />
          </div>
        )}

        {!isActive ? (
          <button className="btn-start" onClick={handleStart}>
            Start Breathing
          </button>
        ) : (
          <button className="btn-start" onClick={handleStop}>
            Stop
          </button>
        )}
      </div>
    </div>
  );
};
