/**
 * Bilingual Translations for DIMENUVEL: THE LAST ABIDERS
 * English & Português (Brasil)
 * English: "Gospel of Dimenuous"
 * Portuguese: "Evangelho das Dimenúveis"
 */

import { SupportedLanguage } from '../types/game';

export interface Translations {
  gameTitle: string;
  gameSubtitle: string;
  cosmicGenre: string;
  spiralConnects: string;
  gospelName: string;
  theDude: string;

  // Menu
  continue: string;
  newOdyssey: string;
  beginDefense: string;
  campaign: string;
  endlessSpiral: string;
  finalAbiders: string;
  codex: string;
  triumphs: string;
  settings: string;
  about: string;
  switchLanguage: string;
  abiderQuote: string;
  enterNamePrompt: string;
  defaultPlayerName: string;

  // In-Game HUD
  essence: string;
  wave: string;
  equilibrium: string;
  sacredAshEquilibrium: string;
  resonance: string;
  invokeDecree: string;
  constructPrompt: string;
  idleHint: string;
  upgrade: string;
  maxStratum: string;
  dismantle: string;
  kills: string;
  damageDealt: string;
  initiateWave: string;
  summonWave: string;
  exitToMenu: string;

  // Resonance Powers
  temporalStillness: string;
  temporalStillnessDesc: string;
  goldenSpiral: string;
  goldenSpiralDesc: string;
  silentPresence: string;
  silentPresenceDesc: string;
  cosmicReset: string;
  cosmicResetDesc: string;

  // Outcome
  stratumHarmonized: string;
  equilibriumRestored: string;
  centerBreached: string;
  equilibriumLost: string;
  score: string;
  ascendNext: string;
  retryStratum: string;
  returnMenu: string;
  defeatTip: string;

  // Tour
  tourTitle: string;
  tourSubtitle: string;
  tourStep1Title: string;
  tourStep1Desc: string;
  tourStep2Title: string;
  tourStep2Desc: string;
  tourStep3Title: string;
  tourStep3Desc: string;
  tourStep4Title: string;
  tourStep4Desc: string;
  tourNamePlaceholder: string;
  tourConfirmName: string;
  tourSkip: string;
  tourNext: string;
  tourPrev: string;
  tourFinish: string;

  // Settings
  harmonicConfig: string;
  ambientMusic: string;
  towerSfx: string;
  audioActive: string;
  audioMuted: string;
  mobileTouchNoteTitle: string;
  mobileTouchNoteDesc: string;
  resetSaveData: string;
  confirmResetPrompt: string;
  confirmReset: string;
  cancel: string;
  playerNameLabel: string;
  saveName: string;
  crtVisuals: string;
  crtVisualsOn: string;
  crtVisualsOff: string;
  crtVisualsDesc: string;

  // Modals
  close: string;
  theSevenStrata: string;
  campaignOdyssey: string;
  finalAbidersChallenge: string;
  defendStratum: string;
  completePrior: string;
  highScoreLabel: string;
  rollCredits: string;
  cosmicCredits: string;
  theSpiralSaved: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    gameTitle: 'DIMENUOUS',
    gameSubtitle: 'THE LAST ABIDERS',
    cosmicGenre: 'Retro Cosmic Arcade · Tower Defense',
    spiralConnects: 'The Spiral Connects All Layers of Existence',
    gospelName: 'Gospel of Dimenuous',
    theDude: 'The Dude',

    // Menu
    continue: 'Continue',
    newOdyssey: 'New Odyssey',
    beginDefense: 'Begin Defense',
    campaign: 'Campaign',
    endlessSpiral: 'Endless',
    finalAbiders: 'Abiders',
    codex: 'Codex',
    triumphs: 'Triumphs',
    settings: 'Settings',
    about: 'About',
    switchLanguage: 'Português',
    abiderQuote: '"Don\'t fight the entire universe, man. Just keep the lane open." — Gospel of Dimenuous',
    enterNamePrompt: 'Enter your Abider Moniker:',
    defaultPlayerName: 'Abider',

    // In-Game HUD
    essence: 'Essence',
    wave: 'Wave',
    equilibrium: 'Equilibrium',
    sacredAshEquilibrium: 'Sacred Ash Equilibrium',
    resonance: 'Resonance',
    invokeDecree: 'Invoke Spiral Decree',
    constructPrompt: 'Construct:',
    idleHint: 'Tap socket to construct · Tap tower to command',
    upgrade: 'Upgrade',
    maxStratum: 'Max Stratum',
    dismantle: 'Dismantle (75% back)',
    kills: 'Kills',
    damageDealt: 'Dmg',
    initiateWave: 'Initiate Wave 1',
    summonWave: 'Summon Wave',
    exitToMenu: 'Exit',

    // Resonance Powers
    temporalStillness: 'Temporal Stillness',
    temporalStillnessDesc: 'Slow all foes by 80% for 6s',
    goldenSpiral: 'Golden Spiral',
    goldenSpiralDesc: '2x attack speed & 100% Crits for 8s',
    silentPresence: 'Silent Presence',
    silentPresenceDesc: 'Restore +35% Equilibrium to Sacred Ash',
    cosmicReset: 'Cosmic Reset',
    cosmicResetDesc: 'Obliterates enemy ranks in radiant fire',

    // Outcome
    stratumHarmonized: 'Stratum Harmonized',
    equilibriumRestored: 'EQUILIBRIUM RESTORED',
    centerBreached: 'Center Breached',
    equilibriumLost: 'EQUILIBRIUM LOST',
    score: 'Score',
    ascendNext: 'Next Stratum',
    retryStratum: 'Retry',
    returnMenu: 'Main Menu',
    defeatTip: 'Tip: Place Astral Eyes to pierce stealth and Solar Crucibles to melt heavy armor.',

    // Tour
    tourTitle: 'WELCOME TO THE SPIRAL',
    tourSubtitle: 'Initiation of the Last Abider',
    tourStep1Title: 'The Seven Dimenuous Layers & Sacred Ash',
    tourStep1Desc: 'The Spiral is the cosmic structure connecting all seven layers of existence (Silence, Vision, Mind, Heart, Will, Energy, and Matter). At the center rests the Sacred Ash, the balance point. If distortions breach the center, equilibrium collapses.',
    tourStep2Title: 'Defensive Towers & Upgrades',
    tourStep2Desc: 'Tap golden construction sockets along the path to build towers attuned to each layer. Tap existing towers to inspect range, upgrade through 3 tiers, or activate game-changing active abilities.',
    tourStep3Title: 'Spiral Resonance & The Dude',
    tourStep3Desc: 'Defeating distortions fills your Spiral Resonance meter. When full, invoke decrees like Temporal Stillness or Cosmic Reset. Along your journey, The Dude will offer guidance from the Gospel of Dimenuous.',
    tourStep4Title: 'Inscribe Your Name',
    tourStep4Desc: 'Your deeds will be etched into the cosmic archives. Enter your name below to register your high scores and achievements across the Spiral.',
    tourNamePlaceholder: 'e.g. Master Lebowski, Cosmos Walker',
    tourConfirmName: 'Enter',
    tourSkip: 'Skip',
    tourNext: 'Next',
    tourPrev: 'Back',
    tourFinish: 'Complete',

    // Settings
    harmonicConfig: 'Harmonic Configuration',
    ambientMusic: 'Ambient Music',
    towerSfx: 'Tower & Cosmic SFX',
    audioActive: 'Audio Active (Click to Mute)',
    audioMuted: 'Audio Muted (Click to Unmute)',
    mobileTouchNoteTitle: 'Mobile Touch Optimized',
    mobileTouchNoteDesc: 'Best played in landscape mode. Tap any construction socket to build, tap a tower to inspect, upgrade, sell (recovers 75%), or unleash active abilities.',
    resetSaveData: 'Reset Save Data',
    confirmResetPrompt: 'Are you sure? All stars, unlocks, and progress will be erased.',
    confirmReset: 'Confirm Reset',
    cancel: 'Cancel',
    playerNameLabel: 'Abider Moniker',
    saveName: 'Save Name',
    crtVisuals: 'CRT Arcade Scanlines',
    crtVisualsOn: 'CRT Visuals: ON (Retro)',
    crtVisualsOff: 'CRT Visuals: OFF (Crisp)',
    crtVisualsDesc: 'Toggle vintage arcade monitor scanlines and curved glass glow',

    // Modals
    close: 'Close',
    theSevenStrata: 'The Seven Strata of the Spiral',
    campaignOdyssey: 'Campaign Odyssey',
    finalAbidersChallenge: 'The Final Abiders Challenge',
    defendStratum: 'Defend',
    completePrior: 'Locked',
    highScoreLabel: 'High',
    rollCredits: 'Roll Cosmic Credits',
    cosmicCredits: 'Cosmic Credits',
    theSpiralSaved: '★ ALL 7 STRATA HARMONIZED · THE SPIRAL IS SAVED! ★',
  },

  pt: {
    gameTitle: 'DIMENUVEL',
    gameSubtitle: 'OS ÚLTIMOS ABIDANTES',
    cosmicGenre: 'Arcade Cósmico Retrô · Defesa de Torres',
    spiralConnects: 'A Espiral Conecta Todas as Camadas da Existência',
    gospelName: 'Evangelho das Dimenúveis',
    theDude: 'O Cara',

    // Menu
    continue: 'Continuar',
    newOdyssey: 'Nova Odisseia',
    beginDefense: 'Iniciar Defesa',
    campaign: 'Campanha',
    endlessSpiral: 'Infinito',
    finalAbiders: 'Abidantes',
    codex: 'Códice',
    triumphs: 'Triunfos',
    settings: 'Ajustes',
    about: 'Sobre',
    switchLanguage: 'English',
    abiderQuote: '"Não lute contra o universo inteiro, cara. Apenas mantenha a pista desimpedida." — Evangelho das Dimenúveis',
    enterNamePrompt: 'Insira o seu Nome de Abidante:',
    defaultPlayerName: 'Abidante',

    // In-Game HUD
    essence: 'Essência',
    wave: 'Onda',
    equilibrium: 'Equilíbrio',
    sacredAshEquilibrium: 'Equilíbrio da Cinza Sagrada',
    resonance: 'Ressonância',
    invokeDecree: 'Invocar Decreto',
    constructPrompt: 'Construir:',
    idleHint: 'Toque no soquete para criar · Toque na torre para aprimorar',
    upgrade: 'Aprimorar',
    maxStratum: 'Nível Máx',
    dismantle: 'Vender (75% volta)',
    kills: 'Abates',
    damageDealt: 'Dano',
    initiateWave: 'Iniciar Onda 1',
    summonWave: 'Invocar Onda',
    exitToMenu: 'Sair',

    // Resonance Powers
    temporalStillness: 'Quietude Temporal',
    temporalStillnessDesc: 'Reduz a velocidade inimiga em 80% por 6s',
    goldenSpiral: 'Espiral Dourada',
    goldenSpiralDesc: 'Dobra velocidade de ataque e 100% Críticos por 8s',
    silentPresence: 'Presença Silenciosa',
    silentPresenceDesc: 'Restaura +35% de Equilíbrio à Cinza Sagrada',
    cosmicReset: 'Reinício Cósmico',
    cosmicResetDesc: 'Pulveriza as fileiras inimigas em chamas radiantes',

    // Outcome
    stratumHarmonized: 'Estrato Harmonizado',
    equilibriumRestored: 'EQUILÍBRIO RESTAURADO',
    centerBreached: 'Centro Rompido',
    equilibriumLost: 'EQUILÍBRIO PERDIDO',
    score: 'Pontuação',
    ascendNext: 'Próximo Estrato',
    retryStratum: 'Tentar de Novo',
    returnMenu: 'Menu Principal',
    defeatTip: 'Dica: Posicione Olhos Astrais para revelar camuflagem e Crisóis Solares para derreter armaduras pesadas.',

    // Tour
    tourTitle: 'BOAS-VINDAS À ESPIRAL',
    tourSubtitle: 'Iniciação do Último Abidante',
    tourStep1Title: 'As Sete Dimenúveis e a Cinza Sagrada',
    tourStep1Desc: 'A Espiral é a estrutura cósmica que conecta as sete camadas da existência (Silêncio, Visão, Mente, Coração, Vontade, Energia e Matéria). No centro repousa a Cinza Sagrada, o eixo de equilíbrio. Se as distorções alcançarem o centro, o equilíbrio colapsa.',
    tourStep2Title: 'Torres Defensivas e Aprimoramentos',
    tourStep2Desc: 'Toque nos soquetes dourados ao longo do caminho para erguer torres sintonizadas com cada camada. Toque em torres existentes para ver o alcance, evoluir através de 3 níveis ou acionar habilidades ativas devastadoras.',
    tourStep3Title: 'Ressonância da Espiral e O Cara',
    tourStep3Desc: 'Derrotar distorções preenche a barra de Ressonância da Espiral. Ao atingir 100%, invoque decretos como a Quietude Temporal ou o Reinício Cósmico. Em sua jornada, O Cara surgirá trazendo sábios conselhos do Evangelho das Dimenúveis.',
    tourStep4Title: 'Inscreva o seu Nome',
    tourStep4Desc: 'Seus feitos serão gravados nos anais cósmicos. Digite seu nome de Abidante abaixo para registrar seus recordes e triunfos em toda a Espiral.',
    tourNamePlaceholder: 'ex: Mestre Lebowski, Andarilho Cósmico',
    tourConfirmName: 'Entrar',
    tourSkip: 'Pular',
    tourNext: 'Próximo',
    tourPrev: 'Voltar',
    tourFinish: 'Concluir',

    // Settings
    harmonicConfig: 'Configuração Harmônica',
    ambientMusic: 'Música Ambiente',
    towerSfx: 'Efeitos Sonoros',
    audioActive: 'Áudio Ativo (Clique p/ Mudo)',
    audioMuted: 'Áudio Mudo (Clique p/ Ativar)',
    mobileTouchNoteTitle: 'Otimizado para Toque no Celular',
    mobileTouchNoteDesc: 'Ideal em modo paisagem. Toque em qualquer soquete para construir, toque em uma torre para inspecionar, aprimorar, vender (recupera 75%) ou disparar habilidades ativas.',
    resetSaveData: 'Redefinir Dados Salvos',
    confirmResetPrompt: 'Tem certeza? Todas as estrelas, desbloqueios e progresso serão apagados.',
    confirmReset: 'Confirmar Redefinição',
    cancel: 'Cancelar',
    playerNameLabel: 'Nome do Abidante',
    saveName: 'Salvar Nome',
    crtVisuals: 'Efeito CRT Vintage',
    crtVisualsOn: 'Efeito CRT: LIGADO (Retrô)',
    crtVisualsOff: 'Efeito CRT: DESLIGADO (Nítido)',
    crtVisualsDesc: 'Alternar linhas de varredura e vinheta de monitor de arcade retrô',

    // Modals
    close: 'Fechar',
    theSevenStrata: 'Os Sete Estratos da Espiral',
    campaignOdyssey: 'Odisseia da Campanha',
    finalAbidersChallenge: 'O Desafio dos Últimos Abidantes',
    defendStratum: 'Defender',
    completePrior: 'Bloqueado',
    highScoreLabel: 'Recorde',
    rollCredits: 'Ver Créditos Cósmicos',
    cosmicCredits: 'Créditos Cósmicos',
    theSpiralSaved: '★ TODOS OS 7 ESTRATOS HARMONIZADOS · A ESPIRAL FOI SALVA! ★',
  },
};
