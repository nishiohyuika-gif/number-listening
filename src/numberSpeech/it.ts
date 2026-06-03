import type { NumberSpeech } from '../types/speech';
import type { ArithmeticOp, Currency, TimeSystem } from '../types/core';

const ONES = ['zero', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove'];
const TEENS = ['dieci', 'undici', 'dodici', 'tredici', 'quattordici', 'quindici', 'sedici', 'diciassette', 'diciotto', 'diciannove'];
const TENS = ['', '', 'venti', 'trenta', 'quaranta', 'cinquanta', 'sessanta', 'settanta', 'ottanta', 'novanta'];

function under100(n: number): string {
  if (n < 10) return ONES[n]!;
  if (n < 20) return TEENS[n - 10]!;
  const t = Math.floor(n / 10);
  const o = n % 10;
  let tWord = TENS[t]!;
  if (o === 0) return tWord;
  let oWord = ONES[o]!;
  // Vowel elision before "uno"/"otto": drop final vowel of tens word
  if (o === 1 || o === 8) tWord = tWord.slice(0, -1);
  // Accent on "tre" when ending a compound: "ventitré"
  if (o === 3) oWord = 'tré';
  return tWord + oWord;
}

function under1000(n: number): string {
  if (n < 100) return under100(n);
  const h = Math.floor(n / 100);
  const r = n % 100;
  const head = h === 1 ? 'cento' : `${ONES[h]}cento`;
  return r === 0 ? head : head + under100(r);
}

function under1m(n: number): string {
  if (n < 1000) return under1000(n);
  const t = Math.floor(n / 1000);
  const r = n % 1000;
  const head = t === 1 ? 'mille' : `${under1000(t)}mila`;
  return r === 0 ? head : head + under1000(r);
}

export function cardinal(n: number): string {
  if (n === 0) return 'zero';
  if (n < 0) return `meno ${cardinal(-n)}`;
  if (n < 1_000_000) return under1m(n);
  if (n < 1_000_000_000) {
    const m = Math.floor(n / 1_000_000);
    const rest = n % 1_000_000;
    const head = m === 1 ? 'un milione' : `${under1m(m)} milioni`;
    return rest === 0 ? head : `${head} ${under1m(rest)}`;
  }
  const mrd = Math.floor(n / 1_000_000_000);
  const rest = n % 1_000_000_000;
  const head = mrd === 1 ? 'un miliardo' : `${under1m(mrd)} miliardi`;
  return rest === 0 ? head : `${head} ${cardinal(rest)}`;
}

function time(hour: number, minute: number, system: TimeSystem): string {
  if (system === '12h' && hour === 12 && minute === 0) return 'mezzogiorno';
  if (system === '12h' && hour === 0 && minute === 0) return 'mezzanotte';
  const h = system === '12h' ? (hour % 12 === 0 ? 12 : hour % 12) : hour;
  const hWord = h === 1 ? 'l’una' : `le ${under100(h)}`;
  if (minute === 0) return hWord;
  return `${hWord} e ${under100(minute)}`;
}

function money(amount: number, currency: Currency): string {
  const major = Math.floor(amount);
  const minor = Math.round((amount - major) * 100);
  const unit: Record<Currency, [string, string, string, string]> = {
    EUR: ['euro', 'euro', 'centesimo', 'centesimi'],
    USD: ['dollaro', 'dollari', 'centesimo', 'centesimi'],
    GBP: ['sterlina', 'sterline', 'penny', 'pence'],
    JPY: ['yen', 'yen', '', ''],
    KRW: ['won', 'won', '', ''],
    CNY: ['yuan', 'yuan', 'fen', 'fen'],
  };
  const [sg, pl, msg, mpl] = unit[currency];
  const majorName = major === 1 ? sg : pl;
  if (!msg || minor === 0) return `${cardinal(major)} ${majorName}`;
  const minorName = minor === 1 ? msg : mpl;
  return `${cardinal(major)} ${majorName} e ${cardinal(minor)} ${minorName}`;
}

const MONTHS = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
const WEEKDAYS = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];

function date(year: number | undefined, month: number, day: number, dow?: number): string {
  const dayWord = day === 1 ? 'primo' : cardinal(day);
  const parts: string[] = [];
  if (dow !== undefined) parts.push(WEEKDAYS[dow]!);
  parts.push(`${dayWord} ${MONTHS[month - 1]}`);
  if (year !== undefined) parts.push(cardinal(year));
  return parts.join(' ');
}

function phone(digits: string): string {
  const clean = digits.replace(/\D/g, '');
  if (clean.length === 0) return '';
  const groups: string[] = [];
  // Italian phones often read as 3-3-4 or 3-4 groupings; we'll read each digit
  for (let i = 0; i < clean.length; i += 3) {
    const grp = clean.slice(i, i + 3);
    groups.push(grp.split('').map((d) => ONES[Number(d)]).join(' '));
  }
  return groups.join(', ');
}

function arithmetic(a: number, op: ArithmeticOp, b: number): string {
  const verb = { '+': 'più', '-': 'meno', '*': 'per', '/': 'diviso' }[op];
  return `Quanto fa ${cardinal(a)} ${verb} ${cardinal(b)}?`;
}

const engine: NumberSpeech = { cardinal, time, money, date, phone, arithmetic };
export default engine;
