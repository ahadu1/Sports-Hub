import { routes } from '@/app/config/routes';
import { HEADER_ASSETS } from '@/components/header/header.constants';
import { NavLink } from 'react-router-dom';

type MobileHeaderProps = {
  onNavigateHome: () => void;
  onOpenDrawer: () => void;
  onOpenSeasonDrawer: () => void;
};

const mobileIconButtonClasses =
  'flex size-10 items-center justify-center rounded-full bg-black/15 shrink-0';

export function MobileHeader({
  onNavigateHome,
  onOpenDrawer,
  onOpenSeasonDrawer,
}: MobileHeaderProps) {
  return (
    <header className="flex h-14 w-full items-center justify-between bg-app-brand-primary px-4 lg:hidden">
      <NavLink to={routes.home} onClick={onNavigateHome}>
        <img
          src={HEADER_ASSETS.logo}
          alt="Sports Hub"
          className="object-contain"
          style={{ height: '26.1px', width: '82px' }}
        />
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
          onClick={onOpenSeasonDrawer}
          className="flex h-10 items-center gap-2 rounded-full bg-black/15 px-4 text-app-brand-on-surface [font-family:'Roboto',sans-serif] text-[12px] leading-4 font-light tracking-[0]"
        >
          <span>2024/25</span>
          <ChevronDownIcon />
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

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 7.5 5 5 5-5" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}
