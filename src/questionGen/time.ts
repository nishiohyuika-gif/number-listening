import type { Difficulty, Language, Question, TimeSystem } from '../types/core';
import { getEngine } from '../numberSpeech';
import { randInt, pick } from '../utils/random';
import { uid } from '../utils/id';

function paramsFor(difficulty: Difficulty): { minuteSet: number[]; systems: TimeSystem[] } {
  switch (difficulty) {
    case 'easy':
      return { minuteSet: [0, 15, 30, 45], systems: ['12h'] };
    case 'medium':
      return { minuteSet: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55], systems: ['12h', '24h'] };
    case 'hard':
      return { minuteSet: Array.from({ length: 60 }, (_, i) => i), systems: ['12h', '24h'] };
  }
}

export function genTime(lang: Language, difficulty: Difficulty): Question {
  const { minuteSet, systems } = paramsFor(difficulty);
  const system = pick(systems);
  const hour = system === '24h' ? randInt(0, 23) : randInt(1, 12);
  const minute = pick(minuteSet);
  const engine = getEngine(lang);
  const hh = hour.toString().padStart(2, '0');
  const mm = minute.toString().padStart(2, '0');
  return {
    id: uid(),
    category: 'time',
    targetLang: lang,
    difficulty,
    value: { kind: 'time', hour, minute, system },
    speechText: engine.time(hour, minute, system),
    canonicalAnswer: `${hh}:${mm}`,
    displayAnswer: `${hh}:${mm}${system === '12h' ? (hour < 12 ? ' AM' : ' PM') : ''}`,
  };
}
