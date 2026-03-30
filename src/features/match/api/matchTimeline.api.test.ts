import { describe, expect, it } from 'vitest';

import {
  matchTimelineResponseSchema,
  normalizeTimelinePayload,
} from '@/features/match/api/matchTimeline.api';

describe('matchTimeline.api', () => {
  it('accepts a top-level Message response for timeline requests', () => {
    expect(matchTimelineResponseSchema.parse({ Message: 'No data found' })).toEqual({
      Message: 'No data found',
    });
  });

  it('normalizes a no-data response into an empty timeline payload', () => {
    expect(normalizeTimelinePayload({ Message: 'No data found' }, 'https://example.test')).toEqual({
      lookup: [],
      timeline: null,
      message: 'No data found',
    });
  });
});
