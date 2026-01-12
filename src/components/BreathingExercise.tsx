import React, { useState, useEffect } from "react";
import "./BreathingExercise.css";

type BreathingPhase = "idle" | "inhale" | "hold" | "exhale";

export const BreathingExercise: React.FC = () => {
  // state
  const [phase, setPhase] = useState<BreathingPhase>("idle");
  const [count, setCount] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  const [targetCycles, setTargetCycles] = useState<number>(5);
  const [currentCycle, setCurrentCycle] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (!isActive) return;

    const timeout = setTimeout(() => {
      if (count > 1) {
        setCount(count - 1);
      } else {
        switch (phase) {
          case "inhale":
            setPhase("hold");
            setCount(7);
            break;
          case "hold":
            setPhase("exhale");
            setCount(8);
            break;
          case "exhale":
            if (currentCycle >= targetCycles) {
              setIsActive(false);
              setPhase("idle");
              setCount(0);
              setIsCompleted(true);
            } else {
              setCurrentCycle(currentCycle + 1);
              setPhase("inhale");
              setCount(4);
            }
            break;
          default:
            break;
        }
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [count, isActive, phase, currentCycle, targetCycles]);

  const handleStart = () => {
    setIsActive(true);
    setPhase("inhale");
    setCount(4);
    setCurrentCycle(1);
    setIsCompleted(false);
  };

  const handleStop = () => {
    setIsActive(false);
    setPhase("idle");
    setCount(0);
    setCurrentCycle(1);
    setIsCompleted(false);
  };

  const handleTargetCyclesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value, 10);
    if (
      !isNaN(value) &&
      value > 0 &&
      Number.isInteger(Number(event.target.value))
    ) {
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

      {/* Progress display during active breathing */}
      {isActive && (
        <div className="progress-text">
          {currentCycle} / {targetCycles}
        </div>
      )}

      <div className="controls">
        {/* Target cycles input when idle */}
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
