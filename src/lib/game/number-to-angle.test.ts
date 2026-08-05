import { describe, expect, it } from 'vitest';
import { numberToAngle } from './roulette';

describe('numberToAngle', () => {
  it('returns 0 for number 0', () => {
    expect(numberToAngle(0)).toBeCloseTo(0, 0);
  });

  it('returns SLICE for number 36 (one slice from full circle)', () => {
    expect(numberToAngle(36)).toBeCloseTo(360 / 37, 0);
  });

  it('returns (37 - N) * SLICE for other numbers', () => {
    // number 18 → (37-18) = 19 fatias ≈ 184.86°
    expect(numberToAngle(18)).toBeCloseTo(19 * (360 / 37), 0);
  });

  it('result is always in [0, 360)', () => {
    for (const n of [0, 1, 9, 17, 18, 26, 35, 36]) {
      const a = numberToAngle(n);
      expect(a).toBeGreaterThanOrEqual(0);
      expect(a).toBeLessThan(360);
    }
  });

  it('adjacent numbers differ by exactly SLICE (modulo wrap-around)', () => {
    const slice = 360 / 37;
    for (let n = 0; n < 36; n++) {
      const diff = Math.abs(numberToAngle(n + 1) - numberToAngle(n));
      const wrapped = Math.min(diff, 360 - diff);
      expect(wrapped).toBeCloseTo(slice, 1);
    }
  });
});
