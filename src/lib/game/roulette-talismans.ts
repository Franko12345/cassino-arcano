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
  { id: 'tide', name: 'Maré', text: 'Vitórias seguidas: +8 por sequência.', cost: 55 },
  { id: 'favoriteColor', name: 'Cor Favorita', text: 'Cor apostada vencedora: líquido ×2.', cost: 50 },
  { id: 'shortBet', name: 'Aposta Curta', text: 'Total apostado ≤ 10: líquido ×1.5.', cost: 35 },
  { id: 'parityHot', name: 'Par/Ímpar de Sorte', text: 'Par/ímpar com streak ≥ 3: líquido ×3.', cost: 40 }
] as const;

export interface RouletteMods {
  /** Bônus fixo em fichas (soma aditiva aplicada ao `s.net`). */
  bonus: number;
  /** Multiplicador aplicado sobre (s.net + bonus) APENAS quando s.net > 0. */
  multiplier: number;
  /** Mensagens visíveis no breakdown da rodada. */
  notes: string[];
}

export const NO_MODS: RouletteMods = { bonus: 0, multiplier: 1, notes: [] };

/**
 * Aplica modificadores dos Talismãs sobre um settlement.
 * Política de aplicação (documentada na spec docs/specs/0002):
 *   1. Se s.net <= 0: só bônus fixos (Contrapeso) — sem multiplicador.
 *   2. Se s.net > 0: primeiro bônus fixos, depois multiplicador sobre (net + bonus).
 */
export function applyTalismans(settlement: Settlement, state: { relics: readonly string[]; streak: number }): RouletteMods {
  const mods: RouletteMods = { bonus: 0, multiplier: 1, notes: [] };
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
  if (state.relics.includes('favoriteColor') && settlement.colorWin) {
    mods.multiplier *= 2;
    mods.notes.push('Cor Favorita ×2');
  }
  if (state.relics.includes('shortBet') && settlement.staked <= 10) {
    mods.multiplier *= 1.5;
    mods.notes.push('Aposta Curta ×1.5');
  }
  if (state.relics.includes('parityHot') && state.streak >= 3 && (settlement.types.has('even') || settlement.types.has('odd'))) {
    mods.multiplier *= 3;
    mods.notes.push(`Par/Ímpar de Sorte ×3 (streak ${state.streak})`);
  }
  return mods;
}

/**
 * Aplica os modificadores no saldo: primeiro adiciona bônus fixos, depois multiplica o líquido positivo.
 * Centralizado aqui para que toda a política de Talismãs fique em uma camada pura.
 */
export function applyModsToBalance(mods: RouletteMods, baseNet: number): { net: number; extra: number } {
  if (baseNet <= 0 || mods.multiplier === 1) {
    return { net: baseNet + mods.bonus, extra: 0 };
  }
  const net = Math.round((baseNet + mods.bonus) * mods.multiplier);
  return { net, extra: net - (baseNet + mods.bonus) };
}