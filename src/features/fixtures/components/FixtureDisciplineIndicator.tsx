import { cn } from '@/utils/cn';

import type { FixtureDiscipline } from '../types/fixtures.types';

type FixtureDisciplineIndicatorProps = {
  discipline: FixtureDiscipline;
};

export function FixtureDisciplineIndicator({ discipline }: FixtureDisciplineIndicatorProps) {
  return (
    <span
      aria-label={`${discipline.card} card`}
      className={cn(
        'fixtureRow__disciplineCard',
        discipline.card === 'red'
          ? 'fixtureRow__disciplineCard--red'
          : 'fixtureRow__disciplineCard--yellow',
      )}
    />
  );
}
