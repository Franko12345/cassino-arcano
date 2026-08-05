import { describe, expect, it } from 'vitest';
import { settle, type Bet } from './roulette';
import { applyTalismans, favoriteDozenEffect, ROULETTE_CATALOG } from './roulette-talismans';

describe('talisman: favoriteDozen', () => {
  // dozenStreak é o número de acertos consecutivos ANTES do acerto atual.
  // 1º acerto → dozenStreak=0 → +0.5 (multiplier 1.5)
  // 2º acerto → dozenStreak=1 → +1.0 (multiplier 2)
  // 3º acerto → dozenStreak=2 → +1.5 (multiplier 2.5)
  // 4º acerto → dozenStreak=3 → +2.0 → cap (multiplier 3)
  // 5º+ → cap (multiplier 3)

  it('first dozen hit gives ×1.5 (dozenStreak 0 → +0.5)', () => {
    const bets: Bet[] = [{ type: 'dozen', value: '1', amount: 10 }];
    const s = settle(5, bets);
    const effect = favoriteDozenEffect(s, 0);
    expect(effect.multiplier).toBe(1.5);
    expect(effect.notes[0]).toMatch(/Dúzia Favorita ×1\.5/);
  });

  it('second dozen hit gives ×2 (dozenStreak 1 → +1.0)', () => {
    const bets: Bet[] = [{ type: 'dozen', value: '1', amount: 10 }];
    const s = settle(5, bets);
    const effect = favoriteDozenEffect(s, 1);
    expect(effect.multiplier).toBe(2);
  });

  it('third dozen hit gives ×2.5 (dozenStreak 2 → +1.5)', () => {
    const bets: Bet[] = [{ type: 'dozen', value: '1', amount: 10 }];
    const s = settle(5, bets);
    const effect = favoriteDozenEffect(s, 2);
    expect(effect.multiplier).toBe(2.5);
  });

  it('fourth dozen hit caps at ×3', () => {
    const bets: Bet[] = [{ type: 'dozen', value: '1', amount: 10 }];
    const s = settle(5, bets);
    const effect = favoriteDozenEffect(s, 3);
    expect(effect.multiplier).toBe(3);
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

  it('integrates with applyTalismans: dozenStreak 2 → ×2.5', () => {
    const bets: Bet[] = [{ type: 'dozen', value: '1', amount: 10 }];
    const s = settle(5, bets);
    const mods = applyTalismans(s, { relics: ['favoriteDozen'], streak: 0, dozenStreak: 2 });
    expect(mods.multiplier).toBe(2.5);
    expect(mods.notes.some((n) => n.startsWith('Dúzia Favorita'))).toBe(true);
  });

  it('appears in ROULETTE_CATALOG with cost 45', () => {
    const found = ROULETTE_CATALOG.find((t) => t.id === 'favoriteDozen');
    expect(found).toBeDefined();
    expect(found?.cost).toBe(45);
  });
});