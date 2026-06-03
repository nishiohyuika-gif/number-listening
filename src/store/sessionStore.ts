import { create } from 'zustand';
import type {
  Answer,
  Category,
  Difficulty,
  Language,
  Question,
  Session,
} from '../types/core';
import { generateBatch } from '../questionGen';
import { uid } from '../utils/id';

interface SessionState {
  current: Session | null;
  currentIndex: number;
  startedAtMs: number;
  startSession: (opts: {
    uiLang: Language;
    targetLang: Language;
    categories: Category[];
    difficulty: Difficulty;
    count: number;
  }) => void;
  submitAnswer: (userInput: string, playCount: number) => Answer;
  next: () => void;
  finish: () => void;
  reset: () => void;
  /** Build a review session from the given mistakes (regenerates new questions of same kind). */
  startReviewFrom: (questions: Question[]) => void;
}

function judge(q: Question, input: string): boolean {
  const normalize = (s: string) => s.trim().replace(/\s+/g, '');
  return normalize(input) === normalize(q.canonicalAnswer);
}

export const useSession = create<SessionState>((set, get) => ({
  current: null,
  currentIndex: 0,
  startedAtMs: 0,
  startSession: ({ uiLang, targetLang, categories, difficulty, count }) => {
    const cats = categories.length > 0 ? categories : (['number'] as Category[]);
    const questions = generateBatch(cats, targetLang, difficulty, count);
    set({
      current: {
        id: uid(),
        startedAt: Date.now(),
        uiLang,
        targetLang,
        categories: cats,
        difficulty,
        questions,
        answers: [],
      },
      currentIndex: 0,
      startedAtMs: Date.now(),
    });
  },
  submitAnswer: (userInput, playCount) => {
    const { current, currentIndex, startedAtMs } = get();
    if (!current) throw new Error('no active session');
    const q = current.questions[currentIndex]!;
    const ans: Answer = {
      questionId: q.id,
      userInput,
      correct: judge(q, userInput),
      playCount,
      elapsedMs: Date.now() - startedAtMs,
      timestamp: Date.now(),
    };
    set({
      current: { ...current, answers: [...current.answers, ans] },
    });
    return ans;
  },
  next: () => {
    const { current, currentIndex } = get();
    if (!current) return;
    if (currentIndex + 1 >= current.questions.length) {
      set({
        current: { ...current, endedAt: Date.now() },
      });
    } else {
      set({ currentIndex: currentIndex + 1, startedAtMs: Date.now() });
    }
  },
  finish: () => {
    const { current } = get();
    if (!current) return;
    set({ current: { ...current, endedAt: Date.now() } });
  },
  reset: () => set({ current: null, currentIndex: 0, startedAtMs: 0 }),
  startReviewFrom: (questions) => {
    if (questions.length === 0) return;
    const { current } = get();
    if (!current) return;
    set({
      current: {
        id: uid(),
        startedAt: Date.now(),
        uiLang: current.uiLang,
        targetLang: current.targetLang,
        categories: current.categories,
        difficulty: current.difficulty,
        questions,
        answers: [],
      },
      currentIndex: 0,
      startedAtMs: Date.now(),
    });
  },
}));
