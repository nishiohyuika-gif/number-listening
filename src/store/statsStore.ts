import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Category, Language, Session } from '../types/core';
import { makePersistStorage } from './persistence';

export interface SessionRecord {
  id: string;
  endedAt: number;
  uiLang: Language;
  targetLang: Language;
  difficulty: string;
  totalQuestions: number;
  correctAnswers: number;
  categoryBreakdown: Partial<Record<Category, { total: number; correct: number }>>;
}

interface StatsState {
  history: SessionRecord[];
  record: (session: Session) => void;
  clear: () => void;
}

function summarize(session: Session): SessionRecord {
  const breakdown: Partial<Record<Category, { total: number; correct: number }>> = {};
  for (let i = 0; i < session.questions.length; i++) {
    const q = session.questions[i]!;
    const a = session.answers[i];
    const slot = breakdown[q.category] ?? { total: 0, correct: 0 };
    slot.total++;
    if (a?.correct) slot.correct++;
    breakdown[q.category] = slot;
  }
  return {
    id: session.id,
    endedAt: session.endedAt ?? Date.now(),
    uiLang: session.uiLang,
    targetLang: session.targetLang,
    difficulty: session.difficulty,
    totalQuestions: session.questions.length,
    correctAnswers: session.answers.filter((a) => a.correct).length,
    categoryBreakdown: breakdown,
  };
}

export const useStats = create<StatsState>()(
  persist(
    (set) => ({
      history: [],
      record: (session) =>
        set((s) => ({ history: [summarize(session), ...s.history].slice(0, 100) })),
      clear: () => set({ history: [] }),
    }),
    {
      name: 'number-listening:stats',
      storage: makePersistStorage(),
    },
  ),
);
