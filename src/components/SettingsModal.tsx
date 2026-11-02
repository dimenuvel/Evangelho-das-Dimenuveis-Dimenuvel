import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Volume2,
  VolumeX,
  Music,
  RotateCcw,
  Smartphone,
  Sliders,
  Globe,
  User,
  GraduationCap,
  Tv,
} from 'lucide-react';
import { soundManager } from '../services/audio';
import { progressService } from '../services/storage';
import { PlayerProgress, SupportedLanguage } from '../types/game';
import { TRANSLATIONS } from '../i18n/translations';

interface SettingsModalProps {
  progress: PlayerProgress;
  onUpdateProgress: (newProgress: PlayerProgress) => void;
  onOpenTour: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  progress,
  onUpdateProgress,
  onOpenTour,
  onClose,
}) => {
  const t = TRANSLATIONS[progress.language];
  const [musicVol, setMusicVol] = useState(progress.settings.musicVolume);
  const [sfxVol, setSfxVol] = useState(progress.settings.sfxVolume);
  const [isMuted, setIsMuted] = useState(() => soundManager.getIsMuted());
  const [confirmReset, setConfirmReset] = useState(false);
  const [playerName, setPlayerName] = useState(progress.playerName || '');
  const [isNameSaved, setIsNameSaved] = useState(false);
  const [crtVisuals, setCrtVisuals] = useState<boolean>(progress.settings.crtVisuals ?? true);

  const handleToggleCrt = () => {
    soundManager.playBuild();
    const nextVal = !crtVisuals;
    setCrtVisuals(nextVal);
    const updated = {
      ...progress,
      settings: { ...progress.settings, crtVisuals: nextVal },
    };
    progressService.save(updated);
    onUpdateProgress(updated);
  };

  const handleMusicChange = (val: number) => {
    setMusicVol(val);
    soundManager.setMusicVolume(val);
    const updated = {
      ...progress,
      settings: { ...progress.settings, musicVolume: val },
    };
    progressService.save(updated);
    onUpdateProgress(updated);
  };

  const handleSfxChange = (val: number) => {
    setSfxVol(val);
    soundManager.setSfxVolume(val);
    soundManager.playTowerShoot('golden_resonator');
    const updated = {
      ...progress,
      settings: { ...progress.settings, sfxVolume: val },
    };
    progressService.save(updated);
    onUpdateProgress(updated);
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    soundManager.playBuild();
    const updated = {
      ...progress,
      language: lang,
    };
    progressService.save(updated);
    onUpdateProgress(updated);
  };

  const handleSavePlayerName = () => {
    const trimmed = playerName.trim() || t.defaultPlayerName;
    setPlayerName(trimmed);
    const updated = {
      ...progress,
      playerName: trimmed,
    };
    progressService.save(updated);
    onUpdateProgress(updated);
    setIsNameSaved(true);
    soundManager.playBuild();
    setTimeout(() => setIsNameSaved(false), 2000);
  };

  const handleReset = () => {
    progressService.resetAll();
    const fresh = progressService.get();
    onUpdateProgress(fresh);
    setConfirmReset(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg bg-[#070114] border-2 border-cyan-400 rounded-lg shadow-[0_0_30px_rgba(0,240,255,0.3)] flex flex-col overflow-hidden max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b-2 border-cyan-500/40 bg-[#0f0326] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#160438] border border-cyan-400 flex items-center justify-center text-cyan-300">
              <Sliders className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-pink-400 font-arcade block">
                SYSTEM CONFIG
              </span>
              <h2 className="text-sm font-arcade font-bold text-yellow-300">{t.settings}</h2>
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
        <div className="p-4 sm:p-5 space-y-4 sm:space-y-5 bg-[#090218] overflow-y-auto overflow-x-hidden">
          {/* Player Name / Moniker Section */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-arcade font-bold text-yellow-300 flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              <span>{t.playerNameLabel}</span>
            </label>
            <div className="flex items-center gap-2 max-w-full">
              <input
                type="text"
                size={14}
                maxLength={20}
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder={t.defaultPlayerName}
                className="flex-1 min-w-0 max-w-[220px] sm:max-w-xs px-2.5 py-1.5 bg-[#12042b] border border-cyan-400 focus:border-yellow-300 rounded text-yellow-300 text-[11px] font-arcade focus:outline-none"
              />
              <button
                onClick={handleSavePlayerName}
                className="shrink-0 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded text-[9px] font-arcade font-bold transition-all active:scale-95 border border-cyan-300 whitespace-nowrap"
              >
                {isNameSaved ? '✓ SAVED' : t.saveName}
              </button>
            </div>
          </div>

          {/* Language Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-arcade font-bold text-pink-300 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" />
              <span>{progress.language === 'pt' ? 'IDIOMA REGIONAL' : 'ARCADE REGION'}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`py-2 px-2.5 rounded border text-[10px] font-arcade font-bold transition-all flex flex-col items-center gap-0.5 ${
                  progress.language === 'en'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                    : 'bg-[#100426] border-purple-900/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>ENGLISH</span>
                <span className="text-[9px] text-slate-400 font-tech">(Gospel of Dimenuous)</span>
              </button>

              <button
                onClick={() => handleLanguageChange('pt')}
                className={`py-2 px-2.5 rounded border text-[10px] font-arcade font-bold transition-all flex flex-col items-center gap-0.5 ${
                  progress.language === 'pt'
                    ? 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-[0_0_10px_rgba(255,0,127,0.3)]'
                    : 'bg-[#100426] border-purple-900/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>PORTUGUÊS</span>
                <span className="text-[9px] text-slate-400 font-tech">(Evangelho das Dimenúveis)</span>
              </button>
            </div>
          </div>

          {/* Re-launch Tour */}
          <button
            onClick={() => {
              onClose();
              onOpenTour();
            }}
            className="w-full py-2.5 px-3 bg-[#12042b] hover:bg-[#1f0847] border border-cyan-500/40 rounded text-[9px] sm:text-[10px] font-arcade text-cyan-300 flex items-center justify-center gap-2 transition-all active:scale-95 shadow whitespace-nowrap"
          >
            <GraduationCap className="w-4 h-4 text-yellow-400 shrink-0" />
            <span className="whitespace-nowrap">
              {progress.language === 'pt'
                ? 'REVER INICIAÇÃO'
                : 'RESTART TUTORIAL'}
            </span>
          </button>

          {/* Audio Controls */}
          <div className="space-y-3.5 pt-2 border-t border-cyan-500/20">
            <h3 className="text-[10px] font-arcade font-bold text-yellow-300 uppercase tracking-wider whitespace-nowrap">
              {progress.language === 'pt' ? 'SINTETIZADOR DE ÁUDIO' : 'AUDIO SYNTHESIZER'}
            </h3>

            {/* Music Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-slate-300 font-arcade whitespace-nowrap">
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <Music className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  {t.ambientMusic}
                </span>
                <span className="text-cyan-300 font-arcade">{Math.round(musicVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVol}
                onChange={(e) => handleMusicChange(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-purple-950/40 rounded cursor-pointer h-2"
              />
            </div>

            {/* SFX Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-slate-300 font-arcade whitespace-nowrap">
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <Volume2 className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  {t.towerSfx}
                </span>
                <span className="text-yellow-300 font-arcade">{Math.round(sfxVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVol}
                onChange={(e) => handleSfxChange(parseFloat(e.target.value))}
                className="w-full accent-yellow-400 bg-purple-950/40 rounded cursor-pointer h-2"
              />
            </div>

            {/* Master Mute Toggle */}
            <button
              onClick={handleToggleMute}
              className="w-full py-2 px-3 bg-[#12042b] border border-cyan-500/40 hover:border-cyan-300 rounded text-[9px] font-arcade text-slate-200 flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-pink-500 shrink-0" />
                  <span className="whitespace-nowrap">{t.audioMuted}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#39ff14] shrink-0" />
                  <span className="whitespace-nowrap">{t.audioActive}</span>
                </>
              )}
            </button>
          </div>

          {/* Vintage CRT Visuals Option */}
          <div className="space-y-2 pt-2 border-t border-cyan-500/20">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-arcade font-bold text-yellow-300 flex items-center gap-2">
                <Tv className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{t.crtVisuals}</span>
              </label>
              <span className={`text-[9px] font-arcade ${crtVisuals ? 'text-[#39ff14]' : 'text-slate-400'}`}>
                {crtVisuals ? '[ ON ]' : '[ OFF ]'}
              </span>
            </div>

            <button
              onClick={handleToggleCrt}
              className={`w-full py-2.5 px-3 rounded border text-[9px] sm:text-[10px] font-arcade font-bold flex items-center justify-between gap-2 transition-all active:scale-95 shadow ${
                crtVisuals
                  ? 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                  : 'bg-[#100426] hover:bg-[#1a063e] border-purple-900/40 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Tv className={`w-4 h-4 shrink-0 ${crtVisuals ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
                <span className="whitespace-nowrap">
                  {crtVisuals ? t.crtVisualsOn : t.crtVisualsOff}
                </span>
              </div>
              <span className="text-[8px] font-tech text-slate-300 hidden sm:inline">
                {t.crtVisualsDesc}
              </span>
            </button>
          </div>

          {/* Android Mobile Touch Optimization Note */}
          <div className="p-3 bg-[#0d0322] border border-cyan-500/30 rounded flex items-start gap-2.5">
            <Smartphone className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-300 space-y-0.5 font-tech">
              <p className="font-bold text-cyan-300 font-arcade text-[9px]">{t.mobileTouchNoteTitle}</p>
              <p className="text-slate-400 leading-relaxed">{t.mobileTouchNoteDesc}</p>
            </div>
          </div>

          {/* Reset Save Data */}
          <div className="pt-2 border-t border-cyan-500/20">
            {confirmReset ? (
              <div className="space-y-2">
                <p className="text-[10px] font-arcade text-pink-400 text-center">{t.confirmResetPrompt}</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-[9px] font-arcade font-bold transition-all"
                  >
                    {t.confirmReset}
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[9px] font-arcade transition-all"
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="w-full py-1.5 bg-white/5 hover:bg-pink-950/40 text-slate-400 hover:text-pink-400 border border-transparent hover:border-pink-500/40 rounded text-[9px] font-arcade transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.resetSaveData}</span>
              </button>
            )}
          </div>

          <div className="text-center text-[8px] font-arcade text-slate-600 tracking-widest pt-1">
            DIMENUOUS: THE LAST ABIDERS · v1.0
          </div>
        </div>
      </motion.div>
    </div>
  );
};
