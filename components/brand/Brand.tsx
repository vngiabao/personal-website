import styles from './Brand.module.css';
import {GB_VIEWBOX,GB_LETTERS,GB_DOT} from './gbPaths';

/**
 * The GB monogram. Letters take the current colour; the period is always brass.
 * `heavy` thickens every stroke evenly for small sizes (favicons, ≤32px), where
 * the hairline sweep and the G's curl would otherwise disappear.
 */
export function BrandMark({className = '', heavy = false}: {className?: string; heavy?: boolean}) {
  return <svg className={className} viewBox={GB_VIEWBOX} aria-hidden="true" focusable="false">
    <path d={GB_LETTERS} fill="currentColor" fillRule="evenodd" stroke={heavy ? 'currentColor' : undefined} strokeWidth={heavy ? 16 : undefined} strokeLinejoin="round"/>
    <circle cx={GB_DOT.cx} cy={GB_DOT.cy} r={heavy ? GB_DOT.r * 1.35 : GB_DOT.r} fill="var(--brand-dot, #b58420)"/>
  </svg>;
}

export function Brand({compact = false}: {compact?: boolean}) {
  return <span className={`${styles.brand} ${compact ? styles.compact : ''}`}>
    <BrandMark className={styles.mark}/>
    <span className={styles.type}>
      <span className={styles.name}>Bao Vo</span>
    </span>
  </span>;
}
