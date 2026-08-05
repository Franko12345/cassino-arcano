import { describe, expect, it } from 'vitest';
import { numberToAngle } from './roulette';
import { WHEEL_ORDER } from './roulette-data';

describe('numberToAngle (com WHEEL_ORDER)', () => {
  it('returns 0 for number 0 (number 0 está no índice 0 do WHEEL_ORDER)', () => {
    expect(numberToAngle(0)).toBeCloseTo(0, 0);
  });

  it('returns SLICE for number 32 (índice 1 no WHEEL_ORDER, 1 fatia de distância)', () => {
    expect(numberToAngle(32)).toBeCloseTo(360 / 37, 0);
  });

  it('returns 36 * SLICE para o número anterior ao 0 (índice 36 no WHEEL_ORDER)', () => {
    const lastN = WHEEL_ORDER[WHEEL_ORDER.length - 1]!;
    expect(numberToAngle(lastN)).toBeCloseTo(36 * (360 / 37), 0);
  });

  it('result is always in [0, 360) for all 37 numbers', () => {
    for (let n = 0; n <= 36; n++) {
      const a = numberToAngle(n);
      expect(a).toBeGreaterThanOrEqual(0);
      expect(a).toBeLessThan(360);
    }
  });

  it('é uma função pura (mesma entrada → mesma saída)', () => {
    const a1 = numberToAngle(15);
    const a2 = numberToAngle(15);
    expect(a1).toBe(a2);
  });

  it('números adjacentes no WHEEL_ORDER diferem por exatamente SLICE (mod wrap)', () => {
    const slice = 360 / 37;
    for (let i = 0; i < WHEEL_ORDER.length - 1; i++) {
      const n1 = WHEEL_ORDER[i]!;
      const n2 = WHEEL_ORDER[i + 1]!;
      const diff = Math.abs(numberToAngle(n2) - numberToAngle(n1));
      const wrapped = Math.min(diff, 360 - diff);
      expect(wrapped).toBeCloseTo(slice, 1);
    }
  });
});