import type {
  EmotionOption,
  EmotionType,
  BreathingPattern,
  BreathingPatternName,
  RelaxStep,
  CognitiveQuestion,
} from './types';

/** 六種情緒選項 */
export const EMOTION_OPTIONS: readonly EmotionOption[] = [
  { type: 'anxious', label: '焦慮', emoji: '😰' },
  { type: 'angry', label: '憤怒', emoji: '😤' },
  { type: 'sad', label: '悲傷', emoji: '😢' },
  { type: 'exhausted', label: '疲憊', emoji: '😩' },
  { type: 'overwhelmed', label: '混亂', emoji: '🤯' },
  { type: 'lonely', label: '孤獨', emoji: '🥀' },
] as const;

/** 呼吸模式定義：[吸, 停, 呼, 呼後停] */
export const BREATHING_PATTERNS: Record<BreathingPatternName, BreathingPattern> = {
  'relaxing-478': { name: 'relaxing-478', label: '4-7-8 放鬆呼吸', phases: [4, 7, 8, 0], cycles: 3 },
  'long-exhale':  { name: 'long-exhale',  label: '長呼氣呼吸',     phases: [4, 0, 8, 0], cycles: 3 },
  'energizing':   { name: 'energizing',   label: '能量呼吸',       phases: [2, 0, 2, 0], cycles: 5 },
  'box':          { name: 'box',          label: '方形呼吸',       phases: [4, 4, 4, 4], cycles: 3 },
};

/** 五感接地練習引導文字 */
const GROUNDING_PROMPTS: readonly string[] = [
  '看看四周，找到 5 個你能看到的東西',
  '摸摸身邊，感受 4 個你能觸碰的物品',
  '安靜一下，聽到 3 個聲音',
  '聞聞空氣，感受 2 個氣味',
  '感受嘴裡的 1 個味道',
];

/** 安全空間視覺化引導文字 */
const VISUALIZATION_PROMPTS: readonly string[] = [
  '閉上眼睛，想像一個讓你感到安全的地方',
  '這個地方可以是真實的，也可以是想像的',
  '感受那裡的溫度、光線、氣味',
  '你在這裡是完全安全的',
  '深吸一口氣，把這份安全感帶回來',
];

/** 情緒 → 放鬆技巧組合 */
export const EMOTION_TO_RELAX_STEPS: Record<EmotionType, readonly RelaxStep[]> = {
  anxious:     [
    { type: 'grounding', prompts: GROUNDING_PROMPTS, promptDurationSeconds: 8 },
    { type: 'breathing', breathingPattern: 'relaxing-478' },
  ],
  angry:       [
    { type: 'breathing', breathingPattern: 'long-exhale' },
  ],
  sad:         [
    { type: 'breathing', breathingPattern: 'relaxing-478' },
    { type: 'visualization', prompts: VISUALIZATION_PROMPTS, promptDurationSeconds: 6 },
  ],
  exhausted:   [
    { type: 'breathing', breathingPattern: 'energizing' },
    { type: 'visualization', prompts: VISUALIZATION_PROMPTS, promptDurationSeconds: 6 },
  ],
  overwhelmed: [
    { type: 'grounding', prompts: GROUNDING_PROMPTS, promptDurationSeconds: 8 },
    { type: 'breathing', breathingPattern: 'box' },
  ],
  lonely:      [
    { type: 'breathing', breathingPattern: 'box' },
    { type: 'visualization', prompts: VISUALIZATION_PROMPTS, promptDurationSeconds: 6 },
  ],
};

/** 認知問題庫 */
export const COGNITIVE_QUESTIONS: readonly CognitiveQuestion[] = [
  { text: '現在腦中最大的那個想法是什麼？', purpose: '覺察', applicableTo: [] },
  { text: '這個想法是事實，還是一種感覺？', purpose: '區分事實與詮釋', applicableTo: [] },
  { text: '如果朋友有這個想法，你會對他說什麼？', purpose: '自我慈悲', applicableTo: [] },
  { text: '最壞的情況發生的機率有多高？', purpose: '挑戰災難化', applicableTo: ['anxious', 'overwhelmed'] },
  { text: '此刻有什麼是你能控制的？', purpose: '聚焦可控', applicableTo: [] },
];

/** 情緒對應鼓勵語 */
export const ENCOURAGEMENT_BY_EMOTION: Record<EmotionType, string> = {
  anxious: '你的靈魂比你想像的更強大',
  angry: '你選擇了平靜，這就是力量',
  sad: '允許悲傷流過，你依然完整',
  exhausted: '休息不是放棄，是為了走更遠',
  overwhelmed: '一步一步來，你已經在路上了',
  lonely: '你並不孤單，此刻你陪伴了自己',
};

/** 根據情緒篩選適用的認知問題（通用問題 + 該情緒專屬問題） */
export function getQuestionsForEmotion(emotion: EmotionType): CognitiveQuestion[] {
  return COGNITIVE_QUESTIONS.filter(
    (q) => q.applicableTo.length === 0 || q.applicableTo.includes(emotion)
  );
}

/** 根據情緒取得放鬆技巧組合 */
export function getRelaxStepsForEmotion(emotion: EmotionType): readonly RelaxStep[] {
  return EMOTION_TO_RELAX_STEPS[emotion];
}
