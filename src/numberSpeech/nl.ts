import type { NumberSpeech } from '../types/speech';
import type { ArithmeticOp, Currency, TimeSystem } from '../types/core';

const ONES = ['nul', 'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen'];
const TEENS = ['tien', 'elf', 'twaalf', 'dertien', 'veertien', 'vijftien', 'zestien', 'zeventien', 'achttien', 'negentien'];
const TENS = ['', '', 'twintig', 'dertig', 'veertig', 'vijftig', 'zestig', 'zeventig', 'tachtig', 'negentig'];

// Connector "en" requires ë when preceded by two e's together: "tweeëntwintig", "drieëntwintig"
function joinUnitsTens(unitsWord: string, tensWord: string): string {
  if (unitsWord.endsWith('e')) return `${unitsWord}ën${tensWord}`;
  return `${unitsWord}en${tensWord}`;
}

function under100(n: number): string {
  if (n < 10) return ONES[n]!;
  if (n < 20) return TEENS[n - 10]!;
  const t = Math.floor(n / 10);
  const o = n % 10;
  if (o === 0) return TENS[t]!;
  return joinUnitsTens(ONES[o]!, TENS[t]!);
}

function under1000(n: number): string {
  if (n < 100) return under100(n);
  const h = Math.floor(n / 100);
  const r = n % 100;
  const head = h === 1 ? 'honderd' : `${ONES[h]}honderd`;
  return r === 0 ? head : head + under100(r);
}

function under1m(n: number): string {
  if (n < 1000) return under1000(n);
  const t = Math.floor(n / 1000);
  const r = n % 1000;
  const head = t === 1 ? 'duizend' : `${under1000(t)}duizend`;
  return r === 0 ? head : head + under1000(r);
}

export function cardinal(n: number): string {
  if (n === 0) return 'nul';
  if (n < 0) return `min ${cardinal(-n)}`;
  if (n < 1_000_000) return under1m(n);
  if (n < 1_000_000_000) {
    const m = Math.floor(n / 1_000_000);
    const rest = n % 1_000_000;
    const head = m === 1 ? 'een miljoen' : `${under1m(m)} miljoen`;
    return rest === 0 ? head : `${head} ${under1m(rest)}`;
  }
  const mrd = Math.floor(n / 1_000_000_000);
  const rest = n % 1_000_000_000;
  const head = mrd === 1 ? 'een miljard' : `${under1m(mrd)} miljard`;
  return rest === 0 ? head : `${head} ${cardinal(rest)}`;
}

function time(hour: number, minute: number, system: TimeSystem): string {
  const h = system === '12h' ? (hour % 12 === 0 ? 12 : hour % 12) : hour;
  const hWord = under100(h);
  if (minute === 0) return `${hWord} uur`;
  return `${hWord} uur ${under100(minute)}`;
}

function money(amount: number, currency: Currency): string {
  const major = Math.floor(amount);
  const minor = Math.round((amount - major) * 100);
  const unit: Record<Currency, [string, string]> = {
    EUR: ['euro', 'cent'],
    USD: ['dollar', 'cent'],
    GBP: ['pond', 'penny'],
    JPY: ['yen', ''],
    KRW: ['won', ''],
    CNY: ['yuan', 'fen'],
  };
  const [maj, min] = unit[currency];
  if (!min || minor === 0) return `${cardinal(major)} ${maj}`;
  return `${cardinal(major)} ${maj} ${cardinal(minor)} ${min}`;
}

const MONTHS = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
const WEEKDAYS = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];

function date(year: number | undefined, month: number, day: number, dow?: number): string {
  const parts: string[] = [];
  if (dow !== undefined) parts.push(WEEKDAYS[dow]!);
  parts.push(`${cardinal(day)} ${MONTHS[month - 1]}`);
  if (year !== undefined) parts.push(cardinal(year));
  return parts.join(' ');
}

function phone(digits: string): string {
  const clean = digits.replace(/\D/g, '');
  // Dutch typical: 06 12 34 56 78 — 2-digit area code separately, rest in pairs
  const groups: string[] = [];
  if (clean.length === 0) return '';
  // Read first 2 (or first 3 if odd-leading number) as individual digits, then pairs
  const headLen = clean.length % 2 === 1 ? 1 : 2;
  const headDigits = clean.slice(0, headLen);
  groups.push(headDigits.split('').map((d) => ONES[Number(d)]).join(' '));
  for (let i = headLen; i < clean.length; i += 2) {
    groups.push(under100(Number(clean.slice(i, i + 2))));
  }
  return groups.join(', ');
}

function arithmetic(a: number, op: ArithmeticOp, b: number): string {
  const verb = { '+': 'plus', '-': 'min', '*': 'keer', '/': 'gedeeld door' }[op];
  return `Hoeveel is ${cardinal(a)} ${verb} ${cardinal(b)}?`;
}

const engine: NumberSpeech = { cardinal, time, money, date, phone, arithmetic };
export default engine;
