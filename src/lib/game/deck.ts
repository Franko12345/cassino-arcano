/**
 * Módulo puro de aleatoriedade. Embaralhamento Fisher-Yates usando
 * `crypto.getRandomValues` para uniformidade independente do seed.
 */
import type { Card, Suit, Rank } from './cards';
import { SUITS, RANKS } from './cards';

export function makeDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit: suit as Suit, rank: rank as Rank });
    }
  }
  return deck;
}

export function shuffle(deck: Card[]): Card[] {
  const a = new Uint32Array(1);
  for (let i = deck.length - 1; i > 0; i--) {
    crypto.getRandomValues(a);
    const j = a[0]! % (i + 1);
    const tmp = deck[i]!;
    deck[i] = deck[j]!;
    deck[j] = tmp;
  }
  return deck;
}
