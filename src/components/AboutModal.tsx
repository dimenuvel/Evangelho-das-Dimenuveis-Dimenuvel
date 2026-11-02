import React from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Shield, Compass, Github, Mail } from 'lucide-react';
import { SupportedLanguage } from '../types/game';
import { TRANSLATIONS } from '../i18n/translations';

interface AboutModalProps {
  language: SupportedLanguage;
  onOpenCredits?: () => void;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ language, onOpenCredits, onClose }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg bg-[#070114] border-2 border-cyan-400 rounded-lg shadow-[0_0_30px_rgba(0,240,255,0.3)] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b-2 border-cyan-500/40 bg-[#0f0326] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#160438] border border-cyan-400 flex items-center justify-center text-cyan-300">
              <Compass className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-pink-400 font-arcade block">
                {language === 'pt' ? 'CRÔNICA DE ABIDAR' : 'CHRONICLE OF ABIDE'}
              </span>
              <h2 className="text-xs sm:text-sm font-arcade font-bold text-yellow-300">
                {t.gameTitle}: {t.gameSubtitle}
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

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-slate-200 leading-relaxed font-tech bg-[#090218]">
          <div className="p-3 bg-[#12042b] border-l-4 border-yellow-400 rounded-r">
            <p className="font-tech italic text-yellow-200/90 text-[11px] sm:text-xs">
              {language === 'pt'
                ? '"A Espiral é a estrutura que conecta todas as camadas da existência. No centro repousa a Cinza Sagrada, o ponto de equilíbrio. Proteja a Espiral. O objetivo não é destruir tudo; é reconhecer, redirecionar, conter e restaurar o equilíbrio."'
                : '"The Spiral is the structure connecting all layers of existence. At the center exists the Sacred Ash, the point of equilibrium. Protect the Spiral. The objective is not to destroy everything; it is to recognize, redirect, contain, and restore balance."'}
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-arcade font-bold text-white text-[10px] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              {language === 'pt' ? 'AS SETE DIMENÚVEIS' : 'THE SEVEN DIMENUOUS LAYERS'}
            </h4>
            <p className="text-slate-400 text-[11px]">
              {language === 'pt'
                ? 'Silêncio (Violeta), Visão (Índigo), Mente (Azul), Coração (Verde), Vontade (Amarelo), Energia (Laranja) e Matéria (Vermelho). Cada estrato canaliza uma ressonância cósmica essencial que sustenta a realidade.'
                : 'Silence (Violet), Vision (Indigo), Mind (Blue), Heart (Green), Will (Yellow), Energy (Orange), and Matter (Red). Each stratum channels a unique elemental resonance that sustains the universe.'}
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-arcade font-bold text-yellow-300 text-[10px] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              {language === 'pt' ? `A FILOSOFIA D'${t.theDude.toUpperCase()}` : `THE PHILOSOPHY OF ${t.theDude.toUpperCase()}`}
            </h4>
            <p className="text-slate-400 text-[11px]">
              {language === 'pt'
                ? `"O universo já é complicado demais, cara. Você não precisa piorar as coisas. Não lute contra o universo inteiro, apenas mantenha a pista desimpedida. A Espiral abida." — ${t.gospelName}`
                : `"Man, the universe is complicated enough. You don't have to make it worse. Don't fight the entire universe, man. Just keep the lane open. The Spiral abides." — ${t.gospelName}`}
            </p>
          </div>

          {onOpenCredits && (
            <button
              onClick={() => {
                onClose();
                onOpenCredits();
              }}
              className="w-full py-2.5 px-3 bg-[#13042b] hover:bg-[#200847] border border-yellow-400/50 hover:border-yellow-400 rounded text-yellow-300 font-arcade text-[9px] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_0_12px_rgba(255,230,0,0.2)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>{language === 'pt' ? '★ VER CRÉDITOS CÓSMICOS ★' : '★ VIEW COSMIC CREDITS ★'}</span>
            </button>
          )}

          <div className="pt-2 border-t border-cyan-500/20 text-[9px] font-arcade text-slate-400 flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-yellow-400 font-bold">v1.0</span>
              <a
                href="https://github.com/dimenuvel/Evangelho-das-Dimenuveis-Dimenuvel"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-cyan-300 hover:text-white transition-colors underline"
              >
                <Github className="w-3 h-3 text-cyan-400" />
                GitHub
              </a>
              <a
                href="mailto:samuel.tiem@proton.me?subject=Evangelho%20das%20Dimen%C3%BAveis%20-%20Dimenuvel%20Game"
                className="inline-flex items-center gap-1 text-pink-300 hover:text-white transition-colors underline"
              >
                <Mail className="w-3 h-3 text-pink-400" />
                {language === 'pt' ? 'Contato' : 'Contact'}
              </a>
            </div>
            <span className="text-yellow-400">
              {language === 'pt' ? '★ ABIDA ★' : '★ ABIDE ★'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
