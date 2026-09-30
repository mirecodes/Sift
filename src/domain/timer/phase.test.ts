import { describe, expect, it } from 'vitest';
import { effectiveFocusMs, formatClock, formatTimer, resolvePhase, startBreak, startFocus, timerDisplay } from './phase';

const MIN = 60_000;

describe('resolvePhase', () => {
  const focus = startFocus(1_000, 25 * MIN, 's1');

  it('stays focus until the planned time is reached', () => {
    expect(resolvePhase(focus, 1_000 + 25 * MIN - 1).kind).toBe('focus');
  });

  it('becomes focusOvertime exactly at the planned time, keeping the session id', () => {
    const p = resolvePhase(focus, 1_000 + 25 * MIN);
    expect(p.kind).toBe('focusOvertime');
    expect(p).toMatchObject({ sessionId: 's1', startedAt: 1_000 });
  });

  it('is derived from the clock only, so a long gap cannot be missed', () => {
    expect(resolvePhase(focus, 1_000 + 3 * 60 * MIN).kind).toBe('focusOvertime');
  });

  it('turns break into breakOver and keeps the reward id', () => {
    const b = startBreak(0, 5 * MIN, 'a1');
    expect(resolvePhase(b, 5 * MIN - 1).kind).toBe('break');
    expect(resolvePhase(b, 5 * MIN)).toEqual({ kind: 'breakOver', rewardId: 'a1' });
  });

  it('omits rewardId when there is none', () => {
    expect(resolvePhase(startBreak(0, MIN), MIN)).toEqual({ kind: 'breakOver' });
  });
});

describe('timerDisplay', () => {
  it('counts down during focus', () => {
    const p = resolvePhase(startFocus(0, 25 * MIN, 's'), 10 * MIN);
    expect(timerDisplay(p, 10 * MIN)).toEqual({ direction: 'down', ms: 15 * MIN });
  });

  it('counts up during overtime', () => {
    const now = 25 * MIN + 5 * MIN + 23_000;
    const p = resolvePhase(startFocus(0, 25 * MIN, 's'), now);
    const d = timerDisplay(p, now);
    expect(d?.direction).toBe('up');
    expect(formatClock(d?.ms ?? 0)).toBe('05:23');
  });

  it('has no timer when idle', () => {
    expect(timerDisplay({ kind: 'idle' }, 0)).toBeUndefined();
  });
});

describe('formatClock', () => {
  it('pads and floors', () => {
    expect(formatClock(0)).toBe('00:00');
    expect(formatClock(59_999)).toBe('00:59');
    expect(formatClock(25 * MIN)).toBe('25:00');
    expect(formatClock(75 * MIN + 1_000)).toBe('75:01');
    expect(formatClock(-5)).toBe('00:00');
  });
});

describe('effectiveFocusMs', () => {
  it('caps at 60 minutes', () => {
    expect(effectiveFocusMs(59 * MIN)).toBe(59 * MIN);
    expect(effectiveFocusMs(60 * MIN)).toBe(60 * MIN);
    expect(effectiveFocusMs(240 * MIN)).toBe(60 * MIN);
  });

  it('never goes negative (clock moved backwards)', () => {
    expect(effectiveFocusMs(-10)).toBe(0);
  });
});

describe('formatTimer', () => {
  it('rounds countdowns up so a fresh timer shows the full length', () => {
    expect(formatTimer({ direction: 'down', ms: 25 * MIN })).toBe('25:00');
    expect(formatTimer({ direction: 'down', ms: 25 * MIN - 1 })).toBe('25:00');
    expect(formatTimer({ direction: 'down', ms: 1 })).toBe('00:01');
    expect(formatTimer({ direction: 'down', ms: 0 })).toBe('00:00');
  });

  it('prefixes overtime with + and rounds down', () => {
    expect(formatTimer({ direction: 'up', ms: 5 * MIN + 23_999 })).toBe('+05:23');
  });
});
