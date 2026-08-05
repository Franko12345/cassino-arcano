/**
 * Catálogo de Talismãs do blackjack. Cinco slots, custo entre 35 e 50.
 * Cada efeito é uma função pura que recebe (result, state) e devolve modificador.
 * Se uma regra mudar, ajustar o efeito — não o estado.
 */
import type { Card } from './cards';
import { score, isNatural, isBust } from './blackjack';

export interface TalismanDef {
  readonly id: string;
  readonly name: string;
  readonly text: string;
  readonly cost: number;
}

export const BLACKJACK_CATALOG: readonly TalismanDef[] = [
  { id: 'anchor', name: 'Âncora', text: 'Vitória com 17–19: +12 fichas.', cost: 35 },
  { id: 'five', name: 'Cinco Pontas', text: 'Vitória com 5+ cartas: lucro ×1,5.', cost: 45 },
  { id: 'reserve', name: 'Reserva', text: 'Primeira derrota do ato devolve 10 fichas.', cost: 40 },
  { id: 'crown', name: 'Coroa Solar', text: 'Blackjack natural: +25 fichas.', cost: 50 },
  { id: 'stair', name: 'Escada', text: 'Cada vitória seguida: +5 fichas.', cost: 45 }
] as const;

export type BJOutcome =
  | { kind: 'win'; bet: number; playerScore: number; dealerScore: number; playerHand: Card[]; dealerHand: Card[] }
  | { kind: 'blackjack'; bet: number; playerScore: number; dealerScore: number; playerHand: Card[]; dealerHand: Card[] }
  | { kind: 'push'; bet: number; playerScore: number; dealerScore: number; playerHand: Card[]; dealerHand: Card[] }
  | { kind: 'loss'; bet: number; playerScore: number; dealerScore: number; playerHand: Card[]; dealerHand: Card[]; reason: 'bust' | 'dealer-blackjack' | 'lower' };

export interface BJMods {
  bonus: number;
  multiplier: number;
  notes: string[];
}

export const NO_MODS: BJMods = { bonus: 0, multiplier: 1, notes: [] };

export function applyTalismans(outcome: BJOutcome, state: { relics: readonly string[]; streak: number }): BJMods {
  const mods: BJMods = { bonus: 0, multiplier: 1, notes: [] };
  if (outcome.kind !== 'win' && outcome.kind !== 'blackjack') {
    if (outcome.kind === 'loss') {
      // Reserva is single-use per act, tracked outside
      if (state.relics.includes('reserve')) {
        mods.bonus += 10;
        mods.notes.push('Reserva +10');
      }
    }
    return mods;
  }
  if (state.relics.includes('anchor') && outcome.playerScore >= 17 && outcome.playerScore <= 19) {
    mods.bonus += 12;
    mods.notes.push('Âncora +12');
  }
  if (state.relics.includes('five') && outcome.playerHand.length >= 5) {
    mods.multiplier = 1.5;
    mods.notes.push('Cinco Pontas ×1,5');
  }
  if (state.relics.includes('crown') && outcome.kind === 'blackjack') {
    mods.bonus += 25;
    mods.notes.push('Coroa +25');
  }
  if (state.relics.includes('stair')) {
    const bonus = state.streak * 5;
    if (bonus > 0) {
      mods.bonus += bonus;
      mods.notes.push(`Escada +${bonus}`);
    }
  }
  return mods;
}

export function resolve(
  playerHand: Card[],
  dealerHand: Card[],
  bet: number
): BJOutcome {
  const playerScore = score(playerHand);
  const dealerScore = score(dealerHand);
  if (isBust(playerHand)) {
    return { kind: 'loss', bet, playerScore, dealerScore, playerHand, dealerHand, reason: 'bust' };
  }
  if (isNatural(playerHand) && !isNatural(dealerHand)) {
    return { kind: 'blackjack', bet, playerScore, dealerScore, playerHand, dealerHand };
  }
  if (isNatural(dealerHand) && !isNatural(playerHand)) {
    return { kind: 'loss', bet, playerScore, dealerScore, playerHand, dealerHand, reason: 'dealer-blackjack' };
  }
  if (dealerScore > 21 || playerScore > dealerScore) {
    return { kind: 'win', bet, playerScore, dealerScore, playerHand, dealerHand };
  }
  if (playerScore === dealerScore) {
    return { kind: 'push', bet, playerScore, dealerScore, playerHand, dealerHand };
  }
  return { kind: 'loss', bet, playerScore, dealerScore, playerHand, dealerHand, reason: 'lower' };
}
