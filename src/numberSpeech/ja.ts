import type { NumberSpeech } from '../types/speech';
import type { ArithmeticOp, Currency, TimeSystem } from '../types/core';

const DIGITS_BASIC = ['ゼロ', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう'];

const HYAKU = ['', 'ひゃく', 'にひゃく', 'さんびゃく', 'よんひゃく', 'ごひゃく', 'ろっぴゃく', 'ななひゃく', 'はっぴゃく', 'きゅうひゃく'];
const SEN = ['', 'せん', 'にせん', 'さんぜん', 'よんせん', 'ごせん', 'ろくせん', 'ななせん', 'はっせん', 'きゅうせん'];

function under100(n: number): string {
  if (n === 0) return '';
  if (n < 10) return DIGITS_BASIC[n]!;
  const t = Math.floor(n / 10);
  const o = n % 10;
  const tens = t === 1 ? 'じゅう' : `${DIGITS_BASIC[t]}じゅう`;
  return o === 0 ? tens : tens + DIGITS_BASIC[o];
}

function under1000(n: number): string {
  if (n < 100) return under100(n);
  const h = Math.floor(n / 100);
  const r = n % 100;
  return HYAKU[h]! + (r === 0 ? '' : under100(r));
}

function under10000(n: number): string {
  if (n < 1000) return under1000(n);
  const t = Math.floor(n / 1000);
  const r = n % 1000;
  return SEN[t]! + (r === 0 ? '' : under1000(r));
}

function under100m(n: number): string {
  if (n < 10000) return under10000(n);
  const man = Math.floor(n / 10000);
  const rest = n % 10000;
  const manWord = (man === 1 ? 'いち' : under10000(man)) + 'まん';
  return rest === 0 ? manWord : manWord + under10000(rest);
}

export function cardinal(n: number): string {
  if (n === 0) return 'ゼロ';
  if (n < 0) return `マイナス${cardinal(-n)}`;
  if (n < 100_000_000) return under100m(n);
  const oku = Math.floor(n / 100_000_000);
  const rest = n % 100_000_000;
  const head = under100m(oku) + 'おく';
  return rest === 0 ? head : head + under100m(rest);
}

const HOUR_READING: Record<number, string> = {
  0: 'れいじ',
  1: 'いちじ',
  2: 'にじ',
  3: 'さんじ',
  4: 'よじ',
  5: 'ごじ',
  6: 'ろくじ',
  7: 'しちじ',
  8: 'はちじ',
  9: 'くじ',
  10: 'じゅうじ',
  11: 'じゅういちじ',
  12: 'じゅうにじ',
  13: 'じゅうさんじ',
  14: 'じゅうよじ',
  15: 'じゅうごじ',
  16: 'じゅうろくじ',
  17: 'じゅうしちじ',
  18: 'じゅうはちじ',
  19: 'じゅうくじ',
  20: 'にじゅうじ',
  21: 'にじゅういちじ',
  22: 'にじゅうにじ',
  23: 'にじゅうさんじ',
};

function fun(minute: number): string {
  // minute readings: special small numbers, then composed
  const tens = Math.floor(minute / 10);
  const ones = minute % 10;
  const ONES_FUN: Record<number, string> = {
    1: 'いっぷん', 2: 'にふん', 3: 'さんぷん', 4: 'よんぷん', 5: 'ごふん',
    6: 'ろっぷん', 7: 'ななふん', 8: 'はっぷん', 9: 'きゅうふん',
  };
  if (minute === 0) return '';
  if (minute < 10) return ONES_FUN[minute]!;
  if (minute === 10) return 'じゅっぷん';
  if (minute < 20) return 'じゅう' + (ones === 0 ? 'ぷん' : ONES_FUN[ones]!);
  // 20, 30, 40, 50
  const tensWord = `${DIGITS_BASIC[tens]}じゅっぷん`;
  if (ones === 0) return tensWord;
  return `${DIGITS_BASIC[tens]}じゅう${ONES_FUN[ones]}`;
}

function time(hour: number, minute: number, system: TimeSystem): string {
  if (system === '12h') {
    const period = hour < 12 ? 'ごぜん' : 'ごご';
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    const hr = HOUR_READING[h12]!;
    return minute === 0 ? `${period}${hr}` : `${period}${hr}${fun(minute)}`;
  }
  const hr = HOUR_READING[hour] ?? `${cardinal(hour)}じ`;
  return minute === 0 ? hr : hr + fun(minute);
}

function money(amount: number, currency: Currency): string {
  const unit: Record<Currency, string> = {
    JPY: 'えん',
    USD: 'ドル',
    EUR: 'ユーロ',
    GBP: 'ポンド',
    KRW: 'ウォン',
    CNY: 'げん',
  };
  return cardinal(amount) + unit[currency];
}

const MONTHS_JA = ['いちがつ', 'にがつ', 'さんがつ', 'しがつ', 'ごがつ', 'ろくがつ', 'しちがつ', 'はちがつ', 'くがつ', 'じゅうがつ', 'じゅういちがつ', 'じゅうにがつ'];
const WEEKDAYS_JA = ['にちようび', 'げつようび', 'かようび', 'すいようび', 'もくようび', 'きんようび', 'どようび'];

const DAY_READING: Record<number, string> = {
  1: 'ついたち', 2: 'ふつか', 3: 'みっか', 4: 'よっか', 5: 'いつか',
  6: 'むいか', 7: 'なのか', 8: 'ようか', 9: 'ここのか', 10: 'とおか',
  14: 'じゅうよっか', 20: 'はつか', 24: 'にじゅうよっか',
};

function dayReading(d: number): string {
  return DAY_READING[d] ?? `${cardinal(d)}にち`;
}

function date(year: number | undefined, month: number, day: number, dow?: number): string {
  const parts: string[] = [];
  if (year !== undefined) parts.push(`${cardinal(year)}ねん`);
  parts.push(MONTHS_JA[month - 1]!);
  parts.push(dayReading(day));
  if (dow !== undefined) parts.push(WEEKDAYS_JA[dow]!);
  return parts.join('');
}

const PHONE_DIGIT = ['ゼロ', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう'];

function phone(digits: string): string {
  const clean = digits.replace(/\D/g, '');
  // Japanese phone numbers are typically read with の between groups: 090-1234-5678
  let groups: string[];
  if (clean.length === 11) {
    groups = [clean.slice(0, 3), clean.slice(3, 7), clean.slice(7)];
  } else if (clean.length === 10) {
    groups = [clean.slice(0, 2), clean.slice(2, 6), clean.slice(6)];
  } else {
    groups = [clean];
  }
  return groups.map((g) => g.split('').map((d) => PHONE_DIGIT[Number(d)]).join('')).join(' の ');
}

function arithmetic(a: number, op: ArithmeticOp, b: number): string {
  const verb = { '+': 'たす', '-': 'ひく', '*': 'かける', '/': 'わる' }[op];
  return `${cardinal(a)} ${verb} ${cardinal(b)} は いくつ?`;
}

const engine: NumberSpeech = { cardinal, time, money, date, phone, arithmetic };
export default engine;
