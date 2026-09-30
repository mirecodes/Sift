import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { config } from '../../domain/config';
import { useHold } from '../hooks';
import styles from './Button.module.css';

type Variant = 'primary' | 'primaryInverse' | 'secondary' | 'secondaryInverse';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  block?: boolean;
}

const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ');

export function Button({ variant = 'primary', block, className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={cx(styles.button, styles[variant], block && styles.block, className)} {...rest} />;
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  tone?: 'light' | 'dark';
  children: ReactNode;
}

export function IconButton({ tone = 'light', className, type = 'button', ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      className={cx(styles.button, styles.icon, tone === 'light' ? styles.iconLight : styles.iconDark, className)}
      {...rest}
    />
  );
}

interface HoldButtonProps {
  label: string;
  onComplete: () => void;
  /** Lets a parent (e.g. an Esc key hold) drive the same ring. */
  holdApi?: ReturnType<typeof useHold>;
  disabled?: boolean;
}

/** `button-hold`: secondary-inverse with a red ring that fills over 1.5s; release cancels. */
export function HoldButton({ label, onComplete, holdApi, disabled }: HoldButtonProps) {
  const own = useHold(config.ui.holdToAbandonMs, onComplete);
  const { holding, start, cancel } = holdApi ?? own;
  const style = { '--hold-ms': `${config.ui.holdToAbandonMs}ms` } as CSSProperties;
  return (
    <button
      type="button"
      disabled={disabled}
      className={cx(styles.button, styles.secondaryInverse, styles.hold, holding && styles.holding)}
      style={style}
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(e) => e.preventDefault()}
    >
      <svg className={styles.ring} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle className={styles.ringTrack} cx="10" cy="10" r="8" strokeWidth="1.5" />
        <circle className={styles.ringFill} cx="10" cy="10" r="8" strokeWidth="1.5" />
      </svg>
      {label}
    </button>
  );
}
