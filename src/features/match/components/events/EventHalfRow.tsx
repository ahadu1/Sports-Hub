import { cn } from '@/lib/utils/cn';

import { EventContentBlock } from './EventContentBlock';

import type { EventSideContent, MatchEventSide } from '@/features/match/types/match-events.types';

type EventHalfRowProps = {
  side: MatchEventSide;
  content: EventSideContent | undefined;
};

function ConnectorLine() {
  return <span aria-hidden="true" className="h-0 w-[16px] shrink-0 border-t border-[#374151]" />;
}

export function EventHalfRow({ side, content }: EventHalfRowProps) {
  return (
    <div
      className={cn(
        'flex h-[32px] min-w-0 items-center',
        side === 'home' ? 'justify-end' : 'justify-start',
      )}
    >
      {content ? (
        <>
          {side === 'away' ? <ConnectorLine /> : null}
          <EventContentBlock
            eventType={content.eventType}
            primaryText={content.primaryText}
            showSecondaryText={content.showSecondaryText}
            side={side}
            {...(content.secondaryText !== undefined
              ? { secondaryText: content.secondaryText }
              : {})}
          />
          {side === 'home' ? <ConnectorLine /> : null}
        </>
      ) : null}
    </div>
  );
}
