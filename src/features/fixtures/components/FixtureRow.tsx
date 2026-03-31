import { matchDetails } from '@/app/config/routes';
import { Link } from 'react-router-dom';

import { FixtureMenuButton } from './FixtureMenuButton';
import { FixtureScoreBlock } from './FixtureScoreBlock';
import { FixtureStatusBlock } from './FixtureStatusBlock';
import { FixtureTeamsBlock } from './FixtureTeamsBlock';
import type { Fixture } from '../types/fixtures.types';

type FixtureRowProps = {
  fixture: Fixture;
};

export function FixtureRow({ fixture }: FixtureRowProps) {
  const fixtureLabel = `${fixture.home.name} vs ${fixture.away.name}`;
  const isInProgress = fixture.state === 'live' || fixture.state === 'halftime';

  return (
    <div className="fixtureRow">
      <Link
        to={matchDetails(fixture.eventId)}
        state={{ fixture }}
        aria-label={`View match details for ${fixtureLabel}`}
        className="fixtureRow__link"
      />
      <div className="pointer-events-none relative z-10 flex w-full items-center gap-2 pr-8 sm:gap-3 sm:pr-9">
        {isInProgress && (
          <span
            aria-hidden="true"
            className="fixtureRow__liveAccent pointer-events-none absolute inset-y-0 left-0 w-[136px] sm:w-[152px] lg:w-[176px]"
          />
        )}
        <FixtureStatusBlock fixture={fixture} />
        <FixtureTeamsBlock fixture={fixture} />
        <FixtureScoreBlock fixture={fixture} />
      </div>
      <div className="relative z-20 ml-auto">
        <FixtureMenuButton fixtureLabel={fixtureLabel} />
      </div>
    </div>
  );
}
