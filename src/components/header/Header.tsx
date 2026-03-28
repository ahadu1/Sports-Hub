import { DesktopHeader } from '@/components/header/DesktopHeader';
import { HeaderDrawer } from '@/components/header/HeaderDrawer';
import { MobileHeader } from '@/components/header/MobileHeader';
import { type HeaderAccordionSection } from '@/components/header/header.constants';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function Header() {
  const { pathname } = useLocation();
  const disclosureContainerRef = useRef<HTMLDivElement>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openSection, setOpenSection] = useState<HeaderAccordionSection | null>(null);
  const [openDesktopDisclosure, setOpenDesktopDisclosure] = useState<HeaderAccordionSection | null>(
    null,
  );

  const isMatchesActive = pathname === '/' || pathname.startsWith('/match');

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

  return (
    <>
      <div className="relative z-30">
        <MobileHeader
          onNavigateHome={handleNavigateHome}
          onOpenDrawer={handleOpenDrawer}
          onOpenSeasonDrawer={handleOpenSeasonDrawer}
        />
        <DesktopHeader
          isMatchesActive={isMatchesActive}
          openDisclosure={openDesktopDisclosure}
          onNavigateHome={handleNavigateHome}
          onToggleDisclosure={handleToggleDesktopDisclosure}
          disclosureContainerRef={disclosureContainerRef}
        />
      </div>

      <HeaderDrawer
        isOpen={isDrawerOpen}
        openSection={openSection}
        isMatchesActive={isMatchesActive}
        onClose={handleCloseDrawer}
        onToggleSection={handleToggleSection}
      />
    </>
  );
}
