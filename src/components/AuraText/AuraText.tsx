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
  return (
    <div
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
