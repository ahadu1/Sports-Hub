import { describe, expect, it } from 'vitest';

import type { TimelineItem } from '@/features/match/types/match-events.types';
import { mapMatchCornerMoments } from '@/utils/match/matchCornerMoments.utils';

describe('mapMatchCornerMoments', () => {
  it('maps the first two corner moments in chronological order', () => {
    const timelineItems: TimelineItem[] = [
      {
        id: 'second-corner',
        kind: 'event',
        minute: "45+2'",
        minuteVariant: 'default',
        away: {
          side: 'away',
          eventType: 'corner',
          primaryText: 'Away corner',
          showSecondaryText: false,
        },
      },
      {
        id: 'first-corner',
        kind: 'event',
        minute: "36'",
        minuteVariant: 'default',
        home: {
          side: 'home',
          eventType: 'corner',
          primaryText: 'Home corner',
          showSecondaryText: false,
        },
      },
      {
        id: 'third-corner',
        kind: 'event',
        minute: "61'",
        minuteVariant: 'default',
        home: {
          side: 'home',
          eventType: 'corner',
          primaryText: 'Another home corner',
          showSecondaryText: false,
        },
      },
    ];

    expect(mapMatchCornerMoments(timelineItems)).toEqual([
      { label: '1st corner', minute: "36'" },
      { label: '2nd corner', minute: "45+2'" },
    ]);
  });
});
