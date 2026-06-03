import type { Category } from '../types/core';
import { ALL_CATEGORIES } from '../types/core';
import type { UIStrings } from '../i18n/strings';

interface Props {
  selected: Category[];
  onToggle: (c: Category) => void;
  s: UIStrings;
}

export function CategoryPicker({ selected, onToggle, s }: Props) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">{s.categories}</div>
      <div className="flex flex-wrap gap-2">
        {ALL_CATEGORIES.map((c) => {
          const on = selected.includes(c);
          return (
            <button
              key={c}
              type="button"
              onClick={() => onToggle(c)}
              className={`px-3 py-2 rounded-full text-sm font-medium border transition-colors ${
                on
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {s.categoryName[c]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
