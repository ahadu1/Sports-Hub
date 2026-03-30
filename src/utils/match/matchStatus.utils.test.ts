import { describe, expect, it } from 'vitest';

import {
  getMatchRefetchInterval,
  getPreferredMatchState,
  isMatchActive,
  isMatchTerminal,
} from '@/utils/match/matchStatus.utils';

const scheduledMs = 60_000;
const activeMs = 15_000;

describe('matchStatus utils', () => {
  it('prefers a live fixture state while match detail is still scheduled', () => {
    expect(getPreferredMatchState('scheduled', 'live')).toBe('live');
    expect(getPreferredMatchState('scheduled', 'halftime')).toBe('halftime');
  });

  it('keeps match detail as the source of truth once it reaches a non-scheduled state', () => {
    expect(getPreferredMatchState('finished', 'live')).toBe('finished');
    expect(getPreferredMatchState('live', 'scheduled')).toBe('live');
  });

  it('treats live, halftime, and suspended matches as active', () => {
    expect(isMatchActive('live')).toBe(true);
    expect(isMatchActive('halftime')).toBe(true);
    expect(isMatchActive('suspended')).toBe(true);
    expect(isMatchActive('scheduled')).toBe(false);
  });

  it('treats completed and canceled outcomes as terminal', () => {
    expect(isMatchTerminal('finished')).toBe(true);
    expect(isMatchTerminal('canceled')).toBe(true);
    expect(isMatchTerminal('Match Postponed')).toBe(true);
    expect(isMatchTerminal('live')).toBe(false);
  });

  it('uses slower polling before kickoff and faster polling once active', () => {
    expect(getMatchRefetchInterval('scheduled', { scheduledMs, activeMs })).toBe(scheduledMs);
    expect(getMatchRefetchInterval('unknown', { scheduledMs, activeMs })).toBe(scheduledMs);
    expect(getMatchRefetchInterval('live', { scheduledMs, activeMs })).toBe(activeMs);
    expect(getMatchRefetchInterval('halftime', { scheduledMs, activeMs })).toBe(activeMs);
  });

  it('stops polling for terminal or missing states', () => {
    expect(getMatchRefetchInterval('finished', { scheduledMs, activeMs })).toBe(false);
    expect(getMatchRefetchInterval('awarded', { scheduledMs, activeMs })).toBe(false);
    expect(getMatchRefetchInterval(undefined, { scheduledMs, activeMs })).toBe(false);
  });
});
