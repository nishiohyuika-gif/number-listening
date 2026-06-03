import { describe, it, expect } from 'vitest';
import ja from '../ja';

describe('Japanese number speech — 万単位 + 助数詞', () => {
  it('basic', () => {
    expect(ja.cardinal(0)).toBe('ゼロ');
    expect(ja.cardinal(7)).toBe('なな');
    expect(ja.cardinal(10)).toBe('じゅう');
    expect(ja.cardinal(11)).toBe('じゅういち');
    expect(ja.cardinal(20)).toBe('にじゅう');
  });

  it('hundreds special readings (300, 600, 800)', () => {
    expect(ja.cardinal(300)).toBe('さんびゃく');
    expect(ja.cardinal(600)).toBe('ろっぴゃく');
    expect(ja.cardinal(800)).toBe('はっぴゃく');
  });

  it('thousands (3000, 8000)', () => {
    expect(ja.cardinal(3000)).toBe('さんぜん');
    expect(ja.cardinal(8000)).toBe('はっせん');
  });

  it('10000 = いちまん', () => {
    expect(ja.cardinal(10000)).toBe('いちまん');
    expect(ja.cardinal(12000)).toBe('いちまんにせん');
  });

  it('time: 4時=よじ, 7時=しちじ, 9時=くじ', () => {
    expect(ja.time(4, 0, '24h')).toBe('よじ');
    expect(ja.time(7, 0, '24h')).toBe('しちじ');
    expect(ja.time(9, 0, '24h')).toBe('くじ');
  });

  it('time minute readings: 1分=いっぷん, 3分=さんぷん', () => {
    expect(ja.time(10, 1, '24h')).toBe('じゅうじいっぷん');
    expect(ja.time(10, 3, '24h')).toBe('じゅうじさんぷん');
    expect(ja.time(10, 30, '24h')).toBe('じゅうじさんじゅっぷん');
  });

  it('date: 1日=ついたち, 4日=よっか', () => {
    expect(ja.date(undefined, 3, 1)).toBe('さんがつついたち');
    expect(ja.date(undefined, 3, 4)).toBe('さんがつよっか');
    expect(ja.date(undefined, 7, 20)).toBe('しちがつはつか');
  });
});
