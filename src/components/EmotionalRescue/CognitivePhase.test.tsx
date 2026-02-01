import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CognitivePhase } from './CognitivePhase';

describe('CognitivePhase', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('should render first question for given emotion', () => {
    render(<CognitivePhase emotion="anxious" onComplete={vi.fn()} />);
    expect(screen.getByText('現在腦中最大的那個想法是什麼？')).toBeInTheDocument();
  });

  it('should advance to next question on button click', () => {
    render(<CognitivePhase emotion="anxious" onComplete={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: '下一步' }));
    expect(screen.getByText('這個想法是事實，還是一種感覺？')).toBeInTheDocument();
  });

  it('should auto-advance after 10 seconds', () => {
    render(<CognitivePhase emotion="sad" onComplete={vi.fn()} />);
    expect(screen.getByText('現在腦中最大的那個想法是什麼？')).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(10000); });

    expect(screen.getByText('這個想法是事實，還是一種感覺？')).toBeInTheDocument();
  });

  it('should call onComplete after last question', () => {
    const onComplete = vi.fn();
    render(<CognitivePhase emotion="angry" onComplete={onComplete} />);

    // angry has no specific questions, so 4 universal questions (excluding anxious-specific)
    // Universal: 1,2,3,5 = 4 questions. Click through all.
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByRole('button', { name: '下一步' }));
    }
    // After clicking through last question
    fireEvent.click(screen.getByRole('button', { name: '完成' }));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('should include disaster-challenge question for anxious emotion', () => {
    render(<CognitivePhase emotion="anxious" onComplete={vi.fn()} />);
    // Navigate to find the disaster question
    const buttons = screen.getAllByRole('button');
    // Click through to find it
    let found = false;
    for (let i = 0; i < 5; i++) {
      if (screen.queryByText('最壞的情況發生的機率有多高？')) {
        found = true;
        break;
      }
      fireEvent.click(buttons[0]);
    }
    expect(found).toBe(true);
  });
});
