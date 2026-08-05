import { describe, expect, it } from 'vitest';
import { numberToAngle } from './roulette';
import { WHEEL_ORDER } from './roulette-data';

describe('numberToAngle (com WHEEL_ORDER)', () => {
  it('returns 0 for number 0 (WHEEL[0] = 0, no rotation needed)', () => {
    expect(numberToAngle(0)).toBeCloseTo(0, 0);
  });

  it('returns 36 * SLICE for number 32 (WHEEL[1], so girar 36 fatias para trazê-lo ao topo)', () => {
    expect(numberToAngle(32)).toBeCloseTo(36 * (360 / 37), 0);
  });

  it('returns SLICE for the last number in WHEEL_ORDER (WHEEL[36], girar 1 fatia)', () => {
    const lastN = WHEEL_ORDER[WHEEL_ORDER.length - 1]!;
    expect(numberToAngle(lastN)).toBeCloseTo(360 / 37, 0);
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

  it('girar pelo ângulo correto traz a casa certa para o topo', () => {
    for (let n = 0; n <= 36; n++) {
      const pos = WHEEL_ORDER.indexOf(n);
      // Após girar clockwise pelo ângulo, a casa no topo deve ser a de posição (37-pos) % 37.
      // O item que estava em (-angle mod 360) vai parar em 0°.
      // (37-pos) * SLICE = ângulo. (-angle) mod 360 = (-(37-pos)*SLICE) mod 360 = pos*SLICE.
      const angle = numberToAngle(n);
      const houseAtTop = (-angle + 360) % 360;
      const expectedHouseAtTop = pos * (360 / 37);
      expect(Math.abs(houseAtTop - expectedHouseAtTop)).toBeLessThan(0.01);
    }
  });
});