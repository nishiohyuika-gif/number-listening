export type Language =
  | 'ja'
  | 'en'
  | 'fr'
  | 'zh'
  | 'ko'
  | 'de'
  | 'it'
  | 'es'
  | 'nl';

export const ALL_LANGUAGES: readonly Language[] = [
  'ja',
  'en',
  'fr',
  'zh',
  'ko',
  'de',
  'it',
  'es',
  'nl',
] as const;

export type Category =
  | 'number'
  | 'arithmetic'
  | 'time'
  | 'money'
  | 'date'
  | 'phone';

export const ALL_CATEGORIES: readonly Category[] = [
  'number',
  'arithmetic',
  'time',
  'money',
  'date',
  'phone',
] as const;

export type Difficulty = 'easy' | 'medium' | 'hard';

export const ALL_DIFFICULTIES: readonly Difficulty[] = [
  'easy',
  'medium',
  'hard',
] as const;

export type Currency = 'JPY' | 'USD' | 'EUR' | 'GBP' | 'KRW' | 'CNY';

export type ArithmeticOp = '+' | '-' | '*' | '/';

export type TimeSystem = '12h' | '24h';

export type QuestionValue =
  | { kind: 'number'; n: number }
  | {
      kind: 'arithmetic';
      a: number;
      op: ArithmeticOp;
      b: number;
      result: number;
    }
  | { kind: 'time'; hour: number; minute: number; system: TimeSystem }
  | { kind: 'money'; amount: number; currency: Currency }
  | { kind: 'date'; year?: number; month: number; day: number; dow?: number }
  | { kind: 'phone'; digits: string };

export interface Question {
  id: string;
  category: Category;
  targetLang: Language;
  difficulty: Difficulty;
  value: QuestionValue;
  /** Text passed to the TTS engine in the target language. */
  speechText: string;
  /** Canonical answer used for grading (digits / structured string). */
  canonicalAnswer: string;
  /** Optional pretty form for feedback (e.g., "10:20" or "¥1,200"). */
  displayAnswer: string;
}

export interface Answer {
  questionId: string;
  userInput: string;
  correct: boolean;
  playCount: number;
  elapsedMs: number;
  timestamp: number;
}

export interface Session {
  id: string;
  startedAt: number;
  endedAt?: number;
  uiLang: Language;
  targetLang: Language;
  categories: Category[];
  difficulty: Difficulty;
  questions: Question[];
  answers: Answer[];
}

export const LANGUAGE_BCP47: Record<Language, string> = {
  ja: 'ja-JP',
  en: 'en-US',
  fr: 'fr-FR',
  zh: 'zh-CN',
  ko: 'ko-KR',
  de: 'de-DE',
  it: 'it-IT',
  es: 'es-ES',
  nl: 'nl-NL',
};

export const LANGUAGE_NATIVE_NAMES: Record<Language, string> = {
  ja: '日本語',
  en: 'English',
  fr: 'Français',
  zh: '中文',
  ko: '한국어',
  de: 'Deutsch',
  it: 'Italiano',
  es: 'Español',
  nl: 'Nederlands',
};

export const CURRENCY_BY_LANGUAGE: Record<Language, Currency> = {
  ja: 'JPY',
  en: 'USD',
  fr: 'EUR',
  zh: 'CNY',
  ko: 'KRW',
  de: 'EUR',
  it: 'EUR',
  es: 'EUR',
  nl: 'EUR',
};
