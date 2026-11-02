import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  RotateCcw,
  Compass,
  Infinity as InfinityIcon,
  Crown,
  BookOpen,
  Trophy,
  Sliders,
  Info,
  Sparkles,
  Globe,
  User,
  GraduationCap,
  Gamepad2,
  Github,
  Mail,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { PlayerProgress } from '../types/game';
import { soundManager } from '../services/audio';
import { TRANSLATIONS } from '../i18n/translations';
import { FlagIcon } from './FlagIcon';

interface MainMenuProps {
  progress: PlayerProgress;
  isMuted: boolean;
  onToggleMute: () => void;
  onContinue: () => void;
  onNewGame: () => void;
  onOpenCampaign: () => void;
  onOpenEndless: () => void;
  onOpenFinalAbiders: () => void;
  onOpenCodex: () => void;
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  onToggleLanguage: () => void;
  onOpenTour: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  progress,
  isMuted,
  onToggleMute,
  onContinue,
  onNewGame,
  onOpenCampaign,
  onOpenEndless,
  onOpenFinalAbiders,
  onOpenCodex,
  onOpenAchievements,
  onOpenSettings,
  onOpenAbout,
  onToggleLanguage,
  onOpenTour,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const t = TRANSLATIONS[progress.language];

  // Calculate highest score across maps
  const maxScore = Object.values(progress.mapHighScores || {}).reduce((max: number, s: number) => Math.max(max, s), 0);

  // Background animated retro arcade synthwave grid & starfield
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.015;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Deep space gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#030008');
      bgGrad.addColorStop(0.5, '#0b021d');
      bgGrad.addColorStop(1, '#020005');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 1. Twinkling Retro 4-point Vector Stars
      const starCount = 55;
      for (let i = 0; i < starCount; i++) {
        const sx = ((i * 187.3 + 23) % w);
        const sy = ((i * 123.7 + 67) % (h * 0.75));
        const twinkle = 0.35 + 0.65 * Math.sin(time * 3 + i * 2.1);
        ctx.globalAlpha = twinkle;
        const col = i % 3 === 0 ? '#00f0ff' : i % 3 === 1 ? '#ff007f' : '#ffe600';
        ctx.fillStyle = col;
        ctx.strokeStyle = col;
        ctx.lineWidth = 1;

        if (i % 5 === 0) {
          ctx.beginPath();
          ctx.moveTo(sx - 3, sy);
          ctx.lineTo(sx + 3, sy);
          ctx.moveTo(sx, sy - 3);
          ctx.lineTo(sx, sy + 3);
          ctx.stroke();
          ctx.fillRect(sx - 1, sy - 1, 2, 2);
        } else {
          ctx.fillRect(sx, sy, 1.5, 1.5);
        }
      }
      ctx.globalAlpha = 1.0;

      // 2. Perspective Synthwave Vector Grid (The Cosmic Carpet Ride)
      const horizonY = h * 0.62;
      const gridBottomY = h;

      ctx.save();
      ctx.strokeStyle = 'rgba(255, 0, 127, 0.25)';
      ctx.lineWidth = 1.2;

      // Receding horizontal lines with animated forward velocity
      const numHoriz = 10;
      const gridOffset = (time * 0.8) % 1;
      for (let i = 0; i < numHoriz; i++) {
        const p = Math.pow((i + gridOffset) / numHoriz, 2.2);
        const y = horizonY + p * (gridBottomY - horizonY);
        if (y <= gridBottomY) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      }

      // Converging perspective lines
      const numVert = 22;
      for (let i = -numVert; i <= numVert; i++) {
        const spreadBottom = cx + i * (w / (numVert * 0.8));
        ctx.beginPath();
        ctx.moveTo(cx + i * 12, horizonY);
        ctx.lineTo(spreadBottom, gridBottomY);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Central Neon Sacred Geometry Rings
      ctx.save();
      ctx.translate(cx, horizonY - 40);
      ctx.rotate(time * 0.1);

      [90, 170, 260].forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = idx % 2 === 0 ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 0, 127, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const count = idx % 2 === 0 ? 8 : 12;
        for (let j = 0; j < count; j++) {
          const a = (j / count) * Math.PI * 2;
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          ctx.fillStyle = idx % 2 === 0 ? '#00f0ff' : '#ffe600';
          ctx.fillRect(px - 2, py - 2, 4, 4);
        }
      });

      // Rotating Golden Spiral core
      ctx.strokeStyle = 'rgba(255, 230, 0, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let theta = 0; theta < Math.PI * 6; theta += 0.1) {
        const rad = 2.2 * theta;
        const x = Math.cos(theta) * rad;
        const y = Math.sin(theta) * rad;
        if (theta === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const hasProgress = progress.unlockedMaps.length > 1 || Object.keys(progress.mapStars).length > 0;
  const isFinalAbidersUnlocked =
    progress.unlockedMaps.length >= 7 ||
    Object.keys(progress.mapStars).length >= 5 ||
    progress.finalAbidersCompleted.length > 0;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-3 sm:p-6 select-none overflow-hidden">
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* TOP ARCADE STATUS TICKER */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-between gap-2 border-b border-cyan-500/30 pb-2.5">
        {/* Left: 1P Moniker & Tour Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#0b031d]/90 border border-cyan-400/50 text-cyan-300 text-[11px] font-arcade shadow-lg">
            <User className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-pink-400 hidden sm:inline">1P:</span>
            <span className="font-bold text-yellow-300 tracking-wider">
              {progress.playerName || t.defaultPlayerName}
            </span>
          </div>

          <button
            onClick={onOpenTour}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#0b031d]/90 hover:bg-[#1a083d] border border-purple-400/50 text-[10px] font-arcade text-purple-300 transition-all active:scale-95 shadow"
            title={progress.language === 'pt' ? 'Rever Iniciação / Tour' : 'Review Initiation Tour'}
          >
            <GraduationCap className="w-3 h-3 text-cyan-300" />
            <span className="hidden sm:inline">
              {progress.language === 'pt' ? 'TOUR' : 'TOUR'}
            </span>
          </button>
        </div>

        {/* Center: High Score Marquee */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-[#0b031d]/90 border border-yellow-400/50 text-yellow-300 text-[10px] font-arcade shadow-lg">
          <Trophy className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
          <span>HI-SCORE:</span>
          <span className="text-white font-mono-numbers tracking-widest">
            {maxScore.toString().padStart(6, '0')}
          </span>
        </div>

        {/* Right: Sound Toggle and Language Switcher (Just Flag) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded bg-[#0b031d]/90 hover:bg-[#1a083d] border border-cyan-400/50 hover:border-yellow-400 text-cyan-300 hover:text-white transition-all active:scale-95 shadow flex items-center justify-center"
            title={
              isMuted
                ? progress.language === 'pt'
                  ? 'Ativar Som'
                  : 'Unmute Sound'
                : progress.language === 'pt'
                ? 'Desativar Som'
                : 'Mute Sound'
            }
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-cyan-300" />
            )}
          </button>

          {/* Language Switcher (Just Flag) */}
          <button
            onClick={() => {
              soundManager.playBuild();
              onToggleLanguage();
            }}
            className="p-1 sm:px-1.5 py-1 rounded bg-[#0b031d]/90 hover:bg-[#1a083d] border border-cyan-400/50 hover:border-yellow-400 transition-all active:scale-95 shadow flex items-center justify-center"
            title={
              progress.language === 'pt'
                ? 'Mudar para Inglês (Switch to English)'
                : 'Alternar para Português (Switch to Portuguese)'
            }
          >
            <FlagIcon language={progress.language} className="w-5 h-3.5" />
          </button>
        </div>
      </div>

      {/* MARQUEE TITLE (THE COSMIC CARPET RIDE ARCADE AESTHETIC) */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center space-y-2 max-w-3xl px-4 py-2"
      >
        {/* Neon Chromatic Arcade Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-arcade font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-[#00f0ff] via-[#ffffff] to-[#ff007f] drop-shadow-[0_0_20px_rgba(0,240,255,0.8)]">
          {t.gameTitle}
        </h1>

        {/* Subtitle with Pixel Grid Framing */}
        <div className="text-xs sm:text-sm font-arcade tracking-[0.2em] text-pink-300 font-bold flex items-center justify-center gap-3">
          <span className="h-[2px] w-6 sm:w-16 bg-gradient-to-r from-transparent to-cyan-400" />
          <span className="drop-shadow-[0_0_8px_rgba(255,0,127,0.7)]">{t.gameSubtitle}</span>
          <span className="h-[2px] w-6 sm:w-16 bg-gradient-to-l from-transparent to-cyan-400" />
        </div>

        {/* Blinking Arcade Call-To-Action */}
        <div className="text-[11px] font-arcade text-yellow-300 tracking-widest animate-arcade-blink pt-1">
          {hasProgress ? '▲ 1P READY: CONTINUE YOUR STRATUM ▲' : '▲ INSERT COIN · 1P READY ▲'}
        </div>
      </motion.div>

      {/* PRIMARY ACTION PANEL */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative z-10 w-full max-w-md space-y-2.5 pb-2"
      >
        {/* Main Play Action (Arcade Push Button) */}
        {hasProgress ? (
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                soundManager.playBuild();
                onContinue();
              }}
              className="py-3 px-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-arcade font-bold text-[10px] sm:text-[11px] rounded border border-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-current shrink-0" />
              <span className="whitespace-nowrap">{t.continue}</span>
            </button>
            <button
              onClick={() => {
                soundManager.playBuild();
                onNewGame();
              }}
              className="py-3 px-3 bg-[#0d0422]/90 hover:bg-[#1a083f] border border-pink-500/50 text-pink-300 font-arcade font-bold text-[10px] sm:text-[11px] rounded transition-all flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_12px_rgba(255,0,127,0.25)] whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">{t.newOdyssey}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              soundManager.playBuild();
              onNewGame();
            }}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-yellow-400 via-amber-500 to-pink-500 hover:from-yellow-300 hover:to-pink-400 text-slate-950 font-arcade font-bold text-[11px] sm:text-xs rounded border border-yellow-200 shadow-[0_0_20px_rgba(255,230,0,0.5)] transition-all flex items-center justify-center gap-2.5 active:scale-95 tracking-wider whitespace-nowrap"
          >
            <Play className="w-4 h-4 fill-current text-slate-950 shrink-0" />
            <span className="whitespace-nowrap">{t.beginDefense}</span>
          </button>
        )}

        {/* Game Modes (Arcade Cabinet Cartridges - Single Line) */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onOpenCampaign}
            className="py-2.5 px-1 bg-[#0c031f]/90 hover:bg-[#18063d] border border-cyan-500/40 hover:border-cyan-400 text-cyan-200 font-arcade text-[9px] sm:text-[10px] rounded transition-all flex flex-col items-center gap-1 active:scale-95 shadow-[0_0_10px_rgba(0,240,255,0.15)] whitespace-nowrap"
          >
            <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="whitespace-nowrap">{t.campaign}</span>
          </button>

          <button
            onClick={onOpenEndless}
            className="py-2.5 px-1 bg-[#0c031f]/90 hover:bg-[#18063d] border border-pink-500/40 hover:border-pink-400 text-pink-200 font-arcade text-[9px] sm:text-[10px] rounded transition-all flex flex-col items-center gap-1 active:scale-95 shadow-[0_0_10px_rgba(255,0,127,0.15)] whitespace-nowrap"
          >
            <InfinityIcon className="w-4 h-4 text-pink-400 shrink-0" />
            <span className="whitespace-nowrap">{t.endlessSpiral}</span>
          </button>

          <button
            onClick={onOpenFinalAbiders}
            disabled={!isFinalAbidersUnlocked}
            className={`py-2.5 px-1 border text-[9px] sm:text-[10px] font-arcade rounded transition-all flex flex-col items-center gap-1 whitespace-nowrap ${
              isFinalAbidersUnlocked
                ? 'bg-[#0c031f]/90 hover:bg-[#18063d] border-yellow-500/50 text-yellow-300 hover:border-yellow-400 active:scale-95 shadow-[0_0_10px_rgba(255,230,0,0.2)]'
                : 'bg-[#060110]/60 border-purple-900/30 text-slate-600 cursor-not-allowed opacity-50'
            }`}
          >
            <Crown className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">{t.finalAbiders}</span>
          </button>
        </div>

        {/* System Toolbar: Codex, Triumphs, Settings, About - Single Line */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          <button
            onClick={onOpenCodex}
            className="py-2 px-1 bg-[#090217]/80 hover:bg-[#150433] border border-indigo-500/30 text-indigo-300 hover:text-white rounded text-[8px] sm:text-[9px] font-arcade flex items-center justify-center gap-1 transition-all active:scale-95 shadow whitespace-nowrap"
          >
            <BookOpen className="w-3 h-3 text-indigo-400 shrink-0" />
            <span className="whitespace-nowrap">{t.codex}</span>
          </button>

          <button
            onClick={onOpenAchievements}
            className="py-2 px-1 bg-[#090217]/80 hover:bg-[#150433] border border-yellow-500/30 text-yellow-300 hover:text-white rounded text-[8px] sm:text-[9px] font-arcade flex items-center justify-center gap-1 transition-all active:scale-95 shadow whitespace-nowrap"
          >
            <Trophy className="w-3 h-3 text-yellow-400 shrink-0" />
            <span className="whitespace-nowrap">{t.triumphs}</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="py-2 px-1 bg-[#090217]/80 hover:bg-[#150433] border border-cyan-500/30 text-cyan-300 hover:text-white rounded text-[8px] sm:text-[9px] font-arcade flex items-center justify-center gap-1 transition-all active:scale-95 shadow whitespace-nowrap"
          >
            <Sliders className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="whitespace-nowrap">{t.settings}</span>
          </button>

          <button
            onClick={onOpenAbout}
            className="py-2 px-1 bg-[#090217]/80 hover:bg-[#150433] border border-pink-500/30 text-pink-300 hover:text-white rounded text-[8px] sm:text-[9px] font-arcade flex items-center justify-center gap-1 transition-all active:scale-95 shadow whitespace-nowrap"
          >
            <Info className="w-3 h-3 text-pink-400 shrink-0" />
            <span className="whitespace-nowrap">{t.about}</span>
          </button>
        </div>
      </motion.div>

      {/* FOOTER: Gospel Quote & App Info / Contact Links */}
      <div className="relative z-10 text-center space-y-1.5 px-4 pb-1">
        <div className="text-[10px] sm:text-[11px] text-cyan-400/80 font-retro tracking-widest">
          {t.abiderQuote}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[9px] sm:text-[10px] font-arcade text-slate-400 tracking-wider">
          <span className="px-1.5 py-0.5 rounded bg-yellow-400/10 border border-yellow-500/40 text-yellow-300 font-bold">
            v1.0
          </span>
          <a
            href="https://github.com/dimenuvel/Evangelho-das-Dimenuveis-Dimenuvel"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-cyan-300 hover:text-white transition-colors underline decoration-cyan-500/40 hover:decoration-cyan-300"
            title="GitHub Repository: Evangelho das Dimenúveis"
          >
            <Github className="w-3 h-3 text-cyan-400 shrink-0" />
            <span>GitHub</span>
          </a>
          <span className="text-slate-600">·</span>
          <a
            href="mailto:samuel.tiem@proton.me?subject=Evangelho%20das%20Dimen%C3%BAveis%20-%20Dimenuvel%20Game"
            className="inline-flex items-center gap-1.5 text-pink-300 hover:text-white transition-colors underline decoration-pink-500/40 hover:decoration-pink-300"
            title="samuel.tiem@proton.me"
          >
            <Mail className="w-3 h-3 text-pink-400 shrink-0" />
            <span>{progress.language === 'pt' ? 'Contato' : 'Contact'}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

