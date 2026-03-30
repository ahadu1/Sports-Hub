const MATCH_EVENT_ID_PATTERN = /^\d+$/;

export function isValidMatchEventId(eventId: string): boolean {
  return MATCH_EVENT_ID_PATTERN.test(eventId.trim());
}
