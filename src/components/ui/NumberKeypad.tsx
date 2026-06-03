import type { RefObject, MouseEvent } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  /** Allowed extra characters (e.g., ".", ":", "-"). */
  allowExtra?: string[];
  maxLength?: number;
  /** If provided, keypad presses preserve focus on this input (for keyboard interleaving). */
  keepFocusRef?: RefObject<HTMLInputElement>;
}

export function NumberKeypad({
  value,
  onChange,
  allowExtra = [],
  maxLength = 20,
  keepFocusRef,
}: Props) {
  const append = (ch: string) => {
    if (value.length >= maxLength) return;
    onChange(value + ch);
  };
  const backspace = () => onChange(value.slice(0, -1));
  const clear = () => onChange('');

  // Prevent buttons from stealing focus from the input.
  const preserveFocus = (e: MouseEvent) => {
    if (keepFocusRef?.current) {
      e.preventDefault();
    }
  };

  const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="grid grid-cols-3 gap-2 select-none w-full max-w-sm mx-auto">
      {KEYS.map((k) => (
        <button
          key={k}
          type="button"
          onMouseDown={preserveFocus}
          onClick={() => append(k)}
          className="bg-white border border-slate-300 rounded-lg py-4 text-2xl font-medium text-slate-800 hover:bg-slate-100 active:bg-slate-200"
        >
          {k}
        </button>
      ))}
      <button
        type="button"
        onMouseDown={preserveFocus}
        onClick={clear}
        className="bg-slate-100 border border-slate-300 rounded-lg py-4 text-base font-medium text-slate-600 hover:bg-slate-200"
      >
        C
      </button>
      <button
        type="button"
        onMouseDown={preserveFocus}
        onClick={() => append('0')}
        className="bg-white border border-slate-300 rounded-lg py-4 text-2xl font-medium text-slate-800 hover:bg-slate-100 active:bg-slate-200"
      >
        0
      </button>
      <button
        type="button"
        onMouseDown={preserveFocus}
        onClick={backspace}
        className="bg-slate-100 border border-slate-300 rounded-lg py-4 text-base font-medium text-slate-600 hover:bg-slate-200"
        aria-label="backspace"
      >
        ⌫
      </button>
      {allowExtra.length > 0 && (
        <div className="col-span-3 flex gap-2">
          {allowExtra.map((ch) => (
            <button
              key={ch}
              type="button"
              onMouseDown={preserveFocus}
              onClick={() => append(ch)}
              className="flex-1 bg-white border border-slate-300 rounded-lg py-3 text-xl font-medium text-slate-700 hover:bg-slate-100"
            >
              {ch}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
