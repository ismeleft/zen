import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuraText } from './AuraText';

describe('AuraText', () => {
  it('應該渲染氛圍文字容器', () => {
    render(<AuraText />);
    // hidden: true 因為這是裝飾元素，本身帶 aria-hidden="true"
    const container = screen.getByRole('presentation', { hidden: true });
    expect(container).toBeInTheDocument();
  });

  it('應該設定 aria-hidden 避免螢幕閱讀器讀取', () => {
    render(<AuraText />);
    const container = screen.getByRole('presentation', { hidden: true });
    expect(container).toHaveAttribute('aria-hidden', 'true');
  });

  it('應該渲染所有文字行', () => {
    // 文字行在 aria-hidden 容器內，用 querySelector 直接查 DOM
    const { container } = render(<AuraText />);
    expect(container.querySelector('.aura-text-wrapper')).toBeInTheDocument();
    expect(container.textContent).toContain("Nobody gon'");
    expect(container.textContent).toContain('move my soul,');
    expect(container.textContent).toContain("gon' move my");
    expect(container.textContent).toContain('aura, my matter');
  });

  it('應該有 aura-text-wrapper class 以套用 CSS', () => {
    render(<AuraText />);
    const container = screen.getByRole('presentation', { hidden: true });
    expect(container).toHaveClass('aura-text-wrapper');
  });
});
