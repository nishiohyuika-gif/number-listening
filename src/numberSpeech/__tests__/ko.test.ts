import { describe, it, expect } from 'vitest';
import ko from '../ko';

describe('Korean number speech — 漢数字/固有数字 hybrid', () => {
  it('sino cardinals', () => {
    expect(ko.cardinal(0)).toBe('영');
    expect(ko.cardinal(10)).toBe('십');
    expect(ko.cardinal(21)).toBe('이십일');
    expect(ko.cardinal(100)).toBe('백');
    expect(ko.cardinal(1234)).toBe('천 이백 삼십사');
    expect(ko.cardinal(10000)).toBe('만');
    expect(ko.cardinal(20000)).toBe('이만');
  });

  it('time: hour is native, minute is sino', () => {
    // 3시 20분 = 세 시 이십 분
    expect(ko.time(3, 20, '24h')).toBe('세 시 이십 분');
    // 1시 = 한 시
    expect(ko.time(1, 0, '24h')).toBe('한 시');
    // 4시 = 네 시 (not 사 시)
    expect(ko.time(4, 0, '24h')).toBe('네 시');
  });

  it('months: 6월=유월, 10월=시월', () => {
    expect(ko.date(undefined, 6, 15)).toBe('유월 십오 일');
    expect(ko.date(undefined, 10, 5)).toBe('시월 오 일');
  });

  it('phone: digits with 공 for 0', () => {
    expect(ko.phone('01012345678')).toBe('공 일 공, 일 이 삼 사, 오 육 칠 팔');
  });
});
