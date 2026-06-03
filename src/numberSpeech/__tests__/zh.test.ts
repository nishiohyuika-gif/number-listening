import { describe, it, expect } from 'vitest';
import zh from '../zh';

describe('Chinese number speech — 万亿四桁区切り', () => {
  it('basic', () => {
    expect(zh.cardinal(0)).toBe('零');
    expect(zh.cardinal(10)).toBe('十');
    expect(zh.cardinal(11)).toBe('十一');
    expect(zh.cardinal(20)).toBe('二十');
    expect(zh.cardinal(100)).toBe('一百');
    expect(zh.cardinal(110)).toBe('一百一十');
    expect(zh.cardinal(101)).toBe('一百零一');
  });

  it('10000 grouping', () => {
    expect(zh.cardinal(10000)).toBe('一万');
    expect(zh.cardinal(12000)).toBe('一万二千');
    expect(zh.cardinal(100000)).toBe('十万');
  });

  it('100 million = 一亿', () => {
    expect(zh.cardinal(100_000_000)).toBe('一亿');
  });

  it('time: 2点 -> 两点', () => {
    expect(zh.time(2, 30, '24h')).toBe('两点三十分');
  });

  it('money: 两元 for ¥2', () => {
    expect(zh.money(2, 'CNY')).toBe('两元');
  });
});
