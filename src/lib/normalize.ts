export function normalizeString(value: string | null | undefined): string {
  return value?.trim() ?? '';
}

export function normalizeNullableString(value: string | null | undefined): string | null {
  const normalized = normalizeString(value);
  return normalized || null;
}

export function normalizeOptionalString(value: string | null | undefined): string | undefined {
  const normalized = normalizeString(value);
  return normalized || undefined;
}

export function parseNumber(value: string | number | null | undefined): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = normalizeString(value);
  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}
