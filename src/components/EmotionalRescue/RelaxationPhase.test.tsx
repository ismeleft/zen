import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RelaxationPhase } from './RelaxationPhase';

describe('RelaxationPhase', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('should render grounding prompts for anxious emotion (first step)', () => {
    render(<RelaxationPhase emotion="anxious" onComplete={vi.fn()} />);
    // Anxious starts with grounding
    expect(screen.getByText(/看看四周/)).toBeInTheDocument();
  });

  it('should render breathing guidance for angry emotion', () => {
    render(<RelaxationPhase emotion="angry" onComplete={vi.fn()} />);
    // Angry has long-exhale breathing
    expect(screen.getByText('長呼氣呼吸')).toBeInTheDocument();
  });

  it('should show breathing phase text during breathing step', () => {
    render(<RelaxationPhase emotion="angry" onComplete={vi.fn()} />);
    // Should show inhale indication
    expect(screen.getByText('吸')).toBeInTheDocument();
  });

  it('should call onComplete when all relaxation steps are done', () => {
    const onComplete = vi.fn();
    // angry has only 1 step: long-exhale breathing with 3 cycles of [4,0,8,0]
    // Total: 3 cycles × (4+8) = 36 seconds
    render(<RelaxationPhase emotion="angry" onComplete={onComplete} />);

    // Advance through 3 cycles of (4s inhale + 8s exhale)
    for (let i = 0; i < 36; i++) {
      act(() => { vi.advanceTimersByTime(1000); });
    }

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('should display guide text during relaxation', () => {
    render(<RelaxationPhase emotion="angry" onComplete={vi.fn()} />);
    expect(screen.getByText('穩住你的氣場')).toBeInTheDocument();
  });
});
