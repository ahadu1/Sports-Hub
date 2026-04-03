import { normalizeDate } from '@/utils/fixtures/date-selector.utils';
import { startOfLocalDay } from '@/lib/datetime/date';
import { useCallback, useState } from 'react';

function getDefaultSelectedDate(): Date {
  return startOfLocalDay(new Date());
}

export function usePersistedFixturesDate() {
  const [selectedDate, setSelectedDate] = useState<Date>(() => getDefaultSelectedDate());

  const updateSelectedDate = useCallback((nextDate: Date) => {
    setSelectedDate(normalizeDate(nextDate));
  }, []);

  return { selectedDate, setSelectedDate: updateSelectedDate };
}
