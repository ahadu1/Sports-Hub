import type {
  MatchDetailsHeaderEvent,
  MatchDetailsHeaderUiMeta,
} from '@/features/match/components/match-details-header.types';
import type { Fixture } from '@/features/fixtures/types/fixtures.types';
import type { MatchDetail } from '@/features/match/types/match.types';

export function mapMatchDetailsHeaderEvent(
  matchDetail: MatchDetail | null | undefined,
  selectedFixture: Fixture | undefined,
  routeEventId: string,
): MatchDetailsHeaderEvent | null {
  if (matchDetail) {
    return {
      idEvent: matchDetail.id,
      strLeague: matchDetail.leagueName,
      dateEvent: matchDetail.dateEvent,
      strHomeTeam: matchDetail.homeTeamName,
      strAwayTeam: matchDetail.awayTeamName,
      strHomeTeamBadge: matchDetail.homeTeamBadge,
      strAwayTeamBadge: matchDetail.awayTeamBadge,
      intHomeScore: matchDetail.homeScore,
      intAwayScore: matchDetail.awayScore,
      strStatus: matchDetail.status,
      matchState: matchDetail.state,
    };
  }

  if (selectedFixture && selectedFixture.eventId === routeEventId) {
    return {
      idEvent: selectedFixture.eventId,
      strLeague: selectedFixture.leagueName,
      dateEvent: selectedFixture.fixtureDate,
      strHomeTeam: selectedFixture.home.name,
      strAwayTeam: selectedFixture.away.name,
      strHomeTeamBadge: selectedFixture.home.badgeSrc,
      strAwayTeamBadge: selectedFixture.away.badgeSrc,
      intHomeScore: selectedFixture.homeScore ?? null,
      intAwayScore: selectedFixture.awayScore ?? null,
      strStatus: null,
      matchState: selectedFixture.state,
    };
  }

  return null;
}

export function mapMatchDetailsHeaderUiMeta(
  matchDetail: MatchDetail | null | undefined,
): MatchDetailsHeaderUiMeta {
  return {
    activeTab: 'events',
    homeYellowCards: matchDetail?.summary.homeYellowCardDetails.length ?? 0,
    homeRedCards: matchDetail?.summary.homeRedCardDetails.length ?? 0,
    awayYellowCards: matchDetail?.summary.awayYellowCardDetails.length ?? 0,
    awayRedCards: matchDetail?.summary.awayRedCardDetails.length ?? 0,
  };
}
