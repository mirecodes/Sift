import type { HTMLAttributes } from 'react';
import type { Tier } from '../../domain/config';
import styles from './Surfaces.module.css';

const join = (...parts: (string | undefined | false)[]) => parts.filter(Boolean).join(' ');

/** Canvas surface with the layered shadow; used for panels floating over the island. */
export function Panel({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={join(styles.panel, className)} {...rest} />;
}

export function FeatureCard({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={join(styles.featureCard, className)} {...rest} />;
}

interface TierCardProps extends HTMLAttributes<HTMLDivElement> {
  tier: Tier;
  elevated?: boolean;
}

export function TierCard({ tier, elevated, className, ...rest }: TierCardProps) {
  return <div data-tier={tier} className={join(styles.tierCard, elevated && styles.elevated, className)} {...rest} />;
}
