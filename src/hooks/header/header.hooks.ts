import { routes } from '@/app/config/routes';
import type { HeaderAccordionSection } from '@/components/header/header.constants';
import { useEffect, type RefObject } from 'react';
import { matchPath } from 'react-router-dom';

type HeaderBehaviorEffectsParams = {
  isDrawerOpen: boolean;
  openDesktopDisclosure: HeaderAccordionSection | null;
  disclosureContainerRef: RefObject<HTMLDivElement | null>;
  setIsDrawerOpen: (isOpen: boolean) => void;
  setOpenDesktopDisclosure: (section: HeaderAccordionSection | null) => void;
};

export function useHeaderRouteMatch(pathname: string) {
  const matchRoute = matchPath(routes.match, pathname);
  const matchEventId = matchRoute?.params.eventId?.trim() ?? '';

  return {
    matchEventId,
    isMatchRoute: matchEventId.length > 0,
    isMatchesActive: pathname === routes.home || pathname.startsWith(routes.matchPrefix),
  };
}

export function useHeaderBehaviorEffects({
  isDrawerOpen,
  openDesktopDisclosure,
  disclosureContainerRef,
  setIsDrawerOpen,
  setOpenDesktopDisclosure,
}: HeaderBehaviorEffectsParams) {
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
  }, [setIsDrawerOpen, setOpenDesktopDisclosure]);

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
  }, [disclosureContainerRef, openDesktopDisclosure, setOpenDesktopDisclosure]);

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
  }, [isDrawerOpen, setIsDrawerOpen]);
}
