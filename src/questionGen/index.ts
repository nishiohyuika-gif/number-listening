import type {
  Category,
  Difficulty,
  Language,
  Question,
} from '../types/core';
import { genNumber } from './number';
import { genArithmetic } from './arithmetic';
import { genTime } from './time';
import { genMoney } from './money';
import { genDate } from './date';
import { genPhone } from './phone';

export function generate(
  category: Category,
  lang: Language,
  difficulty: Difficulty,
): Question {
  switch (category) {
    case 'number':
      return genNumber(lang, difficulty);
    case 'arithmetic':
      return genArithmetic(lang, difficulty);
    case 'time':
      return genTime(lang, difficulty);
    case 'money':
      return genMoney(lang, difficulty);
    case 'date':
      return genDate(lang, difficulty);
    case 'phone':
      return genPhone(lang, difficulty);
  }
}

export function generateBatch(
  categories: Category[],
  lang: Language,
  difficulty: Difficulty,
  count: number,
): Question[] {
  const out: Question[] = [];
  for (let i = 0; i < count; i++) {
    const c = categories[i % categories.length]!;
    out.push(generate(c, lang, difficulty));
  }
  return out;
}
