import { Search } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';

import styles from './styles.module.scss';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

function Input({ label, error, className, type = 'text', ...props }: IInputProps) {
  const isSearch = type === 'search';

  return (
    <div className={styles['input']}>
      {label && <label className={styles['input__label']}>{label}</label>}

      <div
        className={`${styles['input__wrapper']} ${
          isSearch ? styles['input__wrapper--search'] : ''
        }`}
      >
        {isSearch && <Search className={styles['input__search-icon']} size={16} />}

        <input className={`${styles['input__field']} ${className ?? ''}`} type={type} {...props} />
      </div>

      {error && <p className={styles['input__error']}>{error}</p>}
    </div>
  );
}

export default Input;
