import type { Difficulty, Language, Question } from '../types/core';
import { getEngine } from '../numberSpeech';
import { randInt } from '../utils/random';
import { uid } from '../utils/id';

function paramsFor(difficulty: Difficulty): { withYear: boolean; withDow: boolean } {
  switch (difficulty) {
    case 'easy':
      return { withYear: false, withDow: false };
    case 'medium':
      return { withYear: false, withDow: true };
    case 'hard':
      return { withYear: true, withDow: true };
  }
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function genDate(lang: Language, difficulty: Difficulty): Question {
  const { withYear, withDow } = paramsFor(difficulty);
  const year = randInt(2000, 2030);
  const month = randInt(1, 12);
  const day = randInt(1, daysInMonth(year, month));
  const dow = new Date(year, month - 1, day).getDay();
  const engine = getEngine(lang);
  const yyyy = withYear ? year : undefined;
  const dd = day.toString().padStart(2, '0');
  const mm = month.toString().padStart(2, '0');
  return {
    id: uid(),
    category: 'date',
    targetLang: lang,
    difficulty,
    value: { kind: 'date', year: yyyy, month, day, dow: withDow ? dow : undefined },
    speechText: engine.date(yyyy, month, day, withDow ? dow : undefined),
    canonicalAnswer: withYear ? `${year}-${mm}-${dd}` : `${mm}-${dd}`,
    displayAnswer: withYear ? `${year}/${mm}/${dd}` : `${mm}/${dd}`,
  };
}
