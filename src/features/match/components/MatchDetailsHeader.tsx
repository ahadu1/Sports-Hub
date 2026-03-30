import { ChevronLeftIcon } from '@/components/icons';
import { routes } from '@/app/config/routes';
import {
  getVisibleCardCounters,
  mapHeaderDateLabel,
  mapHeaderStatusLabel,
} from '@/features/match/utils/matchDetailsHeader.utils';
import { cn } from '@/lib/utils/cn';
import { useNavigate } from 'react-router-dom';

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

  const dateLabel = mapHeaderDateLabel(event.dateEvent);
  const statusLabel = mapHeaderStatusLabel(event.strStatus, event.matchState);
  const scoreLabel = `${event.intHomeScore ?? '-'} - ${event.intAwayScore ?? '-'}`;
  const statusClassName =
    event.matchState === 'finished'
      ? 'app-match-status-pill--finished'
      : event.matchState === 'live' || event.matchState === 'halftime'
        ? 'app-match-status-pill--live'
        : 'app-match-status-pill--default';

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(routes.home);
  };

  return (
    <section className="app-match-header-panel">
      <div className="flex items-center gap-4 px-4">
        <button
          aria-label="Go back"
          className="app-match-back-button"
          type="button"
          onClick={handleBack}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <p className="app-type-inter-14-20-normal text-app-text">{event.strLeague}</p>
      </div>

      <div className="grid h-16 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-4 sm:px-6">
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
            <p className="app-type-inter-14-20-medium w-full truncate text-center text-app-text">
              {event.strHomeTeam}
            </p>
          </div>
        </div>

        <div className="mx-3 flex flex-col items-center justify-center text-center">
          <span className="app-type-inter-11-15-normal whitespace-nowrap text-app-text-strong">
            {dateLabel}
          </span>
          <span className="app-type-inter-22-28-semibold whitespace-nowrap text-app-text">
            {scoreLabel}
          </span>
          {statusLabel ? (
            <span className={cn('app-match-status-pill', statusClassName)}>{statusLabel}</span>
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
            <p className="app-type-inter-14-20-medium w-full truncate text-center text-app-text">
              {event.strAwayTeam}
            </p>
          </div>
        </div>
      </div>

      <MatchHeaderTabs activeTab={uiMeta.activeTab} />
    </section>
  );
}
