/** 六種情緒類型 */
export type EmotionType = 'anxious' | 'angry' | 'sad' | 'exhausted' | 'overwhelmed' | 'lonely';

/** 流程階段 */
export type RescuePhase = 'selecting' | 'relaxing' | 'checking' | 'reflecting' | 'completed';

/** 放鬆技巧類型 */
export type RelaxTechniqueType = 'grounding' | 'breathing' | 'visualization';

/** 呼吸模式名稱 */
export type BreathingPatternName = 'relaxing-478' | 'long-exhale' | 'energizing' | 'box';

/** 呼吸階段 */
export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'holdAfterExhale';

/** 呼吸模式設定 */
export interface BreathingPattern {
  readonly name: BreathingPatternName;
  readonly label: string;
  /** 各階段秒數，依序為 [吸, 停, 呼, 呼後停]，0 表示跳過該階段 */
  readonly phases: readonly [number, number, number, number];
  readonly cycles: number;
}

/** 放鬆技巧步驟 */
export interface RelaxStep {
  readonly type: RelaxTechniqueType;
  readonly breathingPattern?: BreathingPatternName;
  /** 接地練習或視覺化的引導文字陣列 */
  readonly prompts?: readonly string[];
  /** 每個 prompt 停留秒數 */
  readonly promptDurationSeconds?: number;
}

/** 情緒選項（UI 顯示用） */
export interface EmotionOption {
  readonly type: EmotionType;
  readonly label: string;
  readonly emoji: string;
}

/** 認知問題 */
export interface CognitiveQuestion {
  readonly text: string;
  readonly purpose: string;
  readonly hint?: string;
  /** 適用的情緒，空陣列表示通用 */
  readonly applicableTo: readonly EmotionType[];
}

/** 狀態檢查結果 */
export type CheckInResult = 'better' | 'okay' | 'still-bad';

/** 主流程狀態 */
export interface RescueState {
  readonly phase: RescuePhase;
  readonly selectedEmotion: EmotionType | null;
  readonly checkInResult: CheckInResult | null;
  /** 放鬆階段：當前第幾個技巧步驟（0-based） */
  readonly currentRelaxStepIndex: number;
  /** 認知階段：當前第幾題（0-based） */
  readonly currentQuestionIndex: number;
}

/** 狀態機 Action */
export type RescueAction =
  | { type: 'SELECT_EMOTION'; emotion: EmotionType }
  | { type: 'COMPLETE_RELAX_STEP' }
  | { type: 'COMPLETE_RELAXATION' }
  | { type: 'CHECK_IN'; result: CheckInResult }
  | { type: 'NEXT_QUESTION' }
  | { type: 'COMPLETE_REFLECTION' }
  | { type: 'RESET' };
