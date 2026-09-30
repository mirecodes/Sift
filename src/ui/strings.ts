import { config, type Tier } from '../domain/config';

const minimumMinutes = Math.round(config.reward.minFocusMs / 60_000);

/** Every user-visible string. Add a locale by swapping this module's content. */
export const strings = {
  appName: 'Sift',
  home: {
    cycle: (focusMin: number, breakMin: number) => `${focusMin} min focus · ${breakMin} min break`,
    start: 'Start focus',
  },
  focus: {
    eyebrow: 'Focus',
    overtime: 'Overtime',
    end: 'End focus',
    holdToStop: 'Hold to stop',
  },
  break: {
    eyebrow: 'Break',
    ready: 'Ready for the next one?',
    startNow: 'Start focus now',
    startFocus: 'Start focus',
    home: 'Home',
    noReward: `Nice work. Focus for ${minimumMinutes} minutes or more to meet a new friend.`,
    newFriend: 'A new friend',
  },
  settings: {
    title: 'Settings',
    timer: 'Timer',
    sound: 'Sound',
    focusLength: 'Focus length',
    breakLength: 'Break length',
    chimes: 'Chimes',
    minutes: 'min',
  },
  collection: {
    title: 'Collection',
    unknown: '???',
    stats: 'Stats',
    focusTime: 'Focus time',
    sessions: 'Sessions',
    animals: 'Animals',
    count: (n: number) => `×${n}`,
    unknownAnimal: 'Not collected yet',
  },
  tiers: {
    common: 'Common',
    epic: 'Epic',
    legendary: 'Legendary',
    mythic: 'Mythic',
  } satisfies Record<Tier, string>,
  aria: {
    collection: 'Open collection',
    settings: 'Open settings',
    close: 'Close',
    toNight: 'Switch to night mode',
    toDay: 'Switch to day mode',
    decrease: (what: string) => `Decrease ${what}`,
    increase: (what: string) => `Increase ${what}`,
    timer: 'Timer',
    revealSkip: 'Show the new friend on the island',
  },
} as const;
