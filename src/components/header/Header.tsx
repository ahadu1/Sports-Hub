import { DesktopHeader } from '@/components/header/DesktopHeader';
import { HeaderDrawer } from '@/components/header/HeaderDrawer';
import { MobileHeader } from '@/components/header/MobileHeader';
import { useHeaderBehaviorEffects, useHeaderRouteMatch } from '@/components/header/header.hooks';
import { formatSeasonLabel } from '@/components/header/header.utils';
import { type HeaderAccordionSection } from '@/components/header/header.constants';
import { useFixturesCompetition } from '@/features/fixtures/context/useFixturesCompetition';
import { useMatchDetailsQuery } from '@/features/match/hooks/useMatchDetailsQuery';
import { useCallback, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function Header() {
  const { pathname } = useLocation();
  const disclosureContainerRef = useRef<HTMLDivElement>(null);
  const { isMatchRoute, isMatchesActive, matchEventId } = useHeaderRouteMatch(pathname);
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

  const matchLeagueOption =
    isMatchRoute && matchDetailsQuery.data?.leagueId && matchDetailsQuery.data.leagueName
      ? [{ id: matchDetailsQuery.data.leagueId, label: matchDetailsQuery.data.leagueName }]
      : [];
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
    openDesktopDisclosure,
    disclosureContainerRef,
    setIsDrawerOpen,
    setOpenDesktopDisclosure,
  });

  const resetNavigationState = useCallback(() => {
    setIsDrawerOpen(false);
    setOpenSection(null);
    setOpenDesktopDisclosure(null);
  }, []);

  const handleNavigateHome = useCallback(() => {
    resetNavigationState();
  }, [resetNavigationState]);

  const handleOpenDrawer = useCallback(() => {
    setOpenDesktopDisclosure(null);
    setOpenSection(null);
    setIsDrawerOpen(true);
  }, []);

  const handleOpenSeasonDrawer = useCallback(() => {
    setOpenDesktopDisclosure(null);
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
    setOpenDesktopDisclosure((current) => (current === section ? null : section));
  }, []);

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
      <div className="relative z-30">
        <MobileHeader
          canOpenSeasonDrawer={seasonOptions.length > 0}
          isSeasonLoading={isHomeSeasonLoading}
          onNavigateHome={handleNavigateHome}
          onOpenDrawer={handleOpenDrawer}
          onOpenSeasonDrawer={handleOpenSeasonDrawer}
          selectedSeasonLabel={selectedSeasonLabel}
        />
        <DesktopHeader
          isMatchesActive={isMatchesActive}
          isLeagueLoading={isHomeLeagueLoading}
          isSeasonLoading={isHomeSeasonLoading}
          leagueOptions={isMatchRoute ? matchLeagueOption : leagueOptions}
          openDisclosure={openDesktopDisclosure}
          seasonOptions={seasonOptions}
          selectedLeagueId={isMatchRoute ? matchLeagueOption[0]?.id : selectedLeagueId}
          selectedLeagueLabel={selectedLeagueLabel}
          selectedSeasonId={isMatchRoute ? seasonOptions[0]?.id : selectedSeasonId}
          selectedSeasonLabel={selectedSeasonLabel}
          onNavigateHome={handleNavigateHome}
          onSelectLeague={isMatchRoute ? undefined : handleSelectLeague}
          onSelectSeason={isMatchRoute ? undefined : handleSelectSeason}
          onToggleDisclosure={handleToggleDesktopDisclosure}
          disclosureContainerRef={disclosureContainerRef}
        />
      </div>

      <HeaderDrawer
        isOpen={isDrawerOpen}
        openSection={openSection}
        isMatchesActive={isMatchesActive}
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
