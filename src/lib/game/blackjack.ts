/**
 * Pontuação de blackjack: ás vale 1 ou 11, figuras valem 10.
 * Implementa "soft 17" automático via dois passes (Alto, depois Baixo).
 */
import { type Card, type Rank } from './cards';

export { type Card, type Rank } from './cards';

const FACE: readonly Rank[] = ['J', 'Q', 'K'];

export function score(hand: readonly Card[]): number {
  let total = 0;
  let aces = 0;
  for (const { rank } of hand) {
    if (rank === 'A') {
      total += 11;
      aces += 1;
    } else if (FACE.includes(rank)) {
      total += 10;
    } else {
      total += Number(rank);
    }
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

export function isNatural(hand: readonly Card[]): boolean {
  return hand.length === 2 && score(hand) === 21;
}

export function isBust(hand: readonly Card[]): boolean {
  return score(hand) > 21;
}
