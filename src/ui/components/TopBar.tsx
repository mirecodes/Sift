import type { ReactNode } from 'react';
import { ThemeToggle } from './ThemeToggle';
import styles from './TopBar.module.css';

/** Home, Settings, and Collection only. Never on Focus. */
export function TopBar({ children }: { children?: ReactNode }) {
  return (
    <header className={styles.bar}>
      <div className={styles.actions}>
        {children}
        <ThemeToggle />
      </div>
    </header>
  );
}
