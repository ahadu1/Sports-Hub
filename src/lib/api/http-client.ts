import { env } from '@/lib/env/env';
import { ApiError, ValidationError } from '@/lib/api/errors';
import type { z } from 'zod';

type ApiVersion = 'v1' | 'v2';

type GetJsonOptions = {
  signal?: AbortSignal;
  apiVersion?: ApiVersion;
};

function resolveBaseUrl(apiVersion: ApiVersion): string {
  if (apiVersion === 'v1') {
    return `${env.v1BaseUrl}/${env.apiKey}/`;
  }

  return env.v2BaseUrl.endsWith('/') ? env.v2BaseUrl : `${env.v2BaseUrl}/`;
}

function resolveUrl(relativePath: string, apiVersion: ApiVersion): string {
  const base = resolveBaseUrl(apiVersion);
  return new URL(relativePath.replace(/^\//, ''), base).toString();
}

export async function getJson<T>(
  relativePath: string,
  schema: z.ZodType<T>,
  options?: GetJsonOptions,
): Promise<T> {
  const apiVersion = options?.apiVersion ?? 'v2';
  const url = resolveUrl(relativePath, apiVersion);
  let response: Response;

  const init: RequestInit = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      // TheSportsDB V2 docs reference X-API-KEY, but the live CORS preflight
      // only allows X_API_KEY from the browser. Use the runtime-compatible name.
      ...(apiVersion === 'v2' ? { X_API_KEY: env.apiKey } : {}),
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
