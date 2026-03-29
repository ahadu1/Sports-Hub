import { cn } from '@/lib/utils/cn';

import { EventIcon } from './EventIcon';

import type { MatchEventSide, MatchEventType } from '@/features/match/types/match-events.types';

type EventContentBlockProps = {
  side: MatchEventSide;
  primaryText: string;
  secondaryText?: string;
  showSecondaryText: boolean;
  eventType: MatchEventType;
};

type EventTextStackProps = {
  side: MatchEventSide;
  primaryText: string;
  secondaryText?: string;
  showSecondaryText: boolean;
};

function EventTextStack({
  side,
  primaryText,
  secondaryText,
  showSecondaryText,
}: EventTextStackProps) {
  return (
    <div
      className={cn(
        'flex h-[32px] min-w-0 flex-1 flex-col justify-center',
        side === 'home' ? 'items-end text-right' : 'items-start text-left',
      )}
    >
      <span className="app-type-inter-12-16-normal block max-w-full truncate whitespace-nowrap text-white">
        {primaryText}
      </span>
      {showSecondaryText ? (
        <span className="app-type-inter-12-16-normal block max-w-full truncate whitespace-nowrap text-[#6B7280]">
          {secondaryText}
        </span>
      ) : null}
    </div>
  );
}

export function EventContentBlock({
  side,
  primaryText,
  secondaryText,
  showSecondaryText,
  eventType,
}: EventContentBlockProps) {
  const textBlock = (
    <EventTextStack
      primaryText={primaryText}
      showSecondaryText={showSecondaryText}
      side={side}
      {...(secondaryText !== undefined ? { secondaryText } : {})}
    />
  );

  return (
    <div className="flex h-[32px] max-w-full min-w-0 items-center gap-[10px]">
      {side === 'home' ? (
        <>
          {textBlock}
          <EventIcon eventType={eventType} />
        </>
      ) : (
        <>
          <EventIcon eventType={eventType} />
          {textBlock}
        </>
      )}
    </div>
  );
}
