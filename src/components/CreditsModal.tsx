import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Sparkles,
  Trophy,
  Crown,
  Heart,
  Compass,
  Star,
  Tv,
} from 'lucide-react';
import { SupportedLanguage } from '../types/game';
import { soundManager } from '../services/audio';

interface CreditsModalProps {
  language: SupportedLanguage;
  onClose: () => void;
  crtVisuals?: boolean;
}

interface CreditEntry {
  role: { pt: string; en: string };
  name: { pt: string; en: string };
  desc: { pt: string; en: string };
  icon?: string;
  tag?: string;
}

const CREDITS_DATA: CreditEntry[] = [
  {
    role: {
      pt: 'Supervisor Cósmico Supremo & Especialista em Tapetes',
      en: 'Supreme Cosmic Overseer & Rug Placement Specialist',
    },
    name: { pt: 'Samuel Tiem', en: 'Samuel Tiem' },
    desc: {
      pt: 'Garantiu pessoalmente que o tapete da sala cósmica amarrasse todo o universo e nunca fosse pisoteado por Materialistas sujos.',
      en: 'Personally ensured the cosmic living room rug tied the entire universe together and was never scuffed by dusty Materialists.',
    },
    icon: '🎳',
    tag: 'DEVELOPER & DIRECTOR',
  },
  {
    role: {
      pt: 'Sumo Sacerdote de Não Fazer Absolutamente Nada',
      en: 'Grand High Priest of Doing Nothing in Particular',
    },
    name: { pt: 'O Cara (The Dude)', en: 'The Dude (O Cara)' },
    desc: {
      pt: 'Horário de atendimento no oráculo: Somente terças-feiras, das 14h00 às 14h02, se não coincidir com a final do campeonato de boliche.',
      en: 'Oracle consulting hours: Alternate Tuesdays, 2:00 PM to 2:02 PM, barring bowling tournaments or beverage runs.',
    },
    icon: '🧘',
    tag: 'GOSPEL INSPIRATION',
  },
  {
    role: {
      pt: 'Engenheiro Chefe de Balística de Boliche e Pânico Existencial',
      en: 'Chief Bowling Ballistics & Existential Panic Engineer',
    },
    name: {
      pt: 'Dr. Walter Sobchak (PhD em Regras da Liga)',
      en: 'Dr. Walter Sobchak (PhD in League Regulations)',
    },
    desc: {
      pt: 'Calculou os vetores dos lasers estritamente de acordo com as regras de boliche de 1977. Marcou zero para qualquer monstro que pisou na linha da pista.',
      en: 'Calibrated laser vectors strictly adhering to the 1977 League Rulebook. Marked zero for any monster that crossed the foul line.',
    },
    icon: '🎳',
    tag: 'KINETIC PHYSICS',
  },
  {
    role: {
      pt: 'Diretor Executivo de Sussurros ao Vazio e Silêncio Constrangedor',
      en: 'Executive Director of Void Whispering & Awkward Silence',
    },
    name: { pt: 'O Observatório Silencioso', en: 'The Silent Observatory' },
    desc: {
      pt: 'Não disse uma única palavra durante todas as 800 reuniões de sprint. O snipe crítico de 350% falou por ele.',
      en: 'Maintained total, unbroken silence across 800 agile sprint standups. The 350% critical sniper ray spoke for him.',
    },
    icon: '🤫',
    tag: 'STRATUM I: SILENCE',
  },
  {
    role: {
      pt: 'Mestre Iluminador Neon & Olho que Tudo Vê',
      en: 'Retro Neon Lighting Master & Omnipresent Gaze',
    },
    name: { pt: 'O Olho Astral', en: 'The Astral Eye' },
    desc: {
      pt: 'Passou 96 horas seguidas em debate existencial decidindo se o ciano era #00f0ff ou #00ffff. Revelou todos os Silenciadores camuflados.',
      en: 'Spent 96 continuous hours debating whether cyan was #00f0ff or #00ffff. Successfully uncloaked every sneaking Silencer.',
    },
    icon: '👁️',
    tag: 'STRATUM II: VISION',
  },
  {
    role: {
      pt: 'Cientista Chefe de Sobrecarga Cerebral e Insônia das 3 da Manhã',
      en: 'Chief Scientist of Cerebral Overload & 3 AM Thoughts',
    },
    name: { pt: 'O Motor do Pensamento', en: 'The Thought Engine' },
    desc: {
      pt: 'Tentou decifrar o sentido da vida às 3h14 da manhã; acabou descobrindo acidentalmente como atordoar monstros em cadeia por 3 segundos.',
      en: 'Attempted to decode the meaning of existence at 3:14 AM; accidentally discovered how to stun chained monsters for 3 seconds instead.',
    },
    icon: '🧠',
    tag: 'STRATUM III: MIND',
  },
  {
    role: {
      pt: 'Consultor de Coquetelaria Quântica e White Russian Sagrado',
      en: 'Quantum Mixologist & Sacred White Russian Consultant',
    },
    name: { pt: 'O Santuário do Coração', en: 'The Sanctuary of Heart' },
    desc: {
      pt: 'Receita canônica: 2 partes de licor de café cósmico, 1 parte de vodka celestial e 10% de cura de equilíbrio por cada gole lento.',
      en: 'Canonical recipe: 2 parts cosmic coffee liqueur, 1 part celestial vodka, and 10% equilibrium restoration per slow sip.',
    },
    icon: '🍸',
    tag: 'STRATUM IV: HEART',
  },
  {
    role: {
      pt: 'Treinador de Motivação Cósmica & Disparador de Fúria 4X',
      en: 'Cosmic Hype Coach & 4X Rapid Fire Specialist',
    },
    name: { pt: 'O Ressonador Dourado', en: 'The Golden Resonator' },
    desc: {
      pt: 'Acreditou tão forte na vitória que a cadência de tiro disparou 400%. O próprio conceito de calma ficou assustado.',
      en: 'Believed in victory so intensely that attack speed accelerated 400%. The very concept of tranquility got startled.',
    },
    icon: '⚡',
    tag: 'STRATUM V: WILL',
  },
  {
    role: {
      pt: 'Chef de Churrasco Interdimensional da Cinza Sagrada',
      en: 'Sacred Ash Pitmaster & Interdimensional BBQ Chef',
    },
    name: { pt: 'O Crisol Solar', en: 'The Solar Crucible' },
    desc: {
      pt: 'Nenhum Materialista blindado saiu mal-passado. Especialidade da casa: costelinha cósmica tostada com 400 de dano solar.',
      en: 'No armored Materialist leaves medium-rare. House specialty: cosmic ribs slow-roasted under 400 solar AoE damage.',
    },
    icon: '☀️',
    tag: 'STRATUM VI: ENERGY',
  },
  {
    role: {
      pt: 'Fiscal Geral de Orientação Paisagem no Celular',
      en: 'Mobile Landscape Orientation Inspector General',
    },
    name: { pt: 'A Âncora Material', en: 'The Material Anchor' },
    desc: {
      pt: 'Lembrou educadamente mais de 10.000 vezes: "Gire o seu celular para a horizontal, cara, as estrelas cabem melhor assim".',
      en: 'Politely reminded players over 10,000 times: "Rotate your device to landscape, man, the stars breathe better that way".',
    },
    icon: '📱',
    tag: 'STRATUM VII: MATTER',
  },
  {
    role: {
      pt: 'Vice-Presidente de Desculpas por Input Lag & Desaparecimentos',
      en: 'VP of Blaming Lag & Sudden Disappearances',
    },
    name: { pt: 'O Falso (The False One)', en: 'The False One' },
    desc: {
      pt: 'Teleportou para outra dobra dimensional exatamente no milissegundo em que você decidiu gastar sua Ressonância Espiral.',
      en: 'Quantum-jittered into an alternate plane the exact millisecond you decided to invoke your Spiral decree.',
    },
    icon: '👻',
    tag: 'ANTAGONIST SQUAD',
  },
  {
    role: {
      pt: 'Representante Sindical de Invasores Apressados',
      en: 'Union Rep for Rushing Invasions',
    },
    name: { pt: 'O Andarilho (The Stepper)', en: 'The Stepper' },
    desc: {
      pt: 'Reivindicou paradas para descanso no meio da pista e menos torres no corredor. As petições foram gentilmente ignoradas.',
      en: 'Demanded mid-lane pit stops and 50% fewer sniper towers along the corridor. Petitions were calmly ignored.',
    },
    icon: '🏃',
    tag: 'ANTAGONIST SQUAD',
  },
  {
    role: {
      pt: 'Xamã dos Sintetizadores & Osciladores Matemáticos',
      en: 'Chiptune Shaman & Mathematical Oscillator Whisperer',
    },
    name: { pt: 'A Web Audio API', en: 'The Web Audio API' },
    desc: {
      pt: 'Nenhum arquivo MP3 foi contratado ou carregado. Todos os acordes, raios laser e arpejos foram gerados ao vivo por fórmulas matemáticas suando frio.',
      en: 'Zero pre-recorded MP3 audio files were hired. All chords, laser zaps, and sweeps were generated live by math formulas calculating in real time.',
    },
    icon: '🎹',
    tag: 'PROCEDURAL AUDIO',
  },
  {
    role: {
      pt: 'Escriturário dos Anais do Evangelho & Guardião das Estrelas',
      en: 'Scrivener of the Gospel Annals & Keeper of Stars',
    },
    name: { pt: 'O Códice Cósmico', en: 'The Cosmic Codex' },
    desc: {
      pt: 'Contém a sabedoria milenar de 7 estratos da Espiral, mas sabe perfeitamente que você só abre a aba para conferir os triunfos desbloqueados.',
      en: 'Holds millennium-old wisdom across all 7 strata, yet understands full well you only open it to verify unlocked triumphs.',
    },
    icon: '📜',
    tag: 'LORE ARCHIVES',
  },
  {
    role: {
      pt: 'Inspetor Supremo de Paciência e Resiliência Cósmica',
      en: 'Supreme Inspector of Patience & Cosmic Resilience',
    },
    name: {
      pt: 'VOCÊ (O ÚLTIMO ABIDANTE)',
      en: 'YOU (THE LAST ABIDER)',
    },
    desc: {
      pt: 'Sim, você mesmo! Obrigado por manter a pista desimpedida, sintonizar as torres certas e não atirar o celular pela janela na Onda 10 do Grande Vazio.',
      en: 'Yes, you! Thank you for holding the center, attuning your towers, and keeping your cool through Wave 10 of The Great Void.',
    },
    icon: '👑',
    tag: 'THE HERO OF THE SPIRAL',
  },
];

export const CreditsModal: React.FC<CreditsModalProps> = ({ language, onClose, crtVisuals }) => {
  const isPt = language === 'pt';
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollPosRef = useRef<number>(0);
  const isInteractingRef = useRef<boolean>(false);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const isCrtOn = crtVisuals ?? true;

  // Sync scroll tracker on manual scroll / touch
  const handleScroll = () => {
    if (scrollRef.current && isInteractingRef.current) {
      scrollPosRef.current = scrollRef.current.scrollTop;
    }
  };

  const handlePointerDown = () => {
    isInteractingRef.current = true;
    if (scrollRef.current) {
      scrollPosRef.current = scrollRef.current.scrollTop;
    }
  };

  const handlePointerUp = () => {
    isInteractingRef.current = false;
    if (scrollRef.current) {
      scrollPosRef.current = scrollRef.current.scrollTop;
    }
  };

  // Auto-scrolling engine with subpixel accumulator & reliable speed multipliers
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    if (scrollRef.current) {
      scrollPosRef.current = scrollRef.current.scrollTop;
    }

    const scrollLoop = (time: number) => {
      // Clamp dt to max 0.05s to prevent massive jumps when switching tabs or window blur
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      if (isPlaying && scrollRef.current && !isInteractingRef.current) {
        const baseSpeed = 50; // pixels per second at 1X
        const container = scrollRef.current;
        const maxScroll = container.scrollHeight - container.clientHeight;

        if (maxScroll > 0) {
          scrollPosRef.current += baseSpeed * speedMultiplier * dt;

          if (scrollPosRef.current >= maxScroll) {
            scrollPosRef.current = maxScroll;
            container.scrollTop = maxScroll;
            setIsPlaying(false);
          } else {
            container.scrollTop = scrollPosRef.current;
          }
        }
      }

      animId = requestAnimationFrame(scrollLoop);
    };

    animId = requestAnimationFrame(scrollLoop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, speedMultiplier]);

  const handleResetScroll = () => {
    soundManager.playBuild();
    scrollPosRef.current = 0;
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    soundManager.playBuild();
    if (!isPlaying && scrollRef.current) {
      const container = scrollRef.current;
      const maxScroll = container.scrollHeight - container.clientHeight;
      // If at bottom, reset to top on resume
      if (container.scrollTop >= maxScroll - 5) {
        scrollPosRef.current = 0;
        container.scrollTop = 0;
      } else {
        scrollPosRef.current = container.scrollTop;
      }
    }
    setIsPlaying((prev) => !prev);
  };

  const cycleSpeed = () => {
    soundManager.playBuild();
    if (speedMultiplier === 1) setSpeedMultiplier(2);
    else if (speedMultiplier === 2) setSpeedMultiplier(4);
    else setSpeedMultiplier(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md select-none">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 15 }}
        className="w-full max-w-2xl bg-[#060112] border-2 border-yellow-400 rounded-lg shadow-[0_0_40px_rgba(255,230,0,0.35)] flex flex-col overflow-hidden h-[90vh] max-h-[720px] relative"
      >
        {/* Optional Retro Scanline Sheen */}
        {isCrtOn && (
          <div
            className="absolute inset-0 pointer-events-none z-30 opacity-20"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.25) 2px, rgba(0, 240, 255, 0.25) 4px)',
            }}
          />
        )}

        {/* Top Header / Arcade Marquee */}
        <div className="px-4 py-3 bg-[#110328] border-b-2 border-yellow-400/60 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#1a053c] border border-yellow-400 flex items-center justify-center text-yellow-300 shadow-[0_0_10px_rgba(255,230,0,0.5)]">
              <Trophy className="w-4 h-4 text-yellow-400 animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-pink-400 font-arcade block">
                {isPt ? '★ CRÔNICAS DE ENCERRAMENTO ★' : '★ CLOSING CHRONICLES ★'}
              </span>
              <h2 className="text-xs sm:text-sm font-arcade font-bold text-yellow-300">
                {isPt ? 'CRÉDITOS CÓSMICOS' : 'COSMIC CREDITS'}
              </h2>
            </div>
          </div>

          {/* Quick Controls Bar */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleTogglePlay}
              className="p-1.5 sm:px-2.5 sm:py-1 bg-[#1a053c] hover:bg-[#2b0863] border border-cyan-400 rounded text-[9px] font-arcade text-cyan-300 flex items-center gap-1 transition-all active:scale-95"
              title={isPlaying ? (isPt ? 'Pausar' : 'Pause') : (isPt ? 'Rolar' : 'Play')}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isPt ? 'PAUSAR' : 'PAUSE'}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="hidden sm:inline">{isPt ? 'ROLAR' : 'PLAY'}</span>
                </>
              )}
            </button>

            <button
              onClick={cycleSpeed}
              className="px-2 py-1 bg-[#1a053c] hover:bg-[#2b0863] border border-cyan-400 rounded text-[9px] font-arcade text-yellow-300 transition-all active:scale-95 flex items-center gap-1"
              title={isPt ? 'Alterar Velocidade' : 'Change Speed'}
            >
              <FastForward className="w-3 h-3 text-cyan-400" />
              <span>{speedMultiplier}X</span>
            </button>

            <button
              onClick={handleResetScroll}
              className="p-1.5 bg-[#1a053c] hover:bg-[#2b0863] border border-cyan-400 rounded text-cyan-300 transition-all active:scale-95"
              title={isPt ? 'Voltar ao Topo' : 'Rewind to Top'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 ml-1 bg-red-950/60 hover:bg-red-800 text-slate-300 hover:text-white rounded border border-red-500/50 transition-colors"
              title={isPt ? 'Fechar' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchEnd={handlePointerUp}
          onWheel={() => {
            if (scrollRef.current) {
              scrollPosRef.current = scrollRef.current.scrollTop;
            }
          }}
          className="flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-10 space-y-12 bg-gradient-to-b from-[#060112] via-[#090218] to-[#04000a] text-center font-tech relative z-10"
        >
          {/* Top Cosmic Emblem */}
          <div className="pt-4 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400 text-yellow-300 font-arcade text-[10px] tracking-wider animate-bounce">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>{isPt ? 'EQUILÍBRIO RESTAURADO' : 'EQUILIBRIUM RESTORED'}</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-arcade font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-cyan-300 drop-shadow-[0_0_15px_rgba(255,230,0,0.6)]">
              {isPt ? 'DIMENUVEL' : 'DIMENUOUS'}
            </h1>
            <p className="text-sm font-arcade text-pink-400 tracking-widest">
              {isPt ? 'OS ÚLTIMOS ABIDANTES' : 'THE LAST ABIDERS'}
            </p>

            <div className="max-w-md mx-auto p-3.5 rounded bg-[#100326] border border-cyan-500/40 text-xs text-yellow-200/90 italic font-tech shadow-inner">
              {isPt
                ? '"Viu só, cara? O tapete aguentou o tranco, os cristais não racharam e a pista de boliche cósmica continua brilhando. Agora relaxe e veja os nomes de quem tornou esse absurdo possível." — O Cara'
                : '"See, man? The rug held up, the crystals never cracked, and the cosmic bowling lane stays shiny. Now sit back, take a sip, and check out the crew who made this madness happen." — The Dude'}
            </div>
          </div>

          {/* Individual Credit Cards */}
          <div className="space-y-10 max-w-lg mx-auto">
            {CREDITS_DATA.map((entry, index) => (
              <div
                key={index}
                className="p-4 sm:p-5 rounded-lg bg-[#0e0326]/80 border border-cyan-500/30 hover:border-yellow-400/60 shadow-lg space-y-2 transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
              >
                {entry.tag && (
                  <span className="inline-block px-2 py-0.5 rounded text-[8px] font-arcade tracking-wider bg-pink-500/20 text-pink-300 border border-pink-500/40 mb-1">
                    {entry.tag}
                  </span>
                )}

                <div className="text-xs sm:text-sm font-arcade font-bold text-yellow-300 flex items-center justify-center gap-1.5 flex-wrap">
                  {entry.icon && <span className="text-base">{entry.icon}</span>}
                  <span>{isPt ? entry.role.pt : entry.role.en}</span>
                </div>

                <div className="text-base sm:text-lg font-arcade font-black text-cyan-300 tracking-wide">
                  {isPt ? entry.name.pt : entry.name.en}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-tech pt-1 border-t border-purple-950/60">
                  {isPt ? entry.desc.pt : entry.desc.en}
                </p>
              </div>
            ))}
          </div>

          {/* Special Thanks Section */}
          <div className="p-6 rounded-lg bg-[#120430] border-2 border-pink-500/40 max-w-lg mx-auto space-y-3 text-left">
            <div className="text-center">
              <span className="text-[10px] font-arcade text-pink-400 uppercase tracking-widest block">
                ★ SPECIAL DEDICATION ★
              </span>
              <h3 className="text-sm font-arcade font-bold text-yellow-300">
                {isPt ? 'AGRADECIMENTOS ESPECIAIS' : 'SPECIAL THANKS'}
              </h3>
            </div>

            <ul className="text-xs text-slate-300 space-y-2 font-tech list-disc list-inside">
              <li>
                <span className="text-yellow-300 font-bold">
                  {isPt ? 'Ao Tapete Cósmico:' : 'To the Cosmic Rug:'}
                </span>{' '}
                {isPt
                  ? 'Que resistiu a todas as distorções e realmente amarrou a sala inteira.'
                  : 'Which weathered every distortion and truly tied the whole room together.'}
              </li>
              <li>
                <span className="text-cyan-300 font-bold">
                  {isPt ? 'Ao Boliche Cósmico:' : 'To Cosmic Bowling:'}
                </span>{' '}
                {isPt
                  ? 'Por nos lembrar de que na vida, às vezes você acerta um strike, às vezes acerta a canaleta, mas o que importa é a próxima jogada.'
                  : 'For teaching us that sometimes you roll a strike, sometimes you hit the gutter, but what matters is the next frame.'}
              </li>
              <li>
                <span className="text-[#39ff14] font-bold">
                  {isPt ? 'Ao Botão de Mudo:' : 'To the Mute Button:'}
                </span>{' '}
                {isPt
                  ? 'Por salvar o emprego de milhares de pessoas jogando discretamente em reuniões.'
                  : 'For quietly preserving the livelihoods of office workers secretly playing in meetings.'}
              </li>
              <li>
                <span className="text-pink-300 font-bold">
                  {isPt ? 'À Espiral da Existência:' : 'To the Spiral of Existence:'}
                </span>{' '}
                {isPt
                  ? 'Que mesmo quando tudo parece caótico... continua abidando com serenidade.'
                  : 'Which even in utter chaos... gently and perpetually abides.'}
              </li>
            </ul>
          </div>

          {/* Humorous Legal Disclaimer */}
          <div className="max-w-md mx-auto text-[10px] text-slate-400 font-tech leading-relaxed border-t border-cyan-500/20 pt-6 pb-12 space-y-2">
            <p className="italic">
              {isPt
                ? '★ AVISO LEGAL CÓSMICO: Nenhuma Distorção Cósmica sofreu danos irreparáveis durante a produção deste jogo. Todas foram apenas educadamente convidadas a se retirar da pista para meditar sobre suas escolhas no vácuo.'
                : '★ COSMIC LEGAL DISCLAIMER: No Cosmic Distortions were irreversibly harmed during the making of this game. All entities were merely cordially invited to step off the lane and ponder their existence in the vacuum.'}
            </p>
            <p className="font-arcade text-[9px] text-yellow-400 tracking-wider">
              {isPt
                ? 'EVANGELHO DAS DIMENÚVEIS · VERSÃO 1.0 · A ESPIRAL ABIDA'
                : 'GOSPEL OF DIMENUOUS · VERSION 1.0 · THE SPIRAL ABIDES'}
            </p>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="px-4 py-3 bg-[#0d0221] border-t border-cyan-500/40 flex items-center justify-between shrink-0 z-20">
          <div className="text-[9px] font-arcade text-slate-400 hidden sm:block">
            {isPt ? 'Pressione Fechar para voltar ao jogo' : 'Press Close to return to game'}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleResetScroll}
              className="flex-1 sm:flex-none px-3 py-1.5 bg-[#170533] hover:bg-[#270957] border border-cyan-500/40 rounded text-[9px] font-arcade text-cyan-300 transition-all flex items-center justify-center gap-1 active:scale-95"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isPt ? 'REINICIAR' : 'RESTART'}</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-arcade font-bold text-[10px] rounded border border-yellow-200 shadow-[0_0_15px_rgba(255,230,0,0.4)] transition-all flex items-center justify-center gap-1 active:scale-95"
            >
              <CheckIcon className="w-3.5 h-3.5" />
              <span>{isPt ? 'FECHAR CRÉDITOS' : 'CLOSE CREDITS'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
