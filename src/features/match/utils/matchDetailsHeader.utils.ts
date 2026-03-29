import type {
  MatchDetailsHeaderUiMeta,
  MatchDetailsHeaderVisibleCardCounters,
} from '@/features/match/components/match-details-header.types';

const MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  timeZone: 'UTC',
});

export function mapHeaderDateLabel(dateEvent: string): string {
  const trimmedDate = dateEvent.trim();

  if (!trimmedDate) {
    return '';
  }

  const parsedDate = new Date(`${trimmedDate}T00:00:00Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  const day = String(parsedDate.getUTCDate()).padStart(2, '0');
  const month = MONTH_FORMATTER.format(parsedDate).toUpperCase();

  return `${day} ${month}`;
}

export function mapHeaderStatusLabel(strStatus: string | null): string {
  const trimmedStatus = strStatus?.trim() ?? '';

  if (!trimmedStatus) {
    return '';
  }

  if (
    trimmedStatus === 'Match Finished' ||
    trimmedStatus === 'Finished' ||
    trimmedStatus === 'FT'
  ) {
    return 'Finished';
  }

  return trimmedStatus;
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
