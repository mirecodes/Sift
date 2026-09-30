import { config } from '../../domain/config';
import { useApp } from '../../store';
import { strings } from '../../ui/strings';
import { IconButton } from '../../ui/components/Button';
import { SettingsRow, Stepper, Toggle } from '../../ui/components/Controls';
import { CloseIcon } from '../../ui/components/Icons';
import { TopBar } from '../../ui/components/TopBar';
import styles from '../Screen.module.css';

export function SettingsScreen() {
  const settings = useApp((s) => s.settings);
  const updateSettings = useApp((s) => s.updateSettings);
  const setView = useApp((s) => s.setView);
  const { focusMinutes, breakMinutes } = config.settings;

  return (
    <div className={styles.page}>
      <TopBar>
        <IconButton aria-label={strings.aria.close} onClick={() => setView('home')}>
          <CloseIcon />
        </IconButton>
      </TopBar>
      <main className={styles.content}>
        <h1 className={`${styles.title} type-display-md`}>{strings.settings.title}</h1>

        <h2 className={`${styles.eyebrow} type-eyebrow`}>{strings.settings.timer}</h2>
        <SettingsRow label={strings.settings.focusLength}>
          <Stepper
            label={strings.settings.focusLength}
            value={settings.focusMinutes}
            min={focusMinutes.min}
            max={focusMinutes.max}
            step={focusMinutes.step}
            unit={strings.settings.minutes}
            onChange={(v) => void updateSettings({ focusMinutes: v })}
          />
        </SettingsRow>
        <SettingsRow label={strings.settings.breakLength}>
          <Stepper
            label={strings.settings.breakLength}
            value={settings.breakMinutes}
            min={breakMinutes.min}
            max={breakMinutes.max}
            step={breakMinutes.step}
            unit={strings.settings.minutes}
            onChange={(v) => void updateSettings({ breakMinutes: v })}
          />
        </SettingsRow>

        <h2 className={`${styles.eyebrow} type-eyebrow`}>{strings.settings.sound}</h2>
        <SettingsRow label={strings.settings.chimes}>
          <Toggle label={strings.settings.chimes} checked={settings.soundEnabled} onChange={(v) => void updateSettings({ soundEnabled: v })} />
        </SettingsRow>
      </main>
    </div>
  );
}
