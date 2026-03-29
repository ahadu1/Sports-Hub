import { routes } from '@/app/config/routes';
import {
  HEADER_ASSETS,
  MOBILE_ACCORDION_CONTENT,
  PRIMARY_NAV_ITEMS,
  type HeaderAccordionSection,
} from '@/components/header/header.constants';
import { ChevronDownIcon } from '@/components/icons';
import clsx from 'clsx';
import type { RefObject } from 'react';
import { NavLink } from 'react-router-dom';

type DesktopHeaderProps = {
  isMatchesActive: boolean;
  openDisclosure: HeaderAccordionSection | null;
  onNavigateHome: () => void;
  onToggleDisclosure: (section: HeaderAccordionSection) => void;
  disclosureContainerRef: RefObject<HTMLDivElement | null>;
};

const desktopNavItemClasses =
  'relative inline-flex h-[43px] items-center whitespace-nowrap px-2 py-2 app-type-poppins-18-27-normal';

const desktopIconButtonClasses =
  'flex size-10 shrink-0 items-center justify-center rounded-full bg-black/15';

const desktopDisclosureButtonClasses =
  'flex h-10 items-center gap-2 rounded-full bg-black/15 px-4 text-app-brand-on-surface app-type-poppins-16-24-medium';

export function DesktopHeader({
  isMatchesActive,
  openDisclosure,
  onNavigateHome,
  onToggleDisclosure,
  disclosureContainerRef,
}: DesktopHeaderProps) {
  return (
    <header className="hidden h-[60px] w-full items-center justify-between bg-app-brand-primary px-4 lg:flex">
      <div className="flex items-center gap-8">
        <NavLink to={routes.home} onClick={onNavigateHome}>
          <img src={HEADER_ASSETS.logo} alt="Sports Hub" className="h-13 w-auto object-contain" />
        </NavLink>

        <nav aria-label="Primary navigation" className="flex items-stretch gap-0">
          {PRIMARY_NAV_ITEMS.map((item) =>
            item.temporary ? (
              <button
                key={item.key}
                type="button"
                className={clsx(desktopNavItemClasses, 'text-white')}
              >
                {item.label}
              </button>
            ) : (
              <NavLink
                key={item.key}
                to={routes.home}
                end
                onClick={onNavigateHome}
                className={clsx(
                  desktopNavItemClasses,
                  isMatchesActive
                    ? 'text-app-brand-secondary after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-app-brand-secondary'
                    : 'text-white',
                )}
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <button type="button" aria-label="Open global options" className={desktopIconButtonClasses}>
          <img
            src={HEADER_ASSETS.globe}
            alt=""
            aria-hidden="true"
            className="h-6 w-6 max-h-full max-w-full object-contain"
          />
        </button>

        <button type="button" aria-label="Open sports options" className={desktopIconButtonClasses}>
          <img
            src={HEADER_ASSETS.football}
            alt=""
            aria-hidden="true"
            className="h-6 w-6 max-h-full max-w-full object-contain"
          />
        </button>

        <div ref={disclosureContainerRef} className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              aria-expanded={openDisclosure === 'league'}
              aria-haspopup="menu"
              onClick={() => onToggleDisclosure('league')}
              className={desktopDisclosureButtonClasses}
            >
              <img
                src={HEADER_ASSETS.leagueFlag}
                alt=""
                aria-hidden="true"
                className="h-4 w-4 object-contain"
              />
              <span>Premier League</span>
              <ChevronDownIcon />
            </button>

            {openDisclosure === 'league' ? (
              <DesktopDisclosurePanel
                items={MOBILE_ACCORDION_CONTENT.league}
                minWidthClass="min-w-[220px]"
              />
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              aria-expanded={openDisclosure === 'season'}
              aria-haspopup="menu"
              onClick={() => onToggleDisclosure('season')}
              className={desktopDisclosureButtonClasses}
            >
              <span>2024/25</span>
              <ChevronDownIcon />
            </button>

            {openDisclosure === 'season' ? (
              <DesktopDisclosurePanel
                items={MOBILE_ACCORDION_CONTENT.season}
                minWidthClass="min-w-[160px]"
              />
            ) : null}
          </div>
        </div>

        <button type="button" aria-label="Open locale options" className={desktopIconButtonClasses}>
          <img
            src={HEADER_ASSETS.localeFlag}
            alt=""
            aria-hidden="true"
            className="h-6 w-6 max-h-full max-w-full object-contain"
          />
        </button>
      </div>
    </header>
  );
}

type DesktopDisclosurePanelProps = {
  items: readonly string[];
  minWidthClass: string;
};

function DesktopDisclosurePanel({ items, minWidthClass }: DesktopDisclosurePanelProps) {
  return (
    <div
      className={clsx(
        'absolute right-0 top-[calc(100%+8px)] z-50 rounded-2xl border border-app-border-base bg-app-surface p-2',
        minWidthClass,
      )}
    >
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className="h-10 w-full rounded-xl px-3 text-left text-app-text-strong hover:bg-white/5"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
