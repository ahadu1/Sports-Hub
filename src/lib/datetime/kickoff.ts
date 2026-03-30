export type KickoffParseSource = 'timestamp' | 'utc_date_time' | 'local_date_time' | 'unparseable';

export type ParsedKickoff = {
  kickoffInstant: Date | null;
  parseSource: KickoffParseSource;
  userTimeZone: string;
  hasDiscrepancy: boolean;
  discrepancyReason: string | null;
  sourceDateEvent: string | null;
  sourceDateEventLocal: string | null;
  sourceTime: string | null;
  sourceTimeLocal: string | null;
};

export type RelativeDayLabel = 'Today' | 'Tomorrow' | 'Yesterday';

export type NormalizedKickoff = {
  kickoffInstant: Date | null;
  parseSource: KickoffParseSource;
  hasDiscrepancy: boolean;
  discrepancyReason: string | null;
  localDayKey: string | null;
  localDateLabel: string | null;
  localTimeLabel: string | null;
  localDateTimeLabel: string | null;
  relativeDayLabel: RelativeDayLabel | null;
  secondaryLabel: string | null;
  fallbackLabel: string | null;
};

type KickoffRawSource = {
  idEvent?: string | null | undefined;
  dateEvent?: string | null | undefined;
  dateEventLocal?: string | null | undefined;
  strTime?: string | null | undefined;
  strTimeLocal?: string | null | undefined;
  strTimestamp?: string | null | undefined;
};

type BuildOptions = {
  userTimeZone?: string;
  now?: Date;
};

type ParsedDateParts = {
  year: number;
  month: number;
  day: number;
};

type ParsedTimeParts = {
  hour: number;
  minute: number;
  second: number;
};

const TIME_UNAVAILABLE_LABEL = 'Time unavailable';
const SECONDARY_LOCAL_LABEL = 'Local to you';
const DAY_MS = 24 * 60 * 60 * 1000;
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_PATTERN = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;

const DAY_KEY_FORMATTERS = new Map<string, Intl.DateTimeFormat>();
const DATE_FORMATTERS = new Map<string, Intl.DateTimeFormat>();
const TIME_FORMATTERS = new Map<string, Intl.DateTimeFormat>();
const DATE_TIME_FORMATTERS = new Map<string, Intl.DateTimeFormat>();
const MONTH_YEAR_FORMATTERS = new Map<string, Intl.DateTimeFormat>();
const WEEKDAY_SHORT_FORMATTERS = new Map<string, Intl.DateTimeFormat>();
const DAY_MONTH_SHORT_FORMATTERS = new Map<string, Intl.DateTimeFormat>();
const WEEKDAY_LONG_FORMATTERS = new Map<string, Intl.DateTimeFormat>();
const DATE_LONG_FORMATTERS = new Map<string, Intl.DateTimeFormat>();

function normalizeString(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? '';
  return trimmed ? trimmed : null;
}

function getFormatter(
  cache: Map<string, Intl.DateTimeFormat>,
  timeZone: string,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  const key = `${timeZone}:${JSON.stringify(options)}`;
  const cached = cache.get(key);
  if (cached) {
    return cached;
  }

  const formatter = new Intl.DateTimeFormat(undefined, {
    ...options,
    timeZone,
  });
  cache.set(key, formatter);
  return formatter;
}

function parseDateParts(value: string | null): ParsedDateParts | null {
  if (!value) {
    return null;
  }

  const match = value.match(DATE_PATTERN);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  return { year, month, day };
}

function parseTimeParts(value: string | null): ParsedTimeParts | null {
  if (!value) {
    return null;
  }

  const match = value.match(TIME_PATTERN);
  if (!match) {
    return null;
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = Number(match[3] ?? '0');

  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    !Number.isInteger(second) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59 ||
    second < 0 ||
    second > 59
  ) {
    return null;
  }

  return { hour, minute, second };
}

function parseTimestamp(value: string | null): Date | null {
  if (!value) {
    return null;
  }

  if (/^\d+$/.test(value)) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return null;
    }

    const isSeconds = value.length <= 10;
    const parsed = new Date(isSeconds ? numeric * 1000 : numeric);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseUtcDateTime(dateValue: string | null, timeValue: string | null): Date | null {
  const dateParts = parseDateParts(dateValue);
  const timeParts = parseTimeParts(timeValue);
  if (!dateParts || !timeParts) {
    return null;
  }

  return new Date(
    Date.UTC(
      dateParts.year,
      dateParts.month - 1,
      dateParts.day,
      timeParts.hour,
      timeParts.minute,
      timeParts.second,
    ),
  );
}

function parseLocalDateTime(dateValue: string | null, timeValue: string | null): Date | null {
  const dateParts = parseDateParts(dateValue);
  const timeParts = parseTimeParts(timeValue);
  if (!dateParts || !timeParts) {
    return null;
  }

  const parsed = new Date(
    dateParts.year,
    dateParts.month - 1,
    dateParts.day,
    timeParts.hour,
    timeParts.minute,
    timeParts.second,
  );
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getUserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

export function getLocalDayKey(date: Date, timeZone = getUserTimeZone()): string {
  const formatter = getFormatter(DAY_KEY_FORMATTERS, timeZone, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === 'year')?.value ?? '';
  const month = parts.find((part) => part.type === 'month')?.value ?? '';
  const day = parts.find((part) => part.type === 'day')?.value ?? '';
  return `${year}-${month}-${day}`;
}

export function parseDayKey(dayKey: string): Date | null {
  const dateParts = parseDateParts(dayKey);
  if (!dateParts) {
    return null;
  }

  return new Date(Date.UTC(dateParts.year, dateParts.month - 1, dateParts.day));
}

export function formatLocalDate(date: Date, timeZone = getUserTimeZone()): string {
  return getFormatter(DATE_FORMATTERS, timeZone, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(date);
}

export function formatLocalTime(date: Date, timeZone = getUserTimeZone()): string {
  return getFormatter(TIME_FORMATTERS, timeZone, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export function formatLocalDateTime(date: Date, timeZone = getUserTimeZone()): string {
  return getFormatter(DATE_TIME_FORMATTERS, timeZone, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export function formatMonthCaption(date: Date, timeZone = getUserTimeZone()): string {
  return getFormatter(MONTH_YEAR_FORMATTERS, timeZone, {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatWeekdayShort(date: Date, timeZone = getUserTimeZone()): string {
  return getFormatter(WEEKDAY_SHORT_FORMATTERS, timeZone, {
    weekday: 'short',
  }).format(date);
}

export function formatDayMonthShort(date: Date, timeZone = getUserTimeZone()): string {
  return getFormatter(DAY_MONTH_SHORT_FORMATTERS, timeZone, {
    day: 'numeric',
    month: 'short',
  }).format(date);
}

export function formatWeekdayLong(date: Date, timeZone = getUserTimeZone()): string {
  return getFormatter(WEEKDAY_LONG_FORMATTERS, timeZone, {
    weekday: 'long',
  }).format(date);
}

export function formatLocalDateLong(date: Date, timeZone = getUserTimeZone()): string {
  return getFormatter(DATE_LONG_FORMATTERS, timeZone, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function getRelativeDayDistance(
  kickoffInstant: Date,
  now: Date,
  userTimeZone: string,
): number | null {
  const kickoffDay = parseDayKey(getLocalDayKey(kickoffInstant, userTimeZone));
  const currentDay = parseDayKey(getLocalDayKey(now, userTimeZone));
  if (!kickoffDay || !currentDay) {
    return null;
  }

  return Math.round((kickoffDay.getTime() - currentDay.getTime()) / DAY_MS);
}

export function getRelativeDayLabel(
  kickoffInstant: Date | null,
  options: BuildOptions = {},
): RelativeDayLabel | null {
  if (!kickoffInstant) {
    return null;
  }

  const userTimeZone = options.userTimeZone ?? getUserTimeZone();
  const now = options.now ?? new Date();
  const delta = getRelativeDayDistance(kickoffInstant, now, userTimeZone);

  if (delta === 0) {
    return 'Today';
  }
  if (delta === 1) {
    return 'Tomorrow';
  }
  if (delta === -1) {
    return 'Yesterday';
  }

  return null;
}

export function formatSecondaryKickoffLabel(kickoffInstant: Date | null): string | null {
  if (!kickoffInstant) {
    return null;
  }
  return SECONDARY_LOCAL_LABEL;
}

function getDiscrepancyReason(params: {
  kickoffInstant: Date | null;
  sourceDateEvent: string | null;
  sourceDateEventLocal: string | null;
  sourceTime: string | null;
  sourceTimeLocal: string | null;
  utcCandidate: Date | null;
  localCandidate: Date | null;
  userTimeZone: string;
}): string | null {
  const {
    kickoffInstant,
    sourceDateEvent,
    sourceDateEventLocal,
    sourceTime,
    sourceTimeLocal,
    utcCandidate,
    localCandidate,
    userTimeZone,
  } = params;

  const hasPartialUtcFields = Boolean(sourceDateEvent) !== Boolean(sourceTime);
  if (hasPartialUtcFields) {
    return 'utc_date_time_partial_fields';
  }

  const hasPartialLocalFields = Boolean(sourceDateEventLocal) !== Boolean(sourceTimeLocal);
  if (hasPartialLocalFields) {
    return 'local_date_time_partial_fields';
  }

  if (sourceDateEvent && sourceDateEventLocal && sourceDateEvent !== sourceDateEventLocal) {
    return 'date_fields_disagree';
  }

  if (!kickoffInstant) {
    return null;
  }

  if (sourceDateEvent) {
    const kickoffUtcDayKey = getLocalDayKey(kickoffInstant, 'UTC');
    if (kickoffUtcDayKey !== sourceDateEvent) {
      return 'timestamp_conflicts_with_date_event';
    }
  }

  if (sourceDateEventLocal) {
    const kickoffLocalDayKey = getLocalDayKey(kickoffInstant, userTimeZone);
    if (kickoffLocalDayKey !== sourceDateEventLocal) {
      return 'timestamp_conflicts_with_date_event_local';
    }
  }

  if (utcCandidate && localCandidate) {
    const utcCandidateLocalDay = getLocalDayKey(utcCandidate, userTimeZone);
    const localCandidateLocalDay = getLocalDayKey(localCandidate, userTimeZone);
    if (utcCandidateLocalDay !== localCandidateLocalDay) {
      return 'date_bucketing_would_differ_by_source';
    }
  }

  return null;
}

export function parseKickoff(source: KickoffRawSource, options: BuildOptions = {}): ParsedKickoff {
  const userTimeZone = options.userTimeZone ?? getUserTimeZone();
  const sourceDateEvent = normalizeString(source.dateEvent);
  const sourceDateEventLocal = normalizeString(source.dateEventLocal);
  const sourceTime = normalizeString(source.strTime);
  const sourceTimeLocal = normalizeString(source.strTimeLocal);
  const sourceTimestamp = normalizeString(source.strTimestamp);

  const parsedTimestamp = parseTimestamp(sourceTimestamp);
  const parsedUtcDateTime = parseUtcDateTime(sourceDateEvent, sourceTime);
  const parsedLocalDateTime = parseLocalDateTime(sourceDateEventLocal, sourceTimeLocal);

  const kickoffInstant = parsedTimestamp ?? parsedUtcDateTime ?? parsedLocalDateTime ?? null;
  const parseSource: KickoffParseSource = parsedTimestamp
    ? 'timestamp'
    : parsedUtcDateTime
      ? 'utc_date_time'
      : parsedLocalDateTime
        ? 'local_date_time'
        : 'unparseable';

  const discrepancyReason = getDiscrepancyReason({
    kickoffInstant,
    sourceDateEvent,
    sourceDateEventLocal,
    sourceTime,
    sourceTimeLocal,
    utcCandidate: parsedUtcDateTime,
    localCandidate: parsedLocalDateTime,
    userTimeZone,
  });

  return {
    kickoffInstant,
    parseSource,
    userTimeZone,
    hasDiscrepancy: discrepancyReason !== null,
    discrepancyReason,
    sourceDateEvent,
    sourceDateEventLocal,
    sourceTime,
    sourceTimeLocal,
  };
}

function getFallbackLocalDayKey(parsedKickoff: ParsedKickoff): string | null {
  if (parsedKickoff.sourceDateEventLocal && parseDateParts(parsedKickoff.sourceDateEventLocal)) {
    return parsedKickoff.sourceDateEventLocal;
  }

  if (parsedKickoff.sourceDateEvent && parseDateParts(parsedKickoff.sourceDateEvent)) {
    return parsedKickoff.sourceDateEvent;
  }

  return null;
}

export function buildNormalizedKickoff(
  source: KickoffRawSource,
  options: BuildOptions = {},
): NormalizedKickoff {
  const parsed = parseKickoff(source, options);
  const userTimeZone = parsed.userTimeZone;
  const localDayKey = parsed.kickoffInstant
    ? getLocalDayKey(parsed.kickoffInstant, userTimeZone)
    : getFallbackLocalDayKey(parsed);

  if (!parsed.kickoffInstant) {
    const fallbackDate = localDayKey ? parseDayKey(localDayKey) : null;

    return {
      kickoffInstant: null,
      parseSource: parsed.parseSource,
      hasDiscrepancy: parsed.hasDiscrepancy,
      discrepancyReason: parsed.discrepancyReason,
      localDayKey,
      localDateLabel: fallbackDate ? formatLocalDate(fallbackDate, userTimeZone) : null,
      localTimeLabel: null,
      localDateTimeLabel: null,
      relativeDayLabel: null,
      secondaryLabel: null,
      fallbackLabel: TIME_UNAVAILABLE_LABEL,
    };
  }

  const allowRelativeLabels =
    !parsed.hasDiscrepancy &&
    (parsed.parseSource === 'timestamp' || parsed.parseSource === 'utc_date_time');
  const relativeDayLabel = allowRelativeLabels
    ? getRelativeDayLabel(parsed.kickoffInstant, {
        userTimeZone,
        ...(options.now ? { now: options.now } : {}),
      })
    : null;

  return {
    kickoffInstant: parsed.kickoffInstant,
    parseSource: parsed.parseSource,
    hasDiscrepancy: parsed.hasDiscrepancy,
    discrepancyReason: parsed.discrepancyReason,
    localDayKey,
    localDateLabel: formatLocalDate(parsed.kickoffInstant, userTimeZone),
    localTimeLabel: formatLocalTime(parsed.kickoffInstant, userTimeZone),
    localDateTimeLabel: formatLocalDateTime(parsed.kickoffInstant, userTimeZone),
    relativeDayLabel,
    secondaryLabel: formatSecondaryKickoffLabel(parsed.kickoffInstant),
    fallbackLabel: null,
  };
}

export function getKickoffPrimaryLabel(kickoff: NormalizedKickoff): string {
  return kickoff.localTimeLabel ?? kickoff.fallbackLabel ?? TIME_UNAVAILABLE_LABEL;
}

export function logKickoffDiscrepancy(
  eventId: string | null | undefined,
  kickoff: ParsedKickoff | NormalizedKickoff,
): void {
  if (!import.meta.env.DEV || !kickoff.hasDiscrepancy) {
    return;
  }

  const normalizedEventId = eventId?.trim() || 'unknown-event';
  console.warn(
    `[kickoff-discrepancy] event=${normalizedEventId} source=${kickoff.parseSource} reason=${kickoff.discrepancyReason ?? 'unknown'}`,
  );
}
