import { routes } from '@/app/config/routes';
import {
  HEADER_ASSETS,
  PRIMARY_NAV_ITEMS,
  type HeaderAccordionSection,
  type HeaderSelectOption,
} from '@/components/header/header.constants';
import { ChevronDownIcon, CloseIcon } from '@/components/icons';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

type HeaderDrawerProps = {
  isOpen: boolean;
  openSection: HeaderAccordionSection | null;
  isMatchesActive: boolean;
  leagueOptions: readonly HeaderSelectOption[];
  seasonOptions: readonly HeaderSelectOption[];
  selectedLeagueId?: string | undefined;
  selectedSeasonId?: string | undefined;
  onClose: () => void;
  onSelectLeague?: ((leagueId: string) => void) | undefined;
  onSelectSeason?: ((seasonId: string) => void) | undefined;
  onToggleSection: (section: HeaderAccordionSection) => void;
};

const drawerNavItemClasses =
  'flex min-h-11 w-full flex-col items-start justify-center rounded-xl px-4 py-2 text-left';

export function HeaderDrawer({
  isOpen,
  openSection,
  isMatchesActive,
  leagueOptions,
  seasonOptions,
  selectedLeagueId,
  selectedSeasonId,
  onClose,
  onSelectLeague,
  onSelectSeason,
  onToggleSection,
}: HeaderDrawerProps) {
  const canSelectLeague = leagueOptions.length > 1 && onSelectLeague !== undefined;
  const canSelectSeason = seasonOptions.length > 1 && onSelectSeason !== undefined;

  return (
    <div
      className={clsx(
        'fixed inset-0 z-40 lg:hidden',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none',
      )}
    >
      <button
        type="button"
        aria-label="Close navigation menu overlay"
        onClick={onClose}
        className={clsx(
          'fixed inset-0 bg-black/50 transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0',
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={clsx(
          'fixed right-0 top-0 z-50 h-dvh w-[320px] max-w-[85vw] border-l border-app-border-base bg-app-surface transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-app-border-base bg-app-brand-primary px-4">
          <NavLink to={routes.home} onClick={onClose}>
            <img src={HEADER_ASSETS.logo} alt="Sports Hub" className="app-header-brand-logo" />
          </NavLink>

          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-full text-white"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-col gap-2 p-4">
          <nav aria-label="Mobile primary navigation" className="flex flex-col gap-2">
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
                          : 'text-app-brand-on-surface',
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
                    className={clsx(drawerNavItemClasses, 'cursor-not-allowed')}
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
                    onClick={onClose}
                    className={clsx(
                      drawerNavItemClasses,
                      isActive && 'border-l-2 border-app-brand-secondary bg-white/5 pl-[14px]',
                    )}
                  >
                    {content}
                  </NavLink>
                );
              }

              return (
                <button key={item.key} type="button" className={drawerNavItemClasses}>
                  {content}
                </button>
              );
            })}
          </nav>

          <AccordionSection
            label="League"
            section="league"
            isOpen={openSection === 'league'}
            isInteractive={leagueOptions.length > 0}
            onToggle={onToggleSection}
          >
            {leagueOptions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={
                  canSelectLeague && onSelectLeague
                    ? () => {
                        onSelectLeague(item.id);
                        onClose();
                      }
                    : undefined
                }
                className={clsx(
                  'h-10 rounded-lg px-3 text-left text-app-text-muted',
                  selectedLeagueId === item.id
                    ? 'bg-white/8 text-app-text-strong'
                    : 'hover:bg-white/5',
                )}
              >
                {item.label}
              </button>
            ))}
          </AccordionSection>

          <AccordionSection
            label="Season"
            section="season"
            isOpen={openSection === 'season'}
            isInteractive={seasonOptions.length > 0}
            onToggle={onToggleSection}
          >
            {seasonOptions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={
                  canSelectSeason && onSelectSeason
                    ? () => {
                        onSelectSeason(item.id);
                        onClose();
                      }
                    : undefined
                }
                className={clsx(
                  'h-10 rounded-lg px-3 text-left text-app-text-muted',
                  selectedSeasonId === item.id
                    ? 'bg-white/8 text-app-text-strong'
                    : 'hover:bg-white/5',
                )}
              >
                {item.label}
              </button>
            ))}
          </AccordionSection>
        </div>
      </aside>
    </div>
  );
}

type AccordionSectionProps = {
  label: string;
  section: HeaderAccordionSection;
  isOpen: boolean;
  isInteractive?: boolean;
  onToggle: (section: HeaderAccordionSection) => void;
  children: ReactNode;
};

function AccordionSection({
  label,
  section,
  isOpen,
  isInteractive = true,
  onToggle,
  children,
}: AccordionSectionProps) {
  return (
    <section>
      <button
        type="button"
        aria-expanded={isInteractive ? isOpen : undefined}
        onClick={isInteractive ? () => onToggle(section) : undefined}
        className={clsx(
          'flex h-11 w-full items-center justify-between rounded-xl border border-app-border-base bg-transparent px-4 text-app-text-strong',
          isOpen ? 'bg-white/5' : '',
        )}
      >
        <span>{label}</span>
        {isInteractive ? <ChevronDownIcon isOpen={isOpen} /> : null}
      </button>

      {isOpen ? <div className="mt-2 flex flex-col gap-2 pl-2">{children}</div> : null}
    </section>
  );
}
