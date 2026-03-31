import { normalizeDate } from '@/utils/fixtures/date-selector.utils';
import { logError } from '@/utils/logger';
import { startOfLocalDay } from '@/lib/datetime/date';
import { useCallback, useState } from 'react';

const FIXTURES_DATE_STORAGE_KEY = 'sports-hub:selected-fixtures-date';

function getDefaultSelectedDate(): Date {
  return startOfLocalDay(new Date());
}

function readPersistedFixturesDate(): Date {
  if (typeof window === 'undefined') {
    return getDefaultSelectedDate();
  }

  try {
    const persistedValue = window.sessionStorage.getItem(FIXTURES_DATE_STORAGE_KEY);
    if (!persistedValue) {
      return getDefaultSelectedDate();
    }

    const parsedDate = new Date(persistedValue);
    if (Number.isNaN(parsedDate.getTime())) {
      return getDefaultSelectedDate();
    }

    return normalizeDate(parsedDate);
  } catch (error) {
    logError('usePersistedFixturesDate.read', error);
    return getDefaultSelectedDate();
  }
}

export function usePersistedFixturesDate() {
  const [selectedDate, setSelectedDate] = useState<Date>(() => readPersistedFixturesDate());

  const updateSelectedDate = useCallback((nextDate: Date) => {
    const normalizedDate = normalizeDate(nextDate);
    setSelectedDate(normalizedDate);

    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.sessionStorage.setItem(FIXTURES_DATE_STORAGE_KEY, normalizedDate.toISOString());
    } catch (error) {
      logError('usePersistedFixturesDate.write', error);
    }
  }, []);

  return { selectedDate, setSelectedDate: updateSelectedDate };
}
