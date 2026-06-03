import { describe, it, expect } from 'vitest';
import itEngine from '../it';

describe('Italian number speech — vowel elision and tré accent', () => {
  it('teens', () => {
    expect(itEngine.cardinal(11)).toBe('undici');
    expect(itEngine.cardinal(17)).toBe('diciassette');
    expect(itEngine.cardinal(18)).toBe('diciotto');
    expect(itEngine.cardinal(19)).toBe('diciannove');
  });

  it('20-99: vowel elision before 1/8, accent on 3', () => {
    expect(itEngine.cardinal(20)).toBe('venti');
    expect(itEngine.cardinal(21)).toBe('ventuno');
    expect(itEngine.cardinal(23)).toBe('ventitré');
    expect(itEngine.cardinal(28)).toBe('ventotto');
    expect(itEngine.cardinal(31)).toBe('trentuno');
    expect(itEngine.cardinal(33)).toBe('trentatré');
    expect(itEngine.cardinal(38)).toBe('trentotto');
    expect(itEngine.cardinal(88)).toBe('ottantotto');
  });

  it('hundreds/thousands', () => {
    expect(itEngine.cardinal(100)).toBe('cento');
    expect(itEngine.cardinal(200)).toBe('duecento');
    expect(itEngine.cardinal(1000)).toBe('mille');
    expect(itEngine.cardinal(2000)).toBe('duemila');
  });
});
