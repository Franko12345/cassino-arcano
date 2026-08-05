/**
 * Catálogo de Talismãs da roleta. Mesma forma do blackjack.
 * Cada efeito é puro e recebe (settlement, state) e devolve modificador.
 */
import type { Settlement } from './roulette';

export interface TalismanDef {
  readonly id: string;
  readonly name: string;
  readonly text: string;
  readonly cost: number;
}

export const ROULETTE_CATALOG: readonly TalismanDef[] = [
  { id: 'prism', name: 'Prisma', text: 'Ganho com 3+ tipos apostados: +15.', cost: 45 },
  { id: 'precision', name: 'Agulha', text: 'Número cheio vencedor: +40.', cost: 60 },
  { id: 'weight', name: 'Contrapeso', text: 'Primeira perda do ato devolve 10.', cost: 40 },
  { id: 'trio', name: 'Trinca', text: 'Dúzia vencedora: +15.', cost: 45 },
  { id: 'tide', name: 'Maré', text: 'Vitórias seguidas: +8 por sequência.', cost: 55 }
] as const;

export interface RouletteMods {
  bonus: number;
  notes: string[];
}

export const NO_MODS: RouletteMods = { bonus: 0, notes: [] };

export function applyTalismans(settlement: Settlement, state: { relics: readonly string[]; streak: number }): RouletteMods {
  const mods: RouletteMods = { bonus: 0, notes: [] };
  if (settlement.net <= 0) {
    if (settlement.net < 0 && state.relics.includes('weight')) {
      mods.bonus += 10;
      mods.notes.push('Contrapeso +10');
    }
    return mods;
  }
  if (state.relics.includes('prism') && settlement.types.size >= 3) {
    mods.bonus += 15;
    mods.notes.push('Prisma +15');
  }
  if (state.relics.includes('precision') && settlement.numberWin) {
    mods.bonus += 40;
    mods.notes.push('Agulha +40');
  }
  if (state.relics.includes('trio') && settlement.dozenWin) {
    mods.bonus += 15;
    mods.notes.push('Trinca +15');
  }
  if (state.relics.includes('tide')) {
    const bonus = state.streak * 8;
    if (bonus > 0) {
      mods.bonus += bonus;
      mods.notes.push(`Maré +${bonus}`);
    }
  }
  return mods;
}
