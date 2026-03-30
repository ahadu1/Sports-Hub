import { z } from 'zod';

const envSchema = z.object({
  VITE_THESPORTSDB_API_KEY: z.string().min(1, 'TheSportsDB API key is required'),
  VITE_THESPORTSDB_V1_BASE_URL: z.string().url('V1 base URL must be a valid URL'),
  VITE_THESPORTSDB_V2_BASE_URL: z.string().url('V2 base URL must be a valid URL'),
  VITE_ENABLE_QUERY_DEVTOOLS: z.enum(['true', 'false']).default('false'),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
    .join('\n');
  const message = `Invalid environment configuration:\n${details}`;
  console.error(message);
  throw new Error(message);
}

export const env = {
  apiKey: parsed.data.VITE_THESPORTSDB_API_KEY,
  v1BaseUrl: parsed.data.VITE_THESPORTSDB_V1_BASE_URL,
  v2BaseUrl: parsed.data.VITE_THESPORTSDB_V2_BASE_URL,
  enableQueryDevtools: parsed.data.VITE_ENABLE_QUERY_DEVTOOLS === 'true',
} as const;
