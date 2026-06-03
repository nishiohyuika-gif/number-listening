import type { NumberSpeech } from '../types/speech';
import type { ArithmeticOp, Currency, TimeSystem } from '../types/core';

const ONES = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
const TEENS = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
const TWENTIES = ['veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
const TENS = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const HUNDREDS = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

function under100(n: number): string {
  if (n < 10) return ONES[n]!;
  if (n < 20) return TEENS[n - 10]!;
  if (n < 30) return TWENTIES[n - 20]!;
  const t = Math.floor(n / 10);
  const o = n % 10;
  if (o === 0) return TENS[t]!;
  return `${TENS[t]} y ${ONES[o]}`;
}

function under1000(n: number): string {
  if (n < 100) return under100(n);
  if (n === 100) return 'cien';
  const h = Math.floor(n / 100);
  const r = n % 100;
  const head = HUNDREDS[h]!;
  return r === 0 ? head : `${head} ${under100(r)}`;
}

function under1m(n: number): string {
  if (n < 1000) return under1000(n);
  const t = Math.floor(n / 1000);
  const r = n % 1000;
  const head = t === 1 ? 'mil' : `${under1000(t)} mil`;
  return r === 0 ? head : `${head} ${under1000(r)}`;
}

export function cardinal(n: number): string {
  if (n === 0) return 'cero';
  if (n < 0) return `menos ${cardinal(-n)}`;
  if (n < 1_000_000) return under1m(n);
  if (n < 1_000_000_000) {
    const m = Math.floor(n / 1_000_000);
    const rest = n % 1_000_000;
    const head = m === 1 ? 'un millón' : `${under1m(m)} millones`;
    return rest === 0 ? head : `${head} ${under1m(rest)}`;
  }
  const mrd = Math.floor(n / 1_000_000_000);
  const rest = n % 1_000_000_000;
  const head = mrd === 1 ? 'mil millones' : `${under1m(mrd)} mil millones`;
  return rest === 0 ? head : `${head} ${cardinal(rest)}`;
}

function time(hour: number, minute: number, system: TimeSystem): string {
  if (system === '12h' && hour === 12 && minute === 0) return 'mediodía';
  if (system === '12h' && hour === 0 && minute === 0) return 'medianoche';
  const h = system === '12h' ? (hour % 12 === 0 ? 12 : hour % 12) : hour;
  const period = system === '12h' ? (hour < 12 ? ' de la mañana' : ' de la tarde') : '';
  const hWord = h === 1 ? 'la una' : `las ${under100(h)}`;
  if (minute === 0) return `${hWord}${period}`;
  return `${hWord} y ${under100(minute)}${period}`;
}

function money(amount: number, currency: Currency): string {
  const major = Math.floor(amount);
  const minor = Math.round((amount - major) * 100);
  const unit: Record<Currency, [string, string, string, string]> = {
    EUR: ['euro', 'euros', 'céntimo', 'céntimos'],
    USD: ['dólar', 'dólares', 'centavo', 'centavos'],
    GBP: ['libra', 'libras', 'penique', 'peniques'],
    JPY: ['yen', 'yenes', '', ''],
    KRW: ['won', 'wones', '', ''],
    CNY: ['yuan', 'yuanes', 'fen', 'fen'],
  };
  const [sg, pl, msg, mpl] = unit[currency];
  const majorName = major === 1 ? sg : pl;
  if (!msg || minor === 0) return `${cardinal(major)} ${majorName}`;
  const minorName = minor === 1 ? msg : mpl;
  return `${cardinal(major)} ${majorName} con ${cardinal(minor)} ${minorName}`;
}

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const WEEKDAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

function date(year: number | undefined, month: number, day: number, dow?: number): string {
  const dayWord = day === 1 ? 'primero' : cardinal(day);
  const parts: string[] = [];
  if (dow !== undefined) parts.push(WEEKDAYS[dow]!);
  parts.push(`${dayWord} de ${MONTHS[month - 1]}`);
  if (year !== undefined) parts.push(`de ${cardinal(year)}`);
  return parts.join(' ');
}

function phone(digits: string): string {
  const clean = digits.replace(/\D/g, '');
  if (clean.length === 0) return '';
  // Spanish: typically 3-3-3 or pair grouping; we'll read pairs
  const groups: string[] = [];
  const headLen = clean.length % 2 === 1 ? 1 : 0;
  if (headLen) groups.push(ONES[Number(clean[0])]!);
  for (let i = headLen; i < clean.length; i += 2) {
    const pair = clean.slice(i, i + 2);
    if (pair.length === 2) groups.push(under100(Number(pair)));
    else groups.push(ONES[Number(pair)]!);
  }
  return groups.join(', ');
}

function arithmetic(a: number, op: ArithmeticOp, b: number): string {
  const verb = { '+': 'más', '-': 'menos', '*': 'por', '/': 'entre' }[op];
  return `¿Cuánto es ${cardinal(a)} ${verb} ${cardinal(b)}?`;
}

const engine: NumberSpeech = { cardinal, time, money, date, phone, arithmetic };
export default engine;
