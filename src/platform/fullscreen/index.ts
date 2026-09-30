export interface FullscreenAdapter {
  /** Best effort: browsers require a user gesture, so this may silently do nothing. */
  enter(): Promise<void>;
  exit(): Promise<void>;
}
