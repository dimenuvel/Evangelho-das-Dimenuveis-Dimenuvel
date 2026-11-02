export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'campaign' | 'mastery' | 'spiral';
  rewardEssence: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_stillness',
    title: 'First Stillness',
    description: 'Complete The Silent Observatory (Map 1).',
    icon: '◯',
    category: 'campaign',
    rewardEssence: 100,
  },
  {
    id: 'clear_horizons',
    title: 'Clear Horizons',
    description: 'Complete The Astral Garden (Map 2).',
    icon: '👁',
    category: 'campaign',
    rewardEssence: 120,
  },
  {
    id: 'neural_mastery',
    title: 'Master of Thought',
    description: 'Complete The Labyrinth of Mind (Map 3).',
    icon: '⚡',
    category: 'campaign',
    rewardEssence: 140,
  },
  {
    id: 'heart_of_spiral',
    title: 'Heart of the Spiral',
    description: 'Complete The Heart Sanctuary (Map 4).',
    icon: '✚',
    category: 'campaign',
    rewardEssence: 160,
  },
  {
    id: 'golden_standard',
    title: 'Golden Standard',
    description: 'Complete The Golden Forge (Map 5).',
    icon: '▲',
    category: 'campaign',
    rewardEssence: 180,
  },
  {
    id: 'solar_supernova',
    title: 'Solar Supernova',
    description: 'Complete The Energy Crucible (Map 6).',
    icon: '✹',
    category: 'campaign',
    rewardEssence: 200,
  },
  {
    id: 'the_last_abider',
    title: 'The Last Abider',
    description: 'Banish The Great Void and save the Sacred Ash in Map 7.',
    icon: '👑',
    category: 'campaign',
    rewardEssence: 500,
  },
  {
    id: 'perfect_equilibrium',
    title: 'Pure Equilibrium',
    description: 'Complete any level without losing a single point of Equilibrium (100% remaining).',
    icon: '⚖',
    category: 'mastery',
    rewardEssence: 150,
  },
  {
    id: 'sevenfold_harmony',
    title: 'Sevenfold Harmony',
    description: 'Construct all 7 distinct tower types on a single battlefield.',
    icon: '✧',
    category: 'mastery',
    rewardEssence: 200,
  },
  {
    id: 'dudes_disciple',
    title: "The Dude's Disciple",
    description: 'Activate Spiral Resonance 5 times in your journey.',
    icon: '☯',
    category: 'spiral',
    rewardEssence: 150,
  },
  {
    id: 'void_cleanser',
    title: 'Void Cleanser',
    description: 'Banish over 250 distortions from the Spiral.',
    icon: '⚔',
    category: 'spiral',
    rewardEssence: 250,
  },
  {
    id: 'endless_voyager',
    title: 'Endless Voyager',
    description: 'Survive beyond Wave 12 in Endless Spiral mode.',
    icon: '♾',
    category: 'spiral',
    rewardEssence: 300,
  },
];
