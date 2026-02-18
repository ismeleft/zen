import '@testing-library/jest-dom';

// jsdom 環境未實作 window.matchMedia，補上 mock 供所有測試使用
// 預設回傳 matches: false（即不啟用 prefers-reduced-motion）
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
