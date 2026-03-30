import { LoadingState } from '@/components/ui/LoadingState';
import { StatePanel } from '@/components/ui/StatePanel';

export function RouteLoadingFallback() {
  return (
    <StatePanel>
      <LoadingState className="justify-center" />
    </StatePanel>
  );
}
