import { PlayerProgress } from '../types/game';

const PROGRESS_STORAGE_KEY = 'dimenuvel_last_abiders_progress_v1';

export const DEFAULT_PROGRESS: PlayerProgress = {
  playerName: '',
  language: 'en',
  hasSeenTour: false,
  unlockedMaps: ['silence_observatory'],
  mapStars: {},
  mapHighScores: {},
  endlessHighScoreWave: 0,
  finalAbidersCompleted: [],
  essenceAccumulated: 0,
  enemiesBanished: 0,
  achievements: [],
  settings: {
    musicVolume: 0.5,
    sfxVolume: 0.7,
    particlesHigh: true,
    showRangesOnHover: true,
    crtVisuals: true,
  },
};

class ProgressService {
  private progress: PlayerProgress;

  constructor() {
    this.progress = this.loadProgress();
  }

  public get(): PlayerProgress {
    return { ...this.progress };
  }

  public save(newProgress: PlayerProgress) {
    this.progress = newProgress;
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(newProgress));
    } catch (e) {
      console.warn('Failed to persist progress to localStorage', e);
    }
  }

  public loadProgress(): PlayerProgress {
    try {
      const data = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...DEFAULT_PROGRESS,
          ...parsed,
          settings: {
            ...DEFAULT_PROGRESS.settings,
            ...(parsed.settings || {}),
            crtVisuals: parsed.settings?.crtVisuals ?? true,
          },
        };
      }
    } catch (e) {
      console.warn('Failed to parse progress from localStorage', e);
    }
    return { ...DEFAULT_PROGRESS };
  }

  public unlockNextMap(currentMapId: string, nextMapId: string) {
    const current = this.get();
    if (!current.unlockedMaps.includes(nextMapId)) {
      current.unlockedMaps.push(nextMapId);
      this.save(current);
    }
  }

  public recordVictory(mapId: string, stars: number, score: number) {
    const current = this.get();
    const existingStars = current.mapStars[mapId] || 0;
    if (stars > existingStars) {
      current.mapStars[mapId] = stars;
    }
    const existingHigh = current.mapHighScores[mapId] || 0;
    if (score > existingHigh) {
      current.mapHighScores[mapId] = score;
    }
    this.save(current);
  }

  public unlockAchievement(id: string): boolean {
    const current = this.get();
    if (!current.achievements.includes(id)) {
      current.achievements.push(id);
      this.save(current);
      return true; // newly unlocked
    }
    return false;
  }

  public addStats(essence: number, enemies: number) {
    const current = this.get();
    current.essenceAccumulated += essence;
    current.enemiesBanished += enemies;
    this.save(current);
  }

  public setLanguage(lang: 'en' | 'pt') {
    const current = this.get();
    current.language = lang;
    this.save(current);
  }

  public setPlayerName(name: string) {
    const current = this.get();
    current.playerName = name.trim();
    this.save(current);
  }

  public setHasSeenTour(seen: boolean) {
    const current = this.get();
    current.hasSeenTour = seen;
    this.save(current);
  }

  public setCrtVisuals(crt: boolean) {
    const current = this.get();
    current.settings = { ...current.settings, crtVisuals: crt };
    this.save(current);
  }

  public resetAll() {
    this.save({ ...DEFAULT_PROGRESS });
  }
}

export const progressService = new ProgressService();
