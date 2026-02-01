import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RescueFab } from './RescueFab';

describe('RescueFab', () => {
  it('should render the floating action button', () => {
    render(<RescueFab onClick={vi.fn()} />);
    expect(screen.getByRole('button', { name: '情緒急救' })).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const onClick = vi.fn();
    render(<RescueFab onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: '情緒急救' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
