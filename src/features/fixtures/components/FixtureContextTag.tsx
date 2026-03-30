import { CheckIcon } from '@/components/icons';

import type { FixtureContextTag as FixtureContextTagType } from '../types/fixtures.types';

type FixtureContextTagProps = {
  tag: FixtureContextTagType;
};

export function FixtureContextTag({ tag }: FixtureContextTagProps) {
  return (
    <span className="fixtureRow__contextTag text-tag">
      <CheckIcon />
      <span>{tag.label}</span>
    </span>
  );
}
