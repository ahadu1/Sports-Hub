import { STALE_GRACE_WINDOW_MS } from '@/app/config/app-config';

/**
 * Returns true when the last successful data update is outside the stale-data grace window.
 * Used to scaffold “show stale briefly, then fail hard” behavior.
 */
export function isBeyondStaleGrace(
  dataUpdatedAt: number | undefined,
  now: number = Date.now(),
): boolean {
  if (dataUpdatedAt === undefined) {
    return true;
  }
  return now - dataUpdatedAt > STALE_GRACE_WINDOW_MS;
}
