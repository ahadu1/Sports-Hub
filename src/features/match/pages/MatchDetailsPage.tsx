import { MatchDetailsHeader } from '@/features/match/components/MatchDetailsHeader';
import {
  mockMatchDetailsHeaderEvent,
  mockMatchDetailsHeaderUiMeta,
} from '@/features/match/mocks/matchDetailsHeader.mock';

export function MatchDetailsPage() {
  return (
    <div className="flex justify-center">
      <MatchDetailsHeader
        event={mockMatchDetailsHeaderEvent}
        uiMeta={mockMatchDetailsHeaderUiMeta}
      />
    </div>
  );
}
