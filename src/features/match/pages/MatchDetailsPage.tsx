import { PagePlaceholder } from '@/components/ui/PagePlaceholder';
import { copy } from '@/lib/constants/copy';
import { useParams } from 'react-router-dom';

export function MatchDetailsPage() {
  const { eventId } = useParams();
  const id = eventId ?? '';

  return (
    <PagePlaceholder
      title={copy.matchPlaceholderHeading}
      description={
        <>
          {copy.matchPlaceholderBodyPrefix} <code className="text-[var(--color-text)]">{id}</code>.
        </>
      }
    />
  );
}
