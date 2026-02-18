import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuraText } from './AuraText';

describe('AuraText', () => {
  it('應該渲染氛圍文字容器', () => {
    render(<AuraText />);
    const container = screen.getByRole('presentation');
    expect(container).toBeInTheDocument();
  });

  it('應該設定 aria-hidden 避免螢幕閱讀器讀取', () => {
    render(<AuraText />);
    const container = screen.getByRole('presentation');
    expect(container).toHaveAttribute('aria-hidden', 'true');
  });

  it('應該渲染所有文字行', () => {
    render(<AuraText />);
    expect(screen.getByText(/Nobody gon'/)).toBeInTheDocument();
    expect(screen.getByText(/move my soul/)).toBeInTheDocument();
    expect(screen.getByText(/gon' move my/)).toBeInTheDocument();
    expect(screen.getByText(/aura, my matter/)).toBeInTheDocument();
  });

  it('應該有 aura-text-wrapper class 以套用 CSS', () => {
    render(<AuraText />);
    const container = screen.getByRole('presentation');
    expect(container).toHaveClass('aura-text-wrapper');
  });
});
