import type { Language } from '../types/core';
import { ALL_LANGUAGES, LANGUAGE_NATIVE_NAMES } from '../types/core';

interface Props {
  label: string;
  value: Language;
  onChange: (l: Language) => void;
}

export function LanguageSelector({ label, value, onChange }: Props) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Language)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-base"
      >
        {ALL_LANGUAGES.map((l) => (
          <option key={l} value={l}>
            {LANGUAGE_NATIVE_NAMES[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
