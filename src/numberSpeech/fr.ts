import type { NumberSpeech } from '../types/speech';
import type { ArithmeticOp, Currency, TimeSystem } from '../types/core';

const ONES = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
const TEENS = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
const TENS_20_60 = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'];

/** 0..99 — traditional French (uses soixante-dix, quatre-vingts, quatre-vingt-dix). */
function under100(n: number): string {
  if (n < 10) return ONES[n]!;
  if (n < 20) return TEENS[n - 10]!;
  if (n < 70) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    const tWord = TENS_20_60[t]!;
    if (o === 0) return tWord;
    if (o === 1) return `${tWord} et un`;
    return `${tWord}-${ONES[o]}`;
  }
  if (n < 80) {
    // 70..79 = soixante + (10..19)
    const r = n - 60; // 10..19
    if (r === 11) return 'soixante et onze';
    return `soixante-${TEENS[r - 10]}`;
  }
  if (n < 100) {
    // 80..99 = quatre-vingt + (0..19); 80 alone = "quatre-vingts"
    const r = n - 80;
    if (r === 0) return 'quatre-vingts';
    if (r < 10) return `quatre-vingt-${ONES[r]}`;
    return `quatre-vingt-${TEENS[r - 10]}`;
  }
  return '';
}

function under1000(n: number): string {
  if (n < 100) return under100(n);
  const h = Math.floor(n / 100);
  const r = n % 100;
  let head: string;
  if (h === 1) head = 'cent';
  else if (r === 0) head = `${ONES[h]} cents`;
  else head = `${ONES[h]} cent`;
  return r === 0 ? head : `${head} ${under100(r)}`;
}

function under1m(n: number): string {
  if (n < 1000) return under1000(n);
  const t = Math.floor(n / 1000);
  const r = n % 1000;
  const head = t === 1 ? 'mille' : `${under1000(t)} mille`;
  return r === 0 ? head : `${head} ${under1000(r)}`;
}

export function cardinal(n: number): string {
  if (n === 0) return 'zéro';
  if (n < 0) return `moins ${cardinal(-n)}`;
  if (n < 1_000_000) return under1m(n);
  if (n < 1_000_000_000) {
    const m = Math.floor(n / 1_000_000);
    const rest = n % 1_000_000;
    const head = m === 1 ? 'un million' : `${under1m(m)} millions`;
    return rest === 0 ? head : `${head} ${under1m(rest)}`;
  }
  const mrd = Math.floor(n / 1_000_000_000);
  const rest = n % 1_000_000_000;
  const head = mrd === 1 ? 'un milliard' : `${under1m(mrd)} milliards`;
  return rest === 0 ? head : `${head} ${cardinal(rest)}`;
}

function time(hour: number, minute: number, system: TimeSystem): string {
  if (system === '24h') {
    if (hour === 0) return minute === 0 ? 'minuit' : `zéro heure ${under100(minute)}`;
    if (hour === 12 && minute === 0) return 'midi';
    const hWord = hour === 1 ? 'une heure' : `${under100(hour)} heures`;
    return minute === 0 ? hWord : `${hWord} ${under100(minute)}`;
  }
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const period = hour < 12 ? ' du matin' : ' de l’après-midi';
  if (h12 === 12 && minute === 0) return hour === 0 ? 'minuit' : 'midi';
  const hWord = h12 === 1 ? 'une heure' : `${under100(h12)} heures`;
  return minute === 0 ? `${hWord}${period}` : `${hWord} ${under100(minute)}${period}`;
}

function money(amount: number, currency: Currency): string {
  const major = Math.floor(amount);
  const minor = Math.round((amount - major) * 100);
  const unit: Record<Currency, [string, string, string, string]> = {
    EUR: ['euro', 'euros', 'centime', 'centimes'],
    USD: ['dollar', 'dollars', 'cent', 'cents'],
    GBP: ['livre', 'livres', 'penny', 'pence'],
    JPY: ['yen', 'yens', '', ''],
    KRW: ['won', 'wons', '', ''],
    CNY: ['yuan', 'yuans', 'fen', 'fen'],
  };
  const [sg, pl, msg, mpl] = unit[currency];
  const majorName = major <= 1 ? sg : pl;
  if (!msg || minor === 0) return `${cardinal(major)} ${majorName}`;
  const minorName = minor <= 1 ? msg : mpl;
  return `${cardinal(major)} ${majorName} ${cardinal(minor)} ${minorName}`;
}

const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const WEEKDAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

function date(year: number | undefined, month: number, day: number, dow?: number): string {
  const dayWord = day === 1 ? 'premier' : cardinal(day);
  const parts: string[] = [];
  if (dow !== undefined) parts.push(WEEKDAYS[dow]!);
  parts.push(`${dayWord} ${MONTHS[month - 1]}`);
  if (year !== undefined) parts.push(cardinal(year));
  return parts.join(' ');
}

function phone(digits: string): string {
  // French: typically read as 2-digit pairs. e.g. 0612345678 → "zéro six, douze, trente-quatre, cinquante-six, soixante-dix-huit"
  const clean = digits.replace(/\D/g, '');
  if (clean.length === 0) return '';
  const groups: string[] = [];
  const startsWithZero = clean[0] === '0' && clean.length % 2 === 0;
  let i = 0;
  if (startsWithZero) {
    groups.push(`${ONES[0]} ${ONES[Number(clean[1])]}`);
    i = 2;
  }
  while (i < clean.length) {
    const pair = clean.slice(i, i + 2);
    if (pair.length === 2) groups.push(under100(Number(pair)));
    else groups.push(ONES[Number(pair)]!);
    i += 2;
  }
  return groups.join(', ');
}

function arithmetic(a: number, op: ArithmeticOp, b: number): string {
  const verb = { '+': 'plus', '-': 'moins', '*': 'fois', '/': 'divisé par' }[op];
  return `Combien font ${cardinal(a)} ${verb} ${cardinal(b)} ?`;
}

const engine: NumberSpeech = { cardinal, time, money, date, phone, arithmetic };
export default engine;
