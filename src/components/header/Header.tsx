import { DesktopHeader } from '@/components/header/DesktopHeader';
import { HeaderDrawer } from '@/components/header/HeaderDrawer';
import { MobileHeader } from '@/components/header/MobileHeader';
import { formatSeasonLabel } from '@/components/header/header.utils';
import { type HeaderAccordionSection } from '@/components/header/header.constants';
import { useFixturesCompetition } from '@/features/fixtures/context/useFixturesCompetition';
import { useMatchDetailsQuery } from '@/features/match/hooks/useMatchDetailsQuery';
import { useEffect, useRef, useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

export function Header() {
  const { pathname } = useLocation();
  const disclosureContainerRef = useRef<HTMLDivElement>(null);
  const matchRoute = matchPath('/match/:eventId', pathname);
  const matchEventId = matchRoute?.params.eventId?.trim() ?? '';
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

  const isMatchesActive = pathname === '/' || pathname.startsWith('/match');
  const isMatchRoute = matchEventId.length > 0;
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

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      setIsDrawerOpen(false);
      setOpenDesktopDisclosure(null);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!openDesktopDisclosure) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        disclosureContainerRef.current &&
        event.target instanceof Node &&
        !disclosureContainerRef.current.contains(event.target)
      ) {
        setOpenDesktopDisclosure(null);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [openDesktopDisclosure]);

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }

    const mediaQuery = window.matchMedia('(min-width: 1024px)');

    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsDrawerOpen(false);
      }
    };

    if (mediaQuery.matches) {
      setIsDrawerOpen(false);
    }

    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [isDrawerOpen]);

  const handleNavigateHome = () => {
    setIsDrawerOpen(false);
    setOpenSection(null);
    setOpenDesktopDisclosure(null);
  };

  const handleOpenDrawer = () => {
    setOpenDesktopDisclosure(null);
    setOpenSection(null);
    setIsDrawerOpen(true);
  };

  const handleOpenSeasonDrawer = () => {
    setOpenDesktopDisclosure(null);
    setOpenSection('season');
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleToggleSection = (section: HeaderAccordionSection) => {
    setOpenSection((current) => (current === section ? null : section));
  };

  const handleToggleDesktopDisclosure = (section: HeaderAccordionSection) => {
    setIsDrawerOpen(false);
    setOpenDesktopDisclosure((current) => (current === section ? null : section));
  };

  const handleSelectLeague = (leagueId: string) => {
    setSelectedLeagueId(leagueId);
    setIsDrawerOpen(false);
    setOpenSection(null);
    setOpenDesktopDisclosure(null);
  };

  const handleSelectSeason = (seasonId: string) => {
    setSelectedSeasonId(seasonId);
    setIsDrawerOpen(false);
    setOpenSection(null);
    setOpenDesktopDisclosure(null);
  };

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
