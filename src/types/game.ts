/**
 * DIMENUVEL: THE LAST ABIDERS
 * Game Type Definitions & Constants
 */

export type LayerId = 'silence' | 'vision' | 'mind' | 'heart' | 'will' | 'energy' | 'matter';

export interface DimenuvelLayer {
  id: LayerId;
  name: string;
  order: number;
  color: string;
  glowColor: string;
  hex: string;
  essenceName: string;
  theme: string;
  description: string;
}

export const DIMENUVEL_LAYERS: Record<LayerId, DimenuvelLayer> = {
  silence: {
    id: 'silence',
    name: 'SILENCE',
    order: 1,
    color: 'text-purple-400',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    hex: '#a855f7',
    essenceName: 'Violet Silence',
    theme: 'Cosmic Stillness',
    description: 'The first layer. Absolute calm from which all vibrations arise.',
  },
  vision: {
    id: 'vision',
    name: 'VISION',
    order: 2,
    color: 'text-indigo-400',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    hex: '#6366f1',
    essenceName: 'Indigo Sight',
    theme: 'The Astral Eye',
    description: 'The second layer. Pierces through all illusions and veils.',
  },
  mind: {
    id: 'mind',
    name: 'MIND',
    order: 3,
    color: 'text-cyan-400',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    hex: '#06b6d4',
    essenceName: 'Azure Intellect',
    theme: 'The Thought Engine',
    description: 'The third layer. Pure logic, chaining awareness across minds.',
  },
  heart: {
    id: 'heart',
    name: 'HEART',
    order: 4,
    color: 'text-emerald-400',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    hex: '#10b981',
    essenceName: 'Verdant Equilibrium',
    theme: 'The Sanctuary',
    description: 'The fourth layer. The harmonic axis restoring balance to all.',
  },
  will: {
    id: 'will',
    name: 'WILL',
    order: 5,
    color: 'text-amber-400',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    hex: '#f59e0b',
    essenceName: 'Golden Focus',
    theme: 'The Golden Resonator',
    description: 'The fifth layer. Unyielding drive that accelerates energy into form.',
  },
  energy: {
    id: 'energy',
    name: 'ENERGY',
    order: 6,
    color: 'text-orange-400',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    hex: '#f97316',
    essenceName: 'Solar Radiance',
    theme: 'The Solar Crucible',
    description: 'The sixth layer. Incandescent nuclear cosmic flame that sunders armor.',
  },
  matter: {
    id: 'matter',
    name: 'MATTER',
    order: 7,
    color: 'text-rose-500',
    glowColor: 'rgba(244, 63, 94, 0.4)',
    hex: '#f43f5e',
    essenceName: 'Crimson Bedrock',
    theme: 'The Material Anchor',
    description: 'The seventh layer. Dense physical reality that roots the Spiral.',
  },
};

export type TowerType =
  | 'silent_observatory'
  | 'astral_eye'
  | 'thought_engine'
  | 'sanctuary'
  | 'golden_resonator'
  | 'solar_crucible'
  | 'material_anchor';

export interface TowerTierStats {
  damage: number;
  range: number;
  fireRate: number; // attacks per second
  cost: number;
  splashRadius?: number;
  chainCount?: number;
  slowPercent?: number;
  slowDuration?: number;
  passiveEquilibriumRegen?: number; // per wave
  auraBuff?: number; // % damage to neighbors
  armorPenetration?: number;
  description: string;
}

export interface TowerConfig {
  type: TowerType;
  layer: LayerId;
  name: string;
  role: string;
  symbol: string;
  baseCost: number;
  activeAbilityName: string;
  activeAbilityDesc: string;
  activeAbilityCooldown: number; // in seconds
  tiers: [TowerTierStats, TowerTierStats, TowerTierStats];
}

export interface PlacedTower {
  id: string;
  socketId: string;
  type: TowerType;
  tier: 1 | 2 | 3;
  x: number;
  y: number;
  level: number;
  lastShotTime: number;
  targetId: string | null;
  angle: number;
  abilityCooldownRemaining: number;
  kills: number;
  totalDamageDealt: number;
}

export type EnemyType =
  | 'void'
  | 'false_one'
  | 'stepper'
  | 'materialist'
  | 'agitator'
  | 'silencer'
  | 'stranger'
  | 'great_void';

export interface EnemyStats {
  type: EnemyType;
  name: string;
  maxHealth: number;
  speed: number;
  essenceReward: number;
  radius: number;
  color: string;
  description: string;
  armor: number; // 0 to 1 reduction on physical
  isBoss?: boolean;
  isCloaked?: boolean;
}

export interface ActiveEnemy {
  id: string;
  type: EnemyType;
  health: number;
  maxHealth: number;
  speed: number;
  pathIndex: number; // which path if multiple
  distanceAlongPath: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  essenceReward: number;
  armor: number;
  isBoss: boolean;
  isCloaked: boolean;
  revealedTimer: number; // >0 if revealed by Astral Eye
  slowFactor: number;
  slowTimer: number;
  agitatorPulseTimer: number;
  markedDamageBonus: number; // from Astral Eye
  markedTimer: number;
  angle: number;
  phase?: number; // For Great Void boss
}

export interface Projectile {
  id: string;
  towerType: TowerType;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  targetEnemyId: string | null;
  damage: number;
  speed: number;
  color: string;
  radius: number;
  splashRadius: number;
  chainLeft: number;
  slowPercent: number;
  slowDuration: number;
  pierceArmor: boolean;
}

export interface VisualParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  shape?: 'circle' | 'spark' | 'ring' | 'star';
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  alpha: number;
  life: number;
}

export interface TowerSocket {
  id: string;
  x: number;
  y: number;
}

export interface PathWaypoint {
  x: number;
  y: number;
}

export interface WaveUnit {
  enemyType: EnemyType;
  count: number;
  spawnInterval: number; // seconds between each
  delay: number; // delay before this sub-wave starts
  pathIndex?: number;
}

export interface WaveDefinition {
  waveNumber: number;
  title: string;
  units: WaveUnit[];
  bonusEssence: number;
}

export interface GameMap {
  id: string;
  layer: LayerId;
  name: string;
  subtitle: string;
  lore: string;
  dudeIntro: string;
  dudeOutro: string;
  difficulty: 'Novice' | 'Adeptus' | 'Master' | 'Cosmic';
  startingEssence: number;
  paths: PathWaypoint[][];
  sockets: TowerSocket[];
  waves: WaveDefinition[];
  centerAsh: { x: number; y: number };
}

export type GameMode = 'campaign' | 'endless' | 'final_abiders';

export type ResonancePower = 'temporal_stillness' | 'golden_spiral' | 'silent_presence' | 'cosmic_reset';

export interface ResonancePowerConfig {
  id: ResonancePower;
  name: string;
  cost: number;
  cooldown: number;
  description: string;
  iconName: string;
}

export type SupportedLanguage = 'en' | 'pt';

export interface PlayerProgress {
  playerName: string;
  language: SupportedLanguage;
  hasSeenTour: boolean;
  unlockedMaps: string[];
  mapStars: Record<string, number>; // mapId -> 1..3 stars
  mapHighScores: Record<string, number>;
  endlessHighScoreWave: number;
  finalAbidersCompleted: string[];
  essenceAccumulated: number;
  enemiesBanished: number;
  achievements: string[];
  settings: {
    musicVolume: number;
    sfxVolume: number;
    particlesHigh: boolean;
    showRangesOnHover: boolean;
    crtVisuals?: boolean;
  };
}
