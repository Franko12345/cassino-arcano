/**
 * Feedback procedural: áudio, partículas, shake.
 * Ativado após o primeiro gesto do usuário (autoplay policy).
 * Respeita `prefers-reduced-motion` em todo feedback visual.
 */

const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

let audio: AudioContext | null = null;
let sound = isBrowser ? localStorage.getItem('arcana-sound') !== 'off' : true;

export function getSound(): boolean {
  return sound;
}

export function setSound(value: boolean) {
  sound = value;
  if (isBrowser) localStorage.setItem('arcana-sound', value ? 'on' : 'off');
  if (value) tone(520, 0.12, 'sine', 0.04);
}

export function tone(freq = 420, duration = 0.06, type: OscillatorType = 'sine', gain = 0.035) {
  if (!sound || !isBrowser) return;
  audio ??= new AudioContext();
  const ctx = audio;
  const oscillator = ctx.createOscillator();
  const volume = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = freq;
  volume.gain.setValueAtTime(gain, ctx.currentTime);
  volume.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  oscillator.connect(volume).connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
}

export function reducedMotion(): boolean {
  if (!isBrowser) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function shake(target: HTMLElement | null, big = false) {
  if (!target || !isBrowser) return;
  target.classList.remove('shake', 'shake-big');
  void target.offsetWidth;
  target.classList.add(big ? 'shake-big' : 'shake');
  setTimeout(() => target.classList.remove('shake', 'shake-big'), 600);
}

export function burst(target: HTMLElement | null, big = false) {
  if (reducedMotion() || !target || !isBrowser) return;
  const count = big ? 20 : 8;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('i');
    p.className = 'burst';
    p.textContent = i % 2 ? '◆' : '✦';
    p.style.position = 'fixed';
    p.style.zIndex = '20';
    p.style.pointerEvents = 'none';
    p.style.fontSize = '1.1rem';
    p.style.left = `${45 + Math.random() * 10}%`;
    p.style.top = `${35 + Math.random() * 20}%`;
    p.style.setProperty('--x', `${(Math.random() - 0.5) * 260}px`);
    p.style.setProperty('--y', `${-40 - Math.random() * 180}px`);
    p.style.color = i % 3 ? '#e0b85d' : '#76d5c0';
    document.body.append(p);
    setTimeout(() => p.remove(), 750);
  }
}

export function celebrate(target: HTMLElement | null, big = false) {
  tone(big ? 660 : 520, 0.12, 'triangle', 0.05);
  if (big) setTimeout(() => tone(880, 0.18, 'sine', 0.045), 90);
  shake(target, big);
  burst(target, big);
}
