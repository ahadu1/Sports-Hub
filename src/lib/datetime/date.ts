export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addCalendarDays(date: Date, dayDelta: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + dayDelta);
}

export function startOfLocalMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
