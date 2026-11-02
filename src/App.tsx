/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { GameEngine, GameEngineState } from './game/GameEngine';
import { MAPS } from './data/maps';
import { GameMap, GameMode, PlayerProgress, SupportedLanguage } from './types/game';
import { progressService } from './services/storage';
import { soundManager } from './services/audio';
import { TRANSLATIONS } from './i18n/translations';

import { MainMenu } from './components/MainMenu';
import { GameHUD } from './components/GameHUD';
import { MapSelectModal } from './components/MapSelectModal';
import { CodexModal } from './components/CodexModal';
import { AchievementsModal } from './components/AchievementsModal';
import { SettingsModal } from './components/SettingsModal';
import { AboutModal } from './components/AboutModal';
import { DialogueModal } from './components/DialogueModal';
import { VictoryDefeatModal } from './components/VictoryDefeatModal';
import { TourModal } from './components/TourModal';
import { CreditsModal } from './components/CreditsModal';

type AppScreen = 'menu' | 'playing';

// Portuguese localized dialogue for The Dude / O Cara
const MAP_DIALOGUE_PT: Record<string, { intro: string; outro: string }> = {
  silence_observatory: {
    intro:
      'Cara, o universo é bem silencioso quando você escuta de verdade. Não saia correndo em pânico. Coloque uma torre ou duas e deixe o silêncio falar.',
    outro:
      'Viu só? Mantenha a respiração firme e o vazio simplesmente se dobra. Bom trabalho mantendo a pista desimpedida, Abidante.',
  },
  astral_garden: {
    intro:
      'Parece que eles trouxeram camuflagem para um show de luzes, cara. Plante alguns Olhos Astrais. Não dá para atingir o que não se vê, mas o que é iluminado não escapa.',
    outro:
      'Visão limpa clareia o horizonte. Você pegou o compasso cósmico, Abidante. Mantenha os cristais sintonizados.',
  },
  labyrinth_mind: {
    intro:
      'Cara, o cérebro pode pensar demais e complicar tudo. Mantenha os pensamentos claros e encadeie esses raios. Não lute contra cada átomo individualmente.',
    outro: 'Sinapses serenas, cara. Isso foi cognição cósmica de altíssimo nível.',
  },
  heart_sanctuary: {
    intro:
      'Tudo está conectado, cara. Se o coração perder o ritmo, a harmonia inteira desaba. Plante alguns Santuários para manter o equilíbrio firme.',
    outro: 'Aquele pulso harmônico foi pura poesia. O Coração resiste, Abidante. Mandou muito bem.',
  },
  golden_forge: {
    intro:
      'Força de vontade não é sobre fazer esforço até chorar, cara. É sobre ritmo. Plante uns Ressonadores Dourados e deixe a torrente dourada cantar.',
    outro:
      'Ressonância dourada pura! Foi como um strike perfeito em uma pista de boliche cósmica. Direto no ponto.',
  },
  energy_crucible: {
    intro:
      'Aqui a chapa é quente, cara. Essas criaturas blindadas se acham duronas até o Crisol Solar soltar uma mini-supernova em suas cabeças. Mantenha a calma e traga o calor.',
    outro: 'Cozinhados com perfeição, cara. Nenhuma distorção resistiu ao fogo radiante.',
  },
  material_realm: {
    intro:
      'Muito bem, Abidante, é agora. Não lute contra o universo inteiro, cara. Apenas mantenha a pista desimpedida, cuide da sua ressonância e lembre-se: A Espiral abida.',
    outro:
      'ABIDA! Você sustentou o centro, conteve a distorção e a Cinza Sagrada arde com vigor. O Evangelho das Dimenúveis ganha um novo capítulo hoje, irmão.',
  },
};

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('menu');
  const [progress, setProgress] = useState<PlayerProgress>(() => progressService.get());

  // Active Map & Game Engine
  const [currentMap, setCurrentMap] = useState<GameMap>(MAPS[0]);
  const [currentMode, setCurrentMode] = useState<GameMode>('campaign');
  const [engineState, setEngineState] = useState<GameEngineState | null>(null);

  // Modals state
  const [isMapSelectOpen, setIsMapSelectOpen] = useState(false);
  const [isCodexOpen, setIsCodexOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  // Tour modal on first launch if not seen
  const [isTourOpen, setIsTourOpen] = useState<boolean>(!progress.hasSeenTour);

  // Narrative Dialogue
  const [dialogue, setDialogue] = useState<{
    speaker: string;
    quote: string;
    onClose: () => void;
  } | null>(null);

  // Victory / Defeat Modal
  const [matchOutcome, setMatchOutcome] = useState<{
    isVictory: boolean;
    stars: number;
    score: number;
  } | null>(null);

  // Dude Advice Toast
  const [dudeToast, setDudeToast] = useState<string | null>(null);
  const [gameSessionId, setGameSessionId] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const language = progress.language;
  const t = TRANSLATIONS[language];

  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getIsMuted());

  // Start sound on user interaction
  const initAudio = useCallback(() => {
    soundManager.startCosmicAmbience();
  }, []);

  const handleToggleMute = useCallback(() => {
    initAudio();
    const nextMuted = soundManager.toggleMute();
    setIsMuted(nextMuted);
  }, [initAudio]);

  const handleToggleLanguage = () => {
    const nextLang: SupportedLanguage = progress.language === 'en' ? 'pt' : 'en';
    progressService.setLanguage(nextLang);
    setProgress(progressService.get());
  };

  const handleCompleteTour = (chosenName: string) => {
    progressService.setPlayerName(chosenName);
    progressService.setHasSeenTour(true);
    setProgress(progressService.get());
    setIsTourOpen(false);
  };

  const handleStartGame = useCallback(
    (map: GameMap, mode: GameMode = 'campaign') => {
      initAudio();

      // Clean up previous engine completely before instantiating new one
      if (engineRef.current) {
        engineRef.current.detachCanvas();
      }

      setCurrentMap(map);
      setCurrentMode(mode);
      setMatchOutcome(null);
      setDudeToast(null);
      setDialogue(null);
      setGameSessionId((prev) => prev + 1);

      // Initialize game engine
      const engine = new GameEngine(map, mode);
      engineRef.current = engine;

      engine.onStateChange = (state) => {
        setEngineState(state);
      };

      engine.onVictory = (stars, score) => {
        progressService.recordVictory(map.id, stars, score);
        progressService.addStats(score, engine.state.enemiesBanishedCount);

        // Unlock next map if in campaign
        const currentIdx = MAPS.findIndex((m) => m.id === map.id);
        if (currentIdx !== -1 && currentIdx + 1 < MAPS.length) {
          progressService.unlockNextMap(map.id, MAPS[currentIdx + 1].id);
        }

        setProgress(progressService.get());
        setMatchOutcome({ isVictory: true, stars, score });

        // Cosmic victory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#6366f1', '#fbbf24', '#f97316'],
        });
      };

      engine.onDefeat = () => {
        setMatchOutcome({
          isVictory: false,
          stars: 0,
          score: engine.state.score,
        });
      };

      engine.onAchievementTrigger = (achId) => {
        const unlocked = progressService.unlockAchievement(achId);
        if (unlocked) {
          setProgress(progressService.get());
        }
      };

      engine.onDudeToast = (quote) => {
        const isPt = progress.language === 'pt';
        let localizedQuote = quote;
        if (isPt) {
          const ptQuotes = [
            'Cara, a pista já está ficando mais limpa.',
            'Cuide da sua ressonância, irmão. Deixe fluir.',
            'Belo strike. A Espiral abida.',
            'Não tenha pressa com a próxima onda. Respire essa quietude.',
          ];
          localizedQuote = ptQuotes[Math.floor(Math.random() * ptQuotes.length)];
        }
        setDudeToast(localizedQuote);
        setTimeout(() => {
          setDudeToast((prev) => (prev === localizedQuote ? null : prev));
        }, 4500);
      };

      setEngineState(engine.state);
      setScreen('playing');

      // If canvas is already mounted in DOM (e.g. proceeding to next map or retry),
      // attach it immediately so the canvas paints the new map with zero latency
      if (canvasRef.current) {
        engine.attachCanvas(canvasRef.current);
      }

      // Show intro narrative dialogue if campaign
      if (mode === 'campaign') {
        const isPt = progress.language === 'pt';
        const speaker = isPt ? 'O Cara' : 'The Dude';
        const quote = isPt
          ? MAP_DIALOGUE_PT[map.id]?.intro || map.dudeIntro
          : map.dudeIntro;

        if (quote) {
          setDialogue({
            speaker,
            quote,
            onClose: () => setDialogue(null),
          });
        }
      }
    },
    [initAudio, progress.language]
  );

  // Attach canvas to engine when playing or when map/session changes
  useEffect(() => {
    if (screen === 'playing' && canvasRef.current && engineRef.current) {
      engineRef.current.attachCanvas(canvasRef.current);
    }
    return () => {
      if (engineRef.current) {
        engineRef.current.detachCanvas();
      }
    };
  }, [screen, gameSessionId, currentMap.id]);

  // Touch / Click coordinate mapping from viewport to 1000x600 virtual coordinate space
  const handleCanvasInteraction = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || !engineRef.current) return;
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();

      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
      }

      // Map to 1000 x 600 virtual space
      const scaleX = 1000 / rect.width;
      const scaleY = 600 / rect.height;

      const virtualX = (clientX - rect.left) * scaleX;
      const virtualY = (clientY - rect.top) * scaleY;

      engineRef.current.handleTap(virtualX, virtualY);
    },
    []
  );

  const handleNextMap = () => {
    const currentIdx = MAPS.findIndex((m) => m.id === currentMap.id);
    if (currentIdx !== -1 && currentIdx + 1 < MAPS.length) {
      const nextMap = MAPS[currentIdx + 1];
      handleStartGame(nextMap, currentMode);
    } else {
      setScreen('menu');
    }
  };

  const handleRetry = () => {
    handleStartGame(currentMap, currentMode);
  };

  return (
    <div
      onClick={initAudio}
      className="relative w-screen h-screen overflow-hidden bg-[#05020c] flex items-center justify-center select-none"
    >
      {/* Optional Vintage Arcade CRT Screen Overlay */}
      {progress.settings.crtVisuals !== false && (
        <div className="crt-screen-overlay" aria-hidden="true" />
      )}

      {screen === 'menu' && (
        <MainMenu
          progress={progress}
          onContinue={() => {
            const lastUnlockedId = progress.unlockedMaps[progress.unlockedMaps.length - 1];
            const map = MAPS.find((m) => m.id === lastUnlockedId) || MAPS[0];
            handleStartGame(map, 'campaign');
          }}
          onNewGame={() => handleStartGame(MAPS[0], 'campaign')}
          onOpenCampaign={() => {
            setCurrentMode('campaign');
            setIsMapSelectOpen(true);
          }}
          onOpenEndless={() => handleStartGame(MAPS[0], 'endless')}
          onOpenFinalAbiders={() => {
            setCurrentMode('final_abiders');
            setIsMapSelectOpen(true);
          }}
          onOpenCodex={() => setIsCodexOpen(true)}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
          onToggleLanguage={handleToggleLanguage}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenTour={() => setIsTourOpen(true)}
        />
      )}

      {screen === 'playing' && (
        <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden select-none">
          {/* Main 1000 x 600 Canvas (Blocky Vintage Arcade) */}
          <canvas
            ref={canvasRef}
            width={1000}
            height={600}
            onClick={handleCanvasInteraction}
            onTouchStart={handleCanvasInteraction}
            className="max-w-full max-h-full object-contain cursor-crosshair shadow-[0_0_40px_rgba(0,0,0,0.9)]"
            style={{ imageRendering: 'pixelated' }}
          />

          {/* In-Game HUD overlay */}
          {engineRef.current && engineState && (
            <GameHUD
              engine={engineRef.current}
              state={engineState}
              language={progress.language}
              onExit={() => {
                if (engineRef.current) engineRef.current.detachCanvas();
                setScreen('menu');
              }}
            />
          )}

          {/* The Dude / O Cara Advice Toast */}
          {dudeToast && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-[#0d0221]/95 border-2 border-yellow-400 px-4 py-2 rounded shadow-[0_0_15px_rgba(255,230,0,0.4)] backdrop-blur-md text-yellow-300 text-xs font-tech italic animate-bounce flex items-center gap-2">
              <span className="text-[9px] font-arcade text-pink-400">▲ {t.theDude.toUpperCase()}:</span>
              <span>"{dudeToast}"</span>
            </div>
          )}

          {/* Victory / Defeat Modal */}
          {matchOutcome && (
            <VictoryDefeatModal
              isVictory={matchOutcome.isVictory}
              map={currentMap}
              stars={matchOutcome.stars}
              score={matchOutcome.score}
              equilibrium={engineState ? engineState.equilibrium : 0}
              language={progress.language}
              onNextMap={
                currentMode === 'campaign' &&
                MAPS.findIndex((m) => m.id === currentMap.id) < MAPS.length - 1
                  ? handleNextMap
                  : undefined
              }
              onRetry={handleRetry}
              onMenu={() => {
                if (engineRef.current) engineRef.current.detachCanvas();
                setScreen('menu');
              }}
              onViewCredits={
                matchOutcome.isVictory ? () => setIsCreditsOpen(true) : undefined
              }
            />
          )}
        </div>
      )}

      {/* Global Modals */}
      {isMapSelectOpen && (
        <MapSelectModal
          progress={progress}
          mode={currentMode}
          language={progress.language}
          onSelectMap={(map) => {
            setIsMapSelectOpen(false);
            handleStartGame(map, currentMode);
          }}
          onClose={() => setIsMapSelectOpen(false)}
        />
      )}

      {isCodexOpen && <CodexModal language={progress.language} onClose={() => setIsCodexOpen(false)} />}

      {isAchievementsOpen && (
        <AchievementsModal
          progress={progress}
          language={progress.language}
          onClose={() => setIsAchievementsOpen(false)}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          progress={progress}
          onUpdateProgress={(p) => {
            setProgress(p);
            setIsMuted(soundManager.getIsMuted());
          }}
          onOpenTour={() => setIsTourOpen(true)}
          onClose={() => {
            setIsSettingsOpen(false);
            setIsMuted(soundManager.getIsMuted());
          }}
        />
      )}

      {isAboutOpen && (
        <AboutModal
          language={progress.language}
          onOpenCredits={() => setIsCreditsOpen(true)}
          onClose={() => setIsAboutOpen(false)}
        />
      )}

      {/* End of Game / Cosmic Credits Modal */}
      {isCreditsOpen && (
        <CreditsModal
          language={progress.language}
          onClose={() => setIsCreditsOpen(false)}
        />
      )}

      {/* First Launch or On-Demand Tour Modal */}
      {isTourOpen && (
        <TourModal
          language={progress.language}
          currentName={progress.playerName}
          onComplete={handleCompleteTour}
          onSkip={() => handleCompleteTour(progress.playerName || t.defaultPlayerName)}
        />
      )}

      {dialogue && (
        <DialogueModal
          speaker={dialogue.speaker}
          quote={dialogue.quote}
          confirmLabel={progress.language === 'pt' ? 'A Espiral Abida' : 'The Spiral Abides'}
          onClose={dialogue.onClose}
        />
      )}
    </div>
  );
}
