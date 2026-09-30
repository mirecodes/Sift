export interface WakeLockAdapter {
  /** Keeps the screen awake until `release()`. Never throws. */
  request(): Promise<void>;
  release(): Promise<void>;
}
