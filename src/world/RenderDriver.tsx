import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { config } from '../domain/config';
import type { WorldMode } from './types';

/**
 * Home and Break render at full rate. Focus renders at full rate only while the camera
 * settles, then drops to on-demand frames at a fixed low rate. Paused renders nothing.
 */
export function RenderDriver({ mode }: { mode: WorldMode }) {
  const setFrameloop = useThree((s) => s.setFrameloop);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    if (mode !== 'focus') {
      setFrameloop(mode === 'paused' ? 'never' : 'always');
      return;
    }
    setFrameloop('always');
    let interval: number | undefined;
    const settle = window.setTimeout(() => {
      setFrameloop('demand');
      interval = window.setInterval(invalidate, 1000 / config.render.focusFps);
    }, config.render.sceneMs + 500);
    return () => {
      window.clearTimeout(settle);
      window.clearInterval(interval);
    };
  }, [mode, setFrameloop, invalidate]);

  return null;
}
