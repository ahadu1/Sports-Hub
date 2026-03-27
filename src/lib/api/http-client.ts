import { env } from '@/app/config/env';
import { ApiError, ValidationError } from '@/lib/api/errors';
import type { z } from 'zod';

function resolveUrl(relativePath: string): string {
  const base = env.VITE_API_BASE_URL.endsWith('/')
    ? env.VITE_API_BASE_URL
    : `${env.VITE_API_BASE_URL}/`;
  return new URL(relativePath.replace(/^\//, ''), base).toString();
}

export async function getJson<T>(
  relativePath: string,
  schema: z.ZodType<T>,
  options?: { signal?: AbortSignal },
): Promise<T> {
  const url = resolveUrl(relativePath);
  let response: Response;

  const init: RequestInit = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  };
  if (options?.signal !== undefined) {
    init.signal = options.signal;
  }

  try {
    response = await fetch(url, init);
  } catch (cause) {
    throw new ApiError('Network request failed', 0, url, { cause });
  }

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  let body: unknown;
  const text = await response.text();

  if (text.length === 0) {
    body = null;
  } else if (isJson) {
    try {
      body = JSON.parse(text) as unknown;
    } catch (cause) {
      throw new ApiError('Response was not valid JSON', response.status, url, {
        details: text.slice(0, 200),
        cause,
      });
    }
  } else {
    body = text;
  }

  if (!response.ok) {
    const message =
      typeof body === 'object' &&
      body !== null &&
      'message' in body &&
      typeof body.message === 'string'
        ? body.message
        : response.statusText || 'Request failed';
    if (typeof body === 'string') {
      throw new ApiError(message, response.status, url, { details: body });
    }
    throw new ApiError(message, response.status, url);
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError('Response validation failed', parsed.error.issues, parsed.error);
  }

  return parsed.data;
}
