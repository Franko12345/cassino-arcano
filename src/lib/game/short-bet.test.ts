import { describe, expect, it } from 'vitest';
import { settle, type Bet } from './roulette';
import { applyTalismans, ROULETTE_CATALOG } from './roulette-talismans';

describe('talisman: shortBet', () => {
  it('triggers ×1.5 when total stake is exactly 10', () => {
    const bets: Bet[] = [{ type: 'color', value: 'red', amount: 10 }];
    const s = settle(3, bets);
    expect(s.staked).toBe(10);
    const mods = applyTalismans(s, { relics: ['shortBet'], streak: 0 });
    expect(mods.multiplier).toBe(1.5);
    expect(mods.notes).toContain('Aposta Curta ×1.5');
  });

  it('does not trigger when total stake is 11', () => {
    const bets: Bet[] = [
      { type: 'color', value: 'red', amount: 10 },
      { type: 'color', value: 'red', amount: 1 }
    ];
    const s = settle(3, bets);
    expect(s.staked).toBe(11);
    const mods = applyTalismans(s, { relics: ['shortBet'], streak: 0 });
    expect(mods.multiplier).toBe(1);
  });

  it('does not trigger when total stake is large', () => {
    const bets: Bet[] = [
      { type: 'color', value: 'red', amount: 50 },
      { type: 'color', value: 'red', amount: 50 }
    ];
    const s = settle(3, bets);
    const mods = applyTalismans(s, { relics: ['shortBet'], streak: 0 });
    expect(mods.multiplier).toBe(1);
  });

  it('appears in ROULETTE_CATALOG with cost 35', () => {
    const found = ROULETTE_CATALOG.find((t) => t.id === 'shortBet');
    expect(found).toBeDefined();
    expect(found?.cost).toBe(35);
  });
});