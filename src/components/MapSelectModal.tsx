import React from 'react';
import { motion } from 'motion/react';
import { X, Star, Lock, Play, Compass } from 'lucide-react';
import { MAPS } from '../data/maps';
import { DIMENUVEL_LAYERS, GameMap, GameMode, PlayerProgress, SupportedLanguage } from '../types/game';
import { TRANSLATIONS } from '../i18n/translations';

interface MapSelectModalProps {
  progress: PlayerProgress;
  mode: GameMode;
  language: SupportedLanguage;
  onSelectMap: (map: GameMap) => void;
  onClose: () => void;
}

export const MapSelectModal: React.FC<MapSelectModalProps> = ({
  progress,
  mode,
  language,
  onSelectMap,
  onClose,
}) => {
  const t = TRANSLATIONS[language];
  const isPt = language === 'pt';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-4xl h-[90vh] max-h-[680px] bg-[#070114] border-2 border-cyan-400 rounded-lg shadow-[0_0_30px_rgba(0,240,255,0.3)] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b-2 border-cyan-500/40 bg-[#0f0326] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#160438] border border-cyan-400 flex items-center justify-center text-cyan-300 shadow">
              <Compass className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-pink-400 font-arcade block">
                {mode === 'campaign' ? '★ CAMPAIGN ODYSSEY ★' : '▲ FINAL ABIDERS CHALLENGE ▲'}
              </span>
              <h2 className="text-sm sm:text-base font-arcade font-bold text-yellow-300 pt-0.5">
                {isPt ? 'SELECIONE A CAMADA' : 'SELECT STRATUM STAGE'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Grid */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 bg-[#090218]">
          {MAPS.map((map, index) => {
            const layer = DIMENUVEL_LAYERS[map.layer];
            const isUnlocked =
              mode === 'final_abiders'
                ? true
                : progress.unlockedMaps.includes(map.id) || index === 0;
            const stars = progress.mapStars[map.id] || 0;
            const highScore = progress.mapHighScores[map.id] || 0;

            // Translated stratum names
            const stratumNamesPt: Record<string, string> = {
              silence_observatory: 'O Observatório Silencioso',
              astral_garden: 'O Jardim Astral',
              labyrinth_mind: 'O Labirinto da Mente',
              heart_sanctuary: 'O Santuário do Coração',
              golden_forge: 'A Forja Dourada',
              energy_crucible: 'O Crisol de Energia',
              material_realm: 'O Reino Material: O Último Bastião',
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

            const mapTitle = isPt ? (stratumNamesPt[map.id] || map.name) : map.name;
            const layerLabel = isPt ? (layerNamesPt[map.layer] || layer.name) : layer.name;

            return (
              <div
                key={map.id}
                className={`flex flex-col justify-between p-3.5 rounded border transition-all ${
                  isUnlocked
                    ? 'bg-[#12042b]/95 border-cyan-500/40 hover:border-yellow-300 hover:shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                    : 'bg-[#090216]/60 border-purple-900/30 opacity-50'
                }`}
              >
                <div>
                  {/* Top layer badge & difficulty */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[9px] font-arcade uppercase tracking-wider font-bold px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: `${layer.hex}25`,
                        color: layer.hex,
                        border: `1px solid ${layer.hex}`,
                      }}
                    >
                      {layerLabel}
                    </span>
                    <span className="text-[9px] text-yellow-300 font-arcade">
                      STAGE 0{index + 1}
                    </span>
                  </div>

                  {/* Title & subtitle */}
                  <h3 className="text-xs sm:text-sm font-arcade font-bold text-white mb-1.5 leading-snug">
                    {mapTitle}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-3 font-tech">
                    {map.lore}
                  </p>
                </div>

                <div>
                  {/* Stars and score */}
                  {isUnlocked && (
                    <div className="flex items-center justify-between pt-2 border-t border-cyan-500/20 mb-2.5 text-xs">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map((starNum) => (
                          <Star
                            key={starNum}
                            className={`w-3.5 h-3.5 ${
                              starNum <= stars
                                ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_6px_rgba(255,230,0,0.8)]'
                                : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                      {highScore > 0 && (
                        <span className="text-[9px] font-arcade text-cyan-300">
                          HI: {highScore.toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action button */}
                  {isUnlocked ? (
                    <button
                      onClick={() => onSelectMap(map)}
                      className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-arcade font-bold text-[9px] rounded border border-cyan-300 shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 whitespace-nowrap"
                    >
                      <Play className="w-3 h-3 fill-current shrink-0" />
                      <span className="whitespace-nowrap">{t.defendStratum}</span>
                    </button>
                  ) : (
                    <div className="py-2 flex items-center justify-center gap-2 text-[9px] text-slate-500 font-arcade bg-white/5 rounded border border-white/5 whitespace-nowrap">
                      <Lock className="w-3 h-3 shrink-0" />
                      <span className="whitespace-nowrap">{t.completePrior}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

