import { useState, useEffect, useRef } from 'react';
import type { Question } from '../types/core';
import { NumberKeypad } from './ui/NumberKeypad';

interface Props {
  question: Question;
  onSubmit: (value: string) => void;
  disabled?: boolean;
  submitLabel: string;
}

export function AnswerInput({ question, onSubmit, disabled, submitLabel }: Props) {
  const [val, setVal] = useState('');
  const [hh, setHh] = useState('');
  const [mm, setMm] = useState('');
  const [yyyy, setYyyy] = useState('');
  const [mon, setMon] = useState('');
  const [day, setDay] = useState('');

  const numericInputRef = useRef<HTMLInputElement>(null);
  const hhRef = useRef<HTMLInputElement>(null);
  const mmRef = useRef<HTMLInputElement>(null);
  const yyyyRef = useRef<HTMLInputElement>(null);
  const monRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setVal('');
    setHh('');
    setMm('');
    setYyyy('');
    setMon('');
    setDay('');
    // Focus first field of the new question's input
    setTimeout(() => {
      if (question.category === 'time') hhRef.current?.focus();
      else if (question.category === 'date') {
        const hasYear = question.value.kind === 'date' && question.value.year !== undefined;
        (hasYear ? yyyyRef : monRef).current?.focus();
      } else {
        numericInputRef.current?.focus();
      }
    }, 0);
  }, [question.id, question.category, question.value]);

  if (question.category === 'time') {
    const ok = hh.length > 0 && mm.length > 0;
    const submit = () => ok && onSubmit(`${hh.padStart(2, '0')}:${mm.padStart(2, '0')}`);
    const onHhChange = (v: string) => {
      const clean = v.replace(/\D/g, '').slice(0, 2);
      setHh(clean);
      if (clean.length === 2) mmRef.current?.focus();
    };
    const onMmChange = (v: string) => {
      setMm(v.replace(/\D/g, '').slice(0, 2));
    };
    const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submit();
      }
    };
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 text-4xl font-mono">
          <input
            ref={hhRef}
            inputMode="numeric"
            pattern="[0-9]*"
            value={hh}
            onChange={(e) => onHhChange(e.target.value)}
            onKeyDown={onKey}
            className="w-20 text-center rounded-lg border border-slate-300 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="HH"
            aria-label="hour"
          />
          <span>:</span>
          <input
            ref={mmRef}
            inputMode="numeric"
            pattern="[0-9]*"
            value={mm}
            onChange={(e) => onMmChange(e.target.value)}
            onKeyDown={onKey}
            className="w-20 text-center rounded-lg border border-slate-300 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="MM"
            aria-label="minute"
          />
        </div>
        <button
          type="button"
          disabled={!ok || disabled}
          onClick={submit}
          className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium disabled:bg-slate-300"
        >
          {submitLabel}
        </button>
      </div>
    );
  }

  if (question.category === 'date') {
    const hasYear = question.value.kind === 'date' && question.value.year !== undefined;
    const ok = mon.length > 0 && day.length > 0 && (!hasYear || yyyy.length === 4);
    const submit = () => {
      if (!ok) return;
      const dd = day.padStart(2, '0');
      const mmStr = mon.padStart(2, '0');
      onSubmit(hasYear ? `${yyyy}-${mmStr}-${dd}` : `${mmStr}-${dd}`);
    };
    const onYyyyChange = (v: string) => {
      const clean = v.replace(/\D/g, '').slice(0, 4);
      setYyyy(clean);
      if (clean.length === 4) monRef.current?.focus();
    };
    const onMonChange = (v: string) => {
      const clean = v.replace(/\D/g, '').slice(0, 2);
      setMon(clean);
      if (clean.length === 2) dayRef.current?.focus();
    };
    const onDayChange = (v: string) => {
      setDay(v.replace(/\D/g, '').slice(0, 2));
    };
    const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submit();
      }
    };
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 text-3xl font-mono flex-wrap">
          {hasYear && (
            <>
              <input
                ref={yyyyRef}
                inputMode="numeric"
                pattern="[0-9]*"
                value={yyyy}
                onChange={(e) => onYyyyChange(e.target.value)}
                onKeyDown={onKey}
                className="w-28 text-center rounded-lg border border-slate-300 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="YYYY"
                aria-label="year"
              />
              <span>-</span>
            </>
          )}
          <input
            ref={monRef}
            inputMode="numeric"
            pattern="[0-9]*"
            value={mon}
            onChange={(e) => onMonChange(e.target.value)}
            onKeyDown={onKey}
            className="w-20 text-center rounded-lg border border-slate-300 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="MM"
            aria-label="month"
          />
          <span>-</span>
          <input
            ref={dayRef}
            inputMode="numeric"
            pattern="[0-9]*"
            value={day}
            onChange={(e) => onDayChange(e.target.value)}
            onKeyDown={onKey}
            className="w-20 text-center rounded-lg border border-slate-300 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="DD"
            aria-label="day"
          />
        </div>
        <button
          type="button"
          disabled={!ok || disabled}
          onClick={submit}
          className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium disabled:bg-slate-300"
        >
          {submitLabel}
        </button>
      </div>
    );
  }

  // Numeric input (number, arithmetic, money, phone)
  const isMoney = question.category === 'money';
  const allowExtra = isMoney ? ['.'] : [];
  const sanitize = (v: string) => v.replace(isMoney ? /[^0-9.]/g : /\D/g, '').slice(0, 20);
  const submitNumeric = () => {
    if (!val) return;
    onSubmit(val);
  };
  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitNumeric();
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={numericInputRef}
        type="text"
        inputMode={isMoney ? 'decimal' : 'numeric'}
        pattern={isMoney ? '[0-9.]*' : '[0-9]*'}
        value={val}
        onChange={(e) => setVal(sanitize(e.target.value))}
        onKeyDown={onInputKey}
        placeholder="—"
        aria-label="answer"
        className="w-full bg-white rounded-lg border-2 border-slate-300 px-4 py-3 text-3xl font-mono text-right break-all focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
      />
      <NumberKeypad value={val} onChange={setVal} allowExtra={allowExtra} keepFocusRef={numericInputRef} />
      <button
        type="button"
        disabled={!val || disabled}
        onClick={submitNumeric}
        className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium disabled:bg-slate-300"
      >
        {submitLabel}
      </button>
    </div>
  );
}
