import {
  QUERY_CACHE_BUSTER,
  QUERY_CACHE_MAX_AGE_MS,
  QUERY_CACHE_STORAGE_KEY,
  QUERY_CACHE_THROTTLE_MS,
} from '@/app/config/app-config';
import type { Fixture } from '@/features/fixtures/types/fixtures.types';
import type { TimelineItem } from '@/features/match/types/match-events.types';
import type { MatchDetail } from '@/features/match/types/match.types';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import type { Query } from '@tanstack/react-query';
import type { PersistedClient } from '@tanstack/react-query-persist-client';

type DehydratedQuery = PersistedClient['clientState']['queries'][number];

function isQueryKeyPrefix(queryKey: readonly unknown[], scope: string, entity: string): boolean {
  return queryKey[0] === scope && queryKey[1] === entity;
}

function getEventIdFromQueryKey(queryKey: readonly unknown[]): string | undefined {
  const eventId = queryKey[2];
  return typeof eventId === 'string' && eventId.length > 0 ? eventId : undefined;
}

function isFixture(value: unknown): value is Fixture {
  return (
    typeof value === 'object' &&
    value !== null &&
    'eventId' in value &&
    'state' in value &&
    'kickoff' in value
  );
}

function isMatchDetail(value: unknown): value is MatchDetail {
  return typeof value === 'object' && value !== null && 'id' in value && 'state' in value;
}

function isTimelineItem(value: unknown): value is TimelineItem {
  if (typeof value !== 'object' || value === null || !('kind' in value)) {
    return false;
  }

  if (value.kind === 'divider') {
    return 'id' in value && 'label' in value && 'dividerVariant' in value;
  }

  if (value.kind === 'event') {
    return 'id' in value && 'minute' in value && 'minuteVariant' in value;
  }

  return false;
}

function isMatchTimelineData(value: unknown): value is TimelineItem[] {
  return Array.isArray(value) && value.every((item) => isTimelineItem(item));
}

function getPersistableFinishedFixtures(data: unknown): Fixture[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.filter(isFixture).filter((fixture) => fixture.state === 'finished');
}

function getFinishedMatchEventIds(queries: readonly DehydratedQuery[]): Set<string> {
  return new Set(
    queries.flatMap((query) => {
      if (!isQueryKeyPrefix(query.queryKey, 'match', 'detail')) {
        return [];
      }

      const eventId = getEventIdFromQueryKey(query.queryKey);
      const detail = query.state.data;

      if (!eventId || !isMatchDetail(detail) || detail.state !== 'finished') {
        return [];
      }

      return [eventId];
    }),
  );
}

function sanitizePersistedQueries(queries: readonly DehydratedQuery[]): DehydratedQuery[] {
  const finishedMatchEventIds = getFinishedMatchEventIds(queries);

  return queries.flatMap((query) => {
    if (isQueryKeyPrefix(query.queryKey, 'fixtures', 'list')) {
      const fixtures = getPersistableFinishedFixtures(query.state.data);

      if (fixtures.length === 0) {
        return [];
      }

      return [
        {
          ...query,
          state: {
            ...query.state,
            data: fixtures,
            // Force a background refresh after hydration so future/live rows are restored.
            dataUpdatedAt: 0,
          },
        },
      ];
    }

    if (isQueryKeyPrefix(query.queryKey, 'match', 'detail')) {
      const detail = query.state.data;

      if (!isMatchDetail(detail) || detail.state !== 'finished') {
        return [];
      }

      return [query];
    }

    if (isQueryKeyPrefix(query.queryKey, 'match', 'timeline')) {
      const eventId = getEventIdFromQueryKey(query.queryKey);

      if (!eventId || !finishedMatchEventIds.has(eventId)) {
        return [];
      }

      if (!isMatchTimelineData(query.state.data)) {
        return [];
      }

      return [query];
    }

    return [];
  });
}

function shouldDehydrateStableQuery(query: Query): boolean {
  if (query.state.status !== 'success') {
    return false;
  }

  const queryKey = query.queryKey;

  return (
    isQueryKeyPrefix(queryKey, 'fixtures', 'list') ||
    isQueryKeyPrefix(queryKey, 'match', 'detail') ||
    isQueryKeyPrefix(queryKey, 'match', 'timeline')
  );
}

function transformPersistedClient(client: PersistedClient): PersistedClient {
  return {
    ...client,
    clientState: {
      ...client.clientState,
      mutations: [],
      queries: sanitizePersistedQueries(client.clientState.queries ?? []),
    },
  };
}

function getBrowserStorage(): Storage | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export const queryCachePersister = (() => {
  const storage = getBrowserStorage();

  if (!storage) {
    return undefined;
  }

  return createSyncStoragePersister({
    storage,
    key: QUERY_CACHE_STORAGE_KEY,
    throttleTime: QUERY_CACHE_THROTTLE_MS,
    serialize: (client) => JSON.stringify(transformPersistedClient(client)),
    deserialize: (cachedString) => JSON.parse(cachedString) as PersistedClient,
  });
})();

export const queryCachePersistOptions = {
  buster: QUERY_CACHE_BUSTER,
  maxAge: QUERY_CACHE_MAX_AGE_MS,
  dehydrateOptions: {
    shouldDehydrateQuery: shouldDehydrateStableQuery,
  },
} as const;
