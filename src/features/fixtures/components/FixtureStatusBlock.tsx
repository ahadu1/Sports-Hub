import { cn } from '@/utils/cn';

import type { Fixture } from '../types/fixtures.types';

type FixtureStatusBlockProps = {
  fixture: Fixture;
};

export function FixtureStatusBlock({ fixture }: FixtureStatusBlockProps) {
  const isInProgress = fixture.state === 'live' || fixture.state === 'halftime';

  const stripClass =
    fixture.state === 'finished'
      ? 'bg-app-danger'
      : isInProgress
        ? 'bg-app-brand-secondary'
        : 'bg-app-bg-disabled';

  const labelClass =
    fixture.state === 'finished'
      ? 'text-app-danger'
      : isInProgress
        ? 'text-app-brand-secondary'
        : 'text-app-text';

  const label =
    fixture.state === 'finished'
      ? 'FT'
      : isInProgress
        ? fixture.liveLabel
        : (fixture.kickoffLabel ?? '');

  return (
    <div className="relative h-14 w-12 shrink-0 pl-2.5 sm:h-[60px] sm:w-14 sm:pl-3">
      <span
        aria-hidden="true"
        className={cn('absolute left-0 top-0 h-full w-[3px] rounded-full', stripClass)}
      />
      <div className="flex h-full flex-col items-start justify-center">
        <span className={cn('text-body-sm', labelClass)}>{label}</span>
        {isInProgress && (
          <span
            aria-hidden="true"
            className="fixtureRow__statusUnderline mt-1 block h-[2px] w-4 rounded-[100px]"
          />
        )}
      </div>
    </div>
  );
}
