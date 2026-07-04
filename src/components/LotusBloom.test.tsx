/// <reference types="vitest/globals" />
import { render } from '@testing-library/react';

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
    vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(0);
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('應該渲染 3D canvas 容器', () => {
    const { container } = render(<LotusBloom />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('掛載後應自動啟動動畫迴圈（requestAnimationFrame 被呼叫）', () => {
    const { unmount } = render(<LotusBloom />);
    expect(window.requestAnimationFrame).toHaveBeenCalled();
    unmount();
  });

  it('應該不包含任何控制按鈕或滑桿', () => {
    const { container } = render(<LotusBloom />);
    expect(container.querySelector('button')).toBeNull();
    expect(container.querySelector('input[type="range"]')).toBeNull();
  });
});
