import { describe, expect, it } from 'vitest';
import { applyTalismans, ROULETTE_CATALOG } from './roulette-talismans';
import { settle, type Bet } from './roulette';

describe('talisman: favoriteColor', () => {
  const winSettlement = (number: number, bets: Bet[]) => settle(number, bets);

  it('doubles net when a color bet won', () => {
    const bets: Bet[] = [{ type: 'color', value: 'red', amount: 10 }];
    const s = winSettlement(3, bets); // 3 is red
    const mods = applyTalismans(s, { relics: ['favoriteColor'], streak: 0 });
    expect(mods.multiplier).toBe(2);
    expect(mods.notes).toContain('Cor Favorita ×2');
  });

  it('does not trigger when no color bet won', () => {
    const bets: Bet[] = [{ type: 'number', value: '17', amount: 5 }];
    const s = winSettlement(17, bets); // number hit, but no color bet
    const mods = applyTalismans(s, { relics: ['favoriteColor'], streak: 0 });
    expect(mods.multiplier).toBe(1);
    expect(mods.notes.some((n) => n.startsWith('Cor Favorita'))).toBe(false);
  });

  it('does not apply to zero (green)', () => {
    const bets: Bet[] = [{ type: 'color', value: 'red', amount: 10 }];
    const s = winSettlement(0, bets); // zero, color bet loses
    // settlement.net is 0 (push — stake returned) or negative; favoriteColor only on positive net
    expect(s.net).toBeLessThanOrEqual(0);
    const mods = applyTalismans(s, { relics: ['favoriteColor'], streak: 0 });
    expect(mods.multiplier).toBe(1);
  });

  it('appears in ROULETTE_CATALOG with cost 50', () => {
    const found = ROULETTE_CATALOG.find((t) => t.id === 'favoriteColor');
    expect(found).toBeDefined();
    expect(found?.cost).toBe(50);
  });
});