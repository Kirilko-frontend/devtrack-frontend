import { useId } from 'react';

import styles from './styles.module.scss';

type LogoVariant = 'static' | 'intro' | 'loop';

interface ILogoProps {
  size?: number;
  /**
   * static — no animation;
   * intro — the track draws in once on mount;
   * loop — the track keeps redrawing (loaders).
   */
  variant?: LogoVariant;
  className?: string;
}

/**
 * DevTrack logo: the letter D drawn as a candidate's journey.
 * Top node — applied, ring — current stage (interview), bottom node — offer.
 */
function Logo({ size = 32, variant = 'static', className }: ILogoProps) {
  // Gradient ids must be unique when several logos are on the page.
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const backgroundId = `${id}-logo-bg`;
  const shineId = `${id}-logo-shine`;

  return (
    <svg
      className={`${styles['logo']} ${styles[`logo--${variant}`]} ${className ?? ''}`}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="DevTrack"
    >
      <defs>
        <linearGradient
          id={backgroundId}
          x1="4"
          y1="2"
          x2="28"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#FFB25C" />
          <stop offset="0.55" stopColor="#EA7223" />
          <stop offset="1" stopColor="#B8420F" />
        </linearGradient>

        <linearGradient id={shineId} x1="16" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="32" height="32" rx="9" fill={`url(#${backgroundId})`} />
      <rect width="32" height="16" rx="9" fill={`url(#${shineId})`} />

      <path
        className={styles['logo__stem']}
        d="M10 9v14"
        stroke="#FFFFFF"
        strokeOpacity="0.45"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        className={styles['logo__track']}
        d="M10 9h3.5a7 7 0 0 1 0 14H10"
        stroke="#FFFFFF"
        strokeWidth="2.6"
        strokeLinecap="round"
        pathLength={1}
      />

      <circle className={styles['logo__node']} cx="10" cy="9" r="2.4" fill="#FFFFFF" />
      <circle
        className={`${styles['logo__node']} ${styles['logo__node--current']}`}
        cx="20.5"
        cy="16"
        r="3"
        fill="#EA7223"
        stroke="#FFFFFF"
        strokeWidth="2"
      />
      <circle className={styles['logo__node']} cx="10" cy="23" r="2.4" fill="#FFFFFF" />
    </svg>
  );
}

export default Logo;
