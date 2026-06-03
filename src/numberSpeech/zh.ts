import type { NumberSpeech } from '../types/speech';
import type { ArithmeticOp, Currency, TimeSystem } from '../types/core';

const DIGITS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

/** Read 1..99 with either bare 十 (standalone) or 一十 (compound after another non-zero digit). */
function tensPart(n: number, compound: boolean): string {
  if (n < 10) return DIGITS[n]!;
  if (n < 20) {
    const tail = n === 10 ? '' : DIGITS[n - 10]!;
    return (compound ? '一十' : '十') + tail;
  }
  const t = Math.floor(n / 10);
  const o = n % 10;
  return DIGITS[t]! + '十' + (o === 0 ? '' : DIGITS[o]);
}

function under1000(n: number): string {
  if (n === 0) return '';
  if (n < 100) return tensPart(n, false);
  const h = Math.floor(n / 100);
  const r = n % 100;
  const head = DIGITS[h]! + '百';
  if (r === 0) return head;
  if (r < 10) return head + '零' + DIGITS[r];
  return head + tensPart(r, true);
}

/** 0..9999 standalone. */
function under10000(n: number): string {
  if (n === 0) return '零';
  if (n < 1000) return under1000(n);
  const k = Math.floor(n / 1000);
  const r = n % 1000;
  const head = DIGITS[k]! + '千';
  if (r === 0) return head;
  if (r < 100) {
    if (r === 0) return head;
    return head + '零' + tensPart(r, true);
  }
  return head + under1000(r);
}

/** 0..99999999 — adds 万 layer. */
function under100m(n: number): string {
  if (n < 10000) return under10000(n);
  const w = Math.floor(n / 10000);
  const r = n % 10000;
  const head = under10000(w) + '万';
  if (r === 0) return head;
  if (r < 1000) {
    if (r < 100) return head + '零' + tensPart(r, true);
    return head + '零' + under1000(r);
  }
  return head + under10000(r);
}

export function cardinal(n: number): string {
  if (n === 0) return '零';
  if (n < 0) return `负${cardinal(-n)}`;
  if (n < 100_000_000) return under100m(n);
  const yi = Math.floor(n / 100_000_000);
  const rest = n % 100_000_000;
  const head = under100m(yi) + '亿';
  if (rest === 0) return head;
  if (rest < 10_000_000) return head + '零' + under100m(rest);
  return head + under100m(rest);
}

function time(hour: number, minute: number, system: TimeSystem): string {
  // 2点 -> 两点 (Mandarin spoken convention)
  const hourWord = (h: number): string => {
    if (h === 2) return '两';
    return under10000(h);
  };
  if (system === '24h') {
    const hWord = hourWord(hour) + '点';
    if (minute === 0) return hWord + '整';
    return `${hWord}${under10000(minute)}分`;
  }
  const period = hour < 12 ? '上午' : '下午';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const hWord = hourWord(h12) + '点';
  if (minute === 0) return `${period}${hWord}`;
  return `${period}${hWord}${under10000(minute)}分`;
}

function money(amount: number, currency: Currency): string {
  const major = Math.floor(amount);
  const minor = Math.round((amount - major) * 100);
  const unit: Record<Currency, [string, string]> = {
    CNY: ['元', '分'],
    USD: ['美元', '美分'],
    EUR: ['欧元', '欧分'],
    GBP: ['英镑', '便士'],
    JPY: ['日元', ''],
    KRW: ['韩元', ''],
  };
  const [maj, min] = unit[currency];
  // Use 两 for major counts of 2 in money: 两元, 两百元 etc — for simplicity, only at the very leading 2
  let majorWord = cardinal(major);
  if (major === 2) majorWord = '两';
  if (!min || minor === 0) return `${majorWord}${maj}`;
  return `${majorWord}${maj}${cardinal(minor)}${min}`;
}

const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

function date(year: number | undefined, month: number, day: number, dow?: number): string {
  const parts: string[] = [];
  if (year !== undefined) {
    // Year is read digit-by-digit: 2025 -> 二零二五年
    const yearWord = year.toString().split('').map((d) => DIGITS[Number(d)]).join('');
    parts.push(`${yearWord}年`);
  }
  parts.push(MONTHS[month - 1]!);
  parts.push(`${under10000(day)}日`);
  if (dow !== undefined) parts.push(WEEKDAYS[dow]!);
  return parts.join('');
}

function phone(digits: string): string {
  const clean = digits.replace(/\D/g, '');
  // Each digit read individually with brief pauses between groups (3-4-4 typical for mobile)
  let groups: string[];
  if (clean.length === 11) {
    groups = [clean.slice(0, 3), clean.slice(3, 7), clean.slice(7)];
  } else if (clean.length === 8) {
    groups = [clean.slice(0, 4), clean.slice(4)];
  } else {
    groups = [clean];
  }
  return groups.map((g) => g.split('').map((d) => DIGITS[Number(d)]).join('')).join(' ');
}

function arithmetic(a: number, op: ArithmeticOp, b: number): string {
  const verb = { '+': '加', '-': '减', '*': '乘以', '/': '除以' }[op];
  return `${cardinal(a)} ${verb} ${cardinal(b)} 等于多少？`;
}

const engine: NumberSpeech = { cardinal, time, money, date, phone, arithmetic };
export default engine;
