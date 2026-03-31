import { z } from 'zod';

export const nullableString = z.string().nullable().optional();

export const scoreValueSchema = z.union([z.string(), z.number()]).nullable().optional();
