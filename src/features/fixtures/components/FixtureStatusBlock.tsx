import { cn } from '@/lib/utils/cn';

import type { Fixture } from '../types/fixtures.types';

type FixtureStatusBlockProps = {
  fixture: Fixture;
};

export function FixtureStatusBlock({ fixture }: FixtureStatusBlockProps) {
  const isInProgress = fixture.state === 'live' || fixture.state === 'halftime';

  const stripClass =
    fixture.state === 'finished'
      ? 'bg-app-danger'
      : fixture.state === 'scheduled'
        ? 'bg-app-bg-disabled'
        : 'bg-app-brand-secondary';

  const labelClass =
    fixture.state === 'finished'
      ? 'text-app-danger'
      : fixture.state === 'scheduled'
        ? 'text-app-text'
        : 'text-app-brand-secondary';

  const label =
    fixture.state === 'finished'
      ? 'FT'
      : fixture.state === 'scheduled'
        ? fixture.kickoffLabel
        : fixture.liveLabel;

  return (
    <div className="relative h-[60px] w-14 shrink-0 pl-3">
      <span
        aria-hidden="true"
        className={cn(
          'absolute left-0 top-0 h-full w-[3px] rounded-full',
          stripClass,
          isInProgress && 'motion-safe:animate-fixtures-live-pulse motion-reduce:animate-none',
        )}
      />
      <div className="flex h-full flex-col items-start justify-center">
        <span className={cn('app-type-inter-12-16-normal', labelClass)}>{label}</span>
        {isInProgress && (
          <span
            aria-hidden="true"
            className={cn(
              'mt-1 block h-0.5 w-4 rounded-full bg-app-brand-secondary',
              'motion-safe:animate-fixtures-live-pulse motion-reduce:animate-none',
            )}
          />
        )}
      </div>
    </div>
  );
}
