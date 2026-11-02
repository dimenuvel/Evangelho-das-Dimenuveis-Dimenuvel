import React, { useState } from 'react';
import {
  Play,
  Pause,
  FastForward,
  Sparkles,
  ArrowUpCircle,
  Trash2,
  Zap,
  Menu,
  Clock,
  Flame,
  Activity,
  Maximize2,
  Shield,
  Crosshair,
} from 'lucide-react';
import { GameEngine, GameEngineState } from '../game/GameEngine';
import { TOWERS } from '../data/towers';
import { DIMENUVEL_LAYERS, ResonancePower, SupportedLanguage, TowerType } from '../types/game';
import { TRANSLATIONS } from '../i18n/translations';

interface GameHUDProps {
  engine: GameEngine;
  state: GameEngineState;
  language: SupportedLanguage;
  onExit: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  engine,
  state,
  language,
  onExit,
}) => {
  const [showResonancePowers, setShowResonancePowers] = useState(false);
  const t = TRANSLATIONS[language];
  const isPt = language === 'pt';

  const selectedTower = state.placedTowers.find((t) => t.id === state.selectedTowerId);
  const selectedSocket = state.map.sockets.find((s) => s.id === state.selectedSocketId);

  // Tower configs list for building
  const towerTypes: TowerType[] = [
    'silent_observatory',
    'astral_eye',
    'thought_engine',
    'sanctuary',
    'golden_resonator',
    'solar_crucible',
    'material_anchor',
  ];

  const towerNamesPt: Record<TowerType, string> = {
    silent_observatory: 'Observatório Silencioso',
    astral_eye: 'Olho Astral',
    thought_engine: 'Motor do Pensamento',
    sanctuary: 'Santuário',
    golden_resonator: 'Ressonador Dourado',
    solar_crucible: 'Crisol Solar',
    material_anchor: 'Âncora Material',
  };

  const abilityNamesPt: Record<TowerType, string> = {
    silent_observatory: 'Raio da Quietude',
    astral_eye: 'Olhar Onipresente',
    thought_engine: 'Sobrecarga Sináptica',
    sanctuary: 'Pulso Harmônico',
    golden_resonator: 'Tempestade da Vontade',
    solar_crucible: 'Erupção Solar',
    material_anchor: 'Poço Gravitacional',
  };

  const layerNamesPt: Record<string, string> = {
    silence: 'SILÊNCIO',
    vision: 'VISÃO',
    mind: 'MENTE',
    heart: 'CORAÇÃO',
    will: 'VONTADE',
    energy: 'ENERGIA',
    matter: 'MATÉRIA',
  };

  const handleBuild = (type: TowerType) => {
    if (state.selectedSocketId) {
      engine.buildTower(state.selectedSocketId, type);
    }
  };

  const handleUpgrade = () => {
    if (state.selectedTowerId) {
      engine.upgradeTower(state.selectedTowerId);
    }
  };

  const handleDismantle = () => {
    if (state.selectedTowerId) {
      engine.dismantleTower(state.selectedTowerId);
    }
  };

  const handleActivateAbility = () => {
    if (state.selectedTowerId) {
      engine.activateTowerAbility(state.selectedTowerId);
    }
  };

  const handleResonance = (power: ResonancePower) => {
    engine.activateSpiralResonance(power);
    setShowResonancePowers(false);
  };

  const equilColor =
    state.equilibrium > 65
      ? 'text-[#39ff14]'
      : state.equilibrium > 30
      ? 'text-[#ffe600]'
      : 'text-[#ff0055]';

  const equilBg =
    state.equilibrium > 65
      ? 'bg-[#39ff14]'
      : state.equilibrium > 30
      ? 'bg-[#ffe600]'
      : 'bg-[#ff0055]';

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2 sm:p-3 select-none z-30">
      {/* TOP RETRO ARCADE STATUS DASHBOARD */}
      <div className="w-full flex flex-wrap md:flex-nowrap landscape:flex-nowrap items-center justify-between gap-1.5 sm:gap-2 md:gap-3 pointer-events-auto bg-[#070114]/95 border border-cyan-500/50 rounded-lg px-2 sm:px-3 py-1.5 shadow-[0_0_15px_rgba(0,240,255,0.2)] backdrop-blur-md">
        {/* Left: Menu Exit, Credits/Essence, Wave, Score */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 order-1 shrink-0">
          <button
            onClick={onExit}
            className="p-1 sm:p-1.5 bg-[#12042b] hover:bg-[#20084d] border border-cyan-400/50 rounded text-cyan-300 hover:text-white transition-all active:scale-95 shadow shrink-0"
            title={t.exitToMenu}
          >
            <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Credits / Essence */}
          <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#0e0324] border border-yellow-400/50 rounded shadow-[0_0_8px_rgba(255,230,0,0.2)] shrink-0 whitespace-nowrap">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400 animate-pulse shrink-0" />
            <span className="text-[10px] sm:text-xs font-arcade font-bold text-yellow-300">
              {state.essence}
            </span>
            <span className="text-[9px] font-arcade text-yellow-400/70 hidden md:inline ml-0.5">
              {isPt ? 'CRÉDITOS' : 'CREDITS'}
            </span>
          </div>

          {/* Wave Badge */}
          <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#0e0324] border border-pink-500/50 rounded shadow-[0_0_8px_rgba(255,0,127,0.2)] shrink-0 whitespace-nowrap">
            <span className="text-[8px] sm:text-[9px] font-arcade text-pink-400">{isPt ? 'ONDA' : 'WAVE'}</span>
            <span className="text-[10px] sm:text-xs font-arcade font-bold text-white">
              {(state.currentWaveIndex + 1).toString().padStart(2, '0')}
              <span className="text-[8px] sm:text-[9px] text-slate-500">/{state.totalWaves.toString().padStart(2, '0')}</span>
            </span>
          </div>

          {/* Score Counter */}
          <div className="hidden lg:flex items-center gap-1 px-2 py-1 bg-[#0e0324] border border-cyan-500/40 rounded shrink-0 whitespace-nowrap">
            <span className="text-[9px] font-arcade text-cyan-400">{isPt ? 'PTS' : 'SCORE'}</span>
            <span className="text-xs font-arcade text-cyan-200">
              {state.score.toString().padStart(6, '0')}
            </span>
          </div>
        </div>

        {/* Right: Resonance Super Combo, Speed Toggles, Pause */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 order-2 md:order-3 landscape:order-3 shrink-0">
          {/* Super Resonance Button */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowResonancePowers(!showResonancePowers)}
              disabled={state.spiralResonance < 100}
              className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded border text-[8px] sm:text-[10px] font-arcade font-bold shadow-lg transition-all active:scale-95 whitespace-nowrap shrink-0 ${
                state.spiralResonance >= 100
                  ? 'bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 text-slate-950 border-white shadow-[0_0_15px_rgba(255,230,0,0.8)] animate-pulse'
                  : 'bg-[#12042b] text-cyan-400/60 border-cyan-500/20 opacity-70'
              }`}
            >
              <Zap className="w-3 h-3 fill-current shrink-0" />
              <span className="hidden xl:inline">{isPt ? 'RESSONÂNCIA' : 'RESONANCE'}</span>
              <span className="font-arcade text-[8px] sm:text-[10px]">
                {Math.round(state.spiralResonance)}%
              </span>
            </button>

            {/* Resonance Decrees Dropdown */}
            {showResonancePowers && state.spiralResonance >= 100 && (
              <div className="absolute right-0 top-10 sm:top-11 w-64 bg-[#0a021c] border-2 border-yellow-400 rounded-lg p-2 shadow-2xl z-50 space-y-1.5">
                <span className="text-[9px] font-arcade font-bold text-yellow-300 px-1 py-0.5 block uppercase border-b border-yellow-400/30 pb-1 whitespace-nowrap">
                  ▲ {t.invokeDecree} ▲
                </span>
                <button
                  onClick={() => handleResonance('temporal_stillness')}
                  className="w-full text-left p-1.5 rounded hover:bg-cyan-950/60 border border-transparent hover:border-cyan-400 flex items-center gap-2 transition-colors"
                >
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-[10px] font-arcade font-bold text-cyan-200 whitespace-nowrap">
                      {t.temporalStillness}
                    </div>
                    <div className="text-[9px] font-tech text-slate-400">{t.temporalStillnessDesc}</div>
                  </div>
                </button>
                <button
                  onClick={() => handleResonance('golden_spiral')}
                  className="w-full text-left p-1.5 rounded hover:bg-yellow-950/60 border border-transparent hover:border-yellow-400 flex items-center gap-2 transition-colors"
                >
                  <Maximize2 className="w-4 h-4 text-yellow-400 shrink-0" />
                  <div>
                    <div className="text-[10px] font-arcade font-bold text-yellow-200 whitespace-nowrap">
                      {t.goldenSpiral}
                    </div>
                    <div className="text-[9px] font-tech text-slate-400">{t.goldenSpiralDesc}</div>
                  </div>
                </button>
                <button
                  onClick={() => handleResonance('silent_presence')}
                  className="w-full text-left p-1.5 rounded hover:bg-green-950/60 border border-transparent hover:border-green-400 flex items-center gap-2 transition-colors"
                >
                  <Activity className="w-4 h-4 text-green-400 shrink-0" />
                  <div>
                    <div className="text-[10px] font-arcade font-bold text-green-200 whitespace-nowrap">
                      {t.silentPresence}
                    </div>
                    <div className="text-[9px] font-tech text-slate-400">{t.silentPresenceDesc}</div>
                  </div>
                </button>
                <button
                  onClick={() => handleResonance('cosmic_reset')}
                  className="w-full text-left p-1.5 rounded hover:bg-pink-950/60 border border-transparent hover:border-pink-400 flex items-center gap-2 transition-colors"
                >
                  <Flame className="w-4 h-4 text-pink-400 shrink-0" />
                  <div>
                    <div className="text-[10px] font-arcade font-bold text-pink-200 whitespace-nowrap">{t.cosmicReset}</div>
                    <div className="text-[9px] font-tech text-slate-400">{t.cosmicResetDesc}</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Speed Toggles (1X / 2X / 3X Arcade LED Buttons) */}
          <div className="flex bg-[#12042b] border border-cyan-500/40 rounded p-0.5 shadow shrink-0">
            {[1, 2, 3].map((sp) => (
              <button
                key={sp}
                onClick={() => engine.setGameSpeed(sp)}
                className={`px-1 sm:px-1.5 py-0.5 text-[8px] sm:text-[9px] font-arcade rounded transition-all whitespace-nowrap ${
                  state.gameSpeed === sp
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sp}X
              </button>
            ))}
          </div>

          {/* Pause / Resume */}
          <button
            onClick={() => engine.togglePause()}
            className="p-1 sm:p-1.5 bg-[#12042b] hover:bg-[#20084d] border border-cyan-500/40 rounded text-cyan-300 hover:text-white transition-all active:scale-95 shadow shrink-0 flex items-center justify-center"
            title={state.isPaused ? (isPt ? 'Continuar' : 'Resume') : (isPt ? 'Pausar' : 'Pause')}
          >
            {state.isPaused ? <Play className="w-3.5 h-3.5 text-yellow-400" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Center / Row 2: Equilibrium Core Health Meter */}
        <div className="w-full md:w-48 lg:w-56 landscape:w-44 landscape:md:w-52 order-3 md:order-2 landscape:order-2 shrink-0 md:shrink pt-1 md:pt-0 landscape:pt-0 border-t border-cyan-500/20 md:border-t-0 landscape:border-t-0 flex flex-col items-center">
          <div className="flex items-center justify-between w-full text-[8px] sm:text-[9px] font-arcade font-bold mb-0.5 sm:mb-1 whitespace-nowrap">
            <span className="text-cyan-300 tracking-wider flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400 shrink-0" />
              <span>{isPt ? 'EQUILÍBRIO' : 'EQUILIBRIUM'}</span>
            </span>
            <span className={`font-arcade ${equilColor} ml-1`}>
              {Math.min(100, Math.max(0, Math.round(state.equilibrium)))}%
            </span>
          </div>
          <div className="w-full h-2 sm:h-2.5 bg-[#03000a] rounded-full border border-cyan-400/90 p-0.5 overflow-hidden flex items-center shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-300 ${equilBg}`}
              style={{ width: `${Math.min(100, Math.max(0, state.equilibrium))}%` }}
            />
          </div>
        </div>
      </div>

      {/* BOTTOM RETRO ARCADE DOCK: TOWER DEPLOYMENT & INSPECTOR */}
      <div className="w-full flex flex-col-reverse sm:flex-row items-stretch sm:items-end justify-between gap-2 sm:gap-3 pointer-events-auto">
        {/* Left: Wave Summon Button */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          {!state.isWaveActive && (
            <button
              onClick={() => engine.startNextWave()}
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-pink-500 hover:from-yellow-300 hover:to-pink-400 text-slate-950 font-arcade font-bold text-[9px] sm:text-[10px] rounded border border-yellow-200 shadow-[0_0_15px_rgba(255,230,0,0.6)] transition-all flex items-center gap-2 active:scale-95 animate-pulse whitespace-nowrap shrink-0"
            >
              <FastForward className="w-3.5 h-3.5 fill-current shrink-0" />
              <span className="whitespace-nowrap">
                {state.currentWaveIndex === 0
                  ? (isPt ? 'INICIAR ONDA 01' : 'INITIATE WAVE 01')
                  : (isPt ? `CHAMAR ONDA ${(state.currentWaveIndex + 1).toString().padStart(2, '0')}` : `SUMMON WAVE ${(state.currentWaveIndex + 1).toString().padStart(2, '0')}`)}
              </span>
            </button>
          )}
        </div>

        {/* Center / Right: Dynamic Dock depending on selection */}
        {selectedTower ? (
          // INSPECT / UPGRADE / DISMANTLE EXISTING TOWER (ARCADE DATASHEET - SINGLE LINE)
          <div className="bg-[#09021a]/95 border-2 border-cyan-400 rounded-lg p-2 sm:p-2.5 shadow-[0_0_20px_rgba(0,240,255,0.3)] backdrop-blur-md flex items-center gap-2 sm:gap-3 max-w-full overflow-x-auto">
            {/* Tower icon & name */}
            <div className="flex items-center gap-2 pr-2 border-r border-cyan-500/30 shrink-0">
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded flex items-center justify-center text-sm sm:text-base font-bold shadow-inner shrink-0"
                style={{
                  backgroundColor: `${DIMENUVEL_LAYERS[TOWERS[selectedTower.type].layer].hex}25`,
                  color: DIMENUVEL_LAYERS[TOWERS[selectedTower.type].layer].hex,
                  border: `2px solid ${DIMENUVEL_LAYERS[TOWERS[selectedTower.type].layer].hex}`,
                }}
              >
                {TOWERS[selectedTower.type].symbol}
              </div>
              <div className="whitespace-nowrap">
                <div className="text-[9px] sm:text-[10px] font-arcade font-bold text-white flex items-center gap-1.5 whitespace-nowrap">
                  <span>{isPt ? towerNamesPt[selectedTower.type] : TOWERS[selectedTower.type].name}</span>
                  <span className="text-[8px] sm:text-[9px] font-arcade px-1 py-0.2 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-400/50">
                    T{selectedTower.tier}
                  </span>
                </div>
                <div className="text-[9px] font-tech text-slate-400 whitespace-nowrap">
                  {t.kills}: {selectedTower.kills} · {t.damageDealt}: {selectedTower.totalDamageDealt.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Action buttons (Single Line) */}
            <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
              {/* Upgrade Button */}
              {selectedTower.tier < 3 && TOWERS[selectedTower.type].tiers[selectedTower.tier as 1 | 2] ? (
                <button
                  onClick={handleUpgrade}
                  disabled={
                    state.essence < TOWERS[selectedTower.type].tiers[selectedTower.tier as 1 | 2].cost
                  }
                  className="px-2.5 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 disabled:pointer-events-none text-white rounded text-[8px] sm:text-[9px] font-arcade font-bold flex items-center gap-1 shadow-md active:scale-95 transition-all border border-cyan-300 whitespace-nowrap shrink-0"
                >
                  <ArrowUpCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {isPt ? 'MELHORAR' : 'UPGRADE'} ({TOWERS[selectedTower.type].tiers[selectedTower.tier as 1 | 2].cost})
                  </span>
                </button>
              ) : (
                <div className="px-2 py-1.5 bg-white/5 border border-yellow-400/40 rounded text-yellow-300 text-[8px] sm:text-[9px] font-arcade whitespace-nowrap shrink-0">
                  {isPt ? 'NÍVEL MÁX' : 'MAX LEVEL'}
                </div>
              )}

              {/* Active Ability */}
              <button
                onClick={handleActivateAbility}
                disabled={selectedTower.abilityCooldownRemaining > 0}
                className="px-2.5 py-1.5 bg-pink-600/30 hover:bg-pink-600/50 border border-pink-400 disabled:opacity-40 disabled:pointer-events-none text-pink-300 rounded text-[8px] sm:text-[9px] font-arcade font-bold flex items-center gap-1 shadow-md active:scale-95 transition-all whitespace-nowrap shrink-0"
              >
                <Zap className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <span>
                  {selectedTower.abilityCooldownRemaining > 0
                    ? `${Math.ceil(selectedTower.abilityCooldownRemaining)}s`
                    : isPt
                    ? abilityNamesPt[selectedTower.type]
                    : TOWERS[selectedTower.type].activeAbilityName}
                </span>
              </button>

              {/* Dismantle Button */}
              <button
                onClick={handleDismantle}
                className="p-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-500/50 text-rose-300 rounded text-[9px] transition-all active:scale-95 shrink-0"
                title={t.dismantle}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : selectedSocket ? (
          // BUILD NEW TOWER TRAY (ARCADE WEAPON SLOTS - FULL LABELS WITHOUT TRUNCATION)
          <div className="bg-[#09021a]/95 border-2 border-yellow-400 rounded-lg p-1.5 sm:p-2 shadow-[0_0_20px_rgba(255,230,0,0.3)] backdrop-blur-md flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full">
            <span className="text-[9px] font-arcade uppercase text-yellow-300 px-1 shrink-0 whitespace-nowrap">
              {isPt ? 'CRIAR:' : 'DEPLOY:'}
            </span>
            {towerTypes.map((type, idx) => {
              const cfg = TOWERS[type];
              const layer = DIMENUVEL_LAYERS[cfg.layer];
              const canAfford = state.essence >= cfg.baseCost;
              const displayName = isPt ? (layerNamesPt[cfg.layer] || layer.name) : layer.name;

              return (
                <button
                  key={type}
                  onClick={() => handleBuild(type)}
                  disabled={!canAfford}
                  className={`flex flex-col items-center px-2 py-1.5 rounded border transition-all shrink-0 active:scale-95 min-w-[72px] sm:min-w-[80px] ${
                    canAfford
                      ? 'bg-[#150530] hover:bg-[#250a50] border-cyan-400 hover:border-yellow-300 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                      : 'bg-[#0d0320]/60 border-purple-900/40 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between w-full text-[8px] font-arcade text-slate-500 px-0.5">
                    <span>#{idx + 1}</span>
                  </div>
                  <span className="text-sm font-bold my-0.5" style={{ color: layer.hex }}>
                    {cfg.symbol}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-arcade font-bold text-slate-200 whitespace-nowrap">
                    {displayName}
                  </span>
                  <span className="text-[9px] font-arcade text-yellow-300 whitespace-nowrap">
                    {cfg.baseCost}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          // IDLE RETRO MARQUEE HINT (SINGLE LINE)
          <div className="px-3 py-1 bg-[#09021a]/90 border border-cyan-500/30 rounded text-[8px] sm:text-[9px] font-arcade text-cyan-300/80 shadow backdrop-blur-sm hidden sm:block whitespace-nowrap">
            {isPt
              ? '▲ TOQUE NO SOQUETE PARA CONSTRUIR · TOQUE NA TORRE PARA APRIMORAR ▲'
              : '▲ TAP SOCKET TO DEPLOY WEAPON · TAP TOWER TO UPGRADE ▲'}
          </div>
        )}
      </div>
    </div>
  );
};

