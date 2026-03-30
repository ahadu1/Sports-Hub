import type {
  MatchDetailsHeaderUiMeta,
  MatchDetailsHeaderVisibleCardCounters,
} from '@/features/match/components/match-details-header.types';
import type { MatchState } from '@/features/match/types/match.types';

export function mapHeaderStatusLabel(strStatus: string | null, matchState: MatchState): string {
  switch (matchState) {
    case 'finished':
      return 'Finished';
    case 'live':
    case 'halftime':
      return 'In Progress';
    case 'scheduled':
      return 'Not Started';
    case 'Match Postponed':
      return 'Match Postponed';
    case 'canceled':
      return 'Canceled';
    case 'suspended':
      return 'Suspended';
    case 'abandoned':
      return 'Abandoned';
    case 'awarded':
      return 'Awarded';
    case 'unknown':
      return strStatus?.trim() ?? '';
    default:
      return '';
  }
}

export function getVisibleCardCounters(
  meta: MatchDetailsHeaderUiMeta,
): MatchDetailsHeaderVisibleCardCounters {
  const home: MatchDetailsHeaderVisibleCardCounters['home'] = [];
  const away: MatchDetailsHeaderVisibleCardCounters['away'] = [];

  if (meta.homeYellowCards > 0) {
    home.push({ color: 'yellow', value: meta.homeYellowCards });
  }

  if (meta.homeRedCards > 0) {
    home.push({ color: 'red', value: meta.homeRedCards });
  }

  if (meta.awayRedCards > 0) {
    away.push({ color: 'red', value: meta.awayRedCards });
  }

  if (meta.awayYellowCards > 0) {
    away.push({ color: 'yellow', value: meta.awayYellowCards });
  }

  return { home, away };
}
