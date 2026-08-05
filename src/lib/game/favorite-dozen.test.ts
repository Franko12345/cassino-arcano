import { describe, expect, it } from 'vitest';
import { settle, type Bet } from './roulette';
import { applyTalismans, favoriteDozenEffect, ROULETTE_CATALOG } from './roulette-talismans';

describe('talisman: favoriteDozen', () => {
  // Spec §2: streak 0 → ×1, 1 → ×1.5, 2 → ×2, 3+ → ×3 (cap)

  it('first dozen hit returns ×1 (no multiplier)', () => {
    const bets: Bet[] = [{ type: 'dozen', value: '1', amount: 10 }];
    const s = settle(5, bets);
    const effect = favoriteDozenEffect(s, 0);
    expect(effect.multiplier).toBe(1);
    expect(effect.notes).toHaveLength(0);
  });

  it('second dozen hit returns ×1.5', () => {
    const bets: Bet[] = [{ type: 'dozen', value: '1', amount: 10 }];
    const s = settle(5, bets);
    const effect = favoriteDozenEffect(s, 1);
    expect(effect.multiplier).toBe(1.5);
    expect(effect.notes[0]).toMatch(/Dúzia Favorita ×1\.5/);
  });

  it('third dozen hit returns ×2', () => {
    const bets: Bet[] = [{ type: 'dozen', value: '1', amount: 10 }];
    const s = settle(5, bets);
    const effect = favoriteDozenEffect(s, 2);
    expect(effect.multiplier).toBe(2);
  });

  it('fourth dozen hit caps at ×3', () => {
    const bets: Bet[] = [{ type: 'dozen', value: '1', amount: 10 }];
    const s = settle(5, bets);
    expect(favoriteDozenEffect(s, 3).multiplier).toBe(3);
  });

  it('fifth+ stays at cap ×3', () => {
    const bets: Bet[] = [{ type: 'dozen', value: '1', amount: 10 }];
    const s = settle(5, bets);
    expect(favoriteDozenEffect(s, 7).multiplier).toBe(3);
  });

  it('does not trigger when dozen bet lost', () => {
    const bets: Bet[] = [{ type: 'dozen', value: '1', amount: 10 }];
    const s = settle(20, bets);
    expect(s.dozenWin).toBe(false);
    const effect = favoriteDozenEffect(s, 5);
    expect(effect.multiplier).toBe(1);
  });

  it('integrates with applyTalismans: dozenStreak 1 → ×1.5', () => {
    const bets: Bet[] = [{ type: 'dozen', value: '1', amount: 10 }];
    const s = settle(5, bets);
    const mods = applyTalismans(s, { relics: ['favoriteDozen'], streak: 0, dozenStreak: 1 });
    expect(mods.multiplier).toBe(1.5);
    expect(mods.notes.some((n) => n.startsWith('Dúzia Favorita'))).toBe(true);
  });

  it('appears in ROULETTE_CATALOG with cost 45', () => {
    const found = ROULETTE_CATALOG.find((t) => t.id === 'favoriteDozen');
    expect(found).toBeDefined();
    expect(found?.cost).toBe(45);
  });
});