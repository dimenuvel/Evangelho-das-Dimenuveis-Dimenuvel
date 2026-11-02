import React from 'react';
import { motion } from 'motion/react';
import { Star, RotateCcw, ArrowRight, Menu, ShieldAlert, Sparkles, Trophy, Crown } from 'lucide-react';
import { GameMap, SupportedLanguage } from '../types/game';
import { TRANSLATIONS } from '../i18n/translations';

interface VictoryDefeatModalProps {
  isVictory: boolean;
  map: GameMap;
  stars: number;
  score: number;
  equilibrium: number;
  language: SupportedLanguage;
  onNextMap?: () => void;
  onRetry: () => void;
  onMenu: () => void;
  onViewCredits?: () => void;
}

export const VictoryDefeatModal: React.FC<VictoryDefeatModalProps> = ({
  isVictory,
  map,
  stars,
  score,
  equilibrium,
  language,
  onNextMap,
  onRetry,
  onMenu,
  onViewCredits,
}) => {
  const t = TRANSLATIONS[language];
  const isPt = language === 'pt';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className={`w-full max-w-md bg-[#090218] border-2 rounded-lg p-5 shadow-2xl relative overflow-hidden ${
          isVictory
            ? 'border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.35)]'
            : 'border-pink-500 shadow-[0_0_30px_rgba(255,0,127,0.35)]'
        }`}
      >
        {/* Retro Header Sheen */}
        <div
          className={`absolute -top-20 -left-20 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-40 ${
            isVictory ? 'bg-cyan-500' : 'bg-pink-600'
          }`}
        />

        {/* Content */}
        <div className="text-center space-y-3.5 relative z-10">
          {isVictory ? (
            <>
              {/* Arcade Stage Clear Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#10032b] border border-yellow-400 text-yellow-300 font-arcade text-[10px] tracking-wider animate-pulse">
                <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                <span>★ STAGE CLEAR! ★</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-arcade font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-pink-400 drop-shadow-[0_0_12px_rgba(0,240,255,0.7)]">
                {isPt ? 'CAMADA HARMONIZADA' : 'STRATUM HARMONIZED'}
              </h2>

              <p className="text-xs text-slate-300 font-tech italic">"{map.dudeOutro}"</p>

              {/* Stars (Arcade Vector Rank) */}
              <div className="flex items-center justify-center gap-2.5 py-2">
                {[1, 2, 3].map((starNum) => (
                  <Star
                    key={starNum}
                    className={`w-7 h-7 ${
                      starNum <= stars
                        ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(255,230,0,0.8)]'
                        : 'text-slate-800'
                    }`}
                  />
                ))}
              </div>

              {/* Stats Box (Arcade High Score Grid) */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-[#0e0324] border border-cyan-500/40 rounded text-center">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-cyan-400 font-arcade">
                    {t.equilibrium}
                  </span>
                  <div className="text-sm font-arcade font-bold text-[#39ff14] pt-0.5">
                    {Math.round(equilibrium)}%
                  </div>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-yellow-400 font-arcade">
                    {t.score}
                  </span>
                  <div className="text-sm font-arcade font-bold text-yellow-300 pt-0.5">
                    {score.toLocaleString()}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Arcade Game Over Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#10032b] border border-pink-500 text-pink-400 font-arcade text-[10px] tracking-wider animate-pulse">
                <ShieldAlert className="w-3.5 h-3.5 text-pink-500" />
                <span>▲ GAME OVER ▲</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-arcade font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-white to-red-500 drop-shadow-[0_0_12px_rgba(255,0,127,0.7)]">
                {isPt ? 'EQUILÍBRIO PERDIDO' : 'EQUILIBRIUM LOST'}
              </h2>

              <p className="text-xs text-slate-300 font-tech italic">
                {isPt
                  ? `"Cara, o universo já é complicado o bastante. Sacuda a poeira e realinhe as suas torres. A Espiral abida." — ${t.gospelName}`
                  : `"Man, the universe is complicated enough. Shake off the dust and realign your towers. The Spiral abides." — ${t.gospelName}`}
              </p>

              <div className="p-2.5 bg-[#120326] border border-pink-500/30 rounded text-[11px] font-tech text-slate-400">
                {t.defeatTip}
              </div>
            </>
          )}

          {/* Final Stratum Victory Banner */}
          {isVictory && !onNextMap && (
            <div className="p-2 bg-yellow-400/15 border border-yellow-400/60 rounded text-[9px] font-arcade text-yellow-300 animate-pulse flex items-center justify-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span className="whitespace-nowrap">{t.theSpiralSaved}</span>
            </div>
          )}

          {/* Action Buttons (Arcade Tactile Controls - Single Line) */}
          <div className="flex flex-col gap-2 pt-1">
            {isVictory && onViewCredits && (
              <button
                onClick={onViewCredits}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 hover:from-yellow-300 hover:to-amber-200 text-slate-950 font-arcade font-bold text-[10px] rounded border border-yellow-200 shadow-[0_0_20px_rgba(255,230,0,0.5)] transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap animate-pulse"
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0 text-slate-950" />
                <span className="whitespace-nowrap">{t.rollCredits}</span>
                <Sparkles className="w-3.5 h-3.5 shrink-0 text-slate-950" />
              </button>
            )}

            {isVictory && onNextMap && (
              <button
                onClick={onNextMap}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-arcade font-bold text-[10px] rounded border border-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
              >
                <span className="whitespace-nowrap">{t.ascendNext}</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            )}

            <button
              onClick={onRetry}
              className="w-full py-2.5 bg-[#150530] hover:bg-[#250a50] text-yellow-300 border border-yellow-400/60 rounded font-arcade text-[10px] transition-all flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_10px_rgba(255,230,0,0.2)] whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">{t.retryStratum}</span>
            </button>

            <button
              onClick={onMenu}
              className="w-full py-2 text-slate-400 hover:text-cyan-300 font-arcade text-[9px] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Menu className="w-3 h-3 shrink-0" />
              <span className="whitespace-nowrap">{t.returnMenu}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

