import { describe, expect, it } from 'vitest';
import { settle, type Bet } from './roulette';
import { applyTalismans, parityHotEffect, ROULETTE_CATALOG } from './roulette-talismans';

describe('talisman: parityHot', () => {
  it('does not trigger when streak < 3 even on a winning parity bet', () => {
    const bets: Bet[] = [{ type: 'even', value: '', amount: 10 }];
    const s = settle(4, bets);
    const effect = parityHotEffect(s, 2);
    expect(effect.multiplier).toBe(1);
  });

  it('triggers ×3 when streak ≥ 3 and even wins', () => {
    const bets: Bet[] = [{ type: 'even', value: '', amount: 10 }];
    const s = settle(4, bets);
    const effect = parityHotEffect(s, 3);
    expect(effect.multiplier).toBe(3);
    expect(effect.notes[0]).toMatch(/Par\/Ímpar de Sorte ×3/);
  });

  it('triggers ×3 when streak ≥ 3 and odd wins', () => {
    const bets: Bet[] = [{ type: 'odd', value: '', amount: 10 }];
    const s = settle(5, bets);
    const effect = parityHotEffect(s, 4);
    expect(effect.multiplier).toBe(3);
  });

  it('does not trigger on zero (zero is neither even nor odd in roulette)', () => {
    const bets: Bet[] = [{ type: 'even', value: '', amount: 10 }];
    const s = settle(0, bets);
    const effect = parityHotEffect(s, 5);
    expect(effect.multiplier).toBe(1);
  });

  it('integrates with applyTalismans: ×3 on streak ≥ 3 + even win', () => {
    const bets: Bet[] = [{ type: 'even', value: '', amount: 10 }];
    const s = settle(4, bets);
    const mods = applyTalismans(s, { relics: ['parityHot'], streak: 3 });
    expect(mods.multiplier).toBe(3);
    expect(mods.notes.some((n) => n.startsWith('Par/Ímpar de Sorte'))).toBe(true);
  });

  it('appears in ROULETTE_CATALOG with cost 40', () => {
    const found = ROULETTE_CATALOG.find((t) => t.id === 'parityHot');
    expect(found).toBeDefined();
    expect(found?.cost).toBe(40);
  });
});