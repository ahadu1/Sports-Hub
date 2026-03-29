import type { Fixture } from '../types/fixtures.types';

type FixtureScoreBlockProps = {
  fixture: Fixture;
};

export function FixtureScoreBlock({ fixture }: FixtureScoreBlockProps) {
  const showLegScores =
    fixture.state === 'finished' &&
    fixture.homeLegScore !== undefined &&
    fixture.awayLegScore !== undefined;

  return (
    <div className="flex w-[60px] shrink-0 flex-col justify-center gap-2 text-right">
      {fixture.homeScore !== undefined && fixture.awayScore !== undefined ? (
        <>
          <ScoreLine
            score={fixture.homeScore}
            legScore={showLegScores ? fixture.homeLegScore : undefined}
          />
          <ScoreLine
            score={fixture.awayScore}
            legScore={showLegScores ? fixture.awayLegScore : undefined}
          />
        </>
      ) : (
        <>
          <span aria-hidden="true" className="block h-4" />
          <span aria-hidden="true" className="block h-4" />
        </>
      )}
    </div>
  );
}

type ScoreLineProps = {
  score: number;
  legScore?: number | undefined;
};

function ScoreLine({ score, legScore }: ScoreLineProps) {
  return (
    <div className="flex items-end justify-end gap-1">
      {legScore !== undefined && (
        <span className="app-type-inter-11-15-normal text-app-text-subtle">[{legScore}]</span>
      )}
      <span className="app-type-inter-12-16-semibold text-app-text">{score}</span>
    </div>
  );
}
