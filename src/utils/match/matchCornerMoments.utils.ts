import type { TimelineItem } from '@/features/match/types/match-events.types';

export type MatchCornerMoment = {
  label: string;
  minute: string;
};

function parseTimelineMinuteLabel(minuteLabel: string): number | undefined {
  const minuteMatch = minuteLabel.match(/^(\d+)(?:\+(\d+))?'/);
  if (!minuteMatch) {
    return undefined;
  }

  const minute = Number(minuteMatch[1]);
  const extra = minuteMatch[2] ? Number(minuteMatch[2]) : 0;
  if (!Number.isFinite(minute) || !Number.isFinite(extra)) {
    return undefined;
  }

  return minute + extra / 100;
}

export function mapMatchCornerMoments(timelineItems: TimelineItem[]): MatchCornerMoment[] {
  const cornerMoments = timelineItems.flatMap((item) => {
    if (item.kind !== 'event') {
      return [];
    }

    return [item.home, item.away]
      .filter((content) => content?.eventType === 'corner')
      .map(() => ({
        minute: item.minute,
        sortMinute: parseTimelineMinuteLabel(item.minute) ?? Number.MAX_SAFE_INTEGER,
      }));
  });

  cornerMoments.sort((left, right) => left.sortMinute - right.sortMinute);

  return cornerMoments.slice(0, 2).map((cornerMoment, index) => ({
    label: `${index + 1}${index === 0 ? 'st' : 'nd'} corner`,
    minute: cornerMoment.minute,
  }));
}
