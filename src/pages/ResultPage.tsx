import { useEffect, useMemo } from 'react';
import { useSession } from '../store/sessionStore';
import { useSettings } from '../store/settingsStore';
import { useStats } from '../store/statsStore';
import { getStrings } from '../i18n/strings';
import { Button } from '../components/ui/Button';
import type { Category, Question } from '../types/core';
import { generate } from '../questionGen';

interface Props {
  onHome: () => void;
  onReviewStart: (mistakes: Question[]) => void;
}

export function ResultPage({ onHome, onReviewStart }: Props) {
  const session = useSession();
  const settings = useSettings();
  const stats = useStats();
  const s = getStrings(settings.uiLang);

  const cur = session.current;

  // Record this session into history exactly once
  useEffect(() => {
    if (cur && cur.endedAt) {
      stats.record(cur);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur?.id]);

  const stats2 = useMemo(() => {
    if (!cur) return null;
    const total = cur.questions.length;
    const correct = cur.answers.filter((a) => a.correct).length;
    const breakdown: Partial<Record<Category, { total: number; correct: number }>> = {};
    for (let i = 0; i < cur.questions.length; i++) {
      const q = cur.questions[i]!;
      const a = cur.answers[i];
      const slot = breakdown[q.category] ?? { total: 0, correct: 0 };
      slot.total++;
      if (a?.correct) slot.correct++;
      breakdown[q.category] = slot;
    }
    return { total, correct, breakdown };
  }, [cur]);

  if (!cur || !stats2) {
    return (
      <div className="max-w-xl mx-auto px-4 py-6">
        <p className="text-center text-slate-500">No session.</p>
        <Button fullWidth onClick={onHome}>{s.back}</Button>
      </div>
    );
  }

  const mistakes = cur.answers
    .map((a, i) => (a.correct ? null : cur.questions[i]!))
    .filter((q): q is Question => q !== null);

  const handleReview = () => {
    // Regenerate fresh questions of the same kind to avoid memorization of the same numbers
    const fresh = mistakes.map((q) =>
      generate(q.category, q.targetLang, q.difficulty),
    );
    onReviewStart(fresh);
  };

  const pct = stats2.total > 0 ? Math.round((stats2.correct / stats2.total) * 100) : 0;

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-5">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">{s.result}</h1>
      </header>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
        <div className="text-6xl font-bold text-slate-900">{pct}%</div>
        <div className="text-slate-500 mt-2">
          {stats2.correct} / {stats2.total}
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-600 mb-3">{s.categories}</h2>
        <ul className="space-y-2">
          {(Object.entries(stats2.breakdown) as [Category, { total: number; correct: number }][]).map(
            ([cat, v]) => (
              <li key={cat} className="flex justify-between text-sm">
                <span className="text-slate-700">{s.categoryName[cat]}</span>
                <span className="font-mono">
                  {v.correct} / {v.total}
                </span>
              </li>
            ),
          )}
        </ul>
      </section>

      <div className="space-y-2">
        {mistakes.length > 0 ? (
          <Button fullWidth onClick={handleReview}>
            {s.review} ({mistakes.length})
          </Button>
        ) : (
          <p className="text-center text-emerald-700 font-semibold">{s.noMistakes}</p>
        )}
        <Button fullWidth variant="secondary" onClick={onHome}>
          {s.back}
        </Button>
      </div>
    </div>
  );
}
