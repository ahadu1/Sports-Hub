import { ChevronLeftIcon } from '@/components/icons';
import { routes } from '@/app/config/routes';
import {
  asValidDate,
  formatDayMonthShort,
  parseDayKey,
  type NormalizedKickoff,
} from '@/lib/datetime/kickoff';
import {
  getVisibleCardCounters,
  mapHeaderStatusLabel,
} from '@/utils/match/matchDetailsHeader.utils';
import { cn } from '@/utils/cn';
import { useNavigate } from 'react-router-dom';

function formatMatchHeaderDayMonthCaps(kickoff: NormalizedKickoff): string {
  const kickoffInstant = asValidDate(kickoff.kickoffInstant);
  if (kickoffInstant) {
    return formatDayMonthShort(kickoffInstant).toUpperCase();
  }
  if (kickoff.localDayKey) {
    const day = parseDayKey(kickoff.localDayKey);
    if (day) {
      return formatDayMonthShort(day).toUpperCase();
    }
  }
  return kickoff.fallbackLabel ?? kickoff.localDateLabel ?? '';
}

import type {
  MatchDetailsHeaderEvent,
  MatchDetailsHeaderUiMeta,
} from './match-details-header.types';
import { MatchHeaderCardCounter } from './match-details-header/MatchHeaderCardCounter';
import { MatchHeaderTabs } from './match-details-header/MatchHeaderTabs';
import { MatchHeaderTeamBadge } from './match-details-header/MatchHeaderTeamBadge';

type MatchDetailsHeaderProps = {
  event: MatchDetailsHeaderEvent;
  uiMeta: MatchDetailsHeaderUiMeta;
};

export function MatchDetailsHeader({ event, uiMeta }: MatchDetailsHeaderProps) {
  const navigate = useNavigate();
  const [homeCounters, awayCounters] = (() => {
    const counters = getVisibleCardCounters(uiMeta);
    return [counters.home, counters.away] as const;
  })();

  const headerDateLabel = formatMatchHeaderDayMonthCaps(event.kickoff);
  const statusLabel = mapHeaderStatusLabel(event.strStatus, event.matchState);
  const scoreLabel = `${event.intHomeScore ?? '-'} \u2013 ${event.intAwayScore ?? '-'}`;
  const statusClassName =
    event.matchState === 'finished'
      ? 'matchDetailsHeader__statusPill--finished'
      : event.matchState === 'live' || event.matchState === 'halftime'
        ? 'matchDetailsHeader__statusPill--live'
        : 'matchDetailsHeader__statusPill--default';

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(routes.home);
  };

  return (
    <section className="matchDetailsHeader">
      <div className="flex items-center gap-4 px-4">
        <button
          aria-label="Go back"
          className="matchDetailsHeader__backButton"
          type="button"
          onClick={handleBack}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <p className="text-body-md text-app-text">{event.strLeague}</p>
      </div>

      <div className="matchDetailsHeader__teamsGrid grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-4 py-3 sm:px-6">
        <div className="flex min-w-0 justify-center">
          <div className="flex min-w-[92px] flex-col items-center gap-1">
            <div className="relative h-[42px] w-[42px] shrink-0">
              <MatchHeaderTeamBadge
                alt={`${event.strHomeTeam} badge`}
                fallbackLabel={event.strHomeTeam}
                src={event.strHomeTeamBadge}
              />
              {homeCounters.length > 0 ? (
                <div className="absolute -right-[16px] top-px flex items-center gap-[2px]">
                  {homeCounters.map((counter) => (
                    <MatchHeaderCardCounter
                      key={`${event.strHomeTeam}-${counter.color}`}
                      counter={counter}
                    />
                  ))}
                </div>
              ) : null}
            </div>
            <p className="text-body-md-medium w-full truncate text-center text-app-text">
              {event.strHomeTeam}
            </p>
          </div>
        </div>

        <div className="matchDetailsHeader__scoreColumn mx-3 flex flex-col items-center justify-center gap-1 text-center">
          {headerDateLabel ? (
            <span className="matchDetailsHeader__scoreDate whitespace-nowrap">
              {headerDateLabel}
            </span>
          ) : null}
          <span className="matchDetailsHeader__score whitespace-nowrap">{scoreLabel}</span>
          {statusLabel ? (
            <span className={cn('matchDetailsHeader__statusPill', statusClassName)}>
              {statusLabel}
            </span>
          ) : null}
        </div>

        <div className="flex min-w-0 justify-center">
          <div className="flex min-w-[92px] flex-col items-center gap-1">
            <div className="relative h-[42px] w-[42px] shrink-0">
              <MatchHeaderTeamBadge
                alt={`${event.strAwayTeam} badge`}
                fallbackLabel={event.strAwayTeam}
                src={event.strAwayTeamBadge}
              />
              {awayCounters.length > 0 ? (
                <div className="absolute -left-[30px] top-px flex items-center gap-[2px]">
                  {awayCounters.map((counter) => (
                    <MatchHeaderCardCounter
                      key={`${event.strAwayTeam}-${counter.color}`}
                      counter={counter}
                    />
                  ))}
                </div>
              ) : null}
            </div>
            <p className="text-body-md-medium w-full truncate text-center text-app-text">
              {event.strAwayTeam}
            </p>
          </div>
        </div>
      </div>

      <MatchHeaderTabs
        activeTab={uiMeta.activeTab}
        showEventsTab={event.matchState !== 'Match Postponed'}
      />
    </section>
  );
}
