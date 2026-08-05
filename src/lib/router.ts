/**
 * Roteador hash-based mínimo. Evita adicionar SvelteKit para 3 páginas.
 * URLs: "#/", "#/blackjack", "#/roulette".
 */
import { writable, type Writable } from 'svelte/store';

export type RouteName = 'home' | 'blackjack' | 'roulette' | 'not-found';

function readHash(): RouteName {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.hash.replace(/^#/, '') || '/';
  if (path === '/' || path === '') return 'home';
  if (path === '/blackjack') return 'blackjack';
  if (path === '/roulette') return 'roulette';
  return 'not-found';
}

export const route: Writable<RouteName> = writable(readHash());

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => route.set(readHash()));
}

export function navigate(path: '/' | '/blackjack' | '/roulette') {
  if (typeof window === 'undefined') return;
  window.location.hash = path;
}
