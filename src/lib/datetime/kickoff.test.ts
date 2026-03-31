import { describe, expect, it } from 'vitest';

import {
  asValidDate,
  buildNormalizedKickoff,
  getKickoffPrimaryLabel,
  getLocalDayKey,
  parseKickoff,
} from '@/lib/datetime/kickoff';

describe('kickoff parser and normalizer', () => {
  it('parses a valid strTimestamp source first', () => {
    const parsed = parseKickoff(
      {
        strTimestamp: '2026-03-30T20:00:00Z',
        dateEvent: '2026-03-30',
        strTime: '20:00:00',
      },
      { userTimeZone: 'UTC' },
    );

    expect(parsed.parseSource).toBe('timestamp');
    expect(parsed.kickoffInstant?.toISOString()).toBe('2026-03-30T20:00:00.000Z');
  });

  it('falls back to dateEvent + strTime when timestamp is absent', () => {
    const parsed = parseKickoff(
      {
        dateEvent: '2026-03-30',
        strTime: '20:15:00',
      },
      { userTimeZone: 'UTC' },
    );

    expect(parsed.parseSource).toBe('utc_date_time');
    expect(parsed.kickoffInstant?.toISOString()).toBe('2026-03-30T20:15:00.000Z');
  });

  it('falls back to dateEventLocal + strTimeLocal when UTC fields are absent', () => {
    const parsed = parseKickoff(
      {
        dateEventLocal: '2026-03-30',
        strTimeLocal: '20:30:00',
      },
      { userTimeZone: 'UTC' },
    );

    expect(parsed.parseSource).toBe('local_date_time');
    expect(parsed.kickoffInstant).not.toBeNull();
  });

  it('flags discrepancies when dateEvent and dateEventLocal disagree', () => {
    const parsed = parseKickoff(
      {
        strTimestamp: '2026-03-30T20:00:00Z',
        dateEvent: '2026-03-30',
        dateEventLocal: '2026-03-29',
        strTime: '20:00:00',
        strTimeLocal: '20:00:00',
      },
      { userTimeZone: 'UTC' },
    );

    expect(parsed.hasDiscrepancy).toBe(true);
    expect(parsed.discrepancyReason).toBe('date_fields_disagree');
  });

  it('uses local day keys that can shift around midnight UTC', () => {
    const kickoff = buildNormalizedKickoff(
      {
        strTimestamp: '2026-03-30T00:30:00Z',
      },
      { userTimeZone: 'America/Los_Angeles' },
    );

    expect(kickoff.localDayKey).toBe('2026-03-29');
  });

  it('formats DST-boundary timestamps deterministically for the selected timezone', () => {
    const kickoff = buildNormalizedKickoff(
      {
        strTimestamp: '2026-03-08T07:30:00Z',
      },
      { userTimeZone: 'America/New_York' },
    );

    expect(kickoff.localDayKey).toBe('2026-03-08');
    expect(kickoff.localTimeLabel).toBe('03:30');
  });

  it('returns unparseable when time fields are missing', () => {
    const kickoff = buildNormalizedKickoff(
      {
        dateEvent: '2026-03-30',
      },
      { userTimeZone: 'UTC' },
    );

    expect(kickoff.parseSource).toBe('unparseable');
    expect(kickoff.kickoffInstant).toBeNull();
    expect(kickoff.fallbackLabel).toBe('Time unavailable');
  });

  it('returns unparseable when time field is malformed', () => {
    const kickoff = buildNormalizedKickoff(
      {
        dateEvent: '2026-03-30',
        strTime: '99:99',
      },
      { userTimeZone: 'UTC' },
    );

    expect(kickoff.parseSource).toBe('unparseable');
    expect(kickoff.kickoffInstant).toBeNull();
  });

  it('suppresses relative labels when discrepancy is present', () => {
    const kickoff = buildNormalizedKickoff(
      {
        strTimestamp: '2026-03-30T20:00:00Z',
        dateEvent: '2026-03-30',
        dateEventLocal: '2026-03-29',
      },
      {
        userTimeZone: 'UTC',
        now: new Date('2026-03-30T10:00:00Z'),
      },
    );

    expect(kickoff.hasDiscrepancy).toBe(true);
    expect(kickoff.relativeDayLabel).toBeNull();
  });

  it('suppresses relative labels for weaker local-only parse sources', () => {
    const kickoff = buildNormalizedKickoff(
      {
        dateEventLocal: '2026-03-30',
        strTimeLocal: '20:00:00',
      },
      {
        userTimeZone: 'UTC',
        now: new Date('2026-03-30T10:00:00Z'),
      },
    );

    expect(kickoff.parseSource).toBe('local_date_time');
    expect(kickoff.relativeDayLabel).toBeNull();
  });

  it('exposes UI-safe fallback labels when kickoff is null', () => {
    const kickoff = buildNormalizedKickoff(
      {
        strTimestamp: 'not-a-real-date',
      },
      { userTimeZone: 'UTC' },
    );

    expect(kickoff.kickoffInstant).toBeNull();
    expect(getKickoffPrimaryLabel(kickoff)).toBe('Time unavailable');
  });

  it('produces stable local day keys for selected-date comparisons', () => {
    const parsedDate = new Date('2026-03-30T08:30:00Z');
    expect(getLocalDayKey(parsedDate, 'UTC')).toBe('2026-03-30');
  });

  it('revives persisted ISO date strings into valid Date instances', () => {
    const revived = asValidDate('2026-03-30T20:00:00.000Z');

    expect(revived).toBeInstanceOf(Date);
    expect(revived?.toISOString()).toBe('2026-03-30T20:00:00.000Z');
  });

  it('returns null for invalid persisted date values', () => {
    expect(asValidDate('not-a-real-date')).toBeNull();
  });
});
