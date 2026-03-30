import { matchDetails } from '@/app/config/routes';
import { cn } from '@/lib/utils/cn';
import { useNavigate } from 'react-router-dom';

import { FixtureMenuButton } from './FixtureMenuButton';
import { FixtureScoreBlock } from './FixtureScoreBlock';
import { FixtureStatusBlock } from './FixtureStatusBlock';
import { FixtureTeamsBlock } from './FixtureTeamsBlock';
import type { Fixture } from '../types/fixtures.types';

type FixtureRowProps = {
  fixture: Fixture;
};

export function FixtureRow({ fixture }: FixtureRowProps) {
  const navigate = useNavigate();
  const fixtureLabel = `${fixture.home.name} vs ${fixture.away.name}`;
  const isInProgress = fixture.state === 'live' || fixture.state === 'halftime';

  const handleNavigate = () => {
    navigate(matchDetails(fixture.eventId), {
      state: {
        fixture,
      },
    });
  };

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={`View match details for ${fixtureLabel}`}
      className={cn('app-interactive-fixture-row relative')}
      onClick={handleNavigate}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleNavigate();
        }
      }}
    >
      <div className="relative z-10 flex w-full items-center gap-3">
        {isInProgress && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-[152px] bg-[linear-gradient(90deg,rgba(0,255,165,0.10)_0%,rgba(17,24,39,0)_100%)] lg:w-[176px]"
          />
        )}
        <FixtureStatusBlock fixture={fixture} />
        <FixtureTeamsBlock fixture={fixture} />
        <FixtureScoreBlock fixture={fixture} />
        <FixtureMenuButton fixtureLabel={fixtureLabel} />
      </div>
    </div>
  );
}
