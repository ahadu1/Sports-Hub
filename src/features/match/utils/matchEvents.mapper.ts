import type {
  EventSideContent,
  MatchEventSide,
  MatchEventType,
  MatchTimelineApiEntry,
  MatchTimelineApiPayload,
  MatchTimelineMapContext,
  TimelineDividerItem,
  TimelineEventItem,
  TimelineItem,
} from '@/features/match/types/match-events.types';

type NormalizedTimelineEvent = {
  id: string;
  side: MatchEventSide;
  eventType: MatchEventType;
  minute: string;
  sortMinute: number;
  primaryText: string;
  secondaryText?: string;
  sourceIndex: number;
};

type NormalizedTimelineDivider = TimelineDividerItem & {
  sortMinute: number;
  sourceIndex: number;
};

type OrderedTimelineItem = {
  item: TimelineItem;
  sortMinute: number;
  sourceIndex: number;
};

function normalizeString(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function isGenericSubstitutionLabel(value: string | undefined): boolean {
  return value !== undefined && /^substitution(?:\s+\d+)?$/i.test(value);
}

function parseMinuteValue(value: string | number | null | undefined): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const match = value.trim().match(/^(\d+)/);
  if (!match) {
    return undefined;
  }

  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseMinuteParts(
  entry: MatchTimelineApiEntry,
): { minute: number; extra?: number } | undefined {
  const directMinute = parseMinuteValue(entry.intTime) ?? parseMinuteValue(entry.strTime);
  const directExtra = parseMinuteValue(entry.intTimeExtra);

  if (directMinute !== undefined) {
    return directExtra !== undefined
      ? { minute: directMinute, extra: directExtra }
      : { minute: directMinute };
  }

  const timelineValue = normalizeString(entry.strTimeline) ?? normalizeString(entry.strEvent);
  if (!timelineValue) {
    return undefined;
  }

  const minuteMatch = timelineValue.match(/(\d+)(?:\+(\d+))?/);
  if (!minuteMatch) {
    return undefined;
  }

  const minute = Number(minuteMatch[1]);
  const extra = minuteMatch[2] ? Number(minuteMatch[2]) : undefined;

  if (!Number.isFinite(minute)) {
    return undefined;
  }

  return extra !== undefined && Number.isFinite(extra) ? { minute, extra } : { minute };
}

function formatMinuteLabel(entry: MatchTimelineApiEntry): string | undefined {
  const minuteParts = parseMinuteParts(entry);
  if (!minuteParts) {
    return undefined;
  }

  return minuteParts.extra !== undefined && minuteParts.extra > 0
    ? `${minuteParts.minute}+${minuteParts.extra}'`
    : `${minuteParts.minute}'`;
}

function getSortMinute(entry: MatchTimelineApiEntry): number | undefined {
  const minuteParts = parseMinuteParts(entry);
  if (!minuteParts) {
    return undefined;
  }

  return minuteParts.minute + (minuteParts.extra ?? 0) / 100;
}

function getEventType(entry: MatchTimelineApiEntry): MatchEventType | undefined {
  const haystack = [
    normalizeString(entry.strTimeline),
    normalizeString(entry.strTimelineDetail),
    normalizeString(entry.strEvent),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (!haystack) {
    return undefined;
  }

  if (haystack.includes('penalty') && !haystack.includes('miss')) {
    return 'goal';
  }

  if (haystack.includes('own goal')) {
    return 'goal';
  }

  if (
    haystack.includes('off the post') ||
    haystack.includes('off-the-post') ||
    haystack.includes('woodwork')
  ) {
    return 'off-the-post';
  }

  if (haystack.includes('substitution') || haystack.includes('sub')) {
    return 'substitution';
  }

  if (haystack.includes('yellow')) {
    return 'yellow-card';
  }

  if (
    haystack.includes('red') ||
    haystack.includes('sent off') ||
    haystack.includes('second yellow')
  ) {
    return 'red-card';
  }

  if (haystack.includes('injury') || haystack.includes('injured')) {
    return 'injury';
  }

  if (haystack.includes('corner')) {
    return 'corner';
  }

  if (haystack.includes('goal')) {
    return 'goal';
  }

  return undefined;
}

function getEventSide(
  entry: MatchTimelineApiEntry,
  context: MatchTimelineMapContext,
): MatchEventSide | undefined {
  const idTeam = normalizeString(entry.idTeam);
  if (idTeam && context.homeTeamId && idTeam === context.homeTeamId) {
    return 'home';
  }
  if (idTeam && context.awayTeamId && idTeam === context.awayTeamId) {
    return 'away';
  }

  const teamLabel = normalizeString(entry.strTeam)?.toLowerCase();
  const normalizedHomeTeam = context.homeTeamName?.toLowerCase();
  const normalizedAwayTeam = context.awayTeamName?.toLowerCase();

  if (
    teamLabel &&
    normalizedHomeTeam &&
    (teamLabel === normalizedHomeTeam ||
      teamLabel.includes(normalizedHomeTeam) ||
      normalizedHomeTeam.includes(teamLabel))
  ) {
    return 'home';
  }
  if (
    teamLabel &&
    normalizedAwayTeam &&
    (teamLabel === normalizedAwayTeam ||
      teamLabel.includes(normalizedAwayTeam) ||
      normalizedAwayTeam.includes(teamLabel))
  ) {
    return 'away';
  }

  return undefined;
}

function getEventTexts(
  entry: MatchTimelineApiEntry,
  eventType: MatchEventType,
): { primaryText?: string; secondaryText?: string } {
  const player = normalizeString(entry.strPlayer);
  const playerIn = normalizeString(entry.strPlayer);
  const playerOut = normalizeString(entry.strAssist);
  const assist = normalizeString(entry.strAssist);
  const detail = normalizeString(entry.strTimelineDetail);
  const timelineLabel = normalizeString(entry.strTimeline);
  const eventLabel = normalizeString(entry.strEvent);

  switch (eventType) {
    case 'substitution': {
      const outgoingPlayer = playerOut ?? player;
      const incomingPlayer =
        playerIn ??
        (detail && detail !== outgoingPlayer && detail !== eventLabel && detail !== timelineLabel
          ? detail
          : undefined);
      const primaryText = outgoingPlayer ?? incomingPlayer ?? timelineLabel;
      return {
        ...(primaryText !== undefined ? { primaryText } : {}),
        ...(incomingPlayer !== undefined && incomingPlayer !== primaryText
          ? { secondaryText: incomingPlayer }
          : {}),
      };
    }
    case 'goal': {
      const primaryText = player ?? detail ?? eventLabel ?? timelineLabel;
      return {
        ...(primaryText !== undefined ? { primaryText } : {}),
        ...(assist !== undefined ? { secondaryText: assist } : {}),
      };
    }
    case 'corner': {
      const primaryText = detail ?? player ?? eventLabel ?? timelineLabel;
      return primaryText !== undefined ? { primaryText } : {};
    }
    case 'yellow-card':
    case 'red-card':
    case 'injury':
    case 'off-the-post': {
      const primaryText = player ?? detail ?? eventLabel ?? timelineLabel;
      const secondaryText =
        detail && detail !== player && detail !== eventLabel && detail !== timelineLabel
          ? detail
          : undefined;
      return {
        ...(primaryText !== undefined ? { primaryText } : {}),
        ...(secondaryText !== undefined ? { secondaryText } : {}),
      };
    }
    default:
      return {};
  }
}

function mapSideContent(event: NormalizedTimelineEvent): EventSideContent {
  return {
    side: event.side,
    eventType: event.eventType,
    primaryText: event.primaryText,
    showSecondaryText: Boolean(event.secondaryText),
    ...(event.secondaryText !== undefined ? { secondaryText: event.secondaryText } : {}),
  };
}

function formatScoreLabel(
  homeScore: number | null | undefined,
  awayScore: number | null | undefined,
): string | undefined {
  if (
    homeScore === null ||
    homeScore === undefined ||
    awayScore === null ||
    awayScore === undefined
  ) {
    return undefined;
  }

  return `${homeScore} - ${awayScore}`;
}

function getDividerLabel(entry: MatchTimelineApiEntry): TimelineDividerItem | undefined {
  const haystack = [
    normalizeString(entry.strTimeline),
    normalizeString(entry.strTimelineDetail),
    normalizeString(entry.strEvent),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (!haystack) {
    return undefined;
  }

  if (haystack.includes('kick off') || haystack.includes('kickoff')) {
    return {
      id: normalizeString(entry.idTimeline) ?? 'kickoff-divider',
      kind: 'divider',
      label: 'Kick Off',
      dividerVariant: 'kickoff',
    };
  }

  if (haystack.includes('half time') || haystack === 'ht') {
    return {
      id: normalizeString(entry.idTimeline) ?? 'halftime-divider',
      kind: 'divider',
      label: 'Half Time',
      dividerVariant: 'default',
    };
  }

  if (haystack.includes('full time') || haystack.includes('match finished')) {
    return {
      id: normalizeString(entry.idTimeline) ?? 'fulltime-divider',
      kind: 'divider',
      label: 'Full Time',
      dividerVariant: 'default',
    };
  }

  return undefined;
}

function mapTimelineDividerEntry(
  entry: MatchTimelineApiEntry,
  index: number,
  context: MatchTimelineMapContext,
): NormalizedTimelineDivider | undefined {
  const divider = getDividerLabel(entry);
  if (!divider) {
    return undefined;
  }

  const score = formatScoreLabel(context.homeScore, context.awayScore);
  const sortMinute =
    getSortMinute(entry) ??
    (divider.label === 'Half Time' ? 45 : divider.label === 'Full Time' ? 90 : 0);

  if (score) {
    return {
      ...divider,
      score,
      sortMinute,
      sourceIndex: index,
    };
  }

  return {
    ...divider,
    sortMinute,
    sourceIndex: index,
  };
}

function mapTimelineEntry(
  entry: MatchTimelineApiEntry,
  index: number,
  context: MatchTimelineMapContext,
): NormalizedTimelineEvent | undefined {
  const minute = formatMinuteLabel(entry);
  const sortMinute = getSortMinute(entry);
  const eventType = getEventType(entry);
  const side = getEventSide(entry, context);

  if (!minute || sortMinute === undefined || !eventType || !side) {
    return undefined;
  }

  const texts = getEventTexts(entry, eventType);
  if (!texts.primaryText) {
    return undefined;
  }

  return {
    id: normalizeString(entry.idTimeline) ?? `${minute}-${side}-${eventType}-${index}`,
    side,
    eventType,
    minute,
    sortMinute,
    primaryText: texts.primaryText,
    ...(texts.secondaryText !== undefined ? { secondaryText: texts.secondaryText } : {}),
    sourceIndex: index,
  };
}

function createMergedEventRows(
  events: NormalizedTimelineEvent[],
  context: MatchTimelineMapContext,
): OrderedTimelineItem[] {
  const collapsedEvents: NormalizedTimelineEvent[] = [];
  const pendingSubstitutions = new Map<string, NormalizedTimelineEvent>();

  events.forEach((event) => {
    if (event.eventType !== 'substitution' || !isGenericSubstitutionLabel(event.secondaryText)) {
      collapsedEvents.push(event);
      return;
    }

    const substitutionKey = `${event.minute}::${event.side}::${event.secondaryText?.toLowerCase()}`;
    const pendingEvent = pendingSubstitutions.get(substitutionKey);

    if (!pendingEvent) {
      pendingSubstitutions.set(substitutionKey, event);
      return;
    }

    pendingSubstitutions.delete(substitutionKey);
    const [firstPlayerEvent, secondPlayerEvent] = [pendingEvent, event].sort(
      (left, right) => left.sourceIndex - right.sourceIndex,
    ) as [NormalizedTimelineEvent, NormalizedTimelineEvent];

    collapsedEvents.push({
      ...firstPlayerEvent,
      secondaryText: secondPlayerEvent.primaryText,
      sourceIndex: Math.max(firstPlayerEvent.sourceIndex, secondPlayerEvent.sourceIndex),
    });
  });

  pendingSubstitutions.forEach((event) => {
    collapsedEvents.push({
      id: event.id,
      side: event.side,
      eventType: event.eventType,
      minute: event.minute,
      sortMinute: event.sortMinute,
      primaryText: event.primaryText,
      sourceIndex: event.sourceIndex,
    });
  });

  collapsedEvents.sort((left, right) => {
    if (right.sortMinute !== left.sortMinute) {
      return right.sortMinute - left.sortMinute;
    }

    return right.sourceIndex - left.sourceIndex;
  });

  const rows: Array<{
    item: TimelineEventItem;
    sortMinute: number;
    sourceIndex: number;
  }> = [];
  const mergeIndexByKey = new Map<string, number>();

  collapsedEvents.forEach((event) => {
    const mergeKey = `${event.minute}::${event.eventType}`;
    const existingIndex = mergeIndexByKey.get(mergeKey);

    if (existingIndex !== undefined) {
      const existingRow = rows[existingIndex];
      if (existingRow && event.side === 'home' && !existingRow.item.home) {
        existingRow.item.home = mapSideContent(event);
        return;
      }

      if (existingRow && event.side === 'away' && !existingRow.item.away) {
        existingRow.item.away = mapSideContent(event);
        return;
      }
    }

    rows.push({
      item: {
        id: event.id,
        kind: 'event',
        minute: event.minute,
        minuteVariant: 'default',
        ...(event.side === 'home'
          ? { home: mapSideContent(event) }
          : { away: mapSideContent(event) }),
      },
      sortMinute: event.sortMinute,
      sourceIndex: event.sourceIndex,
    });
    mergeIndexByKey.set(mergeKey, rows.length - 1);
  });

  const firstEventRow = rows[0]?.item;
  if (firstEventRow && context.highlightLatestEvent) {
    firstEventRow.minuteVariant = 'active';
  }

  return rows.map((row) => ({
    item: row.item,
    sortMinute: row.sortMinute,
    sourceIndex: row.sourceIndex,
  }));
}

function createStateDivider(
  context: MatchTimelineMapContext,
  sortMinute: number,
): OrderedTimelineItem | undefined {
  if (context.matchState !== 'finished' && context.matchState !== 'halftime') {
    return undefined;
  }

  const score = formatScoreLabel(context.homeScore, context.awayScore);

  return {
    item: {
      id: `state-divider-${context.matchState}`,
      kind: 'divider',
      label: context.matchState === 'finished' ? 'Full Time' : 'Half Time',
      ...(score
        ? {
            dividerVariant: 'default' as const,
            score,
          }
        : { dividerVariant: 'default' as const }),
    },
    sortMinute,
    sourceIndex: Number.MAX_SAFE_INTEGER,
  };
}

function mapOrderedDivider(divider: NormalizedTimelineDivider): OrderedTimelineItem {
  return {
    item: divider.score
      ? {
          id: divider.id,
          kind: 'divider',
          label: divider.label,
          score: divider.score,
          dividerVariant: divider.dividerVariant,
        }
      : {
          id: divider.id,
          kind: 'divider',
          label: divider.label,
          dividerVariant: divider.dividerVariant,
        },
    sortMinute: divider.sortMinute,
    sourceIndex: divider.sourceIndex,
  };
}

export function mapMatchEventsTimeline(
  payload: MatchTimelineApiPayload,
  context: MatchTimelineMapContext = {},
): TimelineItem[] {
  const timelineEntries = Array.isArray(payload.lookup)
    ? payload.lookup
    : Array.isArray(payload.timeline)
      ? payload.timeline
      : [];
  const normalizedDividers = timelineEntries
    .map((entry, index) => mapTimelineDividerEntry(entry, index, context))
    .filter((item): item is NormalizedTimelineDivider => item !== undefined);

  const normalizedEvents = timelineEntries
    .map((entry, index) => mapTimelineEntry(entry, index, context))
    .filter((item): item is NormalizedTimelineEvent => item !== undefined);

  normalizedEvents.sort((left, right) => {
    if (right.sortMinute !== left.sortMinute) {
      return right.sortMinute - left.sortMinute;
    }

    return right.sourceIndex - left.sourceIndex;
  });

  const orderedItems = [
    ...createMergedEventRows(normalizedEvents, context),
    ...normalizedDividers.map((divider) => mapOrderedDivider(divider)),
  ];

  const stateDivider = createStateDivider(context, (orderedItems[0]?.sortMinute ?? 0) + 0.01);
  if (stateDivider && stateDivider.item.kind === 'divider') {
    const stateDividerLabel = stateDivider.item.label;
    if (!normalizedDividers.some((divider) => divider.label === stateDividerLabel)) {
      orderedItems.push(stateDivider);
    }
  }

  return orderedItems
    .sort((left, right) => {
      if (right.sortMinute !== left.sortMinute) {
        return right.sortMinute - left.sortMinute;
      }

      return right.sourceIndex - left.sourceIndex;
    })
    .map((entry) => entry.item);
}
