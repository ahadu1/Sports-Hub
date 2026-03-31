import { cn } from '@/utils/cn';
import { useImageLoadState } from '@/hooks/useImageLoadState';
import { useEffect, useState } from 'react';
import { FixtureContextTag } from './FixtureContextTag';
import { FixtureDisciplineIndicator } from './FixtureDisciplineIndicator';
import type { Fixture, FixtureTeam } from '../types/fixtures.types';

const MOBILE_BREAKPOINT_MAX_WIDTH = 639;

function getMobileTeamNameMaxLength(viewportWidth: number) {
  if (viewportWidth <= 359) {
    return 9;
  }

  if (viewportWidth <= 399) {
    return 13;
  }

  if (viewportWidth <= 479) {
    return 15;
  }

  return 18;
}

type FixtureTeamsBlockProps = {
  fixture: Fixture;
};

export function FixtureTeamsBlock({ fixture }: FixtureTeamsBlockProps) {
  const [mobileTeamNameMaxLength, setMobileTeamNameMaxLength] = useState<number | null>(() => {
    const viewportWidth = window.innerWidth;

    return viewportWidth <= MOBILE_BREAKPOINT_MAX_WIDTH
      ? getMobileTeamNameMaxLength(viewportWidth)
      : null;
  });

  useEffect(() => {
    const syncMobileTeamNameMaxLength = () => {
      const viewportWidth = window.innerWidth;

      if (viewportWidth > MOBILE_BREAKPOINT_MAX_WIDTH) {
        setMobileTeamNameMaxLength(null);
        return;
      }

      setMobileTeamNameMaxLength(getMobileTeamNameMaxLength(viewportWidth));
    };

    syncMobileTeamNameMaxLength();
    window.addEventListener('resize', syncMobileTeamNameMaxLength);

    return () => {
      window.removeEventListener('resize', syncMobileTeamNameMaxLength);
    };
  }, []);

  return (
    <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 sm:gap-2">
      <TeamLine
        fixture={fixture}
        side="home"
        team={fixture.home}
        mobileTeamNameMaxLength={mobileTeamNameMaxLength}
      />
      <TeamLine
        fixture={fixture}
        side="away"
        team={fixture.away}
        mobileTeamNameMaxLength={mobileTeamNameMaxLength}
      />
    </div>
  );
}

type TeamLineProps = {
  fixture: Fixture;
  side: 'home' | 'away';
  team: FixtureTeam;
  mobileTeamNameMaxLength: number | null;
};

function TeamLine({ fixture, side, team, mobileTeamNameMaxLength }: TeamLineProps) {
  const discipline = fixture.discipline?.filter((item) => item.side === side) ?? [];
  const contextTags = fixture.contextTags?.filter((item) => item.side === side) ?? [];
  const hasInlineDetails = discipline.length > 0 || contextTags.length > 0;
  const imageState = useImageLoadState(team.badgeSrc);

  const displayTeamName =
    mobileTeamNameMaxLength && team.name.length > mobileTeamNameMaxLength
      ? `${team.name.slice(0, mobileTeamNameMaxLength - 1)}...`
      : team.name;

  return (
    <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
      <div className="relative flex h-4 w-4 shrink-0 items-center justify-center">
        {imageState === 'error' || !team.badgeSrc ? (
          <span aria-hidden="true" className="fixtureRow__teamBadgeFallback">
            {team.name.slice(0, 1)}
          </span>
        ) : (
          <>
            {imageState !== 'loaded' ? (
              <span
                aria-hidden="true"
                className="loading loading-spinner loading-xs absolute inset-0 m-auto text-app-brand-secondary"
              />
            ) : null}
            <img
              src={team.badgeSrc}
              alt=""
              aria-hidden="true"
              className={cn(
                'h-4 w-4 shrink-0 object-contain transition-opacity',
                imageState === 'loaded' ? 'opacity-100' : 'opacity-0',
              )}
            />
          </>
        )}
      </div>
      <div className="flex min-w-0 items-center">
        <span className="text-body-sm truncate text-app-text" title={team.name}>
          {displayTeamName}
        </span>
        {hasInlineDetails ? (
          <span className="ml-1 inline-flex shrink-0 items-center gap-1.5 sm:ml-1.5 sm:gap-2">
            {discipline.map((item, index) => (
              <FixtureDisciplineIndicator
                key={`${team.id}-${item.card}-${index}`}
                discipline={item}
              />
            ))}
            {contextTags.map((tag, index) => (
              <FixtureContextTag key={`${team.id}-${tag.label}-${index}`} tag={tag} />
            ))}
          </span>
        ) : null}
      </div>
    </div>
  );
}
