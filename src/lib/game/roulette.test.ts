import { describe, expect, it } from 'vitest';
import { randomNumber, odds, settle, type Bet } from './roulette';

describe('roulette', () => {
  it('randomNumber stays in 0..36 over many draws', () => {
    for (let i = 0; i < 500; i++) {
      const n = randomNumber();
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(36);
    }
  });

  it('pays 35:1 on a number', () => {
    expect(odds('number', '17', 17)).toBe(35);
    expect(odds('number', '17', 18)).toBe(-1);
  });

  it('pays 1:1 on color and even-money bets, but never when zero hits', () => {
    expect(odds('color', 'red', 0)).toBe(-1);
    expect(odds('color', 'red', 3)).toBe(1);
    expect(odds('even', '', 4)).toBe(1);
    expect(odds('even', '', 0)).toBe(-1);
  });

  it('pays 2:1 on dozens', () => {
    expect(odds('dozen', '1', 1)).toBe(2);
    expect(odds('dozen', '1', 13)).toBe(-1);
  });

  it('settles a chip stack correctly', () => {
    const bets: Bet[] = [
      { type: 'color', value: 'red', amount: 10 },
      { type: 'number', value: '17', amount: 5 }
    ];
    const r = settle(17, bets);
    expect(r.net).toBe(5 * 36 - 15);
    expect(r.numberWin).toBe(true);
    expect(r.types.has('number')).toBe(true);
    expect(r.types.has('color')).toBe(false);
  });

  it('loses only the stake when color misses but number hits', () => {
    const bets: Bet[] = [
      { type: 'color', value: 'red', amount: 10 },
      { type: 'number', value: '17', amount: 5 }
    ];
    const r = settle(17, bets);
    expect(r.staked).toBe(15);
    expect(r.returned).toBe(180);
    expect(r.types.has('color')).toBe(false);
  });
});
