import { ChevronRightIcon } from '@/components/icons';

type CompetitionHeaderProps = {
  title: string;
};

export function CompetitionHeader({ title }: CompetitionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="app-type-inter-14-20-normal text-app-text">{title}</h2>
      <ChevronRightIcon className="h-5 w-5 shrink-0 text-app-text" />
    </div>
  );
}
