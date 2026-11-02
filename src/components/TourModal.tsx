import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Shield,
  Zap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Crown,
} from 'lucide-react';
import { SupportedLanguage } from '../types/game';
import { TRANSLATIONS } from '../i18n/translations';
import { soundManager } from '../services/audio';

interface TourModalProps {
  language: SupportedLanguage;
  currentName?: string;
  onComplete: (playerName: string) => void;
  onSkip?: () => void;
}

export const TourModal: React.FC<TourModalProps> = ({
  language,
  currentName = '',
  onComplete,
  onSkip,
}) => {
  const t = TRANSLATIONS[language];
  const [step, setStep] = useState<number>(0);
  const [nameInput, setNameInput] = useState<string>(currentName || '');

  const steps = [
    {
      title: t.tourStep1Title,
      desc: t.tourStep1Desc,
      icon: Compass,
      color: '#00f0ff',
      accentBg: 'rgba(0, 240, 255, 0.15)',
      badge: language === 'pt' ? 'SETE CAMADAS' : 'SEVEN LAYERS',
    },
    {
      title: t.tourStep2Title,
      desc: t.tourStep2Desc,
      icon: Shield,
      color: '#39ff14',
      accentBg: 'rgba(57, 255, 20, 0.15)',
      badge: language === 'pt' ? 'CONSTRUÇÃO & NÍVEIS' : 'BUILD & UPGRADE',
    },
    {
      title: t.tourStep3Title,
      desc: t.tourStep3Desc,
      icon: Zap,
      color: '#ffe600',
      accentBg: 'rgba(255, 230, 0, 0.15)',
      badge: language === 'pt' ? 'O CARA & DECRETOS' : "THE DUDE & DECREES",
    },
    {
      title: t.tourStep4Title,
      desc: t.tourStep4Desc,
      icon: Crown,
      color: '#ff007f',
      accentBg: 'rgba(255, 0, 127, 0.15)',
      badge: language === 'pt' ? '1P REGISTRO DE PILOTO' : '1P PILOT REGISTRY',
      isInputStep: true,
    },
  ];

  const currentStepData = steps[step];
  const StepIcon = currentStepData.icon;

  const handleNext = () => {
    soundManager.playBuild();
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    soundManager.playBuild();
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    const finalName = nameInput.trim() || t.defaultPlayerName;
    soundManager.playUpgrade();
    onComplete(finalName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-lg bg-[#080216] border-2 border-cyan-400 rounded-lg p-5 sm:p-6 shadow-[0_0_25px_rgba(0,240,255,0.3)] relative overflow-hidden flex flex-col justify-between min-h-[460px]"
      >
        {/* Retro Arcade Bracket Accents */}
        <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-yellow-400" />
        <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-yellow-400" />
        <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-yellow-400" />
        <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-yellow-400" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#100326] border border-cyan-400 flex items-center justify-center text-cyan-300">
              <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-cyan-400 font-arcade font-bold block">
                {t.tourTitle}
              </span>
              <span className="text-xs text-slate-400 font-tech">{t.tourSubtitle}</span>
            </div>
          </div>

          {onSkip && step < steps.length - 1 && (
            <button
              onClick={onSkip}
              className="text-[10px] text-slate-400 hover:text-cyan-300 font-arcade px-2 py-1 rounded hover:bg-white/5 transition-colors"
            >
              [ {t.tourSkip} ]
            </button>
          )}
        </div>

        {/* Body Carousel Step */}
        <div className="py-5 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded flex items-center justify-center text-xl shadow-lg border"
                  style={{
                    backgroundColor: currentStepData.accentBg,
                    borderColor: currentStepData.color,
                    color: currentStepData.color,
                  }}
                >
                  <StepIcon className="w-5 h-5" />
                </div>
                <div>
                  <span
                    className="text-[9px] font-arcade uppercase tracking-wider px-2 py-0.5 rounded font-bold"
                    style={{
                      backgroundColor: `${currentStepData.color}25`,
                      color: currentStepData.color,
                      border: `1px solid ${currentStepData.color}60`,
                    }}
                  >
                    {currentStepData.badge}
                  </span>
                  <h3 className="text-sm sm:text-base font-arcade font-bold text-slate-100 mt-1">
                    {currentStepData.title}
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-tech bg-[#0e0422] p-3.5 rounded border border-pink-500/25">
                {currentStepData.desc}
              </p>

              {/* Step 4: Player Moniker / Name Input */}
              {currentStepData.isInputStep && (
                <div className="pt-1 space-y-2">
                  <label className="text-[10px] font-arcade font-bold text-yellow-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>{t.enterNamePrompt}</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={20}
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder={t.tourNamePlaceholder}
                      className="w-full px-3.5 py-2.5 bg-[#12042b] border-2 border-cyan-400 focus:border-yellow-400 rounded text-yellow-300 placeholder-slate-600 text-xs font-arcade focus:outline-none shadow-inner"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleFinish();
                      }}
                      autoFocus
                    />
                  </div>
                  <p className="text-[10px] text-cyan-400/80 font-tech">
                    {language === 'pt'
                      ? 'Este codinome será gravado nas tabelas de recorde da máquina cósmica.'
                      : 'This moniker will appear on your arcade high-score records across the cosmos.'}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Nav & Dots */}
        <div className="pt-3 border-t border-cyan-500/30 flex items-center justify-between">
          {/* Progress indicator dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-2 rounded transition-all ${
                  i === step ? 'w-6 bg-yellow-400 shadow-[0_0_8px_rgba(255,230,0,0.8)]' : 'w-2 bg-purple-900/50 hover:bg-purple-700/50'
                }`}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {step > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 bg-[#12042b] hover:bg-[#20084d] text-slate-300 font-arcade text-[9px] rounded border border-cyan-500/40 transition-all flex items-center gap-1 active:scale-95 whitespace-nowrap shrink-0"
              >
                <ArrowLeft className="w-3 h-3 shrink-0" />
                <span className="whitespace-nowrap">{t.tourPrev}</span>
              </button>
            )}

            {step < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-arcade text-[10px] rounded border border-pink-400 shadow-md transition-all flex items-center gap-1 active:scale-95 whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">{t.tourNext}</span>
                <ArrowRight className="w-3 h-3 shrink-0" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-arcade font-bold text-[10px] rounded border border-yellow-200 shadow-[0_0_15px_rgba(255,230,0,0.5)] transition-all flex items-center gap-1 active:scale-95 whitespace-nowrap shrink-0"
              >
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">{t.tourConfirmName}</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

