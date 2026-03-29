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

  return (
    <div className="flex min-w-0 items-center gap-2">
      <img
        src={team.badgeSrc}
        alt=""
        aria-hidden="true"
        className="h-4 w-4 shrink-0 object-contain"
      />
      <div className="flex min-w-0 items-center">
        <span className="app-type-inter-12-16-normal truncate text-app-text">{team.name}</span>
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
