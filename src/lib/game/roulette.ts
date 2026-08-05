/**
 * Módulo puro da roleta europeia (37 casas, 0–36).
 * Pagamentos:
 *  - número cheio: 35:1
 *  - dúzia: 2:1
 *  - outras externas: 1:1
 * Sem zeros em apostas externas (mesma regra do cassino físico).
 */
import { SC_REDS } from './roulette-data';

export type RouletteColor = 'green' | 'red' | 'black';
export type BetType = 'number' | 'color' | 'even' | 'odd' | 'low' | 'high' | 'dozen';

export interface Bet {
  type: BetType;
  value: string;
  amount: number;
}

export function randomNumber(): number {
  const max = 2 ** 32 - (2 ** 32 % 37);
  const a = new Uint32Array(1);
  do {
    crypto.getRandomValues(a);
  } while (a[0]! >= max);
  return a[0]! % 37;
}

export function color(number: number): RouletteColor {
  if (number === 0) return 'green';
  return SC_REDS.has(number) ? 'red' : 'black';
}

export function odds(type: BetType, value: string, number: number): number {
  if (type === 'number') return number === Number(value) ? 35 : -1;
  if (number === 0) return -1;
  if (type === 'color') return color(number) === value ? 1 : -1;
  if (type === 'even') return number % 2 === 0 ? 1 : -1;
  if (type === 'odd') return number % 2 === 1 ? 1 : -1;
  if (type === 'low') return number <= 18 ? 1 : -1;
  if (type === 'high') return number >= 19 ? 1 : -1;
  if (type === 'dozen') return Math.ceil(number / 12) === Number(value) ? 2 : -1;
  return -1;
}

export function totalStake(bets: readonly Bet[]): number {
  return bets.reduce((acc, b) => acc + b.amount, 0);
}

export interface Settlement {
  readonly staked: number;
  readonly returned: number;
  readonly net: number;
  readonly types: Set<string>;
  readonly numberWin: boolean;
  readonly dozenWin: boolean;
  readonly colorWin: boolean;
  readonly luckyMultiplier: number;
}

export function settle(number: number, bets: readonly Bet[], luckyHouseActive = false): Settlement {
  let returned = 0;
  let numberWin = false;
  let dozenWin = false;
  let colorWin = false;
  let luckyMultiplier = 1;
  const types = new Set<string>();
  for (const bet of bets) {
    let pay = odds(bet.type, bet.value, number);
    if (luckyHouseActive && number === 0) {
      // Casa-Sorte: zero paga number:0 em ×5 E aciona externas em 1:1.
      if (bet.type === 'number') pay = 5;
      else if (bet.type !== 'dozen' && pay === -1) pay = 1;
    }
    if (pay > luckyMultiplier) luckyMultiplier = pay;
    if (pay >= 0) {
      returned += bet.amount * (pay + 1);
      types.add(bet.type);
      if (bet.type === 'number') numberWin = true;
      if (bet.type === 'dozen') dozenWin = true;
      if (bet.type === 'color') colorWin = true;
    }
  }
  const staked = totalStake(bets);
  return { staked, returned, net: returned - staked, types, numberWin, dozenWin, colorWin, luckyMultiplier };
}
