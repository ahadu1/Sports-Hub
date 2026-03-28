import { routes } from '@/app/config/routes';
import {
  HEADER_ASSETS,
  MOBILE_ACCORDION_CONTENT,
  PRIMARY_NAV_ITEMS,
  type HeaderAccordionSection,
} from '@/components/header/header.constants';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

type HeaderDrawerProps = {
  isOpen: boolean;
  openSection: HeaderAccordionSection | null;
  isMatchesActive: boolean;
  onClose: () => void;
  onToggleSection: (section: HeaderAccordionSection) => void;
};

const drawerNavItemClasses =
  "h-11 w-full rounded-xl px-4 text-left [font-family:'Poppins',sans-serif] text-[18px] leading-[27px] font-normal tracking-[0]";

export function HeaderDrawer({
  isOpen,
  openSection,
  isMatchesActive,
  onClose,
  onToggleSection,
}: HeaderDrawerProps) {
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
            <img
              src={HEADER_ASSETS.logo}
              alt="Sports Hub"
              className="object-contain"
              style={{ height: '26.1px', width: '82px' }}
            />
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
            {PRIMARY_NAV_ITEMS.map((item) =>
              item.temporary ? (
                <button
                  key={item.key}
                  type="button"
                  className={clsx(drawerNavItemClasses, 'text-app-brand-on-surface')}
                >
                  {item.label}
                </button>
              ) : (
                <NavLink
                  key={item.key}
                  to={routes.home}
                  end
                  onClick={onClose}
                  className={clsx(
                    drawerNavItemClasses,
                    isMatchesActive
                      ? 'border-l-2 border-app-brand-secondary bg-white/5 pl-[14px] text-app-brand-secondary'
                      : 'text-app-brand-on-surface',
                  )}
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>

          <AccordionSection
            label="League"
            section="league"
            isOpen={openSection === 'league'}
            onToggle={onToggleSection}
          >
            {MOBILE_ACCORDION_CONTENT.league.map((item) => (
              <button
                key={item}
                type="button"
                className="h-10 rounded-lg px-3 text-left text-app-text-muted hover:bg-white/5"
              >
                {item}
              </button>
            ))}
          </AccordionSection>

          <AccordionSection
            label="Season"
            section="season"
            isOpen={openSection === 'season'}
            onToggle={onToggleSection}
          >
            {MOBILE_ACCORDION_CONTENT.season.map((item) => (
              <button
                key={item}
                type="button"
                className="h-10 rounded-lg px-3 text-left text-app-text-muted hover:bg-white/5"
              >
                {item}
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
  onToggle: (section: HeaderAccordionSection) => void;
  children: ReactNode;
};

function AccordionSection({ label, section, isOpen, onToggle, children }: AccordionSectionProps) {
  return (
    <section>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => onToggle(section)}
        className={clsx(
          'flex h-11 w-full items-center justify-between rounded-xl border border-app-border-base bg-transparent px-4 text-app-text-strong',
          isOpen ? 'bg-white/5' : '',
        )}
      >
        <span>{label}</span>
        <ChevronDownIcon isOpen={isOpen} />
      </button>

      {isOpen ? <div className="mt-2 flex flex-col gap-2 pl-2">{children}</div> : null}
    </section>
  );
}

function ChevronDownIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={clsx('h-[18px] w-[18px] transition-transform', isOpen ? 'rotate-180' : '')}
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

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}
