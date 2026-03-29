import { CheckIcon } from '@/components/icons';

import type { FixtureContextTag as FixtureContextTagType } from '../types/fixtures.types';

type FixtureContextTagProps = {
  tag: FixtureContextTagType;
};

export function FixtureContextTag({ tag }: FixtureContextTagProps) {
  return (
    <span className="app-fixture-context-tag app-type-inter-10-12-medium">
      <CheckIcon />
      <span>{tag.label}</span>
    </span>
  );
}
