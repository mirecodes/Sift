import type { Tier } from '../../domain/config';
import { strings } from '../strings';
import styles from './Badge.module.css';

/** Tier is never conveyed by color alone: the name is always shown. */
export function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span data-tier={tier} className={`${styles.badge} ${styles.tier} type-eyebrow-sm`}>
      {strings.tiers[tier]}
    </span>
  );
}

export function OvertimeBadge() {
  return <span className={`${styles.badge} ${styles.overtime} type-eyebrow-sm`}>{strings.focus.overtime}</span>;
}
