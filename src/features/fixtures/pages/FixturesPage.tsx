import { PagePlaceholder } from '@/components/ui/PagePlaceholder';
import { copy } from '@/lib/constants/copy';

export function FixturesPage() {
  return (
    <PagePlaceholder
      title={copy.fixturesPlaceholderHeading}
      description={copy.fixturesPlaceholderBody}
    />
  );
}
