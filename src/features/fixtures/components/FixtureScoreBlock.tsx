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
    <div className="flex w-12 shrink-0 flex-col justify-center gap-1.5 text-right sm:w-[60px] sm:gap-2">
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
        <span className="text-meta text-app-text-subtle">[{legScore}]</span>
      )}
      <span className="text-body-sm-strong text-app-text">{score}</span>
    </div>
  );
}
