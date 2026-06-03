import type { Currency, Difficulty, Language, Question } from '../types/core';
import { getEngine } from '../numberSpeech';
import { randInt } from '../utils/random';
import { uid } from '../utils/id';
import { CURRENCY_BY_LANGUAGE } from '../types/core';
import { CURRENCY_INFO, formatMoneyDisplay } from '../utils/currency';

function rangeFor(difficulty: Difficulty, currency: Currency): { min: number; max: number; useCents: boolean } {
  const info = CURRENCY_INFO[currency];
  switch (difficulty) {
    case 'easy':
      return { min: 1, max: 99, useCents: false };
    case 'medium':
      return { min: 100, max: 9_999, useCents: info.hasFraction };
    case 'hard':
      return { min: 10_000, max: 999_999, useCents: info.hasFraction };
  }
}

export function genMoney(lang: Language, difficulty: Difficulty): Question {
  const currency = CURRENCY_BY_LANGUAGE[lang];
  const { min, max, useCents } = rangeFor(difficulty, currency);
  const major = randInt(min, max);
  const minor = useCents ? randInt(0, 99) : 0;
  const amount = major + minor / 100;
  const engine = getEngine(lang);
  return {
    id: uid(),
    category: 'money',
    targetLang: lang,
    difficulty,
    value: { kind: 'money', amount, currency },
    speechText: engine.money(amount, currency),
    canonicalAnswer: useCents ? amount.toFixed(2) : String(major),
    displayAnswer: formatMoneyDisplay(amount, currency),
  };
}
