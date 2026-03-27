import {
  MAX_QUERY_RETRIES,
  RETRY_BASE_DELAY_MS,
  RETRY_MAX_DELAY_MS,
} from '@/app/config/app-config';
import { isNonRetryableClientError } from '@/lib/api/errors';

export function getRetryDelayMs(attemptIndex: number): number {
  const raw = RETRY_BASE_DELAY_MS * 2 ** attemptIndex;
  return Math.min(raw, RETRY_MAX_DELAY_MS);
}

export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_QUERY_RETRIES) {
    return false;
  }
  if (isNonRetryableClientError(error)) {
    return false;
  }
  return true;
}
