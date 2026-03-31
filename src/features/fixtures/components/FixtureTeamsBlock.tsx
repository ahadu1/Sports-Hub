import { cn } from '@/utils/cn';
import { useImageLoadState } from '@/hooks/useImageLoadState';
import { FixtureContextTag } from './FixtureContextTag';
import { FixtureDisciplineIndicator } from './FixtureDisciplineIndicator';
import type { Fixture, FixtureTeam } from '../types/fixtures.types';

type FixtureTeamsBlockProps = {
  fixture: Fixture;
};

export function FixtureTeamsBlock({ fixture }: FixtureTeamsBlockProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
      <TeamLine fixture={fixture} side="home" team={fixture.home} />
      <TeamLine fixture={fixture} side="away" team={fixture.away} />
    </div>
  );
}

type TeamLineProps = {
  fixture: Fixture;
  side: 'home' | 'away';
  team: FixtureTeam;
};

function TeamLine({ fixture, side, team }: TeamLineProps) {
  const discipline = fixture.discipline?.filter((item) => item.side === side) ?? [];
  const contextTags = fixture.contextTags?.filter((item) => item.side === side) ?? [];
  const hasInlineDetails = discipline.length > 0 || contextTags.length > 0;
  const imageState = useImageLoadState(team.badgeSrc);

  return (
    <div className="flex min-w-0 items-center gap-2">
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
        <span className="text-body-sm truncate text-app-text">{team.name}</span>
        {hasInlineDetails ? (
          <span className="ml-[6px] inline-flex shrink-0 items-center gap-2">
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
