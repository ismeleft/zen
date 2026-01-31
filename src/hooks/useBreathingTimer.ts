import { useState, useEffect, useCallback } from 'react';

type TimerPhase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'holdAfterExhale';

interface UseBreathingTimerOptions {
  /** [吸氣秒數, 停留秒數, 呼氣秒數, 呼後停留秒數]，0 表示跳過 */
  phases: readonly [number, number, number, number];
  cycles: number;
  onComplete?: () => void;
}

interface UseBreathingTimerReturn {
  phase: TimerPhase;
  count: number;
  isActive: boolean;
  currentCycle: number;
  totalCycles: number;
  start: () => void;
  stop: () => void;
}

/** 取得下一個有效的呼吸階段（跳過秒數為 0 的階段） */
function getNextPhase(
  currentPhase: TimerPhase,
  phaseDurations: readonly [number, number, number, number],
): { phase: TimerPhase; duration: number } | null {
  const sequence: { phase: TimerPhase; index: number }[] = [
    { phase: 'inhale', index: 0 },
    { phase: 'hold', index: 1 },
    { phase: 'exhale', index: 2 },
    { phase: 'holdAfterExhale', index: 3 },
  ];

  const currentIndex = sequence.findIndex((s) => s.phase === currentPhase);

  for (let i = currentIndex + 1; i < sequence.length; i++) {
    const duration = phaseDurations[sequence[i].index];
    if (duration > 0) {
      return { phase: sequence[i].phase, duration };
    }
  }

  return null; // 一輪結束
}

export function useBreathingTimer(options: UseBreathingTimerOptions): UseBreathingTimerReturn {
  const { phases: phaseDurations, cycles: totalCycles, onComplete } = options;

  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(1);

  const start = useCallback(() => {
    setIsActive(true);
    setPhase('inhale');
    setCount(phaseDurations[0]);
    setCurrentCycle(1);
  }, [phaseDurations]);

  const stop = useCallback(() => {
    setIsActive(false);
    setPhase('idle');
    setCount(0);
    setCurrentCycle(1);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const timeout = setTimeout(() => {
      if (count > 1) {
        setCount(count - 1);
      } else {
        const next = getNextPhase(phase, phaseDurations);

        if (next) {
          setPhase(next.phase);
          setCount(next.duration);
        } else {
          // 一輪結束
          if (currentCycle >= totalCycles) {
            setIsActive(false);
            setPhase('idle');
            setCount(0);
            onComplete?.();
          } else {
            setCurrentCycle(currentCycle + 1);
            setPhase('inhale');
            setCount(phaseDurations[0]);
          }
        }
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [count, isActive, phase, currentCycle, totalCycles, phaseDurations, onComplete]);

  return { phase, count, isActive, currentCycle, totalCycles, start, stop };
}
