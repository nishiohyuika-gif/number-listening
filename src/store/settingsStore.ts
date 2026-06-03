import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Category, Difficulty, Language } from '../types/core';
import { ALL_CATEGORIES } from '../types/core';
import { makePersistStorage } from './persistence';

interface SettingsState {
  uiLang: Language;
  targetLang: Language;
  categories: Category[];
  difficulty: Difficulty;
  questionsPerSession: number;
  playbackRate: number;
  maxPlays: number; // 0 = unlimited
  setUiLang: (l: Language) => void;
  setTargetLang: (l: Language) => void;
  setCategories: (c: Category[]) => void;
  toggleCategory: (c: Category) => void;
  setDifficulty: (d: Difficulty) => void;
  setQuestionsPerSession: (n: number) => void;
  setPlaybackRate: (r: number) => void;
  setMaxPlays: (n: number) => void;
}

function detectDefaultUiLang(): Language {
  if (typeof navigator === 'undefined') return 'en';
  const code = (navigator.language || 'en').toLowerCase().split('-')[0]!;
  const supported: Language[] = ['ja', 'en', 'fr', 'zh', 'ko', 'de', 'it', 'es', 'nl'];
  return (supported.includes(code as Language) ? code : 'en') as Language;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      uiLang: detectDefaultUiLang(),
      targetLang: 'en',
      categories: [...ALL_CATEGORIES],
      difficulty: 'easy',
      questionsPerSession: 10,
      playbackRate: 1,
      maxPlays: 0,
      setUiLang: (uiLang) => set({ uiLang }),
      setTargetLang: (targetLang) => set({ targetLang }),
      setCategories: (categories) => set({ categories }),
      toggleCategory: (c) =>
        set((s) => ({
          categories: s.categories.includes(c)
            ? s.categories.filter((x) => x !== c)
            : [...s.categories, c],
        })),
      setDifficulty: (difficulty) => set({ difficulty }),
      setQuestionsPerSession: (questionsPerSession) => set({ questionsPerSession }),
      setPlaybackRate: (playbackRate) => set({ playbackRate }),
      setMaxPlays: (maxPlays) => set({ maxPlays }),
    }),
    {
      name: 'number-listening:settings',
      storage: makePersistStorage(),
    },
  ),
);
