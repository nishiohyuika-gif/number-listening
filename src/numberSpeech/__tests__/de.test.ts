import { describe, it, expect } from 'vitest';
import de from '../de';

describe('German number speech — units-before-tens order', () => {
  it('0-19', () => {
    expect(de.cardinal(0)).toBe('null');
    expect(de.cardinal(1)).toBe('eins');
    expect(de.cardinal(7)).toBe('sieben');
    expect(de.cardinal(12)).toBe('zwölf');
    expect(de.cardinal(16)).toBe('sechzehn');
    expect(de.cardinal(17)).toBe('siebzehn');
  });

  it('20-99: einundzwanzig pattern', () => {
    expect(de.cardinal(20)).toBe('zwanzig');
    expect(de.cardinal(21)).toBe('einundzwanzig');
    expect(de.cardinal(22)).toBe('zweiundzwanzig');
    expect(de.cardinal(30)).toBe('dreißig');
    expect(de.cardinal(45)).toBe('fünfundvierzig');
    expect(de.cardinal(67)).toBe('siebenundsechzig');
    expect(de.cardinal(99)).toBe('neunundneunzig');
  });

  it('hundreds and thousands', () => {
    expect(de.cardinal(100)).toBe('einhundert');
    expect(de.cardinal(200)).toBe('zweihundert');
    expect(de.cardinal(121)).toBe('einhunderteinundzwanzig');
    expect(de.cardinal(1000)).toBe('eintausend');
    expect(de.cardinal(2025)).toBe('zweitausendfünfundzwanzig');
  });

  it('arithmetic', () => {
    expect(de.arithmetic(12, '+', 7)).toBe('Wie viel ist zwölf plus sieben?');
  });
});
