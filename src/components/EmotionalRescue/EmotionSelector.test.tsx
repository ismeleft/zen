import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmotionSelector } from './EmotionSelector';

describe('EmotionSelector', () => {
  it('should render all 6 emotion options', () => {
    render(<EmotionSelector onSelect={vi.fn()} />);
    expect(screen.getByText('焦慮')).toBeInTheDocument();
    expect(screen.getByText('憤怒')).toBeInTheDocument();
    expect(screen.getByText('悲傷')).toBeInTheDocument();
    expect(screen.getByText('疲憊')).toBeInTheDocument();
    expect(screen.getByText('混亂')).toBeInTheDocument();
    expect(screen.getByText('孤獨')).toBeInTheDocument();
  });

  it('should render the guiding text', () => {
    render(<EmotionSelector onSelect={vi.fn()} />);
    expect(screen.getByText('讓我們一起守護你的光')).toBeInTheDocument();
  });

  it('should call onSelect with the emotion type when clicked', () => {
    const onSelect = vi.fn();
    render(<EmotionSelector onSelect={onSelect} />);
    fireEvent.click(screen.getByText('焦慮'));
    expect(onSelect).toHaveBeenCalledWith('anxious');
  });

  it('should render emoji for each emotion', () => {
    render(<EmotionSelector onSelect={vi.fn()} />);
    expect(screen.getByText('😰')).toBeInTheDocument();
    expect(screen.getByText('😤')).toBeInTheDocument();
  });
});
