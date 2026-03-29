import { MoreVerticalIcon } from '@/components/icons';

type FixtureMenuButtonProps = {
  fixtureLabel: string;
  onClick?: () => void;
};

export function FixtureMenuButton({ fixtureLabel, onClick }: FixtureMenuButtonProps) {
  return (
    <button
      type="button"
      aria-label={`Open fixture menu for ${fixtureLabel}`}
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-app-text"
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      onKeyDown={(event) => {
        event.stopPropagation();
      }}
    >
      <MoreVerticalIcon />
    </button>
  );
}
