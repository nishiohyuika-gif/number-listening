import type { Currency } from '../types/core';

export interface CurrencyInfo {
  /** Major-unit symbol shown in display answers. */
  symbol: string;
  /** ISO-like short code shown in feedback. */
  code: Currency;
  /** Whether the currency uses fractional units in this app. */
  hasFraction: boolean;
  /** Locale typically used to format the currency display string. */
  displayLocale: string;
}

export const CURRENCY_INFO: Record<Currency, CurrencyInfo> = {
  JPY: { symbol: '¥', code: 'JPY', hasFraction: false, displayLocale: 'ja-JP' },
  KRW: { symbol: '₩', code: 'KRW', hasFraction: false, displayLocale: 'ko-KR' },
  USD: { symbol: '$', code: 'USD', hasFraction: true, displayLocale: 'en-US' },
  EUR: { symbol: '€', code: 'EUR', hasFraction: true, displayLocale: 'de-DE' },
  GBP: { symbol: '£', code: 'GBP', hasFraction: true, displayLocale: 'en-GB' },
  CNY: { symbol: '¥', code: 'CNY', hasFraction: true, displayLocale: 'zh-CN' },
};

export function formatMoneyDisplay(amount: number, currency: Currency): string {
  const info = CURRENCY_INFO[currency];
  try {
    return new Intl.NumberFormat(info.displayLocale, {
      style: 'currency',
      currency,
      minimumFractionDigits: info.hasFraction ? 2 : 0,
      maximumFractionDigits: info.hasFraction ? 2 : 0,
    }).format(amount);
  } catch {
    return `${info.symbol}${amount}`;
  }
}
