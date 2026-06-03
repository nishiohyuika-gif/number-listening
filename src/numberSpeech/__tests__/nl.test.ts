import { describe, it, expect } from 'vitest';
import nl from '../nl';

describe('Dutch number speech — units-before-tens with ë diaeresis', () => {
  it('basic', () => {
    expect(nl.cardinal(0)).toBe('nul');
    expect(nl.cardinal(7)).toBe('zeven');
    expect(nl.cardinal(12)).toBe('twaalf');
  });

  it('20-99: eenentwintig pattern with ë for tweeën/drieën', () => {
    expect(nl.cardinal(20)).toBe('twintig');
    expect(nl.cardinal(21)).toBe('eenentwintig');
    expect(nl.cardinal(22)).toBe('tweeëntwintig');
    expect(nl.cardinal(23)).toBe('drieëntwintig');
    expect(nl.cardinal(24)).toBe('vierentwintig');
    expect(nl.cardinal(30)).toBe('dertig');
    expect(nl.cardinal(45)).toBe('vijfenveertig');
  });

  it('hundreds/thousands', () => {
    expect(nl.cardinal(100)).toBe('honderd');
    expect(nl.cardinal(200)).toBe('tweehonderd');
    expect(nl.cardinal(234)).toBe('tweehonderdvierendertig');
    expect(nl.cardinal(1000)).toBe('duizend');
  });
});
