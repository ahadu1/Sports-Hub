import { describe, expect, it } from 'vitest';

import type {
  MatchTimelineApiEntry,
  MatchTimelineApiPayload,
  MatchTimelineMapContext,
  TimelineDividerItem,
} from '@/features/match/types/match-events.types';
import { mapMatchEventsTimeline } from '@/utils/match/matchEvents.mapper';

const baseContext: MatchTimelineMapContext = {
  homeTeamId: 'home',
  awayTeamId: 'away',
  homeTeamName: 'Home FC',
  awayTeamName: 'Away FC',
};

function createGoalEntry({
  id,
  teamId,
  minute,
  player,
}: {
  id: string;
  teamId: string;
  minute: number;
  player: string;
}): MatchTimelineApiEntry {
  return {
    idTimeline: id,
    idTeam: teamId,
    strEvent: 'Goal',
    strPlayer: player,
    intTime: minute,
  };
}

function createCardEntry({
  id,
  teamId,
  minute,
  player,
}: {
  id: string;
  teamId: string;
  minute: number;
  player: string;
}): MatchTimelineApiEntry {
  return {
    idTimeline: id,
    idTeam: teamId,
    strEvent: 'Red Card',
    strPlayer: player,
    intTime: minute,
  };
}

function createYellowCardEntry({
  id,
  teamId,
  minute,
  player,
}: {
  id: string;
  teamId: string;
  minute: number;
  player: string;
}): MatchTimelineApiEntry {
  return {
    idTimeline: id,
    idTeam: teamId,
    strEvent: 'Yellow Card',
    strPlayer: player,
    intTime: minute,
  };
}

function createDividerEntry({
  id,
  label,
  minute,
}: {
  id: string;
  label: string;
  minute?: number;
}): MatchTimelineApiEntry {
  return {
    idTimeline: id,
    strTimeline: label,
    ...(minute !== undefined ? { intTime: minute } : {}),
  };
}

function getDividerByLabel(items: ReturnType<typeof mapMatchEventsTimeline>, label: string) {
  return items.find(
    (item): item is TimelineDividerItem => item.kind === 'divider' && item.label === label,
  );
}

function getDividerCount(items: ReturnType<typeof mapMatchEventsTimeline>, label: string) {
  return items.filter((item) => item.kind === 'divider' && item.label === label).length;
}

describe('mapMatchEventsTimeline', () => {
  it('adds a halftime divider for finished matches when only full time is provided', () => {
    const payload: MatchTimelineApiPayload = {
      timeline: [
        createDividerEntry({ id: 'ft', label: 'Match Finished', minute: 90 }),
        createGoalEntry({ id: 'goal-52', teamId: 'away', minute: 52, player: 'Away Scorer' }),
        createGoalEntry({ id: 'goal-12', teamId: 'home', minute: 12, player: 'Home Scorer' }),
      ],
    };

    const items = mapMatchEventsTimeline(payload, {
      ...baseContext,
      matchState: 'finished',
      homeScore: 1,
      awayScore: 1,
      halftimeHomeScore: 1,
      halftimeAwayScore: 0,
    });

    expect(items.map((item) => (item.kind === 'divider' ? item.label : item.minute))).toEqual([
      'Full Time',
      "52'",
      'Half Time',
      "12'",
    ]);
    expect(getDividerByLabel(items, 'Half Time')).toMatchObject({ score: '1 - 0' });
  });

  it('adds a kickoff divider with the kickoff time when the timeline omits it', () => {
    const payload: MatchTimelineApiPayload = {
      timeline: [createGoalEntry({ id: 'goal-10', teamId: 'home', minute: 10, player: 'Scorer' })],
    };

    const items = mapMatchEventsTimeline(payload, {
      ...baseContext,
      matchState: 'live',
      kickoffLabel: '13:00',
    });

    expect(items.map((item) => (item.kind === 'divider' ? item.label : item.minute))).toEqual([
      "10'",
      'Kick Off',
    ]);
    expect(getDividerByLabel(items, 'Kick Off')).toMatchObject({
      dividerVariant: 'kickoff',
      score: '13:00',
    });
    const firstEvent = items.find((item) => item.kind === 'event');
    expect(firstEvent?.minute).toBe("10'");
    expect(firstEvent?.minute.includes(':')).toBe(false);
  });

  it('derives the halftime score from first-half goals when explicit halftime scores are unavailable', () => {
    const payload: MatchTimelineApiPayload = {
      timeline: [
        createDividerEntry({ id: 'ft', label: 'Match Finished', minute: 90 }),
        createGoalEntry({ id: 'goal-76', teamId: 'home', minute: 76, player: 'Late Winner' }),
        createGoalEntry({ id: 'goal-35', teamId: 'away', minute: 35, player: 'Away Equalizer' }),
        createGoalEntry({ id: 'goal-11', teamId: 'home', minute: 11, player: 'Home Opener' }),
      ],
    };

    const items = mapMatchEventsTimeline(payload, {
      ...baseContext,
      matchState: 'finished',
      homeScore: 2,
      awayScore: 1,
    });

    expect(getDividerByLabel(items, 'Half Time')).toMatchObject({ score: '1 - 1' });
  });

  it('adds halftime by assumption once the timeline crosses 45 minutes', () => {
    const payload: MatchTimelineApiPayload = {
      timeline: [
        createGoalEntry({ id: 'goal-68', teamId: 'home', minute: 68, player: 'Later Goal' }),
        createGoalEntry({ id: 'goal-42', teamId: 'away', minute: 42, player: 'Earlier Goal' }),
      ],
    };

    const items = mapMatchEventsTimeline(payload, {
      ...baseContext,
      kickoffLabel: '13:00',
    });

    expect(items.map((item) => (item.kind === 'divider' ? item.label : item.minute))).toEqual([
      "68'",
      'Half Time',
      "42'",
      'Kick Off',
    ]);
  });

  it('enriches API dividers without duplicating kickoff or halftime rows', () => {
    const payload: MatchTimelineApiPayload = {
      timeline: [
        createDividerEntry({ id: 'ft', label: 'Match Finished', minute: 90 }),
        createGoalEntry({ id: 'goal-12', teamId: 'home', minute: 12, player: 'Home Scorer' }),
        createDividerEntry({ id: 'ht', label: 'Half Time', minute: 45 }),
        createDividerEntry({ id: 'ko', label: 'Kick Off', minute: 0 }),
      ],
    };

    const items = mapMatchEventsTimeline(payload, {
      ...baseContext,
      matchState: 'finished',
      homeScore: 1,
      awayScore: 0,
      kickoffLabel: '13:00',
    });

    expect(getDividerCount(items, 'Kick Off')).toBe(1);
    expect(getDividerCount(items, 'Half Time')).toBe(1);
    expect(getDividerByLabel(items, 'Kick Off')).toMatchObject({ score: '13:00' });
    expect(getDividerByLabel(items, 'Half Time')).toMatchObject({ score: '1 - 0' });
  });

  it('uses the highlighted minute pill only for goal events', () => {
    const payload: MatchTimelineApiPayload = {
      timeline: [
        createCardEntry({ id: 'red-66', teamId: 'home', minute: 66, player: 'Defender' }),
        createGoalEntry({ id: 'goal-55', teamId: 'away', minute: 55, player: 'Striker' }),
      ],
    };

    const items = mapMatchEventsTimeline(payload, {
      ...baseContext,
      matchState: 'live',
      kickoffLabel: '13:00',
    });

    const redCardEvent = items.find((item) => item.kind === 'event' && item.minute === "66'");
    const goalEvent = items.find((item) => item.kind === 'event' && item.minute === "55'");

    expect(redCardEvent).toMatchObject({ kind: 'event', minuteVariant: 'default' });
    expect(goalEvent).toMatchObject({ kind: 'event', minuteVariant: 'active' });
  });

  it('labels red-card events as sent off', () => {
    const payload: MatchTimelineApiPayload = {
      timeline: [createCardEntry({ id: 'red-66', teamId: 'home', minute: 66, player: 'Van Dijk' })],
    };

    const items = mapMatchEventsTimeline(payload, {
      ...baseContext,
      matchState: 'live',
      kickoffLabel: '13:00',
    });

    expect(items.find((item) => item.kind === 'event' && item.minute === "66'")).toMatchObject({
      kind: 'event',
      home: {
        primaryText: 'Van Dijk',
        secondaryText: 'Sent Off',
        showSecondaryText: true,
      },
    });
  });

  it('shows only the player name for yellow-card events', () => {
    const payload: MatchTimelineApiPayload = {
      timeline: [
        createYellowCardEntry({ id: 'yellow-52', teamId: 'away', minute: 52, player: 'Saliba' }),
      ],
    };

    const items = mapMatchEventsTimeline(payload, {
      ...baseContext,
      matchState: 'live',
      kickoffLabel: '13:00',
    });

    expect(items.find((item) => item.kind === 'event' && item.minute === "52'")).toMatchObject({
      kind: 'event',
      away: {
        primaryText: 'Saliba',
        showSecondaryText: false,
      },
    });
  });
});
