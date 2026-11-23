import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

import styles from './styles.module.scss';

export interface DropdownItem {
  label: string;
  icon?: ReactNode;
  hint?: string;
  tone?: 'default' | 'danger';
  onSelect: () => void;
}

interface IDropdownProps {
  /** Content of the trigger button. */
  trigger: ReactNode;
  triggerLabel: string;
  triggerClassName?: string;
  items: DropdownItem[];
  /** Optional block above the items (e.g. signed-in user). */
  header?: ReactNode;
  align?: 'start' | 'end';
}

/** Button with a menu: closes on outside click and Escape, arrow keys move between items. */
function Dropdown({
  trigger,
  triggerLabel,
  triggerClassName,
  items,
  header,
  align = 'end',
}: IDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  const focusItem = (direction: 1 | -1) => {
    const buttons = Array.from(
      rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []
    );
    const currentIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const nextIndex = (currentIndex + direction + buttons.length) % buttons.length;

    buttons[nextIndex]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) {
      return;
    }

    if (event.key === 'Escape') {
      event.stopPropagation();
      setIsOpen(false);
      triggerRef.current?.focus();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusItem(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusItem(-1);
    }
  };

  const handleSelect = (item: DropdownItem) => {
    setIsOpen(false);
    item.onSelect();
  };

  return (
    <div ref={rootRef} className={styles['dropdown']} onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        className={triggerClassName}
        aria-label={triggerLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={() => setIsOpen((current) => !current)}
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          className={`${styles['dropdown__menu']} ${styles[`dropdown__menu--${align}`]}`}
        >
          {header && <div className={styles['dropdown__header']}>{header}</div>}

          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className={`${styles['dropdown__item']} ${
                item.tone === 'danger' ? styles['dropdown__item--danger'] : ''
              }`}
              onClick={() => handleSelect(item)}
            >
              {item.icon && <span className={styles['dropdown__item-icon']}>{item.icon}</span>}
              <span className={styles['dropdown__item-label']}>{item.label}</span>
              {item.hint && <span className={styles['dropdown__item-hint']}>{item.hint}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
