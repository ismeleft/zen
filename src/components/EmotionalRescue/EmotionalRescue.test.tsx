import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmotionalRescue } from './EmotionalRescue';

describe('EmotionalRescue', () => {
  it('should render emotion selector initially', () => {
    render(<EmotionalRescue onClose={vi.fn()} />);
    expect(screen.getByText('你現在感覺如何？')).toBeInTheDocument();
    expect(screen.getByText('焦慮')).toBeInTheDocument();
  });

  it('should transition to relaxation phase after selecting emotion', () => {
    render(<EmotionalRescue onClose={vi.fn()} />);
    fireEvent.click(screen.getByText('焦慮'));
    expect(screen.getByText('穩住你的氣場')).toBeInTheDocument();
  });

  it('should render leave link', () => {
    render(<EmotionalRescue onClose={vi.fn()} />);
    expect(screen.getByText('離開')).toBeInTheDocument();
  });

  it('should call onClose when leave link is clicked', () => {
    const onClose = vi.fn();
    render(<EmotionalRescue onClose={onClose} />);
    fireEvent.click(screen.getByText('離開'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
