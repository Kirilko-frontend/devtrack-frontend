import type { InputHTMLAttributes } from 'react';

import styles from './styles.module.scss';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  placeholder?: string;
}

function Input({ label, error, placeholder, className, ...props }: IInputProps) {
  return (
    <div className={styles['input']}>
      {label && <label className={styles['input__label']}>{label}</label>}

      <input
        className={`${styles['input__field']} ${className ?? ''}`}
        placeholder={placeholder}
        {...props}
      />

      {error && <span className={styles['input__error']}>{error}</span>}
    </div>
  );
}

export default Input;
