import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_ENABLE_QUERY_DEVTOOLS: z.enum(['true', 'false']),
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
  VITE_API_BASE_URL: parsed.data.VITE_API_BASE_URL,
  VITE_ENABLE_QUERY_DEVTOOLS: parsed.data.VITE_ENABLE_QUERY_DEVTOOLS === 'true',
} as const;
