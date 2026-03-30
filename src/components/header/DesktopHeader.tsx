import { routes } from '@/app/config/routes';
import {
  HEADER_ASSETS,
  PRIMARY_NAV_ITEMS,
  type HeaderAccordionSection,
  type HeaderSelectOption,
} from '@/components/header/header.constants';
import { ChevronDownIcon } from '@/components/icons';
import clsx from 'clsx';
import type { RefObject } from 'react';
import { NavLink } from 'react-router-dom';

type DesktopHeaderProps = {
  isMatchesActive: boolean;
  openDisclosure: HeaderAccordionSection | null;
  isLeagueLoading?: boolean;
  isSeasonLoading?: boolean;
  leagueOptions: readonly HeaderSelectOption[];
  seasonOptions: readonly HeaderSelectOption[];
  selectedLeagueId?: string | undefined;
  selectedLeagueLabel: string;
  selectedSeasonId?: string | undefined;
  selectedSeasonLabel: string;
  onNavigateHome: () => void;
  onSelectLeague?: ((leagueId: string) => void) | undefined;
  onSelectSeason?: ((seasonId: string) => void) | undefined;
  onToggleDisclosure: (section: HeaderAccordionSection) => void;
  disclosureContainerRef: RefObject<HTMLDivElement | null>;
};

const desktopNavItemClasses =
  'relative inline-flex min-h-[43px] flex-col items-start justify-center whitespace-nowrap px-2 py-1';

const desktopIconButtonClasses =
  'flex size-10 shrink-0 items-center justify-center rounded-full bg-black/15';

const desktopDisclosureButtonClasses =
  'flex h-10 items-center gap-2 rounded-full bg-black/15 px-4 text-app-brand-on-surface app-type-poppins-16-24-medium';

export function DesktopHeader({
  isMatchesActive,
  openDisclosure,
  isLeagueLoading = false,
  isSeasonLoading = false,
  leagueOptions,
  seasonOptions,
  selectedLeagueId,
  selectedLeagueLabel,
  selectedSeasonId,
  selectedSeasonLabel,
  onNavigateHome,
  onSelectLeague,
  onSelectSeason,
  onToggleDisclosure,
  disclosureContainerRef,
}: DesktopHeaderProps) {
  const canSelectLeague = leagueOptions.length > 1 && onSelectLeague !== undefined;
  const canSelectSeason = seasonOptions.length > 1 && onSelectSeason !== undefined;

  return (
    <header className="hidden h-[60px] w-full items-center justify-between bg-app-brand-primary px-4 lg:flex">
      <div className="flex items-center gap-8">
        <NavLink to={routes.home} onClick={onNavigateHome}>
          <img src={HEADER_ASSETS.logo} alt="Sports Hub" className="h-13 w-auto object-contain" />
        </NavLink>

        <nav aria-label="Primary navigation" className="flex items-stretch gap-0">
          {PRIMARY_NAV_ITEMS.map((item) => {
            const isActive = item.key === 'matches' && isMatchesActive;
            const content = (
              <>
                <span
                  className={clsx(
                    'app-type-poppins-18-27-normal',
                    isActive
                      ? 'text-app-brand-secondary'
                      : item.disabled
                        ? 'text-app-brand-on-surface-variant'
                        : 'text-white',
                  )}
                >
                  {item.label}
                </span>
                {item.disabledText ? (
                  <span className="app-type-roboto-12-16-light text-app-brand-on-surface-variant">
                    {item.disabledText}
                  </span>
                ) : null}
              </>
            );

            if (item.disabled) {
              return (
                <button
                  key={item.key}
                  type="button"
                  disabled
                  className={clsx(desktopNavItemClasses, 'cursor-not-allowed')}
                >
                  {content}
                </button>
              );
            }

            if (item.to) {
              return (
                <NavLink
                  key={item.key}
                  to={item.to}
                  end
                  onClick={onNavigateHome}
                  className={clsx(
                    desktopNavItemClasses,
                    isActive &&
                      'after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-app-brand-secondary',
                  )}
                >
                  {content}
                </NavLink>
              );
            }

            return (
              <button key={item.key} type="button" className={desktopNavItemClasses}>
                {content}
              </button>
            );
          })}
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
              aria-expanded={canSelectLeague ? openDisclosure === 'league' : undefined}
              aria-haspopup={canSelectLeague ? 'menu' : undefined}
              aria-busy={isLeagueLoading}
              onClick={canSelectLeague ? () => onToggleDisclosure('league') : undefined}
              className={desktopDisclosureButtonClasses}
            >
              <img
                src={HEADER_ASSETS.leagueFlag}
                alt=""
                aria-hidden="true"
                className="h-4 w-4 object-contain"
              />
              <span className="flex items-center gap-2">
                {isLeagueLoading ? (
                  <span
                    className="loading loading-spinner loading-xs text-app-brand-secondary"
                    aria-hidden
                  />
                ) : null}
                <span>{selectedLeagueLabel}</span>
              </span>
              {canSelectLeague ? <ChevronDownIcon isOpen={openDisclosure === 'league'} /> : null}
            </button>

            {canSelectLeague && openDisclosure === 'league' ? (
              <DesktopDisclosurePanel
                items={leagueOptions}
                minWidthClass="min-w-[220px]"
                selectedItemId={selectedLeagueId}
                onSelect={onSelectLeague}
              />
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              aria-expanded={canSelectSeason ? openDisclosure === 'season' : undefined}
              aria-haspopup={canSelectSeason ? 'menu' : undefined}
              aria-busy={isSeasonLoading}
              onClick={canSelectSeason ? () => onToggleDisclosure('season') : undefined}
              className={desktopDisclosureButtonClasses}
            >
              <span className="flex items-center gap-2">
                {isSeasonLoading ? (
                  <span
                    className="loading loading-spinner loading-xs text-app-brand-secondary"
                    aria-hidden
                  />
                ) : null}
                <span>{selectedSeasonLabel}</span>
              </span>
              {canSelectSeason ? <ChevronDownIcon isOpen={openDisclosure === 'season'} /> : null}
            </button>

            {canSelectSeason && openDisclosure === 'season' ? (
              <DesktopDisclosurePanel
                items={seasonOptions}
                minWidthClass="min-w-[160px]"
                selectedItemId={selectedSeasonId}
                onSelect={onSelectSeason}
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
  items: readonly HeaderSelectOption[];
  minWidthClass: string;
  selectedItemId?: string | undefined;
  onSelect?: ((itemId: string) => void) | undefined;
};

function DesktopDisclosurePanel({
  items,
  minWidthClass,
  selectedItemId,
  onSelect,
}: DesktopDisclosurePanelProps) {
  return (
    <div
      className={clsx(
        'absolute right-0 top-[calc(100%+8px)] z-50 rounded-2xl border border-app-border-base bg-app-surface p-2',
        minWidthClass,
      )}
    >
      <div className="flex max-h-[320px] flex-col gap-1 overflow-y-auto">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={onSelect ? () => onSelect(item.id) : undefined}
            className={clsx(
              'h-10 w-full rounded-xl px-3 text-left text-app-text-strong',
              selectedItemId === item.id ? 'bg-white/8' : 'hover:bg-white/5',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
