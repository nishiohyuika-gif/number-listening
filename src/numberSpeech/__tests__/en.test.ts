import { describe, it, expect } from 'vitest';
import en from '../en';

describe('English number speech', () => {
  it('basic cardinals', () => {
    expect(en.cardinal(0)).toBe('zero');
    expect(en.cardinal(7)).toBe('seven');
    expect(en.cardinal(13)).toBe('thirteen');
    expect(en.cardinal(21)).toBe('twenty-one');
    expect(en.cardinal(100)).toBe('one hundred');
    expect(en.cardinal(1234)).toBe('one thousand two hundred thirty-four');
    expect(en.cardinal(1_000_000)).toBe('one million');
  });

  it('time', () => {
    expect(en.time(10, 0, '12h')).toBe("ten o'clock a.m.");
    expect(en.time(10, 20, '12h')).toBe('ten twenty a.m.');
    expect(en.time(15, 5, '12h')).toBe('three oh five p.m.');
  });

  it('arithmetic', () => {
    expect(en.arithmetic(12, '+', 7)).toBe('What is twelve plus seven?');
  });
});
