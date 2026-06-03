import type { UIStrings } from '../i18n/strings';

interface Props {
  onPlay: () => void;
  rate: number;
  onRateChange: (r: number) => void;
  playCount: number;
  maxPlays: number;
  speaking: boolean;
  voiceMissing: boolean;
  s: UIStrings;
}

export function PlayControls({
  onPlay, rate, onRateChange, playCount, maxPlays, speaking, voiceMissing, s,
}: Props) {
  const reached = maxPlays > 0 && playCount >= maxPlays;
  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={reached}
        onClick={onPlay}
        className="w-full flex items-center justify-center gap-3 bg-sky-600 text-white py-5 rounded-xl font-semibold text-lg hover:bg-sky-500 active:bg-sky-700 disabled:bg-slate-300"
      >
        <span className="text-2xl" aria-hidden="true">{speaking ? '⏵' : '🔊'}</span>
        <span>{playCount === 0 ? s.play : s.replay}</span>
      </button>
      {voiceMissing && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
          {s.voiceUnavailable}
        </p>
      )}
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <label className="flex-1">
          <div className="flex justify-between text-xs">
            <span>{s.playbackRate}</span>
            <span>{rate.toFixed(2)}×</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={1.5}
            step={0.05}
            value={rate}
            onChange={(e) => onRateChange(Number(e.target.value))}
            className="w-full accent-sky-600"
          />
        </label>
        <div className="text-xs text-right">
          <div>{s.playCount}</div>
          <div className="text-base font-semibold text-slate-800">
            {playCount}{maxPlays > 0 ? ` / ${maxPlays}` : ''}
          </div>
        </div>
      </div>
      {reached && (
        <p className="text-xs text-rose-600 text-center">{s.reachedMaxPlays}</p>
      )}
    </div>
  );
}
