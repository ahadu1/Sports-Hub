import type { MatchState } from '@/features/match/types/match.types';

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

export type MatchTimelineApiEntry = {
  idTimeline?: string | null | undefined;
  idEvent?: string | null | undefined;
  idTeam?: string | null | undefined;
  strTimeline?: string | null | undefined;
  strTimelineDetail?: string | null | undefined;
  strEvent?: string | null | undefined;
  strPlayer?: string | null | undefined;
  strPlayerIn?: string | null | undefined;
  strPlayerOut?: string | null | undefined;
  strAssist?: string | null | undefined;
  strTeam?: string | null | undefined;
  intTime?: string | number | null | undefined;
  intTimeExtra?: string | number | null | undefined;
  strTime?: string | null | undefined;
};

export type MatchTimelineApiPayload = {
  lookup?: MatchTimelineApiEntry[] | string | null | undefined;
  timeline?: MatchTimelineApiEntry[] | string | null | undefined;
};

export type MatchTimelineMapContext = {
  homeTeamId?: string | undefined;
  awayTeamId?: string | undefined;
  homeTeamName?: string | undefined;
  awayTeamName?: string | undefined;
  matchState?: MatchState | undefined;
  homeScore?: number | null | undefined;
  awayScore?: number | null | undefined;
  halftimeHomeScore?: number | null | undefined;
  halftimeAwayScore?: number | null | undefined;
  kickoffLabel?: string | undefined;
  highlightLatestEvent?: boolean | undefined;
};

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
