import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { colors, motion } from './tokens';

const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');
const token = (name: string) => new RegExp(`--${name}:\\s*([^;]+);`).exec(css)?.[1]?.trim();

describe('tokens.ts mirrors tokens.css', () => {
  it('colors', () => {
    expect(token('color-primary')).toBe(colors.primary);
    expect(token('color-canvas')).toBe(colors.canvas);
    expect(token('color-hairline')).toBe(colors.hairline);
    expect(token('color-mute-soft')).toBe(colors.muteSoft);
    expect(token('color-accent-purple')).toBe(colors.accentPurple);
    expect(token('color-accent-orange')).toBe(colors.accentOrange);
    expect(token('color-accent-pink')).toBe(colors.accentPink);
  });

  it('motion', () => {
    expect(token('motion-fast')).toBe(`${motion.fast}ms`);
    expect(token('motion-base')).toBe(`${motion.base}ms`);
    expect(token('motion-slow')).toBe(`${motion.slow}ms`);
    expect(token('motion-scene')).toBe(`${motion.scene}ms`);
  });
});
