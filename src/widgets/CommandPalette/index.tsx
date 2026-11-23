import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { KeyboardEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BriefcaseBusiness,
  Building2,
  CalendarPlus,
  CornerDownLeft,
  FilePlus2,
  Plus,
  Search,
} from 'lucide-react';

import { companiesService, vacanciesService } from '@/services';
import { StatusBadge } from '@/shared/ui';
import { requestCreate, requestSearch } from '@/shared/utils';
import type { Company } from '@/types/company';
import type { Vacancy } from '@/types/vacancy';

import { navigation } from '../Sidebar/config';

import styles from './styles.module.scss';

interface PaletteItem {
  id: string;
  label: string;
  sublabel?: string;
  icon: ReactNode;
  badge?: ReactNode;
  run: () => void;
}

interface PaletteGroup {
  title: string;
  items: PaletteItem[];
}

interface ICommandPaletteProps {
  onClose: () => void;
}

const matches = (query: string, ...values: (string | undefined)[]) =>
  values.some((value) => value?.toLowerCase().includes(query));

/** Wraps the part of `text` that matches the query in <mark>. */
function highlight(text: string, query: string) {
  const index = query ? text.toLowerCase().indexOf(query) : -1;

  if (index === -1) {
    return text;
  }

  return (
    <>
      {text.slice(0, index)}
      <mark className={styles['palette__mark']}>{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

/** Ctrl+K palette: jump to pages, create things and search vacancies/companies. */
function CommandPalette({ onClose }: ICommandPaletteProps) {
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      vacanciesService.getVacancies({ page: 1, limit: 100 }),
      companiesService.getCompanies(),
    ])
      .then(([vacanciesResponse, companiesResponse]) => {
        if (isMounted) {
          setVacancies(vacanciesResponse.data);
          setCompanies(companiesResponse);
        }
      })
      .catch((error: unknown) => console.error('Command palette error:', error))
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  const groups = useMemo<PaletteGroup[]>(() => {
    const go = (path: string, before?: () => void) => () => {
      before?.();
      navigate(path);
    };

    const pages: PaletteItem[] = navigation.map(({ label, path, icon: Icon }) => ({
      id: `page-${path}`,
      label,
      sublabel: 'Go to page',
      icon: <Icon size={16} />,
      run: go(path),
    }));

    const actions: PaletteItem[] = [
      {
        id: 'create-vacancy',
        label: 'New vacancy',
        icon: <FilePlus2 size={16} />,
        run: go('/vacancies', () => requestCreate('vacancy')),
      },
      {
        id: 'create-company',
        label: 'New company',
        icon: <Plus size={16} />,
        run: go('/companies', () => requestCreate('company')),
      },
      {
        id: 'create-interview',
        label: 'New interview',
        icon: <CalendarPlus size={16} />,
        run: go('/interviews', () => requestCreate('interview')),
      },
    ];

    const vacancyItems: PaletteItem[] = vacancies.map((vacancy) => ({
      id: `vacancy-${vacancy.id}`,
      label: vacancy.title,
      sublabel: vacancy.company?.name,
      icon: <BriefcaseBusiness size={16} />,
      badge: <StatusBadge status={vacancy.status} />,
      run: go('/vacancies', () => requestSearch('vacancy', vacancy.title)),
    }));

    const companyItems: PaletteItem[] = companies.map((company) => ({
      id: `company-${company.id}`,
      label: company.name,
      sublabel: company.website ?? undefined,
      icon: <Building2 size={16} />,
      run: go('/companies', () => requestSearch('company', company.name)),
    }));

    if (!normalizedQuery) {
      return [
        { title: 'Quick actions', items: actions },
        { title: 'Pages', items: pages },
        { title: 'Recent vacancies', items: vacancyItems.slice(0, 3) },
      ];
    }

    const filter = (items: PaletteItem[], limit: number) =>
      items.filter((item) => matches(normalizedQuery, item.label, item.sublabel)).slice(0, limit);

    return [
      { title: 'Vacancies', items: filter(vacancyItems, 6) },
      { title: 'Companies', items: filter(companyItems, 4) },
      { title: 'Quick actions', items: filter(actions, 3) },
      { title: 'Pages', items: filter(pages, 5) },
    ];
  }, [normalizedQuery, vacancies, companies, navigate]);

  const visibleGroups = groups.filter((group) => group.items.length > 0);
  const flatItems = visibleGroups.flatMap((group) => group.items);
  const safeActiveIndex = Math.min(activeIndex, Math.max(flatItems.length - 1, 0));

  const runItem = (item: PaletteItem | undefined) => {
    if (!item) {
      return;
    }

    onClose();
    item.run();
  };

  const moveActive = (direction: 1 | -1) => {
    if (flatItems.length === 0) {
      return;
    }

    const nextIndex = (safeActiveIndex + direction + flatItems.length) % flatItems.length;

    setActiveIndex(nextIndex);

    requestAnimationFrame(() => {
      listRef.current
        ?.querySelector(`[data-index="${nextIndex}"]`)
        ?.scrollIntoView({ block: 'nearest' });
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      runItem(flatItems[safeActiveIndex]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    }
  };

  // Running index across groups, so arrow keys move through one flat list.
  let itemIndex = -1;

  // Portal: the palette is opened from TopBar, whose backdrop-filter would otherwise
  // become the containing block for `position: fixed` and shrink the overlay to the top bar.
  return createPortal(
    <div className={styles['palette']} onMouseDown={onClose}>
      <div
        className={styles['palette__dialog']}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles['palette__search']}>
          <Search size={18} className={styles['palette__search-icon']} aria-hidden="true" />

          <input
            className={styles['palette__input']}
            placeholder="Search vacancies, companies or jump to…"
            value={query}
            autoFocus
            aria-label="Search"
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />

          <kbd className={styles['palette__kbd']}>Esc</kbd>
        </div>

        <div ref={listRef} className={styles['palette__list']} role="listbox">
          {visibleGroups.map((group) => (
            <div key={group.title} className={styles['palette__group']}>
              <p className={styles['palette__group-title']}>{group.title}</p>

              {group.items.map((item) => {
                itemIndex += 1;
                const index = itemIndex;
                const isActive = index === safeActiveIndex;

                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    data-index={index}
                    className={`${styles['palette__item']} ${
                      isActive ? styles['palette__item--active'] : ''
                    }`}
                    onMouseMove={() => setActiveIndex(index)}
                    onClick={() => runItem(item)}
                  >
                    <span className={styles['palette__item-icon']}>{item.icon}</span>

                    <span className={styles['palette__item-text']}>
                      <span className={styles['palette__item-label']}>
                        {highlight(item.label, normalizedQuery)}
                      </span>
                      {item.sublabel && (
                        <span className={styles['palette__item-sublabel']}>
                          {highlight(item.sublabel, normalizedQuery)}
                        </span>
                      )}
                    </span>

                    {item.badge}

                    {isActive && (
                      <CornerDownLeft
                        size={14}
                        className={styles['palette__item-enter']}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {flatItems.length === 0 && (
            <p className={styles['palette__empty']}>
              {isLoading ? 'Loading…' : `Nothing found for "${query.trim()}"`}
            </p>
          )}
        </div>

        <div className={styles['palette__footer']}>
          <span>
            <kbd className={styles['palette__kbd']}>↑</kbd>
            <kbd className={styles['palette__kbd']}>↓</kbd> navigate
          </span>
          <span>
            <kbd className={styles['palette__kbd']}>↵</kbd> open
          </span>
          <span>
            <kbd className={styles['palette__kbd']}>Esc</kbd> close
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default CommandPalette;
