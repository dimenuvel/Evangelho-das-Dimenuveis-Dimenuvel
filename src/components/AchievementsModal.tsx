import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Trophy, CheckCircle, Sparkles } from 'lucide-react';
import { ACHIEVEMENTS } from '../data/achievements';
import { PlayerProgress, SupportedLanguage } from '../types/game';

interface AchievementsModalProps {
  progress: PlayerProgress;
  language: SupportedLanguage;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  progress,
  language,
  onClose,
}) => {
  const isPt = language === 'pt';
  const [filter, setFilter] = useState<'all' | 'campaign' | 'mastery' | 'spiral'>('all');

  const filteredAchievements = ACHIEVEMENTS.filter((a) => {
    if (filter === 'all') return true;
    return a.category === filter;
  });

  const unlockedCount = ACHIEVEMENTS.filter((a) => progress.achievements.includes(a.id)).length;

  const filterLabels: Record<string, string> = {
    all: isPt ? 'Todos' : 'All',
    campaign: isPt ? 'Campanha' : 'Campaign',
    mastery: isPt ? 'Maestria' : 'Mastery',
    spiral: isPt ? 'Espiral' : 'Spiral',
  };

  const titlesPt: Record<string, { title: string; desc: string }> = {
    first_stillness: {
      title: 'Primeira Quietude',
      desc: 'Complete O Observatório Silencioso (Estrato 1).',
    },
    clear_horizons: {
      title: 'Horizontes Claros',
      desc: 'Complete O Jardim Astral (Estrato 2).',
    },
    neural_mastery: {
      title: 'Mestre do Pensamento',
      desc: 'Complete O Labirinto da Mente (Estrato 3).',
    },
    heart_of_spiral: {
      title: 'Coração da Espiral',
      desc: 'Complete O Santuário do Coração (Estrato 4).',
    },
    golden_standard: {
      title: 'Padrão Dourado',
      desc: 'Complete A Forja Dourada (Estrato 5).',
    },
    solar_supernova: {
      title: 'Supernova Solar',
      desc: 'Complete O Crisol de Energia (Estrato 6).',
    },
    the_last_abider: {
      title: 'O Último Abidante',
      desc: 'Bana O Grande Vazio e salve a Cinza Sagrada no Estrato 7.',
    },
    perfect_equilibrium: {
      title: 'Equilíbrio Puro',
      desc: 'Complete qualquer nível sem perder nenhum ponto de Equilíbrio (100% restante).',
    },
    sevenfold_harmony: {
      title: 'Harmonia Sétupla',
      desc: 'Construa todos os 7 tipos distintos de torres em uma única partida.',
    },
    dudes_disciple: {
      title: 'Discípulo d\'O Cara',
      desc: 'Ative a Ressonância da Espiral 5 vezes em sua jornada.',
    },
    void_cleanser: {
      title: 'Purificador do Vazio',
      desc: 'Bana mais de 250 distorções da Espiral.',
    },
    endless_voyager: {
      title: 'Viajante Infinito',
      desc: 'Sobreviva além da Onda 12 no modo Espiral Infinita.',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-3xl h-[85vh] max-h-[640px] bg-[#070114] border-2 border-yellow-400 rounded-lg shadow-[0_0_30px_rgba(255,230,0,0.3)] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b-2 border-yellow-500/40 bg-[#0f0326] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#160438] border border-yellow-400 flex items-center justify-center text-yellow-300">
              <Trophy className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-pink-400 font-arcade block">
                {isPt ? 'HALL DOS RECORDES' : 'HALL OF TRIUMPHS'}
              </span>
              <h2 className="text-sm font-arcade font-bold text-yellow-300">
                {isPt ? 'TRIUNFOS CÓSMICOS' : 'COSMIC TRIUMPHS'} ({unlockedCount}/{ACHIEVEMENTS.length})
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

        {/* Filters */}
        <div className="flex px-4 py-2.5 gap-1.5 border-b border-yellow-500/30 bg-[#0c021f]">
          {(['all', 'campaign', 'mastery', 'spiral'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 text-[9px] font-arcade rounded uppercase transition-all ${
                filter === cat
                  ? 'bg-yellow-400 text-slate-950 font-bold shadow-[0_0_8px_rgba(255,230,0,0.6)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {filterLabels[cat]}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-2.5 bg-[#090218]">
          {filteredAchievements.map((item) => {
            const isUnlocked = progress.achievements.includes(item.id);
            const ptData = titlesPt[item.id];
            const title = isPt && ptData ? ptData.title : item.title;
            const description = isPt && ptData ? ptData.desc : item.description;

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded border transition-all ${
                  isUnlocked
                    ? 'bg-[#150530] border-yellow-400/60 shadow-[0_0_10px_rgba(255,230,0,0.15)]'
                    : 'bg-[#0d0320]/60 border-purple-900/30 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded flex items-center justify-center text-lg ${
                      isUnlocked
                        ? 'bg-yellow-400/20 border border-yellow-400 text-yellow-300'
                        : 'bg-white/5 border border-white/10 text-slate-500'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-arcade font-bold ${
                        isUnlocked ? 'text-yellow-200' : 'text-slate-300'
                      }`}
                    >
                      {title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-tech">{description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-arcade text-yellow-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    +{item.rewardEssence}
                  </span>
                  {isUnlocked ? (
                    <CheckCircle className="w-4 h-4 text-[#39ff14]" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-600" />
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
