import type { ArithmeticOp, Currency, TimeSystem } from './core';

/**
 * Contract implemented by every per-language reading engine.
 * All methods must be pure and deterministic.
 */
export interface NumberSpeech {
  /** Cardinal number reading. */
  cardinal(n: number): string;

  /** Time reading. `system` controls 12h vs 24h. */
  time(hour: number, minute: number, system: TimeSystem): string;

  /** Money reading. Amounts are smallest integer units (yen, cent, won, etc. as integer of the major unit). */
  money(amount: number, currency: Currency): string;

  /** Date reading. Year optional. `dow` is 0=Sun..6=Sat. */
  date(year: number | undefined, month: number, day: number, dow?: number): string;

  /** Phone number reading using locale-typical grouping. */
  phone(digits: string): string;

  /** Read a binary arithmetic problem as a complete sentence (target language). */
  arithmetic(a: number, op: ArithmeticOp, b: number): string;
}
