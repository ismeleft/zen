import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useBreathingTimer } from './useBreathingTimer';

describe('useBreathingTimer', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('should start in idle state', () => {
    const { result } = renderHook(() =>
      useBreathingTimer({ phases: [4, 7, 8, 0], cycles: 3 })
    );
    expect(result.current.phase).toBe('idle');
    expect(result.current.isActive).toBe(false);
    expect(result.current.count).toBe(0);
  });

  it('should begin inhale phase on start', () => {
    const { result } = renderHook(() =>
      useBreathingTimer({ phases: [4, 7, 8, 0], cycles: 3 })
    );
    act(() => { result.current.start(); });
    expect(result.current.phase).toBe('inhale');
    expect(result.current.count).toBe(4);
    expect(result.current.isActive).toBe(true);
  });

  it('should countdown and transition to hold', () => {
    const { result } = renderHook(() =>
      useBreathingTimer({ phases: [4, 7, 8, 0], cycles: 3 })
    );
    act(() => { result.current.start(); });

    // Advance through inhale (4 seconds)
    for (let i = 0; i < 4; i++) {
      act(() => { vi.advanceTimersByTime(1000); });
    }
    expect(result.current.phase).toBe('hold');
    expect(result.current.count).toBe(7);
  });

  it('should skip hold phase when duration is 0', () => {
    const { result } = renderHook(() =>
      useBreathingTimer({ phases: [2, 0, 3, 0], cycles: 1 })
    );
    act(() => { result.current.start(); });

    // Advance through inhale (2 seconds)
    for (let i = 0; i < 2; i++) {
      act(() => { vi.advanceTimersByTime(1000); });
    }
    // Should skip hold (0) and go to exhale
    expect(result.current.phase).toBe('exhale');
    expect(result.current.count).toBe(3);
  });

  it('should call onComplete after all cycles finish', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useBreathingTimer({ phases: [2, 0, 2, 0], cycles: 1, onComplete })
    );
    act(() => { result.current.start(); });

    // Inhale 2s + Exhale 2s = 4s
    for (let i = 0; i < 4; i++) {
      act(() => { vi.advanceTimersByTime(1000); });
    }
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(result.current.isActive).toBe(false);
  });

  it('should stop when stop is called', () => {
    const { result } = renderHook(() =>
      useBreathingTimer({ phases: [4, 7, 8, 0], cycles: 3 })
    );
    act(() => { result.current.start(); });
    act(() => { result.current.stop(); });
    expect(result.current.isActive).toBe(false);
    expect(result.current.phase).toBe('idle');
  });

  it('should track current cycle', () => {
    const { result } = renderHook(() =>
      useBreathingTimer({ phases: [2, 0, 2, 0], cycles: 3 })
    );
    act(() => { result.current.start(); });
    expect(result.current.currentCycle).toBe(1);

    // Complete first cycle: 2s inhale + 2s exhale
    for (let i = 0; i < 4; i++) {
      act(() => { vi.advanceTimersByTime(1000); });
    }
    expect(result.current.currentCycle).toBe(2);
  });
});
