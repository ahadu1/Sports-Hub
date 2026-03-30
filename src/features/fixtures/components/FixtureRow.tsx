import { matchDetails } from '@/app/config/routes';
import { cn } from '@/lib/utils/cn';
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
    <div className={cn('app-interactive-fixture-row relative')}>
      <Link
        to={matchDetails(fixture.eventId)}
        state={{ fixture }}
        aria-label={`View match details for ${fixtureLabel}`}
        className="app-focus-ring-surface absolute inset-0 rounded-md"
      />
      <div className="pointer-events-none relative z-10 flex w-full items-center gap-3 pr-9">
        {isInProgress && (
          <span
            aria-hidden="true"
            className="app-fixtures-live-row-accent pointer-events-none absolute inset-y-0 left-0 w-[152px] lg:w-[176px]"
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
