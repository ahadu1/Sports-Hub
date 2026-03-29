import type { MatchTimelineApiItem } from '@/features/match/types/match-events.types';

export const mockMatchEventsApiTimeline: MatchTimelineApiItem[] = [
  {
    id: 'divider-fulltime',
    kind: 'divider',
    label: 'Fulltime',
    score: '2 - 1',
  },
  {
    id: 'event-89-home-substitution',
    kind: 'event',
    minute: "89'",
    home: {
      eventType: 'substitution',
      primaryText: 'Gyokores',
      secondaryText: 'Odegard',
    },
  },
  {
    id: 'event-88-away-goal',
    kind: 'event',
    minute: "88'",
    minuteVariant: 'active',
    away: {
      eventType: 'goal',
      primaryText: 'Ekitike',
      secondaryText: 'Sallah',
    },
  },
  {
    id: 'event-78-home-yellow-card',
    kind: 'event',
    minute: "78'",
    home: {
      eventType: 'yellow-card',
      primaryText: 'Saliba',
    },
  },
  {
    id: 'event-74-home-corner',
    kind: 'event',
    minute: "74'",
    home: {
      eventType: 'corner',
      primaryText: '3rd corner',
    },
  },
  {
    id: 'event-67-bilateral-substitution',
    kind: 'event',
    minute: "67'",
    home: {
      eventType: 'substitution',
      primaryText: 'Rice',
      secondaryText: 'Zubemendi',
    },
    away: {
      eventType: 'substitution',
      primaryText: 'Frimpong',
      secondaryText: 'Robertson',
    },
  },
  {
    id: 'event-66-away-red-card',
    kind: 'event',
    minute: "66'",
    away: {
      eventType: 'red-card',
      primaryText: 'Van Dijk',
      secondaryText: 'Sent Off',
    },
  },
  {
    id: 'event-55-home-goal',
    kind: 'event',
    minute: "55'",
    minuteVariant: 'active',
    home: {
      eventType: 'goal',
      primaryText: 'Saka',
    },
  },
  {
    id: 'event-52-home-corner',
    kind: 'event',
    minute: "52'",
    home: {
      eventType: 'corner',
      primaryText: '5th corner',
    },
  },
  {
    id: 'event-48-away-corner',
    kind: 'event',
    minute: "48'",
    away: {
      eventType: 'corner',
      primaryText: '3rd Corner',
    },
  },
  {
    id: 'divider-halftime',
    kind: 'divider',
    label: "Halftime'",
    score: '1 - 0',
  },
  {
    id: 'event-45-plus-2-home-corner',
    kind: 'event',
    minute: "45+2'",
    home: {
      eventType: 'corner',
      primaryText: '2nd corner',
    },
  },
  {
    id: 'event-45-away-substitution',
    kind: 'event',
    minute: "45'",
    away: {
      eventType: 'substitution',
      primaryText: 'Jones',
      secondaryText: 'Mcalister',
    },
  },
  {
    id: 'event-44-home-yellow-card',
    kind: 'event',
    minute: "44'",
    home: {
      eventType: 'yellow-card',
      primaryText: 'Gabriel',
    },
  },
  {
    id: 'event-44-away-injury',
    kind: 'event',
    minute: "44'",
    away: {
      eventType: 'injury',
      primaryText: 'Jones',
      secondaryText: 'Injured',
    },
  },
  {
    id: 'event-36-home-corner',
    kind: 'event',
    minute: "36'",
    home: {
      eventType: 'corner',
      primaryText: '1st corner',
    },
  },
  {
    id: 'event-34-away-yellow-card',
    kind: 'event',
    minute: "34'",
    away: {
      eventType: 'yellow-card',
      primaryText: 'Konate',
    },
  },
  {
    id: 'event-25-home-goal',
    kind: 'event',
    minute: "25'",
    home: {
      eventType: 'off-the-post',
      primaryText: 'Gyokores',
    },
  },
  {
    id: 'event-16-away-corner',
    kind: 'event',
    minute: "16'",
    away: {
      eventType: 'corner',
      primaryText: '2nd Corner',
    },
  },
  {
    id: 'event-12-home-goal',
    kind: 'event',
    minute: "12'",
    minuteVariant: 'active',
    home: {
      eventType: 'goal',
      primaryText: 'Gyokores',
      secondaryText: 'Odegard',
    },
  },
  {
    id: 'event-3-away-corner',
    kind: 'event',
    minute: "3'",
    away: {
      eventType: 'corner',
      primaryText: '1st Corner',
    },
  },
  {
    id: 'divider-kickoff',
    kind: 'divider',
    label: 'Kick Off -13:00',
    dividerVariant: 'kickoff',
  },
];
