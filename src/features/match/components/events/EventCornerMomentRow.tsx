import { EventIcon } from './EventIcon';

import type { MatchCornerMoment } from '@/utils/match/matchCornerMoments.utils';

type EventCornerMomentRowProps = {
  moment: MatchCornerMoment;
};

export function EventCornerMomentRow({ moment }: EventCornerMomentRowProps) {
  return (
    <div className="matchEventsSection__cornerMoment">
      <span className="matchEventsSection__cornerLabel">{moment.label}</span>
      <EventIcon className="matchEventsSection__cornerIcon" eventType="corner" />
      <span aria-hidden="true" className="matchEventsSection__cornerConnector" />
      <span className="matchEventsSection__cornerMinute">{moment.minute}</span>
    </div>
  );
}
