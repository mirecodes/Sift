import { useApp } from '../../store';
import { strings } from '../strings';
import { IconButton } from './Button';
import { MoonIcon, SunIcon } from './Icons';

/** Day / night switch for the world (DESIGN.md 15.4). */
export function ThemeToggle() {
  const theme = useApp((s) => s.settings.theme);
  const updateSettings = useApp((s) => s.updateSettings);
  const dark = theme === 'dark';
  return (
    <IconButton aria-label={dark ? strings.aria.toDay : strings.aria.toNight} onClick={() => void updateSettings({ theme: dark ? 'light' : 'dark' })}>
      {dark ? <SunIcon /> : <MoonIcon />}
    </IconButton>
  );
}
