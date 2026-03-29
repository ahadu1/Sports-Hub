import { addDays, format, isSameDay, isToday, parseISO, startOfDay } from 'date-fns';

import {
  DESKTOP_DATE_LABEL_FORMAT,
  MOBILE_DATE_BOTTOM_LABEL_FORMAT,
  MOBILE_DATE_TOP_LABEL_FORMAT,
  MOBILE_RIBBON_CENTER_INDEX,
  MOBILE_RIBBON_ITEM_COUNT,
  MONTH_CAPTION_FORMAT,
} from './date-selector.constants';
import type { CompetitionSection } from '../../types/fixtures.types';

export function normalizeDate(date: Date): Date {
  return startOfDay(date);
}

export function normalizeFromIso(dateIso: string): Date {
  return normalizeDate(parseISO(dateIso));
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return isSameDay(normalizeDate(a), normalizeDate(b));
}

export function isSelectedDateToday(selectedDate: Date): boolean {
  return isToday(normalizeDate(selectedDate));
}

export function getDesktopDateLabel(selectedDate: Date): string {
  if (isSelectedDateToday(selectedDate)) {
    return 'Today';
  }

  return format(normalizeDate(selectedDate), DESKTOP_DATE_LABEL_FORMAT).toUpperCase();
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

  if (isToday(normalizeDate(date))) {
    return 'Today';
  }

  return format(normalizeDate(date), MOBILE_DATE_TOP_LABEL_FORMAT).toUpperCase();
}

export function getMobileDateBottomLabel(date: Date): string {
  return format(normalizeDate(date), MOBILE_DATE_BOTTOM_LABEL_FORMAT).toUpperCase();
}

export function getMonthCaption(date: Date): string {
  return format(normalizeDate(date), MONTH_CAPTION_FORMAT);
}

export function filterFixturesByDate(
  sections: CompetitionSection[],
  selectedDate: Date,
): CompetitionSection[] {
  return sections
    .map((section) => ({
      ...section,
      fixtures: section.fixtures.filter((fixture) =>
        isSameCalendarDay(normalizeFromIso(fixture.fixtureDate), selectedDate),
      ),
    }))
    .filter((section) => section.fixtures.length > 0);
}

export function hasFixturesForDate(sections: CompetitionSection[], selectedDate: Date): boolean {
  return sections.some((section) =>
    section.fixtures.some((fixture) =>
      isSameCalendarDay(normalizeFromIso(fixture.fixtureDate), selectedDate),
    ),
  );
}
