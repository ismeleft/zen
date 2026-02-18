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
