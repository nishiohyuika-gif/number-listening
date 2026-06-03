import { useSettings } from '../store/settingsStore';
import { getStrings } from '../i18n/strings';
import { LanguageSelector } from '../components/LanguageSelector';
import { CategoryPicker } from '../components/CategoryPicker';
import { DifficultyPicker } from '../components/DifficultyPicker';
import { Button } from '../components/ui/Button';
import { LANGUAGE_NATIVE_NAMES } from '../types/core';
import { useStats } from '../store/statsStore';

interface Props {
  onStart: () => void;
}

export function HomePage({ onStart }: Props) {
  const settings = useSettings();
  const stats = useStats();
  const s = getStrings(settings.uiLang);

  const recent = stats.history.slice(0, 3);
  const canStart = settings.categories.length > 0;

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">{s.appName}</h1>
      </header>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <LanguageSelector
            label={s.uiLanguage}
            value={settings.uiLang}
            onChange={settings.setUiLang}
          />
          <LanguageSelector
            label={s.targetLanguage}
            value={settings.targetLang}
            onChange={settings.setTargetLang}
          />
        </div>

        <CategoryPicker
          selected={settings.categories}
          onToggle={settings.toggleCategory}
          s={s}
        />

        <DifficultyPicker
          value={settings.difficulty}
          onChange={settings.setDifficulty}
          s={s}
        />

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
              {s.questionsCount}
            </div>
            <input
              type="number"
              min={1}
              max={50}
              value={settings.questionsPerSession}
              onChange={(e) =>
                settings.setQuestionsPerSession(
                  Math.min(50, Math.max(1, Number(e.target.value) || 1)),
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-3"
            />
          </label>
          <label className="block">
            <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
              {s.maxPlays} ({s.unlimited}=0)
            </div>
            <input
              type="number"
              min={0}
              max={10}
              value={settings.maxPlays}
              onChange={(e) =>
                settings.setMaxPlays(Math.max(0, Number(e.target.value) || 0))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-3"
            />
          </label>
        </div>
      </section>

      <Button fullWidth disabled={!canStart} onClick={onStart}>
        {s.start}
      </Button>

      {recent.length > 0 && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-600 mb-3">
            {s.score}
          </h2>
          <ul className="space-y-2">
            {recent.map((r) => (
              <li key={r.id} className="flex justify-between text-sm">
                <span className="text-slate-600">
                  {LANGUAGE_NATIVE_NAMES[r.targetLang]} · {r.totalQuestions}q
                </span>
                <span className="font-mono font-semibold">
                  {r.correctAnswers}/{r.totalQuestions}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
