import type { NumberSpeech } from '../types/speech';
import type { ArithmeticOp, Currency, TimeSystem } from '../types/core';

const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen',
];

const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const SCALES: [number, string][] = [
  [1_000_000_000, 'billion'],
  [1_000_000, 'million'],
  [1_000, 'thousand'],
];

function under100(n: number): string {
  if (n < 20) return ONES[n]!;
  const t = Math.floor(n / 10);
  const o = n % 10;
  return o === 0 ? TENS[t]! : `${TENS[t]}-${ONES[o]}`;
}

function under1000(n: number): string {
  if (n < 100) return under100(n);
  const h = Math.floor(n / 100);
  const r = n % 100;
  const head = `${ONES[h]} hundred`;
  return r === 0 ? head : `${head} ${under100(r)}`;
}

export function cardinal(n: number): string {
  if (n === 0) return 'zero';
  if (n < 0) return `negative ${cardinal(-n)}`;
  const parts: string[] = [];
  let rest = n;
  for (const [unit, name] of SCALES) {
    if (rest >= unit) {
      const chunk = Math.floor(rest / unit);
      parts.push(`${under1000(chunk)} ${name}`);
      rest %= unit;
    }
  }
  if (rest > 0) parts.push(under1000(rest));
  return parts.join(' ');
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function ordinal(n: number): string {
  const word = cardinal(n);
  const last2 = n % 100;
  const last = n % 10;
  if (last2 >= 11 && last2 <= 13) return word + 'th';
  if (last === 1) return word.replace(/one$/, 'first');
  if (last === 2) return word.replace(/two$/, 'second');
  if (last === 3) return word.replace(/three$/, 'third');
  if (last === 5) return word.replace(/five$/, 'fifth');
  if (last === 8) return word.replace(/eight$/, 'eighth');
  if (last === 9) return word.replace(/nine$/, 'ninth');
  if (word.endsWith('y')) return word.slice(0, -1) + 'ieth';
  return word + 'th';
}

function time(hour: number, minute: number, system: TimeSystem): string {
  if (system === '24h') {
    const h = hour.toString().padStart(2, '0');
    const m = minute.toString().padStart(2, '0');
    const hWord = `${ONES[Number(h[0])]} ${ONES[Number(h[1])]}`;
    const mWord = `${ONES[Number(m[0])]} ${ONES[Number(m[1])]}`;
    return `${hWord} ${mWord} hours`;
  }
  const period = hour < 12 ? 'a.m.' : 'p.m.';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  if (minute === 0) return `${cardinal(h12)} o'clock ${period}`;
  if (minute < 10) return `${cardinal(h12)} oh ${cardinal(minute)} ${period}`;
  return `${cardinal(h12)} ${cardinal(minute)} ${period}`;
}

function money(amount: number, currency: Currency): string {
  const major = Math.floor(amount);
  const minor = Math.round((amount - major) * 100);
  const map: Record<Currency, [string, string, string, string]> = {
    USD: ['dollar', 'dollars', 'cent', 'cents'],
    GBP: ['pound', 'pounds', 'penny', 'pence'],
    EUR: ['euro', 'euros', 'cent', 'cents'],
    JPY: ['yen', 'yen', '', ''],
    KRW: ['won', 'won', '', ''],
    CNY: ['yuan', 'yuan', 'fen', 'fen'],
  };
  const [sg, pl, msg, mpl] = map[currency];
  const majorName = major === 1 ? sg : pl;
  if (!msg || minor === 0) {
    return `${cardinal(major)} ${majorName}`;
  }
  const minorName = minor === 1 ? msg : mpl;
  return `${cardinal(major)} ${majorName} and ${cardinal(minor)} ${minorName}`;
}

function date(year: number | undefined, month: number, day: number, dow?: number): string {
  const prefix = dow !== undefined ? `${WEEKDAYS[dow]}, ` : '';
  const main = `${MONTHS[month - 1]} ${ordinal(day)}`;
  const suffix = year !== undefined ? `, ${cardinal(year)}` : '';
  return prefix + main + suffix;
}

function phone(digits: string): string {
  const groups: string[] = [];
  const clean = digits.replace(/\D/g, '');
  // US-style: 3-3-4 if 10 digits, otherwise per digit groups of 4
  if (clean.length === 10) {
    groups.push(clean.slice(0, 3), clean.slice(3, 6), clean.slice(6));
  } else if (clean.length === 7) {
    groups.push(clean.slice(0, 3), clean.slice(3));
  } else {
    for (let i = 0; i < clean.length; i += 4) groups.push(clean.slice(i, i + 4));
  }
  return groups
    .map((g) => g.split('').map((d) => (d === '0' ? 'oh' : ONES[Number(d)])).join(' '))
    .join(', ');
}

function arithmetic(a: number, op: ArithmeticOp, b: number): string {
  const verb = { '+': 'plus', '-': 'minus', '*': 'times', '/': 'divided by' }[op];
  return `What is ${cardinal(a)} ${verb} ${cardinal(b)}?`;
}

const engine: NumberSpeech = { cardinal, time, money, date, phone, arithmetic };
export default engine;
