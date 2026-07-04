/// <reference types="vitest/globals" />
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// 避免 jsdom 沒有 WebGL context 造成錯誤
// importActual 作為 factory 參數傳入，避免 vi.mock hoisting 造成 TDZ 錯誤
vi.mock('three', async (importActual) => {
  const actual = await importActual<typeof import('three')>();
  class MockWebGLRenderer {
    setPixelRatio() {}
    setSize() {}
    render() {}
    dispose() {}
    domElement = document.createElement('canvas');
  }
  return {
    ...actual,
    WebGLRenderer: MockWebGLRenderer,
  };
});

import LotusBloom from './LotusBloom';

describe('LotusBloom', () => {
  beforeEach(() => {
    // 停止 animation loop 避免無限遞迴
    vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(0);
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('應該渲染根容器', () => {
    const { container } = render(<LotusBloom />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('應該顯示播放按鈕（預設為播放圖示）', () => {
    render(<LotusBloom />);
    expect(
      screen.getByRole('button', { name: /播放綻放動畫/i })
    ).toBeInTheDocument();
  });

  it('應該顯示綻放進度滑桿', () => {
    render(<LotusBloom />);
    expect(
      screen.getByRole('slider', { name: /綻放進度/i })
    ).toBeInTheDocument();
  });

  it('應該顯示重設按鈕', () => {
    render(<LotusBloom />);
    expect(screen.getByRole('button', { name: /重設/i })).toBeInTheDocument();
  });

  it('點擊播放後按鈕 aria-label 應變為暫停', async () => {
    const user = userEvent.setup();
    render(<LotusBloom />);
    await user.click(screen.getByRole('button', { name: /播放綻放動畫/i }));
    expect(screen.getByRole('button', { name: /暫停/i })).toBeInTheDocument();
  });

  it('點擊重設後進度滑桿值應為 0', async () => {
    const user = userEvent.setup();
    render(<LotusBloom />);
    await user.click(screen.getByRole('button', { name: /播放綻放動畫/i }));
    await user.click(screen.getByRole('button', { name: /重設/i }));
    const slider = screen.getByRole('slider', { name: /綻放進度/i }) as HTMLInputElement;
    expect(parseFloat(slider.value)).toBe(0);
  });
});
