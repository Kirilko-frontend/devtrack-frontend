import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

import styles from './styles.module.scss';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface IProps<T extends string> {
  value: T;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  icon?: ReactNode;
  className?: string;
}

function Select<T extends string>({
  value,
  options,
  onChange,
  placeholder = 'Select',
  icon,
  className,
}: IProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (optionValue: T) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`${styles['select']} ${className ?? ''}`}>
      <button
        className={`${styles['select__trigger']} ${isOpen ? styles['select__trigger--open'] : ''}`}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
      >
        {icon && <span className={styles['select__icon']}>{icon}</span>}

        <span className={styles['select__value']}>{selectedOption?.label ?? placeholder}</span>

        <ChevronDown className={styles['select__arrow']} size={16} />
      </button>

      {isOpen && (
        <ul className={styles['select__options']}>
          {options.map((option) => (
            <li className={styles['select__option-item']} key={option.value}>
              <button
                className={`${styles['select__option']} ${
                  option.value === value ? styles['select__option--active'] : ''
                }`}
                type="button"
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Select;
