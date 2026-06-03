import type { Difficulty, Language, Question } from '../types/core';
import { getEngine } from '../numberSpeech';
import { randInt } from '../utils/random';
import { uid } from '../utils/id';

function lengthFor(lang: Language, difficulty: Difficulty): number {
  // Approximate typical mobile lengths per locale, increased with difficulty
  const baseByLang: Record<Language, number> = {
    ja: 11, en: 10, fr: 10, zh: 11, ko: 11, de: 10, it: 10, es: 9, nl: 10,
  };
  const base = baseByLang[lang];
  switch (difficulty) {
    case 'easy':
      return Math.max(7, base - 3);
    case 'medium':
      return base;
    case 'hard':
      return base;
  }
}

function genDigits(len: number, lang: Language): string {
  const out: string[] = [];
  // First digit: keep leading 0 / typical prefix to feel realistic
  const prefixByLang: Record<Language, string> = {
    ja: '090', en: '', fr: '06', zh: '138', ko: '010', de: '030', it: '348', es: '6', nl: '06',
  };
  const prefix = prefixByLang[lang] ?? '';
  for (const c of prefix) out.push(c);
  while (out.length < len) out.push(String(randInt(0, 9)));
  return out.join('');
}

export function genPhone(lang: Language, difficulty: Difficulty): Question {
  const len = lengthFor(lang, difficulty);
  const digits = genDigits(len, lang);
  const engine = getEngine(lang);
  return {
    id: uid(),
    category: 'phone',
    targetLang: lang,
    difficulty,
    value: { kind: 'phone', digits },
    speechText: engine.phone(digits),
    canonicalAnswer: digits,
    displayAnswer: digits,
  };
}
