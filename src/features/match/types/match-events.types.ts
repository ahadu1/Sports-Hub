export type MatchEventSide = 'home' | 'away';

export type MatchEventType =
  | 'goal'
  | 'off-the-post'
  | 'substitution'
  | 'yellow-card'
  | 'red-card'
  | 'injury'
  | 'corner';

export type MatchMinuteVariant = 'default' | 'active';

export type MatchDividerVariant = 'default' | 'kickoff';

export type MatchTimelineApiSideEntry = {
  eventType: MatchEventType;
  primaryText: string;
  secondaryText?: string;
  showSecondaryText?: boolean;
};

export type MatchTimelineApiDividerItem = {
  id: string;
  kind: 'divider';
  label: string;
  score?: string;
  dividerVariant?: MatchDividerVariant;
};

export type MatchTimelineApiEventItem = {
  id: string;
  kind: 'event';
  minute: string;
  minuteVariant?: MatchMinuteVariant;
  home?: MatchTimelineApiSideEntry;
  away?: MatchTimelineApiSideEntry;
};

export type MatchTimelineApiItem = MatchTimelineApiDividerItem | MatchTimelineApiEventItem;

export type EventSideContent = {
  side: MatchEventSide;
  eventType: MatchEventType;
  primaryText: string;
  secondaryText?: string;
  showSecondaryText: boolean;
};

export type TimelineDividerItem = {
  id: string;
  kind: 'divider';
  label: string;
  score?: string;
  dividerVariant: MatchDividerVariant;
};

export type TimelineEventItem = {
  id: string;
  kind: 'event';
  minute: string;
  minuteVariant: MatchMinuteVariant;
  home?: EventSideContent;
  away?: EventSideContent;
};

export type TimelineItem = TimelineDividerItem | TimelineEventItem;
