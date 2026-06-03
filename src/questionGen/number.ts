import type { Difficulty, Language, Question } from '../types/core';
import { getEngine } from '../numberSpeech';
import { randInt } from '../utils/random';
import { uid } from '../utils/id';

function rangeFor(difficulty: Difficulty): [number, number] {
  switch (difficulty) {
    case 'easy':
      return [1, 999];
    case 'medium':
      return [1000, 999_999];
    case 'hard':
      return [1_000_000, 9_999_999];
  }
}

export function genNumber(lang: Language, difficulty: Difficulty): Question {
  const [min, max] = rangeFor(difficulty);
  const n = randInt(min, max);
  const engine = getEngine(lang);
  return {
    id: uid(),
    category: 'number',
    targetLang: lang,
    difficulty,
    value: { kind: 'number', n },
    speechText: engine.cardinal(n),
    canonicalAnswer: String(n),
    displayAnswer: n.toLocaleString(),
  };
}
