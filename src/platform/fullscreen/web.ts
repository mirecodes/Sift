import type { FullscreenAdapter } from './index';

export function createWebFullscreen(): FullscreenAdapter {
  return {
    async enter() {
      if (document.fullscreenElement || !document.documentElement.requestFullscreen) return;
      await document.documentElement.requestFullscreen().catch(() => undefined);
    },
    async exit() {
      if (!document.fullscreenElement) return;
      await document.exitFullscreen().catch(() => undefined);
    },
  };
}
