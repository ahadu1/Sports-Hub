import {
  MOBILE_RIBBON_GAP_PX,
  MOBILE_RIBBON_MIN_DATE_WIDTH_PX,
  MOBILE_RIBBON_ITEM_COUNT,
  MOBILE_RIBBON_SELECTED_POSITION_RATIO,
} from '@/utils/fixtures/date-selector.constants';
import type { CompetitionSection } from '@/features/fixtures/types/fixtures.types';
import { addCalendarDays, startOfLocalDay } from '@/lib/datetime/date';
import {
  formatDayMonthShort,
  formatMonthCaption,
  formatWeekdayShort,
  getLocalDayKey,
  parseDayKey,
} from '@/lib/datetime/kickoff';

const DAY_MS = 24 * 60 * 60 * 1000;

export function normalizeDate(date: Date): Date {
  return startOfLocalDay(date);
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return getLocalDayKey(normalizeDate(a)) === getLocalDayKey(normalizeDate(b));
}

export function isSelectedDateToday(selectedDate: Date): boolean {
  return getLocalDayKey(normalizeDate(selectedDate)) === getLocalDayKey(normalizeDate(new Date()));
}

export function getDesktopDateLabel(selectedDate: Date): string {
  if (isSelectedDateToday(selectedDate)) {
    return 'Today';
  }

  const normalizedDate = normalizeDate(selectedDate);
  return `${formatWeekdayShort(normalizedDate)} ${formatDayMonthShort(normalizedDate)}`.toUpperCase();
}

export function getMobileRibbonItemCount(containerWidth: number): number {
  const normalizedWidth = Number.isFinite(containerWidth) ? Math.max(0, containerWidth) : 0;
  const count = Math.floor(
    (normalizedWidth + MOBILE_RIBBON_GAP_PX) /
      (MOBILE_RIBBON_MIN_DATE_WIDTH_PX + MOBILE_RIBBON_GAP_PX),
  );

  return Math.max(MOBILE_RIBBON_ITEM_COUNT, count);
}

export function getMobileRibbonCenterIndex(itemCount: number): number {
  if (itemCount <= 1) {
    return 0;
  }

  return Math.min(
    itemCount - 1,
    Math.max(0, Math.floor(itemCount * MOBILE_RIBBON_SELECTED_POSITION_RATIO)),
  );
}

export function getMobileRibbonDates(
  selectedDate: Date,
  itemCount: number,
  centerIndex: number,
): Date[] {
  const totalItems = Math.max(1, itemCount);
  const selectedIndex = Math.min(totalItems - 1, Math.max(0, centerIndex));

  return Array.from({ length: totalItems }, (_, index) =>
    normalizeDate(addCalendarDays(selectedDate, index - selectedIndex)),
  );
}

export function getMobileDateTopLabel(date: Date, selectedDate: Date): string {
  if (isSameCalendarDay(date, selectedDate) && isSelectedDateToday(selectedDate)) {
    return 'Today';
  }

  if (isSelectedDateToday(date)) {
    return 'Today';
  }

  return formatWeekdayShort(normalizeDate(date)).toUpperCase();
}

export function getMobileDateBottomLabel(date: Date): string {
  return formatDayMonthShort(normalizeDate(date)).toUpperCase();
}

export function getMonthCaption(date: Date): string {
  return formatMonthCaption(normalizeDate(date));
}

export function filterFixturesByDate(
  sections: CompetitionSection[],
  selectedDate: Date,
): CompetitionSection[] {
  const selectedDayKey = getLocalDayKey(normalizeDate(selectedDate));

  return sections
    .map((section) => ({
      ...section,
      fixtures: section.fixtures.filter(
        (fixture) => fixture.kickoff.localDayKey === selectedDayKey,
      ),
    }))
    .filter((section) => section.fixtures.length > 0);
}

export function hasFixturesForDate(sections: CompetitionSection[], selectedDate: Date): boolean {
  const selectedDayKey = getLocalDayKey(normalizeDate(selectedDate));

  return sections.some((section) =>
    section.fixtures.some((fixture) => fixture.kickoff.localDayKey === selectedDayKey),
  );
}

function parseLocalDayKey(dayKey: string): Date | null {
  const parsedDay = parseDayKey(dayKey);
  if (!parsedDay) {
    return null;
  }

  return normalizeDate(
    new Date(parsedDay.getUTCFullYear(), parsedDay.getUTCMonth(), parsedDay.getUTCDate()),
  );
}

export function getClosestFixtureDate(
  sections: CompetitionSection[],
  referenceDate = new Date(),
): Date | null {
  const referenceDay = parseDayKey(getLocalDayKey(referenceDate));
  if (!referenceDay) {
    return null;
  }

  let closestDate: Date | null = null;
  let closestDistance: number | null = null;
  const seenDayKeys = new Set<string>();

  sections.forEach((section) => {
    section.fixtures.forEach((fixture) => {
      const dayKey = fixture.kickoff.localDayKey;
      if (!dayKey || seenDayKeys.has(dayKey)) {
        return;
      }

      seenDayKeys.add(dayKey);

      const parsedDay = parseDayKey(dayKey);
      const localDate = parseLocalDayKey(dayKey);
      if (!parsedDay || !localDate) {
        return;
      }

      const distance = Math.round((parsedDay.getTime() - referenceDay.getTime()) / DAY_MS);
      if (
        closestDistance === null ||
        Math.abs(distance) < Math.abs(closestDistance) ||
        (Math.abs(distance) === Math.abs(closestDistance) && distance > closestDistance)
      ) {
        closestDistance = distance;
        closestDate = localDate;
      }
    });
  });

  return closestDate;
}
