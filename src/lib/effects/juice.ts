/**
 * Efeitos visuais extras: trail da bola, confetti, flash.
 * Todos respeitam `prefers-reduced-motion`.
 */
import { reducedMotion } from './audio';

const isBrowser = typeof window !== 'undefined';

export function ballTrail(x: number, y: number) {
  if (reducedMotion() || !isBrowser) return;
  const trail = document.createElement('div');
  trail.className = 'ball-trail';
  trail.style.left = `${x - 4}px`;
  trail.style.top = `${y - 4}px`;
  document.body.append(trail);
  setTimeout(() => trail.remove(), 500);
}

export function confettiBurst(target: HTMLElement | null) {
  if (reducedMotion() || !target || !isBrowser) return;
  const rect = target.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  for (let i = 0; i < 12; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${cx}px`;
    piece.style.top = `${cy}px`;
    piece.style.background = i % 3 ? '#e0b85d' : i % 2 ? '#76d5c0' : '#f3ead7';
    piece.style.transform = `translate(${(Math.random() - 0.5) * 60}px, 0)`;
    document.body.append(piece);
    setTimeout(() => piece.remove(), 1200);
  }
}

export function flashNumber(target: HTMLElement | null) {
  if (!target || !isBrowser) return;
  target.classList.remove('number-flash');
  void target.offsetWidth;
  target.classList.add('number-flash');
  setTimeout(() => target.classList.remove('number-flash'), 700);
}
