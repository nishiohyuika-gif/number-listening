import type { ArithmeticOp, Difficulty, Language, Question } from '../types/core';
import { getEngine } from '../numberSpeech';
import { randInt, pick } from '../utils/random';
import { uid } from '../utils/id';

function paramsFor(difficulty: Difficulty): { ops: ArithmeticOp[]; max: number } {
  switch (difficulty) {
    case 'easy':
      return { ops: ['+', '-'], max: 20 };
    case 'medium':
      return { ops: ['+', '-', '*'], max: 50 };
    case 'hard':
      return { ops: ['+', '-', '*', '/'], max: 99 };
  }
}

function compute(a: number, op: ArithmeticOp, b: number): number {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return a / b;
  }
}

export function genArithmetic(lang: Language, difficulty: Difficulty): Question {
  const { ops, max } = paramsFor(difficulty);
  const op = pick(ops);
  let a = randInt(1, max);
  let b = randInt(1, max);
  // Avoid negative results for subtraction in easy/medium
  if (op === '-' && b > a) [a, b] = [b, a];
  // For division: produce integer result
  if (op === '/') {
    b = randInt(2, Math.max(2, Math.floor(max / 4)));
    const result = randInt(1, Math.floor(max / b));
    a = result * b;
  }
  const result = compute(a, op, b);
  const engine = getEngine(lang);
  const opSym = { '+': '+', '-': '-', '*': '×', '/': '÷' }[op];
  return {
    id: uid(),
    category: 'arithmetic',
    targetLang: lang,
    difficulty,
    value: { kind: 'arithmetic', a, op, b, result },
    speechText: engine.arithmetic(a, op, b),
    canonicalAnswer: String(result),
    displayAnswer: `${a} ${opSym} ${b} = ${result}`,
  };
}
