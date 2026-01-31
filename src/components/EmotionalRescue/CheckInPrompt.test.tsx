import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CheckInPrompt } from './CheckInPrompt';

describe('CheckInPrompt', () => {
  it('should render the check-in question', () => {
    render(<CheckInPrompt onResult={vi.fn()} />);
    expect(screen.getByText('現在感覺如何？')).toBeInTheDocument();
  });

  it('should render three options', () => {
    render(<CheckInPrompt onResult={vi.fn()} />);
    expect(screen.getByText('好多了')).toBeInTheDocument();
    expect(screen.getByText('還好')).toBeInTheDocument();
    expect(screen.getByText('還是很難受')).toBeInTheDocument();
  });

  it('should call onResult with better when first option clicked', () => {
    const onResult = vi.fn();
    render(<CheckInPrompt onResult={onResult} />);
    fireEvent.click(screen.getByText('好多了'));
    expect(onResult).toHaveBeenCalledWith('better');
  });

  it('should call onResult with okay when second option clicked', () => {
    const onResult = vi.fn();
    render(<CheckInPrompt onResult={onResult} />);
    fireEvent.click(screen.getByText('還好'));
    expect(onResult).toHaveBeenCalledWith('okay');
  });

  it('should call onResult with still-bad when third option clicked', () => {
    const onResult = vi.fn();
    render(<CheckInPrompt onResult={onResult} />);
    fireEvent.click(screen.getByText('還是很難受'));
    expect(onResult).toHaveBeenCalledWith('still-bad');
  });
});
