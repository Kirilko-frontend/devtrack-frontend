import type { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './styles.module.scss';

type ButtonSize = 'sm' | 'md' | 'lg';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: ButtonSize;
}

function Button({ children, size = 'md', className, ...props }: IButtonProps) {
  return (
    <button
      className={`${styles['button']} ${styles[`button--${size}`]} ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
