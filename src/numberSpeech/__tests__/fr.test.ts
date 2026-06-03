import { describe, it, expect } from 'vitest';
import fr from '../fr';

describe('French number speech — soixante-dix/quatre-vingt system', () => {
  it('0-19 basic', () => {
    expect(fr.cardinal(0)).toBe('zéro');
    expect(fr.cardinal(11)).toBe('onze');
    expect(fr.cardinal(17)).toBe('dix-sept');
  });

  it('20-69: "et un" rule', () => {
    expect(fr.cardinal(21)).toBe('vingt et un');
    expect(fr.cardinal(22)).toBe('vingt-deux');
    expect(fr.cardinal(31)).toBe('trente et un');
    expect(fr.cardinal(40)).toBe('quarante');
    expect(fr.cardinal(61)).toBe('soixante et un');
  });

  it('70-79: soixante-dix series', () => {
    expect(fr.cardinal(70)).toBe('soixante-dix');
    expect(fr.cardinal(71)).toBe('soixante et onze');
    expect(fr.cardinal(72)).toBe('soixante-douze');
    expect(fr.cardinal(79)).toBe('soixante-dix-neuf');
  });

  it('80-99: quatre-vingt series', () => {
    expect(fr.cardinal(80)).toBe('quatre-vingts'); // alone takes s
    expect(fr.cardinal(81)).toBe('quatre-vingt-un'); // no et, no s
    expect(fr.cardinal(82)).toBe('quatre-vingt-deux');
    expect(fr.cardinal(90)).toBe('quatre-vingt-dix');
    expect(fr.cardinal(91)).toBe('quatre-vingt-onze');
    expect(fr.cardinal(99)).toBe('quatre-vingt-dix-neuf');
  });

  it('hundreds: cents plural with s only when alone', () => {
    expect(fr.cardinal(100)).toBe('cent');
    expect(fr.cardinal(200)).toBe('deux cents');
    expect(fr.cardinal(201)).toBe('deux cent un');
    expect(fr.cardinal(380)).toBe('trois cent quatre-vingts');
  });

  it('thousands', () => {
    expect(fr.cardinal(1000)).toBe('mille');
    expect(fr.cardinal(2000)).toBe('deux mille');
    expect(fr.cardinal(1234)).toBe('mille deux cent trente-quatre');
  });

  it('phone: read as 2-digit pairs', () => {
    expect(fr.phone('0612345678')).toBe('zéro six, douze, trente-quatre, cinquante-six, soixante-dix-huit');
  });

  it('date: "premier" for the 1st', () => {
    expect(fr.date(undefined, 3, 1)).toBe('premier mars');
    expect(fr.date(undefined, 3, 26)).toBe('vingt-six mars');
  });
});
