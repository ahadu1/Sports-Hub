export const queryKeys = {
  fixtures: {
    list: () => ['fixtures', 'list'] as const,
  },
  match: {
    detail: (eventId: string) => ['match', 'detail', eventId] as const,
  },
} as const;
