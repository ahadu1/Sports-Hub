import { PagePlaceholder } from '@/components/ui/PagePlaceholder';
import { copy } from '@/lib/constants/copy';

export function NotFoundPage() {
  return <PagePlaceholder title={copy.notFoundHeading} description={copy.notFoundBody} />;
}
