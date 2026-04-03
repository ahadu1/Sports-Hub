import { ComingSoonCard } from '@/components/ui/ComingSoonCard';

type TopMenuComingSoonPageProps = {
  title: string;
};

export function TopMenuComingSoonPage({ title }: TopMenuComingSoonPageProps) {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[960px]">
        <h1 className="mb-4 text-left text-2xl font-semibold text-app-text sm:text-3xl">{title}</h1>
        <ComingSoonCard
          title={title}
          showTitle={false}
          className="p-8 sm:p-10"
          messageClassName="text-5xl sm:text-6xl lg:text-7xl"
          footballClassName="mb-1 ml-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6"
        />
      </div>
    </div>
  );
}
