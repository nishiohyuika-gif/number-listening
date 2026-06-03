import type { NumberSpeech } from '../types/speech';
import type { ArithmeticOp, Currency, TimeSystem } from '../types/core';

// === Sino-Korean (漢数字) ===
const SINO_DIGITS = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];

function sinoUnder100(n: number): string {
  if (n < 10) return SINO_DIGITS[n]!;
  if (n < 20) return n === 10 ? '십' : '십' + SINO_DIGITS[n - 10];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return SINO_DIGITS[t]! + '십' + (o === 0 ? '' : SINO_DIGITS[o]);
}

function sinoUnder10000(n: number): string {
  if (n < 100) return sinoUnder100(n);
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    const head = (h === 1 ? '' : SINO_DIGITS[h]) + '백';
    return r === 0 ? head : head + ' ' + sinoUnder100(r);
  }
  const k = Math.floor(n / 1000);
  const r = n % 1000;
  const head = (k === 1 ? '' : SINO_DIGITS[k]) + '천';
  return r === 0 ? head : head + ' ' + sinoUnder10000(r);
}

function sinoUnder100m(n: number): string {
  if (n < 10000) return sinoUnder10000(n);
  const w = Math.floor(n / 10000);
  const r = n % 10000;
  const head = (w === 1 ? '' : sinoUnder10000(w)) + '만';
  return r === 0 ? head : head + ' ' + sinoUnder10000(r);
}

export function cardinal(n: number): string {
  if (n === 0) return '영';
  if (n < 0) return `마이너스 ${cardinal(-n)}`;
  if (n < 100_000_000) return sinoUnder100m(n);
  const yi = Math.floor(n / 100_000_000);
  const rest = n % 100_000_000;
  const head = sinoUnder100m(yi) + '억';
  return rest === 0 ? head : head + ' ' + sinoUnder100m(rest);
}

// === Native Korean (固有数字) — only used for hours 1..12 here ===
const NATIVE_HOURS: Record<number, string> = {
  1: '한', 2: '두', 3: '세', 4: '네',
  5: '다섯', 6: '여섯', 7: '일곱', 8: '여덟',
  9: '아홉', 10: '열', 11: '열한', 12: '열두',
};

function time(hour: number, minute: number, system: TimeSystem): string {
  const h = system === '12h'
    ? (hour % 12 === 0 ? 12 : hour % 12)
    : hour;
  // Hours use native numerals up to 12; for 24h beyond 12 use compound (열셋 시 = 열세 시 for 13h)
  const NATIVE_TEENS_COUNT: Record<number, string> = {
    13: '열세', 14: '열네', 15: '열다섯', 16: '열여섯', 17: '열일곱', 18: '열여덟',
    19: '열아홉', 20: '스무', 21: '스물한', 22: '스물두', 23: '스물세',
  };
  const hourWord = NATIVE_HOURS[h] ?? NATIVE_TEENS_COUNT[h] ?? `${h}`;
  const period = system === '12h' ? (hour < 12 ? '오전 ' : '오후 ') : '';
  if (minute === 0) return `${period}${hourWord} 시`;
  return `${period}${hourWord} 시 ${sinoUnder100(minute)} 분`;
}

function money(amount: number, currency: Currency): string {
  const unit: Record<Currency, string> = {
    KRW: '원',
    USD: '달러',
    EUR: '유로',
    GBP: '파운드',
    JPY: '엔',
    CNY: '위안',
  };
  return `${cardinal(amount)} ${unit[currency]}`;
}

const MONTHS_KO = ['일월', '이월', '삼월', '사월', '오월', '유월', '칠월', '팔월', '구월', '시월', '십일월', '십이월'];
const WEEKDAYS_KO = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

function date(year: number | undefined, month: number, day: number, dow?: number): string {
  const parts: string[] = [];
  if (year !== undefined) parts.push(`${cardinal(year)} 년`);
  parts.push(MONTHS_KO[month - 1]!);
  parts.push(`${sinoUnder100(day)} 일`);
  if (dow !== undefined) parts.push(WEEKDAYS_KO[dow]!);
  return parts.join(' ');
}

const PHONE_DIGITS = ['공', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];

function phone(digits: string): string {
  const clean = digits.replace(/\D/g, '');
  let groups: string[];
  if (clean.length === 11) {
    groups = [clean.slice(0, 3), clean.slice(3, 7), clean.slice(7)];
  } else if (clean.length === 10) {
    groups = [clean.slice(0, 3), clean.slice(3, 6), clean.slice(6)];
  } else if (clean.length === 8) {
    groups = [clean.slice(0, 4), clean.slice(4)];
  } else {
    groups = [clean];
  }
  return groups.map((g) => g.split('').map((d) => PHONE_DIGITS[Number(d)]).join(' ')).join(', ');
}

function arithmetic(a: number, op: ArithmeticOp, b: number): string {
  const verb = { '+': '더하기', '-': '빼기', '*': '곱하기', '/': '나누기' }[op];
  return `${cardinal(a)} ${verb} ${cardinal(b)} 는?`;
}

const engine: NumberSpeech = { cardinal, time, money, date, phone, arithmetic };
export default engine;
