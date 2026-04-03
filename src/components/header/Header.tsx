import { HeaderDrawer } from '@/components/header/HeaderDrawer';
import { type HeaderAccordionSection } from '@/components/header/header.constants';
import { ChevronDownIcon, HamburgerIcon, LogoSmallIcon } from '@/components/icons';
import { useFixturesCompetition } from '@/hooks/fixtures/useFixturesCompetition';
import { useHeaderBehaviorEffects, useHeaderRouteMatch } from '@/hooks/header/header.hooks';
import { useMatchDetailsQuery } from '@/hooks/match/useMatchDetailsQuery';
import { cn } from '@/utils/cn';
import { formatSeasonLabel } from '@/utils/header/header.utils';
import { routes } from '@/app/config/routes';
import {
  HEADER_ASSETS,
  HEADER_LOGO_ALT,
  PRIMARY_NAV_ITEMS,
  type HeaderSelectOption,
} from '@/components/header/header.constants';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export function Header() {
  const { pathname } = useLocation();
  const disclosureContainerRef = useRef<HTMLDivElement>(null);
  const mobileLeagueDisclosureRef = useRef<HTMLDivElement>(null);
  const { isMatchRoute, activePrimaryNavItem, matchEventId } = useHeaderRouteMatch(pathname);
  const matchDetailsQuery = useMatchDetailsQuery(matchEventId);
  const {
    isLeagueLoading,
    isSeasonLoading,
    leagueOptions,
    seasonOptions: fixturesSeasonOptions,
    selectedLeagueId,
    selectedSeasonId,
    selectedLeagueOption,
    selectedSeasonOption,
    setSelectedLeagueId,
    setSelectedSeasonId,
  } = useFixturesCompetition();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openSection, setOpenSection] = useState<HeaderAccordionSection | null>(null);
  const [openDesktopDisclosure, setOpenDesktopDisclosure] = useState<HeaderAccordionSection | null>(
    null,
  );
  const [isMobileLeagueMenuOpen, setIsMobileLeagueMenuOpen] = useState(false);

  const matchLeagueOption =
    isMatchRoute && matchDetailsQuery.data?.leagueId && matchDetailsQuery.data.leagueName
      ? [
          {
            id: matchDetailsQuery.data.leagueId,
            label: matchDetailsQuery.data.leagueName,
            ...(matchDetailsQuery.data.leagueBadge
              ? { badgeSrc: matchDetailsQuery.data.leagueBadge }
              : {}),
          },
        ]
      : [];
  const selectedLeagueBadgeSrc =
    matchLeagueOption[0]?.badgeSrc ?? selectedLeagueOption?.badgeSrc ?? HEADER_ASSETS.leagueFlag;
  const homeSeasonOptions = fixturesSeasonOptions.map((season) => ({
    id: season.id,
    label: formatSeasonLabel(season.label),
  }));
  const isHomeLeagueLoading = !isMatchRoute && isLeagueLoading && leagueOptions.length === 0;
  const isHomeSeasonLoading =
    !isMatchRoute &&
    ((!selectedLeagueId && isLeagueLoading) ||
      (selectedLeagueId.length > 0 && isSeasonLoading && !selectedSeasonOption));
  const selectedLeagueLabel =
    matchLeagueOption[0]?.label ??
    selectedLeagueOption?.label ??
    (isMatchRoute ? 'Loading...' : 'League');
  const selectedSeasonLabel =
    formatSeasonLabel(matchDetailsQuery.data?.season) ||
    (selectedSeasonOption ? formatSeasonLabel(selectedSeasonOption.label) : '') ||
    (isMatchRoute ? 'Loading...' : 'Season');
  const seasonOptions =
    isMatchRoute && matchDetailsQuery.data?.season
      ? [
          {
            id: matchDetailsQuery.data.season,
            label: formatSeasonLabel(matchDetailsQuery.data.season),
          },
        ]
      : homeSeasonOptions;

  useHeaderBehaviorEffects({
    isDrawerOpen,
    setIsDrawerOpen,
  });

  useEffect(() => {
    if (!isMobileLeagueMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        mobileLeagueDisclosureRef.current &&
        event.target instanceof Node &&
        !mobileLeagueDisclosureRef.current.contains(event.target)
      ) {
        setIsMobileLeagueMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileLeagueMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileLeagueMenuOpen]);

  const resetNavigationState = useCallback(() => {
    setIsDrawerOpen(false);
    setOpenSection(null);
    setOpenDesktopDisclosure(null);
    setIsMobileLeagueMenuOpen(false);
  }, []);

  const handleNavigateHome = useCallback(() => {
    resetNavigationState();
  }, [resetNavigationState]);

  const handleOpenDrawer = useCallback(() => {
    setOpenDesktopDisclosure(null);
    setOpenSection(null);
    setIsMobileLeagueMenuOpen(false);
    setIsDrawerOpen(true);
  }, []);

  const handleOpenSeasonDrawer = useCallback(() => {
    setOpenDesktopDisclosure(null);
    setIsMobileLeagueMenuOpen(false);
    setOpenSection('season');
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const handleToggleSection = useCallback((section: HeaderAccordionSection) => {
    setOpenSection((current) => (current === section ? null : section));
  }, []);

  const handleToggleDesktopDisclosure = useCallback((section: HeaderAccordionSection) => {
    setIsDrawerOpen(false);
    setIsMobileLeagueMenuOpen(false);
    setOpenDesktopDisclosure((current) => (current === section ? null : section));
  }, []);

  const handleToggleMobileLeagueDisclosure = useCallback(() => {
    if (isMatchRoute || leagueOptions.length <= 1) {
      return;
    }

    setOpenDesktopDisclosure(null);
    setIsDrawerOpen(false);
    setOpenSection(null);
    setIsMobileLeagueMenuOpen((current) => !current);
  }, [isMatchRoute, leagueOptions.length]);

  const handleSelectLeague = useCallback(
    (leagueId: string) => {
      setSelectedLeagueId(leagueId);
      resetNavigationState();
    },
    [resetNavigationState, setSelectedLeagueId],
  );

  const handleSelectSeason = useCallback(
    (seasonId: string) => {
      setSelectedSeasonId(seasonId);
      resetNavigationState();
    },
    [resetNavigationState, setSelectedSeasonId],
  );

  return (
    <>
      <header className="header">
        <div className="flex h-14 items-center justify-between px-4 lg:hidden">
          <NavLink to={routes.home} onClick={handleNavigateHome} className="header__logoLink">
            <span className="sr-only">{HEADER_LOGO_ALT}</span>
            <LogoSmallIcon aria-hidden="true" className="header__logo header__logo--mobile" />
          </NavLink>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Open sports options"
              disabled
              className="header__iconButton--mobile"
            >
              <img
                src={HEADER_ASSETS.football}
                alt=""
                aria-hidden="true"
                className="h-4 w-4 max-h-full max-w-full object-contain"
              />
            </button>

            <button
              type="button"
              aria-label="Open global options"
              disabled
              className="header__iconButton--mobile"
            >
              <img
                src={HEADER_ASSETS.globe}
                alt=""
                aria-hidden="true"
                className="h-4 w-4 max-h-full max-w-full object-contain"
              />
            </button>

            <div ref={mobileLeagueDisclosureRef} className="relative">
              <button
                type="button"
                aria-label={selectedLeagueLabel}
                aria-expanded={
                  !isMatchRoute && leagueOptions.length > 1 ? isMobileLeagueMenuOpen : undefined
                }
                aria-haspopup={!isMatchRoute && leagueOptions.length > 1 ? 'menu' : undefined}
                aria-busy={isHomeLeagueLoading}
                onClick={
                  !isMatchRoute && leagueOptions.length > 1
                    ? handleToggleMobileLeagueDisclosure
                    : undefined
                }
                className="header__iconButton--mobile"
              >
                {isHomeLeagueLoading ? (
                  <span
                    className="loading loading-spinner loading-xs text-app-brand-secondary"
                    aria-hidden
                  />
                ) : (
                  <img
                    src={selectedLeagueBadgeSrc}
                    alt=""
                    aria-hidden="true"
                    className="h-4 w-4 max-h-full max-w-full object-contain"
                  />
                )}
              </button>

              {!isMatchRoute && leagueOptions.length > 1 && isMobileLeagueMenuOpen ? (
                <DesktopDisclosurePanel
                  items={leagueOptions}
                  minWidthClass="min-w-[220px]"
                  selectedItemId={selectedLeagueId}
                  onSelect={handleSelectLeague}
                />
              ) : null}
            </div>

            <button
              type="button"
              aria-busy={isHomeSeasonLoading}
              onClick={seasonOptions.length > 0 ? handleOpenSeasonDrawer : undefined}
              className="header__disclosureButton text-supporting"
            >
              {isHomeSeasonLoading ? (
                <span
                  className="loading loading-spinner loading-xs text-app-brand-secondary"
                  aria-hidden
                />
              ) : null}
              <span>{selectedSeasonLabel}</span>
              {seasonOptions.length > 0 ? <ChevronDownIcon /> : null}
            </button>

            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={handleOpenDrawer}
              className="flex size-8 items-center justify-center rounded-full text-white"
            >
              <HamburgerIcon />
            </button>
          </div>
        </div>

        <div className="hidden h-[60px] w-full items-center justify-between gap-4 px-4 lg:flex">
          <div className="flex min-w-0 items-center gap-3 xl:gap-8">
            <NavLink to={routes.home} onClick={handleNavigateHome} className="header__logoLink">
              <img
                src={HEADER_ASSETS.logo}
                alt={HEADER_LOGO_ALT}
                className="header__logo header__logo--desktop"
              />
            </NavLink>
            <nav
              aria-label="Primary navigation"
              className="flex min-w-0 items-stretch gap-0 xl:gap-1"
            >
              {PRIMARY_NAV_ITEMS.map((item) => {
                const isActive = item.key === activePrimaryNavItem;
                const content = (
                  <HeaderNavItemContent
                    item={item}
                    isActive={isActive}
                    activeTextClass="text-white"
                  />
                );

                if (item.disabled) {
                  return (
                    <button
                      key={item.key}
                      type="button"
                      disabled
                      className="header__navItem header__navItem--disabled"
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
                      onClick={handleNavigateHome}
                      className={cn('header__navItem', isActive && 'header__navItem--active')}
                    >
                      {content}
                    </NavLink>
                  );
                }

                return (
                  <button key={item.key} type="button" className="header__navItem">
                    {content}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2 xl:gap-4">
            <button
              type="button"
              aria-label="Open global options"
              disabled
              className="header__iconButton"
            >
              <img
                src={HEADER_ASSETS.globe}
                alt=""
                aria-hidden="true"
                className="h-6 w-6 max-h-full max-w-full object-contain"
              />
            </button>

            <button
              type="button"
              aria-label="Open sports options"
              disabled
              className="header__iconButton"
            >
              <img
                src={HEADER_ASSETS.football}
                alt=""
                aria-hidden="true"
                className="h-6 w-6 max-h-full max-w-full object-contain"
              />
            </button>

            <div ref={disclosureContainerRef} className="flex items-center gap-2 xl:gap-4">
              <div className="relative">
                <button
                  type="button"
                  aria-expanded={
                    !isMatchRoute && leagueOptions.length > 1
                      ? openDesktopDisclosure === 'league'
                      : undefined
                  }
                  aria-haspopup={!isMatchRoute && leagueOptions.length > 1 ? 'menu' : undefined}
                  aria-busy={isHomeLeagueLoading}
                  onClick={
                    !isMatchRoute && leagueOptions.length > 1
                      ? () => handleToggleDesktopDisclosure('league')
                      : undefined
                  }
                  className="header__disclosureButton max-w-[150px] px-3 text-nav-sm xl:max-w-none xl:px-4"
                >
                  <img
                    src={selectedLeagueBadgeSrc}
                    alt=""
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 object-contain"
                  />
                  <span className="flex min-w-0 items-center gap-2">
                    {isHomeLeagueLoading ? (
                      <span
                        className="loading loading-spinner loading-xs text-app-brand-secondary"
                        aria-hidden
                      />
                    ) : null}
                    <span className="truncate">{selectedLeagueLabel}</span>
                  </span>
                  {!isMatchRoute && leagueOptions.length > 1 ? (
                    <ChevronDownIcon isOpen={openDesktopDisclosure === 'league'} />
                  ) : null}
                </button>

                {!isMatchRoute && leagueOptions.length > 1 && openDesktopDisclosure === 'league' ? (
                  <DesktopDisclosurePanel
                    items={leagueOptions}
                    minWidthClass="min-w-[220px]"
                    selectedItemId={selectedLeagueId}
                    onSelect={handleSelectLeague}
                  />
                ) : null}
              </div>

              <div className="relative">
                <button
                  type="button"
                  aria-expanded={
                    seasonOptions.length > 1 && !isMatchRoute
                      ? openDesktopDisclosure === 'season'
                      : undefined
                  }
                  aria-haspopup={seasonOptions.length > 1 && !isMatchRoute ? 'menu' : undefined}
                  aria-busy={isHomeSeasonLoading}
                  onClick={
                    seasonOptions.length > 1 && !isMatchRoute
                      ? () => handleToggleDesktopDisclosure('season')
                      : undefined
                  }
                  className="header__disclosureButton max-w-[104px] px-3 text-nav-sm xl:max-w-none xl:px-4"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {isHomeSeasonLoading ? (
                      <span
                        className="loading loading-spinner loading-xs text-app-brand-secondary"
                        aria-hidden
                      />
                    ) : null}
                    <span className="truncate">{selectedSeasonLabel}</span>
                  </span>
                  {seasonOptions.length > 1 && !isMatchRoute ? (
                    <ChevronDownIcon isOpen={openDesktopDisclosure === 'season'} />
                  ) : null}
                </button>

                {seasonOptions.length > 1 && !isMatchRoute && openDesktopDisclosure === 'season' ? (
                  <DesktopDisclosurePanel
                    items={seasonOptions}
                    minWidthClass="min-w-[160px]"
                    selectedItemId={selectedSeasonId}
                    onSelect={handleSelectSeason}
                  />
                ) : null}
              </div>
            </div>

            <button
              type="button"
              aria-label="Open locale options"
              disabled
              className="header__iconButton"
            >
              <img
                src={HEADER_ASSETS.localeFlag}
                alt=""
                aria-hidden="true"
                className="h-6 w-6 max-h-full max-w-full object-contain"
              />
            </button>
          </div>
        </div>
      </header>

      <HeaderDrawer
        isOpen={isDrawerOpen}
        openSection={openSection}
        activePrimaryNavItem={activePrimaryNavItem}
        leagueOptions={isMatchRoute ? matchLeagueOption : leagueOptions}
        seasonOptions={seasonOptions}
        selectedLeagueId={isMatchRoute ? matchLeagueOption[0]?.id : selectedLeagueId}
        selectedSeasonId={isMatchRoute ? seasonOptions[0]?.id : selectedSeasonId}
        onClose={handleCloseDrawer}
        onSelectLeague={isMatchRoute ? undefined : handleSelectLeague}
        onSelectSeason={isMatchRoute ? undefined : handleSelectSeason}
        onToggleSection={handleToggleSection}
      />
    </>
  );
}

function HeaderNavItemContent({
  item,
  isActive,
  activeTextClass,
}: {
  item: (typeof PRIMARY_NAV_ITEMS)[number];
  isActive: boolean;
  activeTextClass: string;
}) {
  return (
    <>
      <span
        className={cn(
          'text-nav',
          isActive
            ? 'text-app-brand-secondary'
            : item.disabled
              ? 'text-app-brand-on-surface-variant'
              : activeTextClass,
        )}
      >
        {item.label}
      </span>
      {item.disabledText ? (
        <span className="text-supporting text-app-brand-on-surface-variant">
          {item.disabledText}
        </span>
      ) : null}
    </>
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
      className={cn(
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
            className={cn(
              'header__selectOption',
              selectedItemId === item.id
                ? 'header__selectOption--selected'
                : 'header__selectOption--default',
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              {item.badgeSrc ? (
                <img
                  src={item.badgeSrc}
                  alt=""
                  aria-hidden
                  className="h-5 w-5 shrink-0 object-contain"
                />
              ) : null}
              <span className="truncate">{item.label}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
