import { ChevronLeftIcon } from '@/components/icons';
import { routes } from '@/app/config/routes';
import {
  getVisibleCardCounters,
  mapHeaderDateLabel,
  mapHeaderStatusLabel,
} from '@/features/match/utils/matchDetailsHeader.utils';
import { cn } from '@/lib/utils/cn';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type {
  MatchDetailsHeaderCardCounter,
  MatchDetailsHeaderEvent,
  MatchDetailsHeaderUiMeta,
} from './match-details-header.types';

const INTER_FONT_STYLE = {
  fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
} as const;

const HEADER_TABS = [
  { id: 'details', label: 'Details' },
  { id: 'odds', label: 'Odds' },
  { id: 'lineups', label: 'Lineups' },
  { id: 'events', label: 'Events' },
  { id: 'stats', label: 'Stats' },
  { id: 'standings', label: 'Standings' },
] as const satisfies ReadonlyArray<{
  id: MatchDetailsHeaderUiMeta['activeTab'];
  label: string;
}>;

type MatchDetailsHeaderProps = {
  event: MatchDetailsHeaderEvent;
  uiMeta: MatchDetailsHeaderUiMeta;
};

type TeamBadgeProps = {
  alt: string;
  fallbackLabel: string;
  src: string;
};

type CardCounterProps = {
  counter: MatchDetailsHeaderCardCounter;
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
      ? 'bg-app-danger text-white'
      : event.matchState === 'live' || event.matchState === 'halftime'
        ? 'bg-app-brand-secondary text-app-text-inverse'
        : 'bg-app-bg-disabled text-app-text';

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(routes.home);
  };

  return (
    <section className="flex h-[198px] w-full max-w-[707px] flex-col justify-between bg-[#1D1E2B] pt-2">
      <div className="flex items-center gap-4 px-4">
        <button
          aria-label="Go back"
          className="flex h-6 w-6 items-center justify-center text-white outline-none transition hover:text-white/85 focus-visible:ring-2 focus-visible:ring-app-brand-secondary"
          type="button"
          onClick={handleBack}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <p className="app-type-inter-14-20-normal text-white">{event.strLeague}</p>
      </div>

      <div className="grid h-16 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-4 sm:px-6">
        <div className="flex min-w-0 justify-center">
          <div className="flex min-w-[92px] flex-col items-center gap-1">
            <div className="relative h-[42px] w-[42px] shrink-0">
              <TeamBadge
                alt={`${event.strHomeTeam} badge`}
                fallbackLabel={event.strHomeTeam}
                src={event.strHomeTeamBadge}
              />
              {homeCounters.length > 0 ? (
                <div className="absolute -right-[16px] top-px flex items-center gap-[2px]">
                  {homeCounters.map((counter) => (
                    <CardCounter key={`${event.strHomeTeam}-${counter.color}`} counter={counter} />
                  ))}
                </div>
              ) : null}
            </div>
            <p className="app-type-inter-14-20-medium w-full truncate text-center text-white">
              {event.strHomeTeam}
            </p>
          </div>
        </div>

        <div className="mx-3 flex flex-col items-center justify-center text-center">
          <span className="app-type-inter-11-15-normal whitespace-nowrap text-[#E5E7EB]">
            {dateLabel}
          </span>
          <span
            className="whitespace-nowrap text-[22px] leading-[28px] font-semibold text-white"
            style={INTER_FONT_STYLE}
          >
            {scoreLabel}
          </span>
          {statusLabel ? (
            <span
              className={cn(
                'inline-flex h-[15px] items-center justify-center rounded-[4px] px-1 text-[10px] leading-[15px] font-normal',
                statusClassName,
              )}
              style={INTER_FONT_STYLE}
            >
              {statusLabel}
            </span>
          ) : null}
        </div>

        <div className="flex min-w-0 justify-center">
          <div className="flex min-w-[92px] flex-col items-center gap-1">
            <div className="relative h-[42px] w-[42px] shrink-0">
              <TeamBadge
                alt={`${event.strAwayTeam} badge`}
                fallbackLabel={event.strAwayTeam}
                src={event.strAwayTeamBadge}
              />
              {awayCounters.length > 0 ? (
                <div className="absolute -left-[30px] top-px flex items-center gap-[2px]">
                  {awayCounters.map((counter) => (
                    <CardCounter key={`${event.strAwayTeam}-${counter.color}`} counter={counter} />
                  ))}
                </div>
              ) : null}
            </div>
            <p className="app-type-inter-14-20-medium w-full truncate text-center text-white">
              {event.strAwayTeam}
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-[#292B41]">
        <div className="overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-end gap-6 md:min-w-full md:justify-center">
            {HEADER_TABS.map((tab) => {
              const isActive = tab.id === uiMeta.activeTab;

              return (
                <button
                  key={tab.id}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'app-type-inter-14-20-normal relative whitespace-nowrap pb-3 text-app-text-muted',
                    isActive &&
                      'text-white after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-app-brand-secondary after:content-[""]',
                  )}
                  type="button"
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function TeamBadge({ alt, fallbackLabel, src }: TeamBadgeProps) {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>(() =>
    src ? 'loading' : 'error',
  );

  useEffect(() => {
    setImageState(src ? 'loading' : 'error');
  }, [src]);

  if (imageState === 'error' || !src) {
    return (
      <div
        aria-label={alt}
        className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#26273B] text-sm font-medium uppercase text-white"
        role="img"
        style={INTER_FONT_STYLE}
      >
        {fallbackLabel.slice(0, 1)}
      </div>
    );
  }

  return (
    <div className="relative h-[42px] w-[42px]">
      {imageState !== 'loaded' ? (
        <span
          aria-hidden="true"
          className="loading loading-spinner loading-sm absolute inset-0 m-auto text-app-brand-secondary"
        />
      ) : null}
      <img
        alt={alt}
        className={cn(
          'h-[42px] w-[42px] object-contain transition-opacity',
          imageState === 'loaded' ? 'opacity-100' : 'opacity-0',
        )}
        src={src}
        onError={() => setImageState('error')}
        onLoad={() => setImageState('loaded')}
      />
    </div>
  );
}

function CardCounter({ counter }: CardCounterProps) {
  return (
    <span
      aria-label={`${counter.color} cards: ${counter.value}`}
      className={cn(
        'inline-flex h-[12px] w-[10px] items-center justify-center rounded-[1px] text-[10px] leading-[15px] font-medium text-[#111827]',
        counter.color === 'red' ? 'bg-[#EE5E52]' : 'bg-[#E7D93F]',
      )}
      style={INTER_FONT_STYLE}
    >
      {counter.value}
    </span>
  );
}
