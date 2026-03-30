export function formatSeasonLabel(value: string | null | undefined): string {
  const normalizedValue = value?.trim() ?? '';
  const match = normalizedValue.match(/^(\d{4})[-/](\d{4})$/);

  if (!match?.[1] || !match[2]) {
    return normalizedValue;
  }

  return `${match[1]}/${match[2].slice(-2)}`;
}
