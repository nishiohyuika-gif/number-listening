import type { NumberSpeech } from '../types/speech';
import type { ArithmeticOp, Currency, TimeSystem } from '../types/core';

const ONES = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'];
// Compound form of 1: "ein" instead of "eins"
const ONES_COMP = ['', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'];
const TEENS = ['zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
const TENS = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];

function under100(n: number): string {
  if (n < 10) return ONES[n]!;
  if (n < 20) return TEENS[n - 10]!;
  const t = Math.floor(n / 10);
  const o = n % 10;
  if (o === 0) return TENS[t]!;
  return `${ONES_COMP[o]}und${TENS[t]}`;
}

function under1000(n: number): string {
  if (n < 100) return under100(n);
  const h = Math.floor(n / 100);
  const r = n % 100;
  const head = `${ONES_COMP[h]}hundert`;
  return r === 0 ? head : head + under100(r);
}

function compoundForm(s: string): string {
  // Replace trailing "eins" with "ein" for use before "tausend"/"hundert" etc.
  if (s === 'eins') return 'ein';
  return s.replace(/eins$/, 'ein');
}

function under1m(n: number): string {
  if (n < 1000) return under1000(n);
  const t = Math.floor(n / 1000);
  const r = n % 1000;
  const head = `${compoundForm(under1000(t))}tausend`;
  return r === 0 ? head : head + under1000(r);
}

export function cardinal(n: number): string {
  if (n === 0) return 'null';
  if (n < 0) return `minus ${cardinal(-n)}`;
  if (n < 1_000_000) return under1m(n);
  if (n < 1_000_000_000) {
    const m = Math.floor(n / 1_000_000);
    const rest = n % 1_000_000;
    const mWord = m === 1 ? 'eine Million' : `${under1m(m)} Millionen`;
    return rest === 0 ? mWord : `${mWord} ${under1m(rest)}`;
  }
  const mrd = Math.floor(n / 1_000_000_000);
  const rest = n % 1_000_000_000;
  const head = mrd === 1 ? 'eine Milliarde' : `${under1m(mrd)} Milliarden`;
  return rest === 0 ? head : `${head} ${cardinal(rest)}`;
}

function ordinal(n: number): string {
  const SPECIAL: Record<number, string> = {
    1: 'erste', 3: 'dritte', 7: 'siebte', 8: 'achte',
  };
  if (SPECIAL[n]) return SPECIAL[n]!;
  if (n < 20) return cardinal(n) + 'te';
  return cardinal(n) + 'ste';
}

function time(hour: number, minute: number, system: TimeSystem): string {
  const h = system === '12h' ? (hour % 12 === 0 ? 12 : hour % 12) : hour;
  const period = system === '12h' ? (hour < 12 ? ' vormittags' : ' nachmittags') : '';
  const hWord = under100(h);
  if (minute === 0) return `${hWord} Uhr${period}`;
  return `${hWord} Uhr ${under100(minute)}${period}`;
}

function money(amount: number, currency: Currency): string {
  const major = Math.floor(amount);
  const minor = Math.round((amount - major) * 100);
  const unit: Record<Currency, [string, string]> = {
    EUR: ['Euro', 'Cent'],
    USD: ['Dollar', 'Cent'],
    GBP: ['Pfund', 'Pence'],
    JPY: ['Yen', ''],
    KRW: ['Won', ''],
    CNY: ['Yuan', 'Fen'],
  };
  const [maj, min] = unit[currency];
  if (!min || minor === 0) return `${cardinal(major)} ${maj}`;
  return `${cardinal(major)} ${maj} ${cardinal(minor)} ${min}`;
}

const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const WEEKDAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

function date(year: number | undefined, month: number, day: number, dow?: number): string {
  const parts: string[] = [];
  if (dow !== undefined) parts.push(`${WEEKDAYS[dow]},`);
  parts.push(`der ${ordinal(day)} ${MONTHS[month - 1]}`);
  if (year !== undefined) parts.push(cardinal(year));
  return parts.join(' ');
}

function phone(digits: string): string {
  const clean = digits.replace(/\D/g, '');
  const groups: string[] = [];
  let i = 0;
  // First 3-4 digits as area code read individually, rest in pairs
  const head = Math.min(clean.length >= 10 ? 4 : 3, clean.length);
  groups.push(clean.slice(0, head).split('').map((d) => ONES[Number(d)]).join(' '));
  i = head;
  while (i < clean.length) {
    const pair = clean.slice(i, i + 2);
    if (pair.length === 2) groups.push(under100(Number(pair)));
    else groups.push(ONES[Number(pair)]!);
    i += 2;
  }
  return groups.join(', ');
}

function arithmetic(a: number, op: ArithmeticOp, b: number): string {
  const verb = { '+': 'plus', '-': 'minus', '*': 'mal', '/': 'geteilt durch' }[op];
  return `Wie viel ist ${cardinal(a)} ${verb} ${cardinal(b)}?`;
}

const engine: NumberSpeech = { cardinal, time, money, date, phone, arithmetic };
export default engine;
