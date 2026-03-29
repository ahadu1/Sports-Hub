import { cn } from '@/lib/utils/cn';

import type { FixtureDiscipline } from '../types/fixtures.types';

type FixtureDisciplineIndicatorProps = {
  discipline: FixtureDiscipline;
};

export function FixtureDisciplineIndicator({ discipline }: FixtureDisciplineIndicatorProps) {
  return (
    <span
      aria-label={`${discipline.card} card`}
      className={cn(
        'app-discipline-card',
        discipline.card === 'red' ? 'app-discipline-card--red' : 'app-discipline-card--yellow',
      )}
    />
  );
}
