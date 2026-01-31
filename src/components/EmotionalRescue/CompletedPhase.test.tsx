import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CompletedPhase } from './CompletedPhase';

describe('CompletedPhase', () => {
  it('should display the main tagline', () => {
    render(<CompletedPhase emotion="anxious" checkInResult="better" onReset={vi.fn()} />);
    expect(screen.getByText('No one can move your light')).toBeInTheDocument();
  });

  it('should display emotion-specific encouragement', () => {
    render(<CompletedPhase emotion="anxious" checkInResult="better" onReset={vi.fn()} />);
    expect(screen.getByText('你的靈魂比你想像的更強大')).toBeInTheDocument();
  });

  it('should display before/after emotion comparison', () => {
    render(<CompletedPhase emotion="anxious" checkInResult="better" onReset={vi.fn()} />);
    expect(screen.getByText(/焦慮/)).toBeInTheDocument();
    expect(screen.getByText(/好多了/)).toBeInTheDocument();
  });

  it('should display still-bad text when check-in was negative', () => {
    render(<CompletedPhase emotion="sad" checkInResult="still-bad" onReset={vi.fn()} />);
    expect(screen.getByText(/還是很難受/)).toBeInTheDocument();
  });

  it('should show okay text when check-in was okay', () => {
    render(<CompletedPhase emotion="sad" checkInResult="okay" onReset={vi.fn()} />);
    expect(screen.getByText(/還好/)).toBeInTheDocument();
  });

  it('should call onReset when return button is clicked', () => {
    const onReset = vi.fn();
    render(<CompletedPhase emotion="anxious" checkInResult="better" onReset={onReset} />);
    fireEvent.click(screen.getByText('返回首頁'));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('should show better as default when no check-in result', () => {
    render(<CompletedPhase emotion="anxious" checkInResult={null} onReset={vi.fn()} />);
    expect(screen.getByText(/好多了/)).toBeInTheDocument();
  });
});
