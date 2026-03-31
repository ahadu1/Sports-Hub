import type {
  MatchDetailsHeaderEvent,
  MatchDetailsHeaderUiMeta,
} from '@/features/match/components/match-details-header.types';
import type { Fixture } from '@/features/fixtures/types/fixtures.types';
import type { TimelineItem } from '@/features/match/types/match-events.types';
import type { MatchDetail } from '@/features/match/types/match.types';
import { mapFixtureDisciplineFromTimelineItems } from '@/utils/fixtures/fixtureDiscipline.utils';
import { getPreferredMatchState } from '@/utils/match/matchStatus.utils';

function resolveHeaderActiveTab(
  matchDetail: MatchDetail | null | undefined,
  selectedFixture: Fixture | undefined,
): MatchDetailsHeaderUiMeta['activeTab'] {
  const preferredState = getPreferredMatchState(matchDetail?.state, selectedFixture?.state);
  const effectiveState = preferredState ?? matchDetail?.state ?? selectedFixture?.state;

  if (effectiveState === 'Match Postponed') {
    return 'details';
  }

  return 'events';
}

export function mapMatchDetailsHeaderEvent(
  matchDetail: MatchDetail | null | undefined,
  selectedFixture: Fixture | undefined,
  routeEventId: string,
): MatchDetailsHeaderEvent | null {
  const fallbackFixture =
    selectedFixture && selectedFixture.eventId === routeEventId ? selectedFixture : undefined;

  if (matchDetail) {
    const preferredMatchState = getPreferredMatchState(matchDetail.state, fallbackFixture?.state);

    return {
      idEvent: matchDetail.id,
      strLeague: matchDetail.leagueName,
      kickoff: matchDetail.kickoff,
      strHomeTeam: matchDetail.homeTeamName,
      strAwayTeam: matchDetail.awayTeamName,
      strHomeTeamBadge: matchDetail.homeTeamBadge,
      strAwayTeamBadge: matchDetail.awayTeamBadge,
      intHomeScore: matchDetail.homeScore ?? fallbackFixture?.homeScore ?? null,
      intAwayScore: matchDetail.awayScore ?? fallbackFixture?.awayScore ?? null,
      strStatus: matchDetail.status,
      matchState: preferredMatchState ?? matchDetail.state,
    };
  }

  if (fallbackFixture) {
    return {
      idEvent: fallbackFixture.eventId,
      strLeague: fallbackFixture.leagueName,
      kickoff: fallbackFixture.kickoff,
      strHomeTeam: fallbackFixture.home.name,
      strAwayTeam: fallbackFixture.away.name,
      strHomeTeamBadge: fallbackFixture.home.badgeSrc,
      strAwayTeamBadge: fallbackFixture.away.badgeSrc,
      intHomeScore: fallbackFixture.homeScore ?? null,
      intAwayScore: fallbackFixture.awayScore ?? null,
      strStatus: null,
      matchState: fallbackFixture.state,
    };
  }

  return null;
}

export function mapMatchDetailsHeaderUiMeta(
  matchDetail: MatchDetail | null | undefined,
  timelineItemsOrSelectedFixture: TimelineItem[] | Fixture | undefined = [],
  selectedFixture?: Fixture | undefined,
): MatchDetailsHeaderUiMeta {
  const timelineItems = Array.isArray(timelineItemsOrSelectedFixture)
    ? timelineItemsOrSelectedFixture
    : [];
  const resolvedSelectedFixture = Array.isArray(timelineItemsOrSelectedFixture)
    ? selectedFixture
    : timelineItemsOrSelectedFixture;
  const timelineDiscipline = mapFixtureDisciplineFromTimelineItems(timelineItems);
  const homeYellowCards = timelineDiscipline.filter(
    (item) => item.side === 'home' && item.card === 'yellow',
  ).length;
  const homeRedCards = timelineDiscipline.filter(
    (item) => item.side === 'home' && item.card === 'red',
  ).length;
  const awayYellowCards = timelineDiscipline.filter(
    (item) => item.side === 'away' && item.card === 'yellow',
  ).length;
  const awayRedCards = timelineDiscipline.filter(
    (item) => item.side === 'away' && item.card === 'red',
  ).length;

  return {
    activeTab: resolveHeaderActiveTab(matchDetail, resolvedSelectedFixture),
    homeYellowCards: Math.max(
      matchDetail?.summary.homeYellowCardDetails.length ?? 0,
      homeYellowCards,
    ),
    homeRedCards: Math.max(matchDetail?.summary.homeRedCardDetails.length ?? 0, homeRedCards),
    awayYellowCards: Math.max(
      matchDetail?.summary.awayYellowCardDetails.length ?? 0,
      awayYellowCards,
    ),
    awayRedCards: Math.max(matchDetail?.summary.awayRedCardDetails.length ?? 0, awayRedCards),
  };
}
