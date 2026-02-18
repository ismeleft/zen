# AuraText Background Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在整個 app 加入固定的氛圍背景大字層，顯示「Nobody gon' move my soul, gon' move my aura, my matter」，帶緩慢漂浮動畫，opacity ~0.12，不干擾任何 UI 操作。

**Architecture:** 新增獨立的 `AuraText` 元件，以 `position: fixed` 固定在全域背景，`z-index: 0`，`pointer-events: none`，`aria-hidden="true"`。GSAP 做無限緩慢 y 軸漂浮（18 秒一週期）。在 `App.tsx` 直接放在最外層，讓整個 app 共享此背景。

**Tech Stack:** React 19, TypeScript, GSAP 3 (@gsap/react useGSAP hook), CSS (co-located), Vitest + React Testing Library

---

## 專案背景知識

- **字體**：app 已有 Cinzel（header 用），body 用 Inter。AuraText 改用 **Playfair Display**（editorial serif 感），需從 Google Fonts 引入。
- **顏色**：背景 `--zen-bg: #0f172a`（深藍黑），文字用 `--zen-text: #e2e8f0`，但 opacity 壓到 0.12。
- **z-index 架構**：
  - `0` → AuraText（氛圍背景）
  - `1` → app-container（正常 scroll 內容）
  - `10` → RescueFab、EmotionalRescue overlay
  - `100` → zen-header
- **GSAP**：專案用 `@gsap/react` 的 `useGSAP` hook，參考 `EmotionalRescue` 裡的 GSAP 用法。
- **測試原則**：純視覺/動畫元件測試重點為「DOM 結構正確」與「accessibility 屬性存在」，不測動畫本身（GSAP 在 jsdom 無法真正執行）。

---

### Task 1: 引入 Playfair Display 字體

**Files:**
- Modify: `index.html`

**Step 1: 在 `<head>` 加入 Google Fonts link**

開啟 `/Users/ying/Desktop/zen/index.html`，在現有 `<link>` 之後加入：

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
```

**Step 2: 確認字體可用（開 dev server 目測）**

```bash
yarn dev
```

在 browser 開啟 `http://localhost:5173`，打開 DevTools → Network → 搜尋 `Playfair`，確認字體有被載入（status 200）。

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat(aura-text): add Playfair Display Google Font"
```

---

### Task 2: 建立 AuraText 元件骨架與測試

**Files:**
- Create: `src/components/AuraText/AuraText.tsx`
- Create: `src/components/AuraText/AuraText.css`
- Create: `src/components/AuraText/AuraText.test.tsx`
- Create: `src/components/AuraText/index.ts`

**Step 1: 先寫測試（TDD）**

建立 `src/components/AuraText/AuraText.test.tsx`：

```tsx
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
    // 驗證文字內容有出現在 DOM 中（aria-hidden 不影響 DOM 查詢）
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
```

**Step 2: 執行測試確認全部 FAIL**

```bash
yarn test --run src/components/AuraText/AuraText.test.tsx
```

預期輸出：`FAIL` — 找不到 `AuraText` 模組。

**Step 3: 建立空的 AuraText 元件讓 import 不報錯**

建立 `src/components/AuraText/AuraText.tsx`：

```tsx
/** 氛圍背景大字元件 — 純裝飾層，不影響 UI 操作 */
export function AuraText() {
  return null;
}
```

**Step 4: 執行測試確認失敗原因正確**

```bash
yarn test --run src/components/AuraText/AuraText.test.tsx
```

預期輸出：`FAIL` — `Unable to find role="presentation"` 等，代表元件 import 正確但 DOM 尚未實作。

**Step 5: 建立 index.ts**

```ts
export { AuraText } from './AuraText';
```

**Step 6: Commit 測試骨架**

```bash
git add src/components/AuraText/
git commit -m "test(aura-text): add AuraText component tests (TDD red phase)"
```

---

### Task 3: 實作 AuraText 元件本體

**Files:**
- Modify: `src/components/AuraText/AuraText.tsx`
- Create: `src/components/AuraText/AuraText.css`

**Step 1: 實作 AuraText.tsx**

```tsx
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import './AuraText.css';

/** 氛圍背景文字的每一行 */
const AURA_TEXT_LINES = [
  "Nobody gon'",
  'move my soul,',
  "gon' move my",
  'aura, my matter',
] as const;

/** 氛圍背景大字元件 — 純裝飾層，不影響 UI 操作 */
export function AuraText() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!wrapperRef.current) return;

    // 緩慢垂直漂浮：y 從 0 → 20px → 0，無限循環，18 秒一週期
    gsap.to(wrapperRef.current, {
      y: 20,
      duration: 18,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }, { scope: wrapperRef });

  return (
    <div
      ref={wrapperRef}
      className="aura-text-wrapper"
      role="presentation"
      aria-hidden="true"
    >
      {AURA_TEXT_LINES.map((line) => (
        <span key={line} className="aura-text-line">
          {line}
        </span>
      ))}
    </div>
  );
}
```

**Step 2: 實作 AuraText.css**

```css
/* 固定在全域背景，不隨頁面 scroll 移動 */
.aura-text-wrapper {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;        /* 完全穿透，不影響點擊 */
  user-select: none;           /* 不可選取 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25em;
  overflow: hidden;
}

/* 每一行文字 */
.aura-text-line {
  display: block;
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  font-size: clamp(3rem, 12vw, 9rem);  /* RWD：手機 ~3rem，桌機最大 9rem */
  line-height: 1.1;
  color: var(--zen-text);              /* #e2e8f0 */
  opacity: 0.12;                       /* 方向 B：有存在感但不搶焦 */
  letter-spacing: -0.02em;
  text-align: center;
  white-space: nowrap;
}

/* 手機直向：字稍微小一點讓全部行都能顯示 */
@media (max-width: 480px) {
  .aura-text-line {
    font-size: clamp(2rem, 9vw, 4rem);
    white-space: normal;
    text-align: center;
    max-width: 90vw;
  }
}
```

**Step 3: 執行測試確認全部 PASS**

```bash
yarn test --run src/components/AuraText/AuraText.test.tsx
```

預期輸出：`PASS` 4 個測試全過。

**Step 4: Commit**

```bash
git add src/components/AuraText/AuraText.tsx src/components/AuraText/AuraText.css
git commit -m "feat(aura-text): implement AuraText component with GSAP floating animation"
```

---

### Task 4: 整合進 App.tsx

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.css`

**Step 1: 在 App.tsx 加入 AuraText**

開啟 `src/App.tsx`，加入 import 並放在 `app-container` 之前：

```tsx
import { useState } from 'react';
import { Lotus } from './components/Lotus';
import { BreathingExercise } from './components/BreathingExercise';
import { RescueFab } from './components/RescueFab';
import { EmotionalRescue } from './components/EmotionalRescue';
import { AuraText } from './components/AuraText';  // ← 新增
import './App.css';

function App() {
  const [isRescueOpen, setIsRescueOpen] = useState(false);

  return (
    <>
      {/* 氛圍背景大字層 — fixed，不在 scroll 容器內 */}
      <AuraText />

      <div className="app-container">
        <header className="zen-header">
          <h1>ZEN</h1>
        </header>

        <section className="hero-section">
          <Lotus />
          <div className="scroll-hint">Scroll to Breathe</div>
        </section>

        <section className="breathing-section">
          <BreathingExercise />
        </section>

        <RescueFab onClick={() => setIsRescueOpen(true)} />

        {isRescueOpen && (
          <EmotionalRescue onClose={() => setIsRescueOpen(false)} />
        )}
      </div>
    </>
  );
}

export default App;
```

**Step 2: 確認 app-container z-index 高於 AuraText**

開啟 `src/App.css`，在 `.app-container` 加入 `position: relative` 與 `z-index: 1`（已有 `position: relative`，確認即可，若無則加入）：

```css
.app-container {
  display: block;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
  z-index: 1;   /* ← 確保在 AuraText (z-index: 0) 之上 */
}
```

**Step 3: 目測確認視覺效果**

```bash
yarn dev
```

開啟 `http://localhost:5173`，確認：
- [ ] 大字有出現在背景
- [ ] 文字可見但不搶焦（opacity 0.12）
- [ ] 字體是 Playfair Display（有襯線感）
- [ ] 所有按鈕、Lotus、BreathingExercise 都可以正常點擊
- [ ] Scroll 時背景字不動（fixed）
- [ ] 打開 EmotionalRescue overlay 時背景字被蓋住

**Step 4: Commit**

```bash
git add src/App.tsx src/App.css
git commit -m "feat(aura-text): integrate AuraText into App as global background layer"
```

---

### Task 5: 執行完整測試套件確認無回歸

**Step 1: 跑所有測試**

```bash
yarn test --run
```

預期輸出：所有現有測試 PASS，新增 4 個 AuraText 測試也 PASS，沒有任何 FAIL。

**Step 2: 若有測試失敗**

檢查失敗訊息，最常見的問題：
- GSAP 在 jsdom 報錯 → 確認 `useGSAP` 內有 `if (!wrapperRef.current) return;` 防護
- CSS import 問題 → Vitest 已設定 jsdom，CSS import 會被忽略，不影響測試

**Step 3: Build 確認無 TypeScript 錯誤**

```bash
yarn build
```

預期輸出：`dist/` 生成成功，無 TS 錯誤。

**Step 4: 最終 Commit**

```bash
git add -A
git commit -m "test(aura-text): verify all tests pass after AuraText integration"
```

---

## 完成標準

- [ ] `yarn test --run` 全部 PASS
- [ ] `yarn build` 無錯誤
- [ ] 瀏覽器目測：大字背景可見、opacity 適中、不影響 UI 操作
- [ ] `aria-hidden="true"` 確認存在（無障礙）
- [ ] Scroll、RescueFab、EmotionalRescue 行為不受影響
