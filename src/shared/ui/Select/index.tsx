import { ChevronDown, Plus } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

import styles from './styles.module.scss';
import Input from '../Input';
import Button from '../Button';

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
  action?: {
    label: string;
    onClick: (value: string) => void | Promise<void>;
  };
}

function Select<T extends string>({
  value,
  options,
  onChange,
  placeholder = 'Select',
  icon,
  className,
  action,
}: IProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [actionName, setActionName] = useState<string>('');

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (optionValue: T) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleActionClick = () => {
    setIsOpen(false);
    setIsAdding(true);
  };

  const handleAddClick = async () => {
    const trimmedValue = actionName.trim();

    if (!trimmedValue || !action) {
      return;
    }

    try {
      await action.onClick(trimmedValue);

      setActionName('');
      setIsAdding(false);
    } catch (error) {
      console.error('SELECT ADD ERROR:', error);
    }
  };

  const handleCanel = () => {
    setIsAdding(false);
  };

  return (
    <div className={`${styles['select']} ${className ?? ''}`}>
      {isAdding ? (
        <div className={styles['select__adding']}>
          <Input
            className={styles['select__adding-input']}
            value={actionName}
            onChange={(e) => setActionName(e.target.value)}
          />
          <div className={styles['select__adding-actions']}>
            <Button
              className={styles['select__adding-action']}
              onClick={handleAddClick}
              type="button"
            >
              Add
            </Button>
            <Button className={styles['select__adding-action']} onClick={handleCanel} type="button">
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <button
          className={`${styles['select__trigger']} ${isOpen ? styles['select__trigger--open'] : ''}`}
          type="button"
          onClick={() => setIsOpen((current) => !current)}
        >
          {icon && <span className={styles['select__icon']}>{icon}</span>}

          <span className={styles['select__value']}>{selectedOption?.label ?? placeholder}</span>

          <ChevronDown className={styles['select__arrow']} size={16} />
        </button>
      )}

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

          {action && (
            <li className={`${styles['select__action-item']} ${styles['select__option-item']}`}>
              <button
                className={`${styles['select__action']} ${styles['select__option']}`}
                type="button"
                onClick={handleActionClick}
              >
                <Plus size={18} /> {action.label}
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default Select;
