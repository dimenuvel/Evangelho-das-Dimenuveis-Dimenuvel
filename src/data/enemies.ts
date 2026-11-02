import { EnemyStats, EnemyType } from '../types/game';

export const ENEMIES: Record<EnemyType, EnemyStats> = {
  void: {
    type: 'void',
    name: 'The Void',
    maxHealth: 110,
    speed: 55, // pixels per second
    essenceReward: 12,
    radius: 12,
    color: '#94a3b8',
    armor: 0,
    description: 'Basic cosmic distortion. Moves in steady waves toward the Sacred Ash.',
  },

  false_one: {
    type: 'false_one',
    name: 'The False One',
    maxHealth: 160,
    speed: 65,
    essenceReward: 18,
    radius: 13,
    color: '#c084fc',
    armor: 0.1,
    description: 'Deceptive apparition. Phase-shifts unpredictably, disorienting basic tower tracking.',
  },

  stepper: {
    type: 'stepper',
    name: 'The Stepper',
    maxHealth: 85,
    speed: 120, // Very fast
    essenceReward: 16,
    radius: 10,
    color: '#38bdf8',
    armor: 0,
    description: 'Hyper-kinetic sprinter. Flits rapidly along the path before defenses can react.',
  },

  materialist: {
    type: 'materialist',
    name: 'The Materialist',
    maxHealth: 480,
    speed: 38, // Slow tank
    essenceReward: 35,
    radius: 18,
    color: '#e11d48',
    armor: 0.65, // 65% physical resistance, melts under Solar Crucible
    description: 'Dense crystallized entity. Heavy armor shrugs off kinetic fire; vulnerable to Energy.',
  },

  agitator: {
    type: 'agitator',
    name: 'The Agitator',
    maxHealth: 280,
    speed: 50,
    essenceReward: 30,
    radius: 15,
    color: '#facc15',
    armor: 0.15,
    description: 'Chaotic disruptor. Radiates interference waves dampening the attack speed of nearby towers.',
  },

  silencer: {
    type: 'silencer',
    name: 'The Silencer',
    maxHealth: 240,
    speed: 52,
    essenceReward: 28,
    radius: 14,
    color: '#818cf8',
    armor: 0.2,
    isCloaked: true,
    description: 'Veil-weaver. Cloaks itself and surrounding allies in cosmic fog until detected by Vision.',
  },

  stranger: {
    type: 'stranger',
    name: 'The Stranger',
    maxHealth: 750,
    speed: 46,
    essenceReward: 60,
    radius: 20,
    color: '#fb923c',
    armor: 0.35,
    description: 'Elite anomaly from outside the Spiral. Periodically blinks forward across path segments.',
  },

  great_void: {
    type: 'great_void',
    name: 'The Great Void',
    maxHealth: 4200,
    speed: 30,
    essenceReward: 300,
    radius: 28,
    color: '#e879f9',
    armor: 0.45,
    isBoss: true,
    description: 'Colossal entity of primordial unraveling. Multi-phase cosmic boss that challenges all seven layers.',
  },
};
