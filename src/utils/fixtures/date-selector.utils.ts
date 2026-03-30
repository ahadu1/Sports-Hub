import { addDays, startOfDay } from 'date-fns';
import {
  MOBILE_RIBBON_CENTER_INDEX,
  MOBILE_RIBBON_ITEM_COUNT,
} from '@/utils/fixtures/date-selector.constants';
import type { CompetitionSection } from '@/features/fixtures/types/fixtures.types';
import {
  formatDayMonthShort,
  formatMonthCaption,
  formatWeekdayShort,
  getLocalDayKey,
} from '@/lib/datetime/kickoff';

export function normalizeDate(date: Date): Date {
  return startOfDay(date);
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

export function getMobileRibbonDates(selectedDate: Date): Date[] {
  return Array.from({ length: MOBILE_RIBBON_ITEM_COUNT }, (_, index) =>
    normalizeDate(addDays(selectedDate, index - MOBILE_RIBBON_CENTER_INDEX)),
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
