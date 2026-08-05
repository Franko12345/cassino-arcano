/**
 * Configuração comum a ambos os jogos: 5 atos, vidas, metas de lucro.
 * Os números de `targets` são calibrados para uma partida padrão com Talismãs
 * mínimos. Mudanças aqui são mudanças de balanceamento e devem ser revisadas
 * via spec + ADR.
 */
export const ACT_COUNT = 5;
export const STARTING_LIVES = 3;
export const STARTING_BALANCE = 250;

export const BLACKJACK_TARGETS: readonly number[] = [80, 140, 220, 320, 450];
export const ROULETTE_TARGETS: readonly number[] = [100, 180, 290, 430, 620];

export const BLACKJACK_MAX_ROUNDS = 5;
export const ROULETTE_MAX_ROUNDS = 6;

export const BLACKJACK_BET_OPTIONS: readonly number[] = [10, 20, 50, 100];
export const ROULETTE_CHIP_OPTIONS: readonly number[] = [5, 10, 25, 50];

/** Consumível "Casa-Sorte": aparece na loja entre atos com chance LUCKY_HOUSE_CHANCE,
 *  custo LUCKY_HOUSE_COST. Uso único por ato; some ao final do ato.
 */
export const LUCKY_HOUSE_COST = 60;
export const LUCKY_HOUSE_CHANCE = 0.3;
