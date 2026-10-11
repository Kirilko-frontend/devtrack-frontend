import type { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './styles.module.scss';

type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonVariant = 'default' | 'accent';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

function Button({ children, size = 'md', variant = 'default', className, ...props }: IButtonProps) {
  return (
    <button
      className={`${styles['button']} ${styles[`button--${size}`]} ${
        variant === 'accent' ? styles['button--accent'] : ''
      } ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
