import { describe, it, expect } from 'vitest';
import es from '../es';

describe('Spanish number speech — vowel-elided teens and twenties', () => {
  it('teens', () => {
    expect(es.cardinal(15)).toBe('quince');
    expect(es.cardinal(16)).toBe('dieciséis');
    expect(es.cardinal(17)).toBe('diecisiete');
    expect(es.cardinal(18)).toBe('dieciocho');
    expect(es.cardinal(19)).toBe('diecinueve');
  });

  it('twenties — single word', () => {
    expect(es.cardinal(20)).toBe('veinte');
    expect(es.cardinal(21)).toBe('veintiuno');
    expect(es.cardinal(22)).toBe('veintidós');
    expect(es.cardinal(29)).toBe('veintinueve');
  });

  it('30-99 — three words with y', () => {
    expect(es.cardinal(31)).toBe('treinta y uno');
    expect(es.cardinal(45)).toBe('cuarenta y cinco');
    expect(es.cardinal(99)).toBe('noventa y nueve');
  });

  it('hundreds', () => {
    expect(es.cardinal(100)).toBe('cien');
    expect(es.cardinal(101)).toBe('ciento uno');
    expect(es.cardinal(500)).toBe('quinientos');
    expect(es.cardinal(700)).toBe('setecientos');
    expect(es.cardinal(900)).toBe('novecientos');
  });

  it('thousands', () => {
    expect(es.cardinal(1000)).toBe('mil');
    expect(es.cardinal(2025)).toBe('dos mil veinticinco');
  });
});
