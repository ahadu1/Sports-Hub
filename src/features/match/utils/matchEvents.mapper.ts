import type {
  EventSideContent,
  MatchEventSide,
  MatchTimelineApiItem,
  MatchTimelineApiSideEntry,
  TimelineDividerItem,
  TimelineEventItem,
  TimelineItem,
} from '@/features/match/types/match-events.types';

function mapSideContent(
  side: MatchEventSide,
  content?: MatchTimelineApiSideEntry,
): EventSideContent | undefined {
  if (!content) {
    return undefined;
  }

  const mappedContent: EventSideContent = {
    side,
    eventType: content.eventType,
    primaryText: content.primaryText,
    showSecondaryText: content.showSecondaryText ?? Boolean(content.secondaryText),
  };

  if (content.secondaryText !== undefined) {
    mappedContent.secondaryText = content.secondaryText;
  }

  return mappedContent;
}

export function mapMatchEventsTimeline(items: MatchTimelineApiItem[]): TimelineItem[] {
  return items.map((item) => {
    if (item.kind === 'divider') {
      const mappedDivider: TimelineDividerItem = {
        id: item.id,
        kind: 'divider',
        label: item.label,
        dividerVariant: item.dividerVariant ?? 'default',
      };

      if (item.score !== undefined) {
        mappedDivider.score = item.score;
      }

      return mappedDivider;
    }

    const mappedEvent: TimelineEventItem = {
      id: item.id,
      kind: 'event',
      minute: item.minute,
      minuteVariant: item.minuteVariant ?? 'default',
    };

    const home = mapSideContent('home', item.home);
    const away = mapSideContent('away', item.away);

    if (home) {
      mappedEvent.home = home;
    }

    if (away) {
      mappedEvent.away = away;
    }

    return mappedEvent;
  });
}
