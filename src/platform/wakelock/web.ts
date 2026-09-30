import type { WakeLockAdapter } from './index';

export function createWebWakeLock(): WakeLockAdapter {
  let sentinel: WakeLockSentinel | null = null;
  let wanted = false;

  const acquire = async () => {
    if (!('wakeLock' in navigator) || sentinel) return;
    try {
      sentinel = await navigator.wakeLock.request('screen');
      sentinel.addEventListener('release', () => {
        sentinel = null;
      });
    } catch {
      sentinel = null; // denied (e.g. low battery); focus continues without it
    }
  };

  // The browser drops the lock when the tab is hidden; take it again on return.
  document.addEventListener('visibilitychange', () => {
    if (wanted && document.visibilityState === 'visible') void acquire();
  });

  return {
    async request() {
      wanted = true;
      await acquire();
    },
    async release() {
      wanted = false;
      const s = sentinel;
      sentinel = null;
      if (s) await s.release().catch(() => undefined);
    },
  };
}
