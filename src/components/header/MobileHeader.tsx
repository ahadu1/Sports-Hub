import { routes } from '@/app/config/routes';
import { HEADER_ASSETS } from '@/components/header/header.constants';
import { ChevronDownIcon, HamburgerIcon } from '@/components/icons';
import { NavLink } from 'react-router-dom';

type MobileHeaderProps = {
  canOpenSeasonDrawer?: boolean;
  isSeasonLoading?: boolean;
  onNavigateHome: () => void;
  onOpenDrawer: () => void;
  onOpenSeasonDrawer: () => void;
  selectedSeasonLabel: string;
};

const mobileIconButtonClasses =
  'flex size-10 items-center justify-center rounded-full bg-black/15 shrink-0';

export function MobileHeader({
  canOpenSeasonDrawer = false,
  isSeasonLoading = false,
  onNavigateHome,
  onOpenDrawer,
  onOpenSeasonDrawer,
  selectedSeasonLabel,
}: MobileHeaderProps) {
  return (
    <header className="flex h-14 w-full items-center justify-between bg-app-brand-primary px-4 lg:hidden">
      <NavLink to={routes.home} onClick={onNavigateHome}>
        <img src={HEADER_ASSETS.logo} alt="Sports Hub" className="app-header-brand-logo" />
      </NavLink>

      <div className="flex items-center gap-2">
        <button type="button" aria-label="Open global options" className={mobileIconButtonClasses}>
          <img
            src={HEADER_ASSETS.globe}
            alt=""
            aria-hidden="true"
            className="h-6 w-6 max-h-full max-w-full object-contain"
          />
        </button>

        <button type="button" aria-label="Open sports options" className={mobileIconButtonClasses}>
          <img
            src={HEADER_ASSETS.football}
            alt=""
            aria-hidden="true"
            className="h-6 w-6 max-h-full max-w-full object-contain"
          />
        </button>

        <button
          type="button"
          aria-busy={isSeasonLoading}
          onClick={canOpenSeasonDrawer ? onOpenSeasonDrawer : undefined}
          className="flex h-10 items-center gap-2 rounded-full bg-black/15 px-4 text-app-brand-on-surface app-type-roboto-12-16-light"
        >
          {isSeasonLoading ? (
            <span
              className="loading loading-spinner loading-xs text-app-brand-secondary"
              aria-hidden
            />
          ) : null}
          <span>{selectedSeasonLabel}</span>
          {canOpenSeasonDrawer ? <ChevronDownIcon /> : null}
        </button>

        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={onOpenDrawer}
          className="flex size-10 items-center justify-center rounded-full text-white"
        >
          <HamburgerIcon />
        </button>
      </div>
    </header>
  );
}
