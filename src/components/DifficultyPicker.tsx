import type { Difficulty } from '../types/core';
import { ALL_DIFFICULTIES } from '../types/core';
import type { UIStrings } from '../i18n/strings';

interface Props {
  value: Difficulty;
  onChange: (d: Difficulty) => void;
  s: UIStrings;
}

export function DifficultyPicker({ value, onChange, s }: Props) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">{s.difficulty}</div>
      <div className="grid grid-cols-3 gap-2">
        {ALL_DIFFICULTIES.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => onChange(d)}
            className={`py-3 rounded-lg text-sm font-medium border transition-colors ${
              value === d
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {s.difficultyName[d]}
          </button>
        ))}
      </div>
    </div>
  );
}
