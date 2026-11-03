import {
  ActiveEnemy,
  FloatingText,
  GameMap,
  GameMode,
  PlacedTower,
  Projectile,
  ResonancePower,
  TowerSocket,
  TowerType,
  VisualParticle,
} from '../types/game';
import { TOWERS } from '../data/towers';
import { ENEMIES } from '../data/enemies';
import { soundManager } from '../services/audio';

export interface GameEngineState {
  map: GameMap;
  mode: GameMode;
  essence: number;
  equilibrium: number; // 0 - 100
  currentWaveIndex: number;
  totalWaves: number;
  isWaveActive: boolean;
  isPaused: boolean;
  gameSpeed: number; // 1, 2, 3
  spiralResonance: number; // 0 - 100
  selectedTowerId: string | null;
  selectedSocketId: string | null;
  selectedEnemyId?: string | null;
  placedTowers: PlacedTower[];
  score: number;
  enemiesBanishedCount: number;
  isGameOver: boolean;
  isVictory: boolean;
  activeResonanceBuff: {
    power: ResonancePower | null;
    timer: number;
  };
}

export class GameEngine {
  public state: GameEngineState;
  public enemies: ActiveEnemy[] = [];
  public projectiles: Projectile[] = [];
  public particles: VisualParticle[] = [];
  public floatingTexts: FloatingText[] = [];

  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animFrameId: number | null = null;
  private lastTime: number = 0;

  // Wave spawning tracking
  private waveSpawnQueue: {
    enemyType: string;
    spawnTime: number;
    pathIndex: number;
  }[] = [];
  private waveStartTime: number = 0;
  private screenShakeTime: number = 0;
  private screenShakeIntensity: number = 0;
  private globalTime: number = 0;

  // Callbacks to UI
  public onStateChange?: (state: GameEngineState) => void;
  public onVictory?: (stars: number, score: number) => void;
  public onDefeat?: () => void;
  public onAchievementTrigger?: (achievementId: string) => void;
  public onDudeToast?: (quote: string) => void;

  constructor(map: GameMap, mode: GameMode = 'campaign') {
    let startingEssence = map.startingEssence;
    if (mode === 'final_abiders') {
      startingEssence = Math.round(map.startingEssence * 0.75); // Hardcore resource limitation
    }

    this.state = {
      map,
      mode,
      essence: startingEssence,
      equilibrium: 100,
      currentWaveIndex: 0,
      totalWaves: map.waves.length,
      isWaveActive: false,
      isPaused: false,
      gameSpeed: 1,
      spiralResonance: 0,
      selectedTowerId: null,
      selectedSocketId: null,
      selectedEnemyId: null,
      placedTowers: [],
      score: 0,
      enemiesBanishedCount: 0,
      isGameOver: false,
      isVictory: false,
      activeResonanceBuff: {
        power: null,
        timer: 0,
      },
    };
  }

  public attachCanvas(canvas: HTMLCanvasElement) {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.render();
    this.startLoop();
  }

  public detachCanvas() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.canvas = null;
    this.ctx = null;
  }

  public setGameSpeed(speed: number) {
    this.state.gameSpeed = speed;
    this.notifyState();
  }

  public togglePause() {
    this.state.isPaused = !this.state.isPaused;
    this.notifyState();
  }

  public startNextWave() {
    if (this.state.isWaveActive || this.state.isGameOver || this.state.isVictory) return;

    if (this.state.currentWaveIndex >= this.state.totalWaves) {
      // In endless mode, generate an endless wave
      if (this.state.mode === 'endless') {
        this.generateEndlessWave(this.state.currentWaveIndex + 1);
      } else {
        return;
      }
    }

    this.state.isWaveActive = true;
    soundManager.playWaveStart();

    const waveDef = this.state.map.waves[this.state.currentWaveIndex];
    this.waveSpawnQueue = [];
    this.waveStartTime = this.globalTime;

    let baseDelay = 0.5;
    waveDef.units.forEach((group) => {
      for (let i = 0; i < group.count; i++) {
        this.waveSpawnQueue.push({
          enemyType: group.enemyType,
          spawnTime: this.globalTime + baseDelay + group.delay + i * group.spawnInterval,
          pathIndex: group.pathIndex || 0,
        });
      }
    });

    // Check if this wave contains Great Void boss
    const hasBoss = waveDef.units.some((u) => u.enemyType === 'great_void');
    if (hasBoss) {
      soundManager.playBossRoar();
      this.addFloatingText('THE GREAT VOID EMERGES', 500, 200, '#e879f9');
      this.triggerScreenShake(1.5, 8);
    }

    this.notifyState();
  }

  private generateEndlessWave(waveNum: number) {
    const unitCount = 10 + waveNum * 4;
    const isBossWave = waveNum % 5 === 0;

    this.state.totalWaves = waveNum;
    this.state.map.waves.push({
      waveNumber: waveNum,
      title: isBossWave ? `Endless Cataclysm ${waveNum}` : `Endless Distortion ${waveNum}`,
      bonusEssence: 100 + waveNum * 25,
      units: [
        {
          enemyType: isBossWave ? 'great_void' : waveNum > 6 ? 'stranger' : 'stepper',
          count: isBossWave ? 1 : Math.min(10, Math.floor(waveNum / 2)),
          spawnInterval: 2.0,
          delay: 0,
        },
        {
          enemyType: waveNum % 2 === 0 ? 'materialist' : 'agitator',
          count: 5 + Math.floor(waveNum * 1.5),
          spawnInterval: 1.0,
          delay: 2,
        },
        {
          enemyType: 'stepper',
          count: unitCount,
          spawnInterval: 0.4,
          delay: 4,
        },
      ],
    });
  }

  // TOWER ACTIONS
  public buildTower(socketId: string, type: TowerType): boolean {
    const socket = this.state.map.sockets.find((s) => s.id === socketId);
    if (!socket) return false;

    // Check if socket already occupied
    const existing = this.state.placedTowers.find((t) => t.socketId === socketId);
    if (existing) return false;

    const config = TOWERS[type];
    const cost = config.baseCost;

    if (this.state.essence < cost) {
      this.addFloatingText('Need More Essence!', socket.x, socket.y - 20, '#f87171');
      return false;
    }

    this.state.essence -= cost;
    const newTower: PlacedTower = {
      id: `tower_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      socketId,
      type,
      tier: 1,
      x: socket.x,
      y: socket.y,
      level: 1,
      lastShotTime: 0,
      targetId: null,
      angle: 0,
      abilityCooldownRemaining: 0,
      kills: 0,
      totalDamageDealt: 0,
    };

    this.state.placedTowers.push(newTower);
    this.state.selectedTowerId = newTower.id;
    this.state.selectedSocketId = null;

    soundManager.playBuild();
    this.spawnParticleRing(socket.x, socket.y, config.tiers[0].range, '#a855f7', 20);
    this.addFloatingText(`-${cost} Essence`, socket.x, socket.y - 30, '#facc15');

    // Check sevenfold harmony achievement
    const distinctTypes = new Set(this.state.placedTowers.map((t) => t.type));
    if (distinctTypes.size >= 7) {
      this.onAchievementTrigger?.('sevenfold_harmony');
    }

    this.notifyState();
    return true;
  }

  public upgradeTower(towerId: string): boolean {
    const tower = this.state.placedTowers.find((t) => t.id === towerId);
    if (!tower || tower.tier >= 3) return false;

    const config = TOWERS[tower.type];
    const nextTierStats = tower.tier < 3 ? config.tiers[tower.tier as 1 | 2] : null;
    if (!nextTierStats) return false;
    const cost = nextTierStats.cost;

    if (this.state.essence < cost) {
      this.addFloatingText('Need More Essence!', tower.x, tower.y - 20, '#f87171');
      return false;
    }

    this.state.essence -= cost;
    tower.tier = (tower.tier + 1) as 1 | 2 | 3;
    tower.level = tower.tier;

    soundManager.playUpgrade();
    this.spawnParticleBurst(tower.x, tower.y, 35, '#38bdf8', 140);
    this.addFloatingText(`Tier ${tower.tier}!`, tower.x, tower.y - 35, '#38bdf8');

    this.notifyState();
    return true;
  }

  /**
   * Calculates the refund value when selling a tower (default: 75% of total invested essence)
   */
  public getTowerSellValue(towerId: string, refundRatio: number = 0.75): number {
    const tower = this.state.placedTowers.find((t) => t.id === towerId);
    if (!tower) return 0;
    const config = TOWERS[tower.type];
    let totalInvested = config.baseCost;
    if (tower.tier >= 2 && config.tiers[1]) totalInvested += config.tiers[1].cost;
    if (tower.tier >= 3 && config.tiers[2]) totalInvested += config.tiers[2].cost;
    return Math.floor(totalInvested * refundRatio);
  }

  /**
   * Sells a placed tower, refunding a percentage of its cost (default 75%) and freeing its socket
   */
  public sellTower(towerId: string, refundRatio: number = 0.75): boolean {
    const index = this.state.placedTowers.findIndex((t) => t.id === towerId);
    if (index === -1) return false;

    const tower = this.state.placedTowers[index];
    const refund = this.getTowerSellValue(towerId, refundRatio);

    this.state.essence += refund;
    this.state.placedTowers.splice(index, 1);

    if (this.state.selectedTowerId === towerId) {
      this.state.selectedTowerId = null;
    }

    soundManager.playSell();
    this.spawnParticleBurst(tower.x, tower.y, 25, '#fbbf24', 90);
    this.addFloatingText(`+${refund} Essence (Sold)`, tower.x, tower.y - 25, '#34d399');

    this.notifyState();
    return true;
  }

  // Alias for backward compatibility
  public dismantleTower(towerId: string): boolean {
    return this.sellTower(towerId, 0.75);
  }

  public activateTowerAbility(towerId: string, tapPoint?: { x: number; y: number }): boolean {
    const tower = this.state.placedTowers.find((t) => t.id === towerId);
    if (!tower || tower.abilityCooldownRemaining > 0) return false;

    const config = TOWERS[tower.type];
    tower.abilityCooldownRemaining = config.activeAbilityCooldown;

    soundManager.playResonanceActivated();

    switch (tower.type) {
      case 'silent_observatory': {
        // Stillness Ray: smites highest HP enemy for 350% crit
        if (this.enemies.length === 0) break;
        const highestHp = [...this.enemies].sort((a, b) => b.health - a.health)[0];
        const tierStats = config.tiers[tower.tier - 1];
        const dmg = Math.round(tierStats.damage * 3.5);
        this.damageEnemy(highestHp, dmg, true, tower);
        this.addBeamEffect(tower.x, tower.y, highestHp.x, highestHp.y, '#c084fc', 8);
        this.addFloatingText(`CRIT! ${dmg}`, highestHp.x, highestHp.y - 25, '#f43f5e');
        break;
      }

      case 'astral_eye': {
        // Omnipresent Gaze: reveal all cloaked & +35% vulnerability for 8s
        this.enemies.forEach((e) => {
          e.revealedTimer = 8;
          e.markedDamageBonus = 0.35;
          e.markedTimer = 8;
        });
        this.triggerScreenShake(0.4, 4);
        this.addFloatingText('OMNIPRESENT GAZE ACTIVE', 500, 180, '#818cf8');
        break;
      }

      case 'thought_engine': {
        // Synaptic Overload: stun all enemies in range for 3s
        const tierStats = config.tiers[tower.tier - 1];
        let stunnedCount = 0;
        this.enemies.forEach((e) => {
          const dist = Math.hypot(e.x - tower.x, e.y - tower.y);
          if (dist <= tierStats.range * 1.3) {
            e.slowFactor = 0.05; // 95% slow/stasis
            e.slowTimer = 3.0;
            stunnedCount++;
            this.addFloatingText('STUN', e.x, e.y - 15, '#38bdf8');
          }
        });
        this.spawnParticleRing(tower.x, tower.y, tierStats.range * 1.3, '#06b6d4', 30);
        break;
      }

      case 'sanctuary': {
        // Harmonic Pulse: heals +10 Equilibrium & cleanses adjacent towers
        this.state.equilibrium = Math.min(100, this.state.equilibrium + 10);
        this.spawnParticleRing(this.state.map.centerAsh.x, this.state.map.centerAsh.y, 90, '#10b981', 40);
        this.addFloatingText('+10 EQUILIBRIUM', this.state.map.centerAsh.x, this.state.map.centerAsh.y - 30, '#10b981');
        break;
      }

      case 'golden_resonator': {
        // Willstorm: 4x attack speed frenzy for 6s
        this.addFloatingText('WILLSTORM FRENZY!', tower.x, tower.y - 30, '#f59e0b');
        this.spawnParticleBurst(tower.x, tower.y, 40, '#f59e0b', 180);
        break;
      }

      case 'solar_crucible': {
        // Solar Flare: 400 instant AoE damage at tap point or map center
        const targetX = tapPoint ? tapPoint.x : 500;
        const targetY = tapPoint ? tapPoint.y : 300;
        this.triggerScreenShake(0.8, 7);
        this.spawnParticleBurst(targetX, targetY, 60, '#f97316', 220);
        this.enemies.forEach((e) => {
          const dist = Math.hypot(e.x - targetX, e.y - targetY);
          if (dist <= 130) {
            this.damageEnemy(e, 400, false, tower);
          }
        });
        this.addFloatingText('SUPERNOVA!', targetX, targetY - 40, '#f97316');
        break;
      }

      case 'material_anchor': {
        // Gravitational Well: stops nearby enemies for 4s
        const tierStats = config.tiers[tower.tier - 1];
        this.enemies.forEach((e) => {
          const dist = Math.hypot(e.x - tower.x, e.y - tower.y);
          if (dist <= tierStats.range * 1.5) {
            e.slowFactor = 0; // complete stop
            e.slowTimer = 4.0;
            this.addFloatingText('GRAVITY LOCK', e.x, e.y - 15, '#f43f5e');
          }
        });
        this.spawnParticleRing(tower.x, tower.y, tierStats.range * 1.5, '#f43f5e', 35);
        break;
      }
    }

    this.notifyState();
    return true;
  }

  // SPIRAL RESONANCE POWERS
  public activateSpiralResonance(power: ResonancePower): boolean {
    if (this.state.spiralResonance < 100) {
      this.addFloatingText('Resonance charging...', 500, 300, '#a855f7');
      return false;
    }

    this.state.spiralResonance = 0;
    this.state.activeResonanceBuff = {
      power,
      timer: power === 'temporal_stillness' ? 6 : power === 'golden_spiral' ? 8 : 1,
    };

    soundManager.playResonanceActivated();
    this.triggerScreenShake(1.0, 6);

    switch (power) {
      case 'temporal_stillness':
        this.enemies.forEach((e) => {
          e.slowFactor = 0.2;
          e.slowTimer = 6.0;
        });
        this.addFloatingText('TEMPORAL STILLNESS INVOKED', 500, 200, '#c084fc');
        break;

      case 'golden_spiral':
        this.addFloatingText('GOLDEN SPIRAL OVERCHARGE', 500, 200, '#facc15');
        this.spawnParticleRing(500, 300, 350, '#facc15', 80);
        break;

      case 'silent_presence':
        this.state.equilibrium = Math.min(100, this.state.equilibrium + 35);
        this.addFloatingText('+35 EQUILIBRIUM RESTORED', 500, 200, '#10b981');
        this.spawnParticleBurst(this.state.map.centerAsh.x, this.state.map.centerAsh.y, 60, '#10b981', 180);
        break;

      case 'cosmic_reset': {
        this.triggerScreenShake(1.5, 10);
        this.addFloatingText('COSMIC RESET DECREED', 500, 200, '#e879f9');
        // Obliterate non-bosses or deal massive 1500 damage to bosses
        const enemiesCopy = [...this.enemies];
        enemiesCopy.forEach((e) => {
          const dmg = e.isBoss ? 1500 : 1200;
          this.damageEnemy(e, dmg, true, null);
        });
        break;
      }
    }

    this.onAchievementTrigger?.('dudes_disciple');
    this.notifyState();
    return true;
  }

  // SELECTION & TAP HANDLING
  public handleTap(virtualX: number, virtualY: number) {
    // 1. Check if tap is on an enemy (priority tap target)
    const tappedEnemy = this.enemies.find((e) => {
      const dist = Math.hypot(e.x - virtualX, e.y - virtualY);
      return dist <= Math.max(30, e.radius + 14);
    });

    if (tappedEnemy) {
      this.state.selectedEnemyId = tappedEnemy.id;
      this.state.selectedTowerId = null;
      this.state.selectedSocketId = null;
      this.notifyState();
      return;
    }

    // 2. Check if tap is on a placed tower
    const tappedTower = this.state.placedTowers.find((t) => {
      const dist = Math.hypot(t.x - virtualX, t.y - virtualY);
      return dist <= 36;
    });

    if (tappedTower) {
      this.state.selectedTowerId = tappedTower.id;
      this.state.selectedSocketId = null;
      this.state.selectedEnemyId = null;
      this.notifyState();
      return;
    }

    // 3. Check if tap is on an empty socket
    const tappedSocket = this.state.map.sockets.find((s) => {
      const dist = Math.hypot(s.x - virtualX, s.y - virtualY);
      return dist <= 38;
    });

    if (tappedSocket) {
      const isOccupied = this.state.placedTowers.some((t) => t.socketId === tappedSocket.id);
      if (!isOccupied) {
        this.state.selectedSocketId = tappedSocket.id;
        this.state.selectedTowerId = null;
        this.state.selectedEnemyId = null;
        this.notifyState();
        return;
      }
    }

    // 4. Tap empty space: deselect
    this.state.selectedTowerId = null;
    this.state.selectedSocketId = null;
    this.state.selectedEnemyId = null;
    this.notifyState();
  }

  public deselect() {
    this.state.selectedTowerId = null;
    this.state.selectedSocketId = null;
    this.state.selectedEnemyId = null;
    this.notifyState();
  }

  // GAME LOOP & UPDATE
  private startLoop() {
    this.lastTime = performance.now();
    const frame = (time: number) => {
      const dt = Math.min((time - this.lastTime) / 1000, 0.1);
      this.lastTime = time;

      if (!this.state.isPaused && !this.state.isGameOver && !this.state.isVictory) {
        const effectiveDt = dt * this.state.gameSpeed;
        this.globalTime += effectiveDt;
        this.update(effectiveDt);
      }

      this.render();
      this.animFrameId = requestAnimationFrame(frame);
    };

    this.animFrameId = requestAnimationFrame(frame);
  }

  private update(dt: number) {
    // Update screen shake
    if (this.screenShakeTime > 0) {
      this.screenShakeTime -= dt;
    }

    // Update active resonance power
    if (this.state.activeResonanceBuff.timer > 0) {
      this.state.activeResonanceBuff.timer -= dt;
      if (this.state.activeResonanceBuff.timer <= 0) {
        this.state.activeResonanceBuff.power = null;
      }
    }

    // Process wave spawning queue
    if (this.state.isWaveActive) {
      const readyUnits = this.waveSpawnQueue.filter((u) => u.spawnTime <= this.globalTime);
      readyUnits.forEach((u) => {
        this.spawnEnemy(u.enemyType, u.pathIndex);
      });
      this.waveSpawnQueue = this.waveSpawnQueue.filter((u) => u.spawnTime > this.globalTime);

      // Check if wave is completed
      if (this.waveSpawnQueue.length === 0 && this.enemies.length === 0) {
        this.completeCurrentWave();
      }
    }

    // Update enemies
    this.updateEnemies(dt);

    // Update towers and targeting
    this.updateTowers(dt);

    // Update projectiles
    this.updateProjectiles(dt);

    // Update visual particles
    this.updateParticles(dt);

    // Update floating texts
    this.updateFloatingTexts(dt);
  }

  private spawnEnemy(typeKey: string, pathIndex: number) {
    const stats = ENEMIES[typeKey as keyof typeof ENEMIES];
    if (!stats) return;

    const path = this.state.map.paths[pathIndex] || this.state.map.paths[0];
    if (!path || path.length === 0) return;

    const startNode = path[0];

    const enemy: ActiveEnemy = {
      id: `enemy_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: stats.type,
      health: stats.maxHealth,
      maxHealth: stats.maxHealth,
      speed: stats.speed,
      pathIndex,
      distanceAlongPath: 0,
      x: startNode.x,
      y: startNode.y,
      radius: stats.radius,
      color: stats.color,
      essenceReward: stats.essenceReward,
      armor: stats.armor,
      isBoss: !!stats.isBoss,
      isCloaked: !!stats.isCloaked,
      revealedTimer: 0,
      slowFactor: 1.0,
      slowTimer: 0,
      agitatorPulseTimer: 0,
      markedDamageBonus: 0,
      markedTimer: 0,
      angle: 0,
      phase: 1,
    };

    // Mode difficulty scaling
    if (this.state.mode === 'final_abiders') {
      enemy.maxHealth = Math.round(enemy.maxHealth * 1.4);
      enemy.health = enemy.maxHealth;
      enemy.speed = Math.round(enemy.speed * 1.2);
    } else if (this.state.mode === 'endless') {
      const waveMult = 1 + this.state.currentWaveIndex * 0.15;
      enemy.maxHealth = Math.round(enemy.maxHealth * waveMult);
      enemy.health = enemy.maxHealth;
    }

    this.enemies.push(enemy);
  }

  private updateEnemies(dt: number) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];

      // Update debuffs / buffs
      if (enemy.slowTimer > 0) {
        enemy.slowTimer -= dt;
        if (enemy.slowTimer <= 0) {
          enemy.slowFactor = 1.0;
        }
      }

      if (enemy.revealedTimer > 0) {
        enemy.revealedTimer -= dt;
      }

      if (enemy.markedTimer > 0) {
        enemy.markedTimer -= dt;
        if (enemy.markedTimer <= 0) {
          enemy.markedDamageBonus = 0;
        }
      }

      // Agitator pulse logic: debuffs nearby towers
      if (enemy.type === 'agitator') {
        enemy.agitatorPulseTimer += dt;
        if (enemy.agitatorPulseTimer >= 1.5) {
          enemy.agitatorPulseTimer = 0;
          this.spawnParticleRing(enemy.x, enemy.y, 90, '#facc15', 18);
        }
      }

      // Boss multi-phase transitions for Great Void
      if (enemy.isBoss && enemy.type === 'great_void') {
        const hpPercent = enemy.health / enemy.maxHealth;
        if (hpPercent <= 0.33 && enemy.phase !== 3) {
          enemy.phase = 3;
          enemy.speed = 45; // Enrage speed
          this.triggerScreenShake(1.2, 8);
          this.addFloatingText('GREAT VOID: CATACLYSM PHASE!', enemy.x, enemy.y - 40, '#f43f5e');
        } else if (hpPercent <= 0.66 && enemy.phase === 1) {
          enemy.phase = 2;
          this.triggerScreenShake(0.8, 6);
          this.addFloatingText('GREAT VOID: DISTORTION STORM!', enemy.x, enemy.y - 40, '#c084fc');
        }
      }

      // Advance along path
      const currentSpeed = enemy.speed * enemy.slowFactor;
      enemy.distanceAlongPath += currentSpeed * dt;

      const path = this.state.map.paths[enemy.pathIndex] || this.state.map.paths[0];
      const pos = this.getPositionAlongPath(path, enemy.distanceAlongPath);

      if (!pos.finished) {
        // Subtle deceptive jitter for False One
        if (enemy.type === 'false_one') {
          const jitter = Math.sin(this.globalTime * 8 + i) * 6;
          enemy.x = pos.x + jitter;
          enemy.y = pos.y + jitter;
        } else {
          enemy.x = pos.x;
          enemy.y = pos.y;
        }
        enemy.angle = pos.angle;
      } else {
        // Reached the central Spiral / Sacred Ash!
        this.handleEnemyBreach(enemy);
        this.enemies.splice(i, 1);
      }
    }
  }

  private handleEnemyBreach(enemy: ActiveEnemy) {
    if (this.state.selectedEnemyId === enemy.id) {
      this.state.selectedEnemyId = null;
    }
    let damage = enemy.isBoss ? 45 : enemy.type === 'materialist' ? 15 : enemy.type === 'stranger' ? 20 : 6;
    this.state.equilibrium = Math.max(0, this.state.equilibrium - damage);

    this.triggerScreenShake(0.6, 8);
    this.spawnParticleBurst(this.state.map.centerAsh.x, this.state.map.centerAsh.y, 30, '#ef4444', 120);
    this.addFloatingText(`-${damage}% EQUILIBRIUM`, this.state.map.centerAsh.x, this.state.map.centerAsh.y - 30, '#ef4444');

    if (this.state.equilibrium <= 0) {
      this.state.equilibrium = 0;
      this.handleGameOver();
    }
  }

  private updateTowers(dt: number) {
    // Check if Golden Spiral resonance is active
    const isGoldenSpiralActive = this.state.activeResonanceBuff.power === 'golden_spiral';

    this.state.placedTowers.forEach((tower) => {
      // Cooldown timer
      if (tower.abilityCooldownRemaining > 0) {
        tower.abilityCooldownRemaining = Math.max(0, tower.abilityCooldownRemaining - dt);
      }

      const config = TOWERS[tower.type];
      const tierStats = config.tiers[tower.tier - 1];

      // Calculate aura buffs from neighboring Sanctuaries
      let auraDmgMultiplier = 1.0;
      let auraRangeBonus = 0;
      this.state.placedTowers.forEach((other) => {
        if (other.id !== tower.id && other.type === 'sanctuary') {
          const dist = Math.hypot(other.x - tower.x, other.y - tower.y);
          if (dist <= 160) {
            const sanctuaryStats = TOWERS.sanctuary.tiers[other.tier - 1];
            auraDmgMultiplier += sanctuaryStats.auraBuff || 0.15;
            auraRangeBonus += 15;
          }
        }
      });

      // Check Agitator debuffs
      let agitatorDebuff = 1.0;
      this.enemies.forEach((e) => {
        if (e.type === 'agitator') {
          const dist = Math.hypot(e.x - tower.x, e.y - tower.y);
          if (dist <= 120) {
            agitatorDebuff = 0.7; // 30% attack speed reduction
          }
        }
      });

      const effectiveRange = tierStats.range + auraRangeBonus;
      let effectiveFireRate = tierStats.fireRate * agitatorDebuff;
      if (isGoldenSpiralActive) {
        effectiveFireRate *= 2.0;
      }

      // Check if tower's active ability frenzy is on (Golden Resonator Willstorm)
      if (tower.type === 'golden_resonator' && tower.abilityCooldownRemaining > config.activeAbilityCooldown - 6) {
        effectiveFireRate *= 3.5;
      }

      // Find targets in range
      const inRangeEnemies = this.enemies.filter((e) => {
        const dist = Math.hypot(e.x - tower.x, e.y - tower.y);
        if (dist > effectiveRange) return false;

        // Cloak check: Silencers & cloaked enemies can only be seen if revealed or if this is Astral Eye
        if (e.isCloaked && e.revealedTimer <= 0 && tower.type !== 'astral_eye' && dist > 50) {
          return false;
        }
        return true;
      });

      if (inRangeEnemies.length === 0) {
        tower.targetId = null;
        return;
      }

      // Target selection
      let target: ActiveEnemy;
      if (tower.type === 'silent_observatory') {
        // Prioritize highest HP
        target = inRangeEnemies.reduce((prev, curr) => (curr.health > prev.health ? curr : prev));
      } else {
        // Prioritize furthest along path
        target = inRangeEnemies.reduce((prev, curr) => (curr.distanceAlongPath > prev.distanceAlongPath ? curr : prev));
      }

      tower.targetId = target.id;
      tower.angle = Math.atan2(target.y - tower.y, target.x - tower.x);

      // Check if ready to fire
      const fireInterval = 1 / effectiveFireRate;
      if (this.globalTime - tower.lastShotTime >= fireInterval) {
        tower.lastShotTime = this.globalTime;
        this.fireTower(tower, target, tierStats, auraDmgMultiplier, isGoldenSpiralActive);
      }
    });
  }

  private fireTower(
    tower: PlacedTower,
    target: ActiveEnemy,
    tierStats: any,
    auraDmgMult: number,
    guaranteedCrit: boolean
  ) {
    soundManager.playTowerShoot(tower.type);

    let damage = Math.round(tierStats.damage * auraDmgMult);
    if (guaranteedCrit) {
      damage = Math.round(damage * 1.5);
    }

    switch (tower.type) {
      case 'silent_observatory': {
        // Instant cosmic pulse beam
        this.damageEnemy(target, damage, guaranteedCrit, tower);
        this.addBeamEffect(tower.x, tower.y, target.x, target.y, '#a855f7', 4);
        break;
      }

      case 'astral_eye': {
        // Ethereal laser & apply vulnerability mark
        target.revealedTimer = 5;
        target.markedDamageBonus = tower.tier >= 3 ? 0.35 : 0.2;
        target.markedTimer = 5;
        this.damageEnemy(target, damage, guaranteedCrit, tower);
        this.addBeamEffect(tower.x, tower.y, target.x, target.y, '#6366f1', 2);
        break;
      }

      case 'thought_engine': {
        // Chain lightning to multiple nearby enemies
        const chainLimit = tierStats.chainCount || 2;
        const hitEnemies = [target];
        this.damageEnemy(target, damage, guaranteedCrit, tower);
        this.addBeamEffect(tower.x, tower.y, target.x, target.y, '#06b6d4', 3);

        let currentSource = target;
        for (let c = 1; c < chainLimit; c++) {
          const nextTarget = this.enemies.find(
            (e) => !hitEnemies.includes(e) && Math.hypot(e.x - currentSource.x, e.y - currentSource.y) <= 120
          );
          if (!nextTarget) break;

          hitEnemies.push(nextTarget);
          const chainDmg = Math.round(damage * 0.75);
          this.damageEnemy(nextTarget, chainDmg, false, tower);
          this.addBeamEffect(currentSource.x, currentSource.y, nextTarget.x, nextTarget.y, '#06b6d4', 2.5);
          currentSource = nextTarget;
        }

        // Apply slow
        hitEnemies.forEach((e) => {
          e.slowFactor = 1 - (tierStats.slowPercent || 0.3);
          e.slowTimer = tierStats.slowDuration || 2.0;
        });
        break;
      }

      case 'sanctuary': {
        // Harmonic beam
        this.damageEnemy(target, damage, false, tower);
        this.addBeamEffect(tower.x, tower.y, target.x, target.y, '#10b981', 2);
        break;
      }

      case 'golden_resonator': {
        // High-velocity kinetic needles
        this.projectiles.push({
          id: `proj_${Date.now()}_${Math.random()}`,
          towerType: tower.type,
          x: tower.x,
          y: tower.y,
          targetX: target.x,
          targetY: target.y,
          targetEnemyId: target.id,
          damage,
          speed: 680,
          color: '#f59e0b',
          radius: 3.5,
          splashRadius: 0,
          chainLeft: 0,
          slowPercent: 0,
          slowDuration: 0,
          pierceArmor: false,
        });
        break;
      }

      case 'solar_crucible': {
        // Solar mortar plasma orb with AoE explosion
        this.projectiles.push({
          id: `proj_${Date.now()}_${Math.random()}`,
          towerType: tower.type,
          x: tower.x,
          y: tower.y,
          targetX: target.x,
          targetY: target.y,
          targetEnemyId: target.id,
          damage,
          speed: 380,
          color: '#f97316',
          radius: 6,
          splashRadius: tierStats.splashRadius || 60,
          chainLeft: 0,
          slowPercent: 0,
          slowDuration: 0,
          pierceArmor: true, // Ignores armor
        });
        break;
      }

      case 'material_anchor': {
        // Crimson kinetic ring shockwave
        this.projectiles.push({
          id: `proj_${Date.now()}_${Math.random()}`,
          towerType: tower.type,
          x: tower.x,
          y: tower.y,
          targetX: target.x,
          targetY: target.y,
          targetEnemyId: target.id,
          damage,
          speed: 440,
          color: '#f43f5e',
          radius: 5,
          splashRadius: tierStats.splashRadius || 70,
          chainLeft: 0,
          slowPercent: tierStats.slowPercent || 0.4,
          slowDuration: tierStats.slowDuration || 2.0,
          pierceArmor: false,
        });
        break;
      }
    }
  }

  private updateProjectiles(dt: number) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];

      // If target enemy still alive, update target coords
      if (proj.targetEnemyId) {
        const targetEnemy = this.enemies.find((e) => e.id === proj.targetEnemyId);
        if (targetEnemy) {
          proj.targetX = targetEnemy.x;
          proj.targetY = targetEnemy.y;
        }
      }

      const dx = proj.targetX - proj.x;
      const dy = proj.targetY - proj.y;
      const dist = Math.hypot(dx, dy);

      const step = proj.speed * dt;
      if (dist <= step) {
        // Projectile reached target!
        this.detonateProjectile(proj);
        this.projectiles.splice(i, 1);
      } else {
        proj.x += (dx / dist) * step;
        proj.y += (dy / dist) * step;
      }
    }
  }

  private detonateProjectile(proj: Projectile) {
    if (proj.splashRadius > 0) {
      // AoE damage
      this.spawnParticleBurst(proj.targetX, proj.targetY, 20, proj.color, 90);
      this.enemies.forEach((e) => {
        const d = Math.hypot(e.x - proj.targetX, e.y - proj.targetY);
        if (d <= proj.splashRadius) {
          const falloff = 1 - (d / proj.splashRadius) * 0.4;
          const splashDmg = Math.round(proj.damage * falloff);
          this.damageEnemy(e, splashDmg, false, null, proj.pierceArmor);
          if (proj.slowPercent > 0) {
            e.slowFactor = 1 - proj.slowPercent;
            e.slowTimer = proj.slowDuration;
          }
        }
      });
    } else {
      // Single target
      const hitEnemy = this.enemies.find((e) => e.id === proj.targetEnemyId);
      if (hitEnemy) {
        this.damageEnemy(hitEnemy, proj.damage, false, null, proj.pierceArmor);
      }
      this.spawnParticleBurst(proj.targetX, proj.targetY, 8, proj.color, 40);
    }
  }

  private damageEnemy(
    enemy: ActiveEnemy,
    rawDamage: number,
    isCrit: boolean = false,
    towerSource: PlacedTower | null = null,
    ignoreArmor: boolean = false
  ) {
    let finalDamage = rawDamage;

    // Apply marked vulnerability bonus (from Astral Eye)
    if (enemy.markedDamageBonus > 0) {
      finalDamage = Math.round(finalDamage * (1 + enemy.markedDamageBonus));
    }

    // Apply armor reduction (unless pierced by Energy or specialized tiers)
    if (!ignoreArmor && enemy.armor > 0) {
      finalDamage = Math.round(finalDamage * (1 - enemy.armor));
    }

    finalDamage = Math.max(1, finalDamage);
    enemy.health -= finalDamage;

    if (towerSource) {
      towerSource.totalDamageDealt += finalDamage;
    }

    // Floating damage text
    const txtColor = isCrit ? '#f43f5e' : enemy.markedDamageBonus > 0 ? '#818cf8' : '#e2e8f0';
    this.addFloatingText(`${finalDamage}`, enemy.x + (Math.random() * 12 - 6), enemy.y - 12, txtColor);

    // Check death
    if (enemy.health <= 0) {
      this.banishEnemy(enemy, towerSource);
    }
  }

  private banishEnemy(enemy: ActiveEnemy, killerTower: PlacedTower | null) {
    if (this.state.selectedEnemyId === enemy.id) {
      this.state.selectedEnemyId = null;
    }
    const idx = this.enemies.indexOf(enemy);
    if (idx !== -1) {
      this.enemies.splice(idx, 1);
    }

    soundManager.playEnemyKilled();
    this.state.enemiesBanishedCount++;
    this.state.score += enemy.essenceReward * 10;
    this.state.essence += enemy.essenceReward;

    // Increase Spiral Resonance
    const resonanceGain = enemy.isBoss ? 50 : enemy.type === 'stranger' ? 15 : 4;
    this.state.spiralResonance = Math.min(100, this.state.spiralResonance + resonanceGain);

    if (killerTower) {
      killerTower.kills++;
    }

    // Particles and floating essence
    this.spawnParticleBurst(enemy.x, enemy.y, enemy.isBoss ? 60 : 16, enemy.isBoss ? '#e879f9' : '#a855f7', 120);
    this.addFloatingText(`+${enemy.essenceReward}`, enemy.x, enemy.y - 18, '#fbbf24');

    // Achievement triggers
    if (this.state.enemiesBanishedCount >= 250) {
      this.onAchievementTrigger?.('void_cleanser');
    }

    // Random Dude quote toast
    if (Math.random() < 0.04) {
      const dudeQuotes = [
        "Man, the lane's looking clearer already.",
        "Mind your resonance, brother. Let it flow.",
        "That was a clean strike. The Spiral abides.",
        "Don't rush the next wave. Breathe in that stillness.",
      ];
      this.onDudeToast?.(dudeQuotes[Math.floor(Math.random() * dudeQuotes.length)]);
    }
  }

  private completeCurrentWave() {
    this.state.isWaveActive = false;
    const completedWaveDef = this.state.map.waves[this.state.currentWaveIndex];
    const bonus = completedWaveDef ? completedWaveDef.bonusEssence : 50;

    // Sanctuaries passive equilibrium regen
    let passiveEquil = 0;
    this.state.placedTowers.forEach((t) => {
      if (t.type === 'sanctuary') {
        const stats = TOWERS.sanctuary.tiers[t.tier - 1];
        passiveEquil += stats.passiveEquilibriumRegen || 3;
      }
    });

    if (passiveEquil > 0) {
      this.state.equilibrium = Math.min(100, this.state.equilibrium + passiveEquil);
      this.addFloatingText(`+${passiveEquil}% Sanctuary Balance`, 500, 300, '#10b981');
    }

    this.state.essence += bonus;
    this.addFloatingText(`Wave Clear! +${bonus} Essence`, 500, 260, '#facc15');

    this.state.currentWaveIndex++;

    if (this.state.currentWaveIndex >= this.state.totalWaves && this.state.mode !== 'endless') {
      // Level victory!
      this.handleVictory();
    } else {
      this.notifyState();
    }
  }

  private handleVictory() {
    this.state.isVictory = true;
    soundManager.playVictory();

    // Calculate stars: 100% equilibrium = 3 stars, >=70% = 2 stars, >0 = 1 star
    let stars = 1;
    if (this.state.equilibrium >= 100) {
      stars = 3;
      this.onAchievementTrigger?.('perfect_equilibrium');
    } else if (this.state.equilibrium >= 70) {
      stars = 2;
    }

    // Campaign map complete achievement check
    const mapAchievements: Record<string, string> = {
      silence_observatory: 'first_stillness',
      astral_garden: 'clear_horizons',
      labyrinth_mind: 'neural_mastery',
      heart_sanctuary: 'heart_of_spiral',
      golden_forge: 'golden_standard',
      energy_crucible: 'solar_supernova',
      material_realm: 'the_last_abider',
    };

    const achId = mapAchievements[this.state.map.id];
    if (achId) {
      this.onAchievementTrigger?.(achId);
    }

    this.onVictory?.(stars, this.state.score);
    this.notifyState();
  }

  private handleGameOver() {
    this.state.isGameOver = true;
    soundManager.playDefeat();
    this.onDefeat?.();
    this.notifyState();
  }

  // PARTICLES & EFFECTS
  private spawnParticleBurst(x: number, y: number, count: number, color: string, speedMax: number) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * speedMax;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 0.4 + Math.random() * 0.5,
        size: 2 + Math.random() * 4,
        color,
        alpha: 1,
        shape: Math.random() > 0.5 ? 'spark' : 'circle',
      });
    }
  }

  private spawnParticleRing(x: number, y: number, radius: number, color: string, count: number) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      this.particles.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * 30,
        vy: Math.sin(angle) * 30,
        life: 0,
        maxLife: 0.6,
        size: 3,
        color,
        alpha: 1,
        shape: 'spark',
      });
    }
  }

  private addBeamEffect(x1: number, y1: number, x2: number, y2: number, color: string, width: number) {
    this.particles.push({
      x: x1,
      y: y1,
      vx: x2,
      vy: y2, // storing end coordinates
      life: 0,
      maxLife: 0.12,
      size: width,
      color,
      alpha: 1,
      shape: 'spark',
    });
  }

  public addFloatingText(text: string, x: number, y: number, color: string) {
    this.floatingTexts.push({
      id: `ft_${Date.now()}_${Math.random()}`,
      text,
      x,
      y,
      color,
      alpha: 1,
      life: 0,
    });
  }

  private triggerScreenShake(duration: number, intensity: number) {
    this.screenShakeTime = duration;
    this.screenShakeIntensity = intensity;
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }
      p.alpha = 1 - p.life / p.maxLife;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
  }

  private updateFloatingTexts(dt: number) {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life += dt;
      if (ft.life >= 1.2) {
        this.floatingTexts.splice(i, 1);
        continue;
      }
      ft.alpha = Math.max(0, 1 - ft.life / 1.2);
      ft.y -= 25 * dt; // Float upward
    }
  }

  private getPositionAlongPath(path: { x: number; y: number }[], distance: number) {
    let accumulated = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const p1 = path[i];
      const p2 = path[i + 1];
      const segLength = Math.hypot(p2.x - p1.x, p2.y - p1.y);

      if (accumulated + segLength >= distance) {
        const segProgress = (distance - accumulated) / segLength;
        const x = p1.x + (p2.x - p1.x) * segProgress;
        const y = p1.y + (p2.y - p1.y) * segProgress;
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return { x, y, angle, finished: false };
      }
      accumulated += segLength;
    }
    const lastNode = path[path.length - 1];
    return { x: lastNode.x, y: lastNode.y, angle: 0, finished: true };
  }

  private notifyState() {
    this.onStateChange?.({ ...this.state });
  }

  // RENDER METHOD (CANVAS 2D)
  public render() {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Force blocky vintage arcade rendering
    ctx.imageSmoothingEnabled = false;

    // Apply screen shake offset
    ctx.save();
    if (this.screenShakeTime > 0) {
      const shakeX = (Math.random() - 0.5) * this.screenShakeIntensity * 2;
      const shakeY = (Math.random() - 0.5) * this.screenShakeIntensity * 2;
      ctx.translate(shakeX, shakeY);
    }

    // 1. Cosmic Retro Arcade Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#04010a');
    bgGrad.addColorStop(0.5, '#0a0319');
    bgGrad.addColorStop(1, '#020007');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Cosmic Vector Starfield & Retro Synthwave Grid
    this.renderCosmicBackground(ctx);

    // 3. Render Neon Paths & Pulsing Chevrons
    this.renderPaths(ctx);

    // 4. Render Central Sacred Ash & Arcade Core
    this.renderSacredAsh(ctx);

    // 5. Render Sockets (Arcade Vector Docking Pads)
    this.renderSockets(ctx);

    // 6. Render Placed Towers (Vector Arcade Weapons)
    this.renderTowers(ctx);

    // 7. Render Selected Range Ring (Radar Grid)
    this.renderSelectionRange(ctx);

    // 8. Render Enemies (Vector Invaders)
    this.renderEnemies(ctx);

    // 9. Render Projectiles (Arcade Lasers & Plasma)
    this.renderProjectiles(ctx);

    // 10. Render Visual Particles & Laser Beams
    this.renderParticles(ctx);

    // 11. Render Floating Numbers / Labels (Pixel Font)
    this.renderFloatingTexts(ctx);

    ctx.restore();
  }

  private renderCosmicBackground(ctx: CanvasRenderingContext2D) {
    const time = this.globalTime;

    // 1. Retro Starfield: Deterministic 4-point vector twinkling stars
    ctx.save();
    const starCount = 65;
    for (let i = 0; i < starCount; i++) {
      const sx = ((i * 137.5 + 47) % 980) + 10;
      const sy = ((i * 223.1 + 89) % 580) + 10;
      const twinkle = 0.4 + 0.6 * Math.sin(time * 3 + i * 2.3);
      const isLarge = i % 7 === 0;

      ctx.globalAlpha = twinkle;
      if (isLarge) {
        const starColor = i % 3 === 0 ? '#00f0ff' : i % 3 === 1 ? '#ff007f' : '#ffe600';
        ctx.fillStyle = starColor;
        ctx.strokeStyle = starColor;
        ctx.lineWidth = 1;

        // 4-point vector arcade star
        ctx.beginPath();
        ctx.moveTo(sx - 4, sy);
        ctx.lineTo(sx + 4, sy);
        ctx.moveTo(sx, sy - 4);
        ctx.lineTo(sx, sy + 4);
        ctx.stroke();

        ctx.fillRect(sx - 1, sy - 1, 2, 2);
      } else {
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 240, 255, 0.6)';
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }
    }
    ctx.restore();

    // 2. Retro Perspective Synthwave Vector Grid (bottom region)
    ctx.save();
    const horizonY = 480;
    const gridBottomY = 600;
    const vanishingX = 500;

    ctx.strokeStyle = 'rgba(255, 0, 127, 0.12)';
    ctx.lineWidth = 1;

    // Receding horizontal grid lines
    const lineCount = 6;
    for (let i = 1; i <= lineCount; i++) {
      const p = Math.pow(i / lineCount, 1.8);
      const y = horizonY + p * (gridBottomY - horizonY);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1000, y);
      ctx.stroke();
    }

    // Perspective lines fanning outward from vanishing point
    const vSteps = 16;
    for (let i = -vSteps; i <= vSteps; i++) {
      const spreadX = vanishingX + i * 45;
      ctx.beginPath();
      ctx.moveTo(vanishingX + i * 8, horizonY);
      ctx.lineTo(spreadX * 1.5 - 250, gridBottomY);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Rotating Vector Sacred Geometry & Neon Rings (Tempest / Arcade Vector style)
    ctx.save();
    ctx.translate(500, 300);

    // Outer rotating vector dodecagon
    ctx.rotate(time * 0.04);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.lineWidth = 1.2;

    [120, 220, 340].forEach((r, idx) => {
      ctx.beginPath();
      const sides = idx % 2 === 0 ? 8 : 12;
      for (let i = 0; i < sides; i++) {
        const a = (i / sides) * Math.PI * 2;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();

      // Neon vector vertex nodes
      for (let i = 0; i < sides; i++) {
        const a = (i / sides) * Math.PI * 2;
        const nx = Math.cos(a) * r;
        const ny = Math.sin(a) * r;
        ctx.fillStyle = idx % 2 === 0 ? '#00f0ff' : '#ff007f';
        ctx.fillRect(nx - 2, ny - 2, 4, 4);
      }
    });

    ctx.restore();
  }

  private renderPaths(ctx: CanvasRenderingContext2D) {
    const time = this.globalTime;

    this.state.map.paths.forEach((path) => {
      if (path.length < 2) return;

      // 1. Neon Outer Glow Rails (Magenta / Cyan Synthwave Track)
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Outer laser aura
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.strokeStyle = 'rgba(255, 0, 127, 0.22)';
      ctx.lineWidth = 36;
      ctx.stroke();

      // Dark cyber conduit interior
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.strokeStyle = '#080315';
      ctx.lineWidth = 26;
      ctx.stroke();

      // Dual neon vector rails
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.55)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 2. Animated Pulsing Neon Vector Chevrons / Waypoint Pulses
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([10, 18]);
      ctx.lineDashOffset = -time * 50;
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Neon node markers at path turns
      for (let i = 0; i < path.length; i++) {
        ctx.fillStyle = '#ff007f';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.fillRect(path[i].x - 3, path[i].y - 3, 6, 6);
        ctx.strokeRect(path[i].x - 3, path[i].y - 3, 6, 6);
      }

      ctx.restore();
    });
  }

  // Vintage Arcade 8-Bit Pixel Sprite Drawer
  private drawPixelSprite(
    ctx: CanvasRenderingContext2D,
    matrix: string[],
    blockSize: number,
    primaryColor: string,
    accentColor: string = '#ffffff'
  ) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const startX = -Math.floor((cols * blockSize) / 2);
    const startY = -Math.floor((rows * blockSize) / 2);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const char = matrix[r][c];
        if (char === 'X' || char === '█') {
          ctx.fillStyle = primaryColor;
          ctx.fillRect(startX + c * blockSize, startY + r * blockSize, blockSize, blockSize);
        } else if (char === 'O' || char === 'o') {
          ctx.fillStyle = accentColor;
          ctx.fillRect(startX + c * blockSize, startY + r * blockSize, blockSize, blockSize);
        } else if (char === '#') {
          ctx.fillStyle = '#05010d';
          ctx.fillRect(startX + c * blockSize, startY + r * blockSize, blockSize, blockSize);
        }
      }
    }
  }

  private renderSacredAsh(ctx: CanvasRenderingContext2D) {
    const ash = this.state.map.centerAsh;
    const time = this.globalTime;

    ctx.save();
    ctx.translate(Math.floor(ash.x), Math.floor(ash.y));

    const equilRatio = Math.max(0, Math.min(1, this.state.equilibrium / 100));
    const isCritical = equilRatio <= 0.35;
    const coreColor = isCritical ? '#ff0055' : '#00f0ff';
    const accentColor = isCritical ? '#ffe600' : '#ff00a0';
    const tertiaryColor = isCritical ? '#ff3366' : '#ffe600';

    // 1. Ambient Background Halo / Energy Vortex Disc
    const pulse = Math.sin(time * 3) * 0.15 + 0.85;
    const maxRadius = 32 * pulse;
    const glowGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, maxRadius);
    glowGrad.addColorStop(0, isCritical ? 'rgba(255, 0, 85, 0.45)' : 'rgba(0, 240, 255, 0.4)');
    glowGrad.addColorStop(0.6, isCritical ? 'rgba(255, 0, 127, 0.15)' : 'rgba(168, 85, 247, 0.18)');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(0, 0, maxRadius, 0, Math.PI * 2);
    ctx.fill();

    // 2. Outer Rotating Halo Ring with Starlight Nodes
    ctx.save();
    ctx.rotate(time * 0.8);
    ctx.strokeStyle = isCritical ? 'rgba(255, 0, 85, 0.4)' : 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, 28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    // Orbiting sentinel nodes along outer ring
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const nx = Math.cos(angle) * 28;
      const ny = Math.sin(angle) * 28;
      ctx.fillStyle = tertiaryColor;
      ctx.beginPath();
      ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 3. Multi-Arm Fluid Spinning Spiral (The Spiral of Existence)
    const arms = 3;
    const spinAngle = time * 2.2; // Smooth continuous rotation
    const spiralTurns = 2.4; // Number of revolutions
    const steps = 60; // Smooth curve segments

    for (let a = 0; a < arms; a++) {
      const armOffset = (a * 2 * Math.PI) / arms;
      const armColor = a === 0 ? coreColor : a === 1 ? accentColor : tertiaryColor;

      ctx.save();
      ctx.strokeStyle = armColor;
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.shadowColor = armColor;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      let started = false;
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const theta = t * spiralTurns * 2 * Math.PI;
        // Archimedean spiral: r = a * theta
        const r = 2.5 + t * 24;
        const currentAngle = theta + spinAngle + armOffset;
        const x = Math.cos(currentAngle) * r;
        const y = Math.sin(currentAngle) * r;

        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.restore();
    }

    // 4. Inward-Flowing Ingestion Particles (Energy Sparks drifting into the Vortex)
    const particleCount = 5;
    for (let p = 0; p < particleCount; p++) {
      const pPhase = (time * 1.4 + p / particleCount) % 1;
      const pRadius = (1 - pPhase) * 25 + 3; // spirals inward
      const pAngle = pPhase * 4 * Math.PI + p * ((2 * Math.PI) / particleCount) + spinAngle;
      const px = Math.cos(pAngle) * pRadius;
      const py = Math.sin(pAngle) * pRadius;

      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(px, py, 1.8 * (1 - pPhase * 0.4), 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Central Singularity / Core Eye (The Heart of the Spiral)
    ctx.save();
    ctx.shadowColor = coreColor;
    ctx.shadowBlur = 12;

    // Glowing core outer circle
    ctx.fillStyle = coreColor;
    ctx.beginPath();
    ctx.arc(0, 0, 7 + Math.sin(time * 6) * 1, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright gold core
    ctx.fillStyle = tertiaryColor;
    ctx.beginPath();
    ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Hot center singularity point
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    ctx.restore();
  }

  private renderSockets(ctx: CanvasRenderingContext2D) {
    this.state.map.sockets.forEach((s) => {
      const isOccupied = this.state.placedTowers.some((t) => t.socketId === s.id);
      const isSelected = this.state.selectedSocketId === s.id;

      if (!isOccupied) {
        ctx.save();
        ctx.translate(Math.floor(s.x), Math.floor(s.y));

        const neonCol = isSelected ? '#ffe600' : '#00f0ff';

        // Blocky pixel pad
        ctx.fillStyle = isSelected ? '#251a05' : '#090317';
        ctx.fillRect(-18, -18, 36, 36);

        // Stepped pixel brackets
        ctx.fillStyle = neonCol;
        // Top-left
        ctx.fillRect(-20, -20, 8, 3);
        ctx.fillRect(-20, -20, 3, 8);
        // Top-right
        ctx.fillRect(12, -20, 8, 3);
        ctx.fillRect(17, -20, 3, 8);
        // Bottom-left
        ctx.fillRect(-20, 17, 8, 3);
        ctx.fillRect(-20, 12, 3, 8);
        // Bottom-right
        ctx.fillRect(12, 17, 8, 3);
        ctx.fillRect(17, 12, 3, 8);

        // Center cross
        ctx.fillStyle = isSelected ? '#ffffff' : 'rgba(0, 240, 255, 0.4)';
        ctx.fillRect(-4, -1, 8, 2);
        ctx.fillRect(-1, -4, 2, 8);

        ctx.restore();
      }
    });
  }

  private renderTowers(ctx: CanvasRenderingContext2D) {
    this.state.placedTowers.forEach((tower) => {
      const isSelected = this.state.selectedTowerId === tower.id;
      ctx.save();
      ctx.translate(Math.floor(tower.x), Math.floor(tower.y));

      const towerNeonColors: Record<TowerType, { border: string; core: string; accent: string }> = {
        silent_observatory: { border: '#a855f7', core: '#c084fc', accent: '#e9d5ff' },
        astral_eye: { border: '#6366f1', core: '#818cf8', accent: '#c7d2fe' },
        thought_engine: { border: '#06b6d4', core: '#22d3ee', accent: '#a5f3fc' },
        sanctuary: { border: '#10b981', core: '#34d399', accent: '#a7f3d0' },
        golden_resonator: { border: '#f59e0b', core: '#fbbf24', accent: '#fef08a' },
        solar_crucible: { border: '#f97316', core: '#fb923c', accent: '#ffedd5' },
        material_anchor: { border: '#ef4444', core: '#f87171', accent: '#fecaca' },
      };

      const pal = towerNeonColors[tower.type] || { border: '#00f0ff', core: '#ffffff', accent: '#ffe600' };

      // 1. Blocky Stepped Pixel Pedestal
      ctx.fillStyle = '#060212';
      ctx.fillRect(-18, -18, 36, 36);
      ctx.strokeStyle = isSelected ? '#ffe600' : pal.border;
      ctx.lineWidth = 2;
      ctx.strokeRect(-18, -18, 36, 36);
      ctx.strokeRect(-12, -12, 24, 24);

      // 2. Square LED Tier Indicators (■ ■ ■)
      for (let i = 0; i < 3; i++) {
        const pipX = -10 + i * 8;
        const pipY = 22;
        const isLit = i < tower.tier;
        ctx.fillStyle = isLit ? pal.accent : '#222222';
        ctx.fillRect(pipX, pipY, 6, 4);
        ctx.strokeStyle = isLit ? pal.border : '#444444';
        ctx.lineWidth = 1;
        ctx.strokeRect(pipX, pipY, 6, 4);
      }

      // 3. Rotating Turret Weapon (Blocky Vintage Arcade)
      ctx.rotate(tower.angle);

      switch (tower.type) {
        case 'silent_observatory': // Violet Heavy Laser Telescope
          ctx.fillStyle = pal.core;
          ctx.fillRect(0, -5, 22, 10);
          ctx.fillStyle = pal.border;
          ctx.fillRect(6, -7, 8, 14);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(18, -3, 4, 6);
          break;

        case 'astral_eye': // Indigo Floating Vector Eye
          ctx.fillStyle = pal.core;
          ctx.fillRect(-12, -8, 24, 16);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, -4, 8, 8);
          ctx.fillStyle = pal.border;
          ctx.fillRect(-14, -4, 4, 8);
          ctx.fillRect(10, -4, 4, 8);
          break;

        case 'thought_engine': // Cyan Prism Blaster
          ctx.fillStyle = pal.core;
          ctx.fillRect(-8, -8, 16, 16);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(6, -3, 10, 6);
          ctx.fillStyle = pal.border;
          ctx.fillRect(-10, -4, 4, 8);
          break;

        case 'sanctuary': // Green Resonant Emerald Cross
          ctx.fillStyle = pal.core;
          ctx.fillRect(-4, -14, 8, 28);
          ctx.fillRect(-14, -4, 28, 8);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-3, -3, 6, 6);
          break;

        case 'golden_resonator': // Amber Quad-Laser Gatling
          ctx.fillStyle = pal.core;
          ctx.fillRect(2, -9, 16, 3);
          ctx.fillRect(2, -4, 18, 3);
          ctx.fillRect(2, 2, 18, 3);
          ctx.fillRect(2, 7, 16, 3);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-6, -6, 12, 12);
          break;

        case 'solar_crucible': // Orange Solar Mortar
          ctx.fillStyle = pal.core;
          ctx.fillRect(-9, -9, 18, 18);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(6, -6, 12, 12);
          ctx.fillStyle = pal.border;
          ctx.fillRect(16, -4, 4, 8);
          break;

        case 'material_anchor': // Crimson Cyber Hammer
          ctx.fillStyle = pal.core;
          ctx.fillRect(-8, -8, 16, 16);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(6, -11, 12, 22);
          ctx.fillStyle = pal.border;
          ctx.fillRect(15, -6, 4, 12);
          break;
      }

      ctx.restore();
    });
  }

  private renderSelectionRange(ctx: CanvasRenderingContext2D) {
    if (!this.state.selectedTowerId) return;
    const tower = this.state.placedTowers.find((t) => t.id === this.state.selectedTowerId);
    if (!tower) return;

    const config = TOWERS[tower.type];
    const tierStats = config.tiers[tower.tier - 1];
    const range = tierStats.range;
    const time = this.globalTime;

    ctx.save();
    ctx.translate(Math.floor(tower.x), Math.floor(tower.y));

    // 1. Semi-transparent circular attack zone fill
    ctx.beginPath();
    ctx.arc(0, 0, range, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.fill();

    // 2. Faint concentric inner guide circle (50% range)
    ctx.beginPath();
    ctx.arc(0, 0, range * 0.5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.22)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.stroke();

    // 3. Main attack radius boundary: CIRCLE with animated dash pattern
    ctx.beginPath();
    ctx.arc(0, 0, range, 0, Math.PI * 2);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.lineDashOffset = -time * 24;
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Subtle glowing outer ring
    ctx.beginPath();
    ctx.arc(0, 0, range + 2, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 5. Circle cardinal crosshair ticks at North, East, South, West along the circumference
    ctx.strokeStyle = '#ffe600';
    ctx.lineWidth = 2;
    const tickLen = 8;
    [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5].forEach((angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo((range - tickLen) * cos, (range - tickLen) * sin);
      ctx.lineTo((range + tickLen) * cos, (range + tickLen) * sin);
      ctx.stroke();
    });

    // 6. Range read-out badge (Clear, Bold, and Legible)
    const rangeLabel = `RANGE: ${range}px`;
    ctx.font = 'bold 12px "Chakra Petch", "JetBrains Mono", sans-serif';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeText(rangeLabel, 0, -range - 8);
    ctx.fillStyle = '#ffe600';
    ctx.fillText(rangeLabel, 0, -range - 8);

    ctx.restore();
  }

  private renderEnemies(ctx: CanvasRenderingContext2D) {
    const time = this.globalTime;

    this.enemies.forEach((enemy) => {
      const isHidden = enemy.isCloaked && enemy.revealedTimer <= 0;

      ctx.save();
      ctx.translate(Math.floor(enemy.x), Math.floor(enemy.y));
      ctx.globalAlpha = isHidden ? 0.3 : 1.0;

      const baseCol = enemy.color;

      // Authentic Vintage Arcade Blocky Sprites
      switch (enemy.type) {
        case 'void': {
          // 8-bit Space Invader Crab Sprite
          const spriteVoid = [
            '  XXXX  ',
            ' XXXXXX ',
            'XXOXXOXX',
            'XXXXXXXX',
            ' X XX X ',
            'X X  X X',
          ];
          this.drawPixelSprite(ctx, spriteVoid, 3, baseCol, '#ffffff');
          break;
        }

        case 'false_one': {
          // Dual Shifting Hologram Pixel Ghost
          const jitter = Math.sin(time * 14) > 0 ? 2 : -2;
          const spriteGhost = [
            '  XXXX  ',
            ' XXXXXX ',
            'XOX  XOX',
            'XXXXXXXX',
            'XXXXXXXX',
            'X X  X X',
          ];
          ctx.save();
          ctx.translate(jitter, 0);
          this.drawPixelSprite(ctx, spriteGhost, 3, baseCol, '#00f0ff');
          ctx.restore();
          break;
        }

        case 'stepper': {
          // Fast 8-bit Galaga Arrow Dart
          ctx.save();
          ctx.rotate(enemy.angle);
          const spriteStepper = [
            '   XX   ',
            '  XXXX  ',
            '  XOOX  ',
            ' XXXXXX ',
            'XX XX XX',
            'X  XX  X',
          ];
          this.drawPixelSprite(ctx, spriteStepper, 3, baseCol, '#ffffff');
          // Pixel Thruster flame
          ctx.fillStyle = '#00f0ff';
          ctx.fillRect(-12, -2, 4, 4);
          ctx.restore();
          break;
        }

        case 'materialist': {
          // Heavy Armored 8-bit Tank / Juggernaut
          const spriteTank = [
            '  XXXXXX  ',
            ' XXXXXXXX ',
            'XXOOXXOOXX',
            'XXXXXXXXXX',
            'XXXXXXXXXX',
            'X#XXXXXX#X',
            'XX#XXXX#XX',
            ' XXXXXXXX ',
          ];
          this.drawPixelSprite(ctx, spriteTank, 3.5, baseCol, '#fecaca');
          break;
        }

        case 'agitator': {
          // Pulsating 8-bit Spike Drone
          ctx.save();
          ctx.rotate(time * 3);
          const spriteAgitator = [
            '   XX   ',
            ' X X  X ',
            '  XOOX  ',
            'XXOOOOXX',
            '  XOOX  ',
            ' X X  X ',
            '   XX   ',
          ];
          this.drawPixelSprite(ctx, spriteAgitator, 3, baseCol, '#ffffff');
          ctx.restore();
          break;
        }

        case 'stranger': {
          // Cosmic 4D Glyphic Block
          ctx.save();
          ctx.rotate(time * 1.5);
          const spriteStranger = [
            ' XXXXXX ',
            'XX    XX',
            'X  XX  X',
            'X XOOX X',
            'X  XX  X',
            'XX    XX',
            ' XXXXXX ',
          ];
          this.drawPixelSprite(ctx, spriteStranger, 4, baseCol, '#00f0ff');
          ctx.restore();
          break;
        }

        case 'great_void': {
          // Boss: Monumental 16x10 Blocky Arcade Dreadnought
          ctx.save();
          const spriteBoss = [
            '    XXXXXXXX    ',
            '  XXXXXXXXXXXX  ',
            ' XXXXXX  XXXXXX ',
            'XXXXXOOOOOOXXXXX',
            'XXXXOOOOOOOOXXXX',
            'XXXXXOOOOOOXXXXX',
            ' XXXXXXXXXXXXXX ',
            'XX XX  XX  XX XX',
            'X  X   XX   X  X',
          ];
          this.drawPixelSprite(ctx, spriteBoss, 5, baseCol, '#ffe600');
          ctx.restore();
          break;
        }

        default:
          ctx.fillStyle = baseCol;
          ctx.fillRect(-10, -10, 20, 20);
          break;
      }

      // 1. Selection indicator if enemy is tapped
      if (this.state.selectedEnemyId === enemy.id) {
        ctx.save();
        ctx.strokeStyle = '#ffe600';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(0, 0, enemy.radius + 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Marked indicator (Astral Eye debuff)
      if (enemy.markedDamageBonus > 0) {
        ctx.save();
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, enemy.radius + 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 2. Clear & Segmented Enemy Health Bar + Big Legible Power Badge
      if (!enemy.isBoss) {
        const barW = Math.max(36, Math.floor(enemy.radius * 2.5));
        const barH = 6;
        const barY = -Math.floor(enemy.radius) - 10;
        const hpPercent = Math.max(0, enemy.health / enemy.maxHealth);

        // Solid high-contrast black border & background
        ctx.fillStyle = '#000000';
        ctx.fillRect(-Math.floor(barW / 2) - 1, barY - 1, barW + 2, barH + 2);
        ctx.fillStyle = '#18042b';
        ctx.fillRect(-Math.floor(barW / 2), barY, barW, barH);

        // Segmented chunky pixels
        const totalSegments = 6;
        const filledSegments = Math.ceil(hpPercent * totalSegments);
        const segW = Math.max(3, Math.floor((barW - (totalSegments - 1)) / totalSegments));
        const hpColor = hpPercent > 0.5 ? '#39ff14' : hpPercent > 0.25 ? '#ffe600' : '#ff0055';

        for (let s = 0; s < totalSegments; s++) {
          if (s < filledSegments) {
            ctx.fillStyle = hpColor;
            ctx.fillRect(-Math.floor(barW / 2) + s * (segW + 1), barY, segW, barH);
          }
        }

        // BIGGER & HIGHLY LEGIBLE ENEMY POWER / HEALTH TEXT
        const currentHp = Math.ceil(enemy.health);
        const powerText = enemy.armor > 0
          ? `${currentHp} [${Math.round(enemy.armor * 100)}%🛡]`
          : `${currentHp}`;

        ctx.font = 'bold 12px "Chakra Petch", "JetBrains Mono", "Segoe UI", sans-serif';
        ctx.textAlign = 'center';

        const textMetrics = ctx.measureText(powerText);
        const badgeW = Math.max(barW, Math.ceil(textMetrics.width) + 8);
        const badgeH = 15;
        const badgeY = barY - badgeH - 3;

        // Dark pill background plate for instant legibility
        ctx.fillStyle = 'rgba(5, 1, 18, 0.94)';
        ctx.fillRect(-Math.floor(badgeW / 2), badgeY, badgeW, badgeH);
        ctx.strokeStyle = this.state.selectedEnemyId === enemy.id
          ? '#ffe600'
          : enemy.armor > 0
          ? '#f87171'
          : 'rgba(0, 240, 255, 0.7)';
        ctx.lineWidth = 1;
        ctx.strokeRect(-Math.floor(badgeW / 2), badgeY, badgeW, badgeH);

        // Power number with 3px black stroke for high contrast
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2.5;
        ctx.strokeText(powerText, 0, badgeY + badgeH - 3);

        ctx.fillStyle = enemy.armor > 0 ? '#fca5a5' : '#38bdf8';
        ctx.fillText(powerText, 0, badgeY + badgeH - 3);
      } else {
        // Boss on-field power indicator
        const bossPowerBadge = `BOSS: ${Math.ceil(enemy.health)} HP`;
        ctx.font = 'bold 13px "Chakra Petch", "JetBrains Mono", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(6, 2, 16, 0.95)';
        ctx.fillRect(-65, -enemy.radius - 28, 130, 18);
        ctx.strokeStyle = '#ff007f';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-65, -enemy.radius - 28, 130, 18);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeText(bossPowerBadge, 0, -enemy.radius - 14);
        ctx.fillStyle = '#ffe600';
        ctx.fillText(bossPowerBadge, 0, -enemy.radius - 14);
      }

      ctx.restore();
    });

    // 3. Boss Health Bar (Top of Canvas) with Arcade Warning Aesthetic & Big Legible Power
    const boss = this.enemies.find((e) => e.isBoss);
    if (boss) {
      const barW = 460;
      const barH = 16;
      const startX = 500 - barW / 2;
      const startY = 40;
      const hpRatio = Math.max(0, boss.health / boss.maxHealth);

      ctx.save();
      // Arcade Boss Cabinet Header
      ctx.fillStyle = 'rgba(6, 2, 16, 0.95)';
      ctx.fillRect(startX - 12, startY - 26, barW + 24, barH + 46);

      ctx.strokeStyle = '#ff007f';
      ctx.lineWidth = 2;
      ctx.strokeRect(startX - 12, startY - 26, barW + 24, barH + 46);

      // Warning Title (Bold Legible Font)
      ctx.fillStyle = '#ffe600';
      ctx.font = 'bold 12px "Press Start 2P", "Chakra Petch", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`▲ WARNING: THE GREAT VOID [PHASE ${boss.phase || 1}] ▲`, 500, startY - 8);

      // Outer Health Bar Border
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(startX, startY, barW, barH);
      ctx.fillStyle = '#120428';
      ctx.fillRect(startX, startY, barW, barH);

      // Stepped segments / smooth fill
      const grad = ctx.createLinearGradient(startX, 0, startX + barW, 0);
      grad.addColorStop(0, '#ff007f');
      grad.addColorStop(1, '#ff0055');
      ctx.fillStyle = grad;
      ctx.fillRect(startX + 1, startY + 1, Math.max(0, (barW - 2) * hpRatio), barH - 2);

      // Prominent, Highly Legible Boss Power Text
      const bossPowerText = `POWER: ${Math.ceil(boss.health)} / ${boss.maxHealth} HP (${Math.round(hpRatio * 100)}%)`;
      ctx.font = 'bold 12px "Chakra Petch", "JetBrains Mono", sans-serif';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText(bossPowerText, 500, startY + barH + 13);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(bossPowerText, 500, startY + barH + 13);

      ctx.restore();
    }
  }

  private renderProjectiles(ctx: CanvasRenderingContext2D) {
    this.projectiles.forEach((p) => {
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;

      // Blocky square pixel projectile
      const px = Math.floor(p.x);
      const py = Math.floor(p.y);
      const size = Math.max(4, Math.floor(p.radius * 2));
      ctx.fillRect(px - Math.floor(size / 2), py - Math.floor(size / 2), size, size);
      ctx.strokeRect(px - Math.floor(size / 2), py - Math.floor(size / 2), size, size);

      // Trailing square pixel spark
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px - 1, py - 1, 3, 3);

      ctx.restore();
    });
  }

  private renderParticles(ctx: CanvasRenderingContext2D) {
    this.particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.strokeStyle = p.color;

      // Check if this particle is a laser beam line
      if (p.shape === 'spark' && p.vx !== 0 && p.vy !== 0 && Math.abs(p.vx) > 10 && Math.abs(p.vy) > 10) {
        ctx.lineWidth = Math.max(3, Math.floor(p.size));
        ctx.lineCap = 'butt';
        ctx.beginPath();
        ctx.moveTo(Math.floor(p.x), Math.floor(p.y));
        ctx.lineTo(Math.floor(p.vx), Math.floor(p.vy));
        ctx.stroke();
      } else {
        // Chunky square pixel spark
        const sz = Math.max(2, Math.floor(p.size));
        ctx.fillRect(Math.floor(p.x - sz / 2), Math.floor(p.y - sz / 2), sz, sz);
      }

      ctx.restore();
    });
  }

  private renderFloatingTexts(ctx: CanvasRenderingContext2D) {
    this.floatingTexts.forEach((ft) => {
      ctx.save();
      ctx.globalAlpha = ft.alpha;
      const fx = Math.floor(ft.x);
      const fy = Math.floor(ft.y);
      // Large, bold, highly legible font for damage and status
      ctx.font = 'bold 13px "Chakra Petch", "JetBrains Mono", sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText(ft.text, fx, fy);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, fx, fy);
      ctx.restore();
    });
  }
}
