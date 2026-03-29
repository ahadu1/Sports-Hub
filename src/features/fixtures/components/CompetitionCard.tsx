import { CompetitionHeader } from './CompetitionHeader';
import { FixtureRow } from './FixtureRow';
import type { CompetitionSection } from '../types/fixtures.types';

type CompetitionCardProps = {
  section: CompetitionSection;
};

export function CompetitionCard({ section }: CompetitionCardProps) {
  return (
    <section className="space-y-2 rounded-lg border-b border-app-border-base bg-app-surface p-4">
      <CompetitionHeader title={section.name} />
      <div>
        {section.fixtures.map((fixture, index) => (
          <div
            key={fixture.eventId}
            className={index === section.fixtures.length - 1 ? '[&>div]:border-b-0' : ''}
          >
            <FixtureRow fixture={fixture} />
          </div>
        ))}
      </div>
    </section>
  );
}
