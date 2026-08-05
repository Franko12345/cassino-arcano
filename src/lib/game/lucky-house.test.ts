import { describe, expect, it } from 'vitest';
import { settle, type Bet } from './roulette';

describe('settlement: luckyHouse (Casa-Sorte)', () => {
  it('pays number:0 at ×5 when active and zero hits', () => {
    const bets: Bet[] = [{ type: 'number', value: '0', amount: 10 }];
    const s = settle(0, bets, true);
    expect(s.net).toBe(10 * 6 - 10); // 60 returned - 10 stake
    expect(s.luckyMultiplier).toBe(5);
  });

  it('pays external bets at 1:1 when zero hits and luckyHouse active', () => {
    const bets: Bet[] = [{ type: 'color', value: 'red', amount: 10 }];
    const s = settle(0, bets, true);
    expect(s.net).toBe(10 * 2 - 10); // 20 returned - 10 stake
  });

  it('does not activate externally when luckyHouse is off (zero still loses)', () => {
    const bets: Bet[] = [{ type: 'color', value: 'red', amount: 10 }];
    const s = settle(0, bets, false);
    expect(s.net).toBe(-10);
  });

  it('does not affect non-zero numbers even when active', () => {
    const bets: Bet[] = [{ type: 'color', value: 'black', amount: 10 }];
    const s = settle(7, bets, true);
    // 7 is red, so black loses
    expect(s.net).toBe(-10);
    expect(s.luckyMultiplier).toBe(1);
  });

  it('combines number:0 ×5 and color ×1 in the same round', () => {
    const bets: Bet[] = [
      { type: 'number', value: '0', amount: 5 },
      { type: 'color', value: 'red', amount: 10 }
    ];
    const s = settle(0, bets, true);
    // number:0: 5 × 6 = 30 returned
    // color (red on zero, normally lose, luckyHouse saves): 10 × 2 = 20
    // total returned: 50, stake: 15, net: 35
    expect(s.net).toBe(50 - 15);
  });
});