import { normalizeError } from '@/lib/api/errors';

const isDev = import.meta.env.DEV;

export function logError(context: string, error: unknown): void {
  if (!isDev) {
    return;
  }
  const err = normalizeError(error);
  console.error(`[${context}]`, err.message, error);
}
