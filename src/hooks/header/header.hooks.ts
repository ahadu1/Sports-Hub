import { routes } from '@/app/config/routes';
import { useEffect, type RefObject } from 'react';
import { matchPath } from 'react-router-dom';

type HeaderBehaviorEffectsParams = {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
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
  setIsDrawerOpen,
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
    if (!isDrawerOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen, setIsDrawerOpen]);

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

type ClickOutsideDismissParams = {
  ref: RefObject<HTMLElement | null>;
  isActive: boolean;
  onDismiss: () => void;
};

export function useClickOutsideDismiss({ ref, isActive, onDismiss }: ClickOutsideDismissParams) {
  useEffect(() => {
    if (!isActive) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (ref.current && event.target instanceof Node && !ref.current.contains(event.target)) {
        onDismiss();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismiss();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, onDismiss, ref]);
}
