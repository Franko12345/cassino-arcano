import { describe, expect, it } from 'vitest';
import { score, isNatural, isBust } from './blackjack';
import type { Card } from './cards';

const card = (rank: Card['rank']): Card => ({ suit: '♠', rank });

describe('blackjack', () => {
  it('counts aces as 11 when low enough', () => {
    expect(score([card('A'), card('9')])).toBe(20);
  });

  it('demotes ace from 11 to 1 when bust', () => {
    expect(score([card('A'), card('A'), card('9')])).toBe(21);
  });

  it('demotes multiple aces', () => {
    expect(score([card('A'), card('A'), card('A'), card('7')])).toBe(20);
  });

  it('counts face cards as 10', () => {
    expect(score([card('J'), card('Q'), card('K')])).toBe(30);
  });

  it('detects natural only on 2-card 21', () => {
    expect(isNatural([card('A'), card('K')])).toBe(true);
    expect(isNatural([card('A'), card('9'), card('A')])).toBe(false);
    expect(isNatural([card('K'), card('Q')])).toBe(false);
  });

  it('detects bust over 21', () => {
    expect(isBust([card('K'), card('Q'), card('5')])).toBe(true);
    expect(isBust([card('K'), card('A')])).toBe(false);
  });
});
