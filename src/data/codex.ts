import { SupportedLanguage } from '../types/game';

export interface CodexEntry {
  id: string;
  category: 'layers' | 'towers' | 'enemies' | 'philosophy' | 'dude';
  title: string;
  subtitle: string;
  color: string;
  badge: string;
  content: string[];
  quote?: string;
}

export function getCodexEntries(language: SupportedLanguage): CodexEntry[] {
  const isPt = language === 'pt';
  const gospelRef = isPt ? 'Evangelho das Dimenúveis' : 'Gospel of Dimenuous';
  const theDudeName = isPt ? 'O Cara' : 'The Dude';

  return [
    // THE SEVEN DIMENÚVEIS
    {
      id: 'layer_silence',
      category: 'layers',
      title: isPt ? 'SILÊNCIO — Camada I' : 'SILENCE — Layer I',
      subtitle: isPt ? 'Primórdio Violeta' : 'Violet Primordium',
      color: '#a855f7',
      badge: isPt ? 'Estrato Violeta' : 'Violet Stratum',
      content: isPt
        ? [
            'O Silêncio não é a ausência de som; é a quietude primordial que permite que toda vibração exista sem colapsar.',
            'No primeiro estrato, o ruído cósmico do multiverso é filtrado em harmônicos coerentes. Quando as distorções rompem o Silêncio, a realidade torna-se ensurdecedoramente discordante.',
            'O Observatório Silencioso canaliza esse comprimento de onda puro em pulsos concentrados de supressão de alto impacto.',
          ]
        : [
            'Silence is not the absence of sound; it is the primordial stillness that allows all vibration to exist without collapse.',
            'In the first stratum, the cosmic noise of the multiverse is filtered into coherent harmonics. When distortions breach Silence, reality becomes deafeningly discordant.',
            'The Silent Observatory channels this pure wavelength into high-impact single-target suppression pulses.',
          ],
      quote: isPt
        ? `"Antes da palavra, havia a pausa. Respeite a pausa." — ${gospelRef}`
        : `"Before the word, there was the pause. Respect the pause." — ${gospelRef}`,
    },
    {
      id: 'layer_vision',
      category: 'layers',
      title: isPt ? 'VISÃO — Camada II' : 'VISION — Layer II',
      subtitle: isPt ? 'Horizonte Índigo' : 'Indigo Horizon',
      color: '#6366f1',
      badge: isPt ? 'Estrato Índigo' : 'Indigo Stratum',
      content: isPt
        ? [
            'A Visão é a faculdade que enxerga além da ilusão ótica. Ela perfura os véus falsos erguidos por entidades que tentam se ocultar entre as dimensões.',
            'Através do olhar Índigo, horrores camuflados como o Silenciador perdem sua cobertura, e aparições enganosas como o Falso revelam sua trajetória real.',
            'O Olho Astral comanda este estrato, oferecendo vigilância sem igual e marcando alvos para retribuição harmônica.',
          ]
        : [
            'Vision is the faculty that perceives beyond optical deception. It pierces the false veils erected by entities that seek to hide between dimensions.',
            'Through Indigo sight, cloaked horrors like the Silencer lose their shroud, and deceptive apparitions like the False One reveal their true trajectory.',
            'The Astral Eye commands this layer, granting unparalleled surveillance and exposing targets to harmonic retribution.',
          ],
      quote: isPt
        ? `"Não olhe com a ganância de julgar, mas com a clareza de compreender." — A Inscrição do Olho Astral`
        : `"Look not with hunger to judge, but with clarity to comprehend." — The Astral Eye Inscription`,
    },
    {
      id: 'layer_mind',
      category: 'layers',
      title: isPt ? 'MENTE — Camada III' : 'MIND — Layer III',
      subtitle: isPt ? 'Matriz Neural Azure' : 'Azure Neural Matrix',
      color: '#06b6d4',
      badge: isPt ? 'Estrato Azul' : 'Azure Stratum',
      content: isPt
        ? [
            'A Mente representa a teia geométrica do intelecto cósmico. Nenhum pensamento existe isolado; todos os reflexos ecoam através de corredores sinápticos.',
            'Quando a Mente é defendida, a lógica permanece intocada e o pânico não consegue paralisar o Abidante.',
            'O Motor do Pensamento manifesta relâmpagos cognitivos, saltando sem esforço entre ameaças adjacentes e refreando a sua velocidade.',
          ]
        : [
            'Mind represents the interconnected geometric lattice of cosmic intellect. No thought exists isolated; all ripples cascade across neural corridors.',
            'When Mind is defended, logic remains intact and panic cannot freeze the Abider.',
            'The Thought Engine manifests cognitive lightning, leaping effortlessly between adjacent threats and dampening their velocity.',
          ],
      quote: isPt
        ? `"Uma única centelha errante pode acender dez mil lanternas." — Códice da Cognição`
        : `"A single wandering spark can ignite ten thousand lanterns." — Codex of Cognition`,
    },
    {
      id: 'layer_heart',
      category: 'layers',
      title: isPt ? 'CORAÇÃO — Camada IV' : 'HEART — Layer IV',
      subtitle: isPt ? 'Eixo Esmeralda do Equilíbrio' : 'Verdant Axis of Equilibrium',
      color: '#10b981',
      badge: isPt ? 'Estrato Esmeralda' : 'Emerald Stratum',
      content: isPt
        ? [
            'A quarta camada é o centro sagrado da Espiral. Ela equilibra os planos etéreos superiores (Silêncio, Visão, Mente) com os planos de manifestação inferiores (Vontade, Energia, Matéria).',
            'O Coração não ataca com rancor; ele restaura o equilíbrio à Cinza Sagrada e nutre as defesas vizinhas com ressonância regenerativa.',
            'O Santuário se ergue como a personificação viva da harmonia cósmica.',
          ]
        : [
            'The fourth layer is the sacred midpoint of the Spiral. It balances the upper ethereal planes (Silence, Vision, Mind) with the lower manifestation planes (Will, Energy, Matter).',
            'The Heart does not strike with hatred; it restores equilibrium to the Sacred Ash and nurtures adjacent towers with harmonic resonance.',
            'The Sanctuary stands as the living embodiment of restorative cosmic balance.',
          ],
      quote: isPt
        ? `"Sem o centro, a roda despedaça a si mesma." — Liturgia do Abidante`
        : `"Without the center, the wheel tears itself to splinters." — The Abider Liturgy`,
    },
    {
      id: 'layer_will',
      category: 'layers',
      title: isPt ? 'VONTADE — Camada V' : 'WILL — Layer V',
      subtitle: isPt ? 'A Forja Dourada Radiante' : 'The Radiant Golden Forge',
      color: '#f59e0b',
      badge: isPt ? 'Estrato Dourado' : 'Golden Stratum',
      content: isPt
        ? [
            'A Vontade é a intenção cinética inquebrável que converte a contemplação em ação decisiva.',
            'Ela não hesita; ataca como uma torrente de agulhas douradas velozes e focadas.',
            'O Ressonador Dourado atinge a maior cadência de disparos de toda a Espiral, aniquilando enxames e corredores ligeiros.',
          ]
        : [
            'Will is the unyielding kinetic intention that converts contemplation into action.',
            'It does not waver or tire; it strikes like a torrent of golden needles, unceasing and pure in direction.',
            'The Golden Resonator unleashes the highest fire rate in the Spiral, shredding swift intruders and swarms alike.',
          ],
      quote: isPt
        ? `"O rio não discute com a pedra. Ele simplesmente flui até esculpir o cânion." — Livro da Vontade`
        : `"The river does not debate the stone. It simply flows until the canyon is carved." — Book of Will`,
    },
    {
      id: 'layer_energy',
      category: 'layers',
      title: isPt ? 'ENERGIA — Camada VI' : 'ENERGY — Layer VI',
      subtitle: isPt ? 'O Crisol Solar' : 'The Solar Crucible',
      color: '#f97316',
      badge: isPt ? 'Estrato Solar' : 'Solar Stratum',
      content: isPt
        ? [
            'A Energia é o fogo termonuclear estelar — o calor transformador que derrete cascas rígidas e dissolve casulos endurecidos.',
            'Entidades blindadas em crostas minerais densas não encontram refúgio aqui, pois o Crisol Solar ignora defesas físicas e purifica áreas inteiras em chamas solares.',
          ]
        : [
            'Energy is incandescent nuclear flame—the transformative heat that melts rigid barriers and dissolves hardened ego.',
            'Entities armored in dense material shells find no comfort here, for the Solar Crucible ignores physical resistance and cleanses whole swathes of battlefield in nuclear fire.',
          ],
      quote: isPt
        ? `"Acenda a estrela no interior do crisol, e até o diamante se torna vapor." — Textos Solares`
        : `"Ignite the star within the crucible, and even diamond turns to vapor." — The Solar Texts`,
    },
    {
      id: 'layer_matter',
      category: 'layers',
      title: isPt ? 'MATÉRIA — Camada VII' : 'MATTER — Layer VII',
      subtitle: isPt ? 'O Alicerce Carmesim' : 'The Crimson Bedrock',
      color: '#f43f5e',
      badge: isPt ? 'Estrato Carmesim' : 'Crimson Stratum',
      content: isPt
        ? [
            'A Matéria é a âncora densa e palpável. O leito sobre o qual todas as ideias sublimes precisam repousar para ganhar forma.',
            'A Âncora Material gera pulsos gravitacionais sísmicos, imobilizando horrores invasores e desacelerando seu avanço em direção à Cinza Sagrada.',
          ]
        : [
            'Matter is the dense tangible anchor. The bedrock upon which all ethereal ideas must stand to exist.',
            'The Material Anchor radiates high-density gravitational shockwaves, anchoring approaching horrors and slowing their progress toward the Sacred Ash.',
          ],
      quote: isPt
        ? `"Honre a pedra sob suas sandálias, pois sem ela o cosmos é uma queda interminável." — Monólitos do Alicerce`
        : `"Honor the stone beneath your sandals, for without it the cosmos is an endless fall." — The Bedrock Monoliths`,
    },

    // THE SEVEN TOWERS
    {
      id: 'tower_silent_observatory',
      category: 'towers',
      title: isPt ? 'O Observatório Silencioso' : 'The Silent Observatory',
      subtitle: isPt ? 'Artilharia Pesada Violeta' : 'Violet Heavy Defense',
      color: '#a855f7',
      badge: isPt ? 'Destruidor de Titãs' : 'Single-Target Titan Smasher',
      content: isPt
        ? [
            'Função Primária: Destruição concentrada a longa distância contra alvos de alta vida.',
            'Pontos Fortes: Dano individual colossal; atinge o Nível 3 "Silêncio Absoluto" com 50% de perfuração de armadura.',
            'Fraquezas: Cadência de tiro lenta. Vulnerável a hordas rápidas sem cobertura.',
            'Habilidade Ativa — Raio da Quietude: Abate instantaneamente o alvo de maior vida em campo com 350% de dano crítico.',
          ]
        : [
            'Primary Role: Concentrated long-range destruction against individual threats.',
            'Strengths: Massive single-shot damage; reaches Tier 3 "Absolute Silence" with 50% armor penetration.',
            'Weaknesses: Slow attack cadence. Vulnerable when swarmed by dense light units without support.',
            'Active Ability — Stillness Ray: Instantly smites the highest-health target on the field for 350% critical damage.',
          ],
    },
    {
      id: 'tower_astral_eye',
      category: 'towers',
      title: isPt ? 'O Olho Astral' : 'The Astral Eye',
      subtitle: isPt ? 'Visão Índigo e Revelador' : 'Indigo Vision & Marker',
      color: '#6366f1',
      badge: isPt ? 'Utilitário / Detector' : 'Utility / Detector',
      content: isPt
        ? [
            'Função Primária: Detecção de camuflagem, amplo campo de visão e amplificação global de dano.',
            'Pontos Fortes: Alcance imenso; marca alvos para sofrerem de +20% a +35% a mais de dano de todas as torres aliadas.',
            'Fraquezas: Dano direto moderado.',
            'Habilidade Ativa — Olhar Onipresente: Remove a camuflagem de todos os inimigos no mapa e os marca por 8 segundos.',
          ]
        : [
            'Primary Role: Stealth detection, broad surveillance, and universal damage amplification.',
            'Strengths: Vast attack range; permanently marks targets so that all other allied towers deal +20% to +35% increased damage.',
            'Weaknesses: Moderate direct DPS.',
            'Active Ability — Omnipresent Gaze: Removes all enemy cloaks across the entire map and marks every foe for 8 seconds.',
          ],
    },
    {
      id: 'tower_thought_engine',
      category: 'towers',
      title: isPt ? 'O Motor do Pensamento' : 'The Thought Engine',
      subtitle: isPt ? 'Sinapses em Cadeia Azure' : 'Azure Chaining Synapse',
      color: '#06b6d4',
      badge: isPt ? 'Relâmpago & Lentidão' : 'Chain Lightning & Crowd Slow',
      content: isPt
        ? [
            'Função Primária: Supressão de múltiplos alvos e desaceleração cinética.',
            'Pontos Fortes: Arcos elétricos pulam em até 5 inimigos ao mesmo tempo, reduzindo sua velocidade em até 50%.',
            'Fraquezas: O dano é distribuído entre os alvos atingidos.',
            'Habilidade Ativa — Sobrecarga Sináptica: Parisa todos os inimigos atingidos em estase mental por 3 segundos.',
          ]
        : [
            'Primary Role: Multi-target suppression and kinetic deceleration.',
            'Strengths: Synaptic lightning jumps up to 5 enemies simultaneously, reducing their speed by up to 50%.',
            'Weaknesses: Damage is divided among chained targets.',
            'Active Ability — Synaptic Overload: Paralyzes all chained enemies in mental stasis for 3 seconds.',
          ],
    },
    {
      id: 'tower_sanctuary',
      category: 'towers',
      title: isPt ? 'O Santuário' : 'The Sanctuary',
      subtitle: isPt ? 'Pilar do Coração Esmeralda' : 'Emerald Heart Pillar',
      color: '#10b981',
      badge: isPt ? 'Suporte & Regeneração' : 'Support & Regeneration',
      content: isPt
        ? [
            'Função Primária: Sustentação da Cinza Sagrada e fortalecimento das estruturas ao redor.',
            'Pontos Fortes: Regenera passivamente o Equilíbrio (+3 a +10 por onda); fornece aura de +15% a +40% de bônus de dano a torres vizinhas.',
            'Fraquezas: Dano ofensivo próprio reduzido.',
            'Habilidade Ativa — Pulso Harmônico: Restaura +10 de Equilíbrio imediatamente ao núcleo central e purifica efeitos negativos.',
          ]
        : [
            'Primary Role: Sustaining the Sacred Ash and supercharging adjacent defensive structures.',
            'Strengths: Passively regenerates Equilibrium (+3 to +10 per wave); provides +15% to +40% bonus damage aura to neighboring towers.',
            'Weaknesses: Modest personal attack damage.',
            'Active Ability — Harmonic Pulse: Instantly restores +10 Equilibrium to the central core and cleanses nearby tower debuffs.',
          ],
    },
    {
      id: 'tower_golden_resonator',
      category: 'towers',
      title: isPt ? 'O Ressonador Dourado' : 'The Golden Resonator',
      subtitle: isPt ? 'Metralhadora da Vontade' : 'Radiant Will Gatling',
      color: '#f59e0b',
      badge: isPt ? 'Dilacerador de Enxames' : 'Rapid-Fire Swarm Shredder',
      content: isPt
        ? [
            'Função Primária: Eliminação ultra-rápida de corredores velozes e hordas compactas.',
            'Pontos Fortes: Maior cadência de tiro da Espiral (até 6.2 disparos/segundo); rastreamento incansável.',
            'Fraquezas: Menor eficiência contra armaduras pesadas, salvo se combinado ao Crisol Solar.',
            'Habilidade Ativa — Tempestade da Vontade: Quadruplica a velocidade de ataque por 6 segundos frenéticos.',
          ]
        : [
            'Primary Role: Rapid-fire elimination of fast runners and light swarms.',
            'Strengths: Unmatched fire rate (up to 6.2 attacks/sec); relentless single-target tracking.',
            'Weaknesses: Reduced effectiveness against heavy armor unless paired with the Solar Crucible.',
            'Active Ability — Willstorm: Quadruples attack speed for 6 seconds of frantic golden devastation.',
          ],
    },
    {
      id: 'tower_solar_crucible',
      category: 'towers',
      title: isPt ? 'O Crisol Solar' : 'The Solar Crucible',
      subtitle: isPt ? 'Morteiro de Energia Incandescente' : 'Incandescent Energy Mortar',
      color: '#f97316',
      badge: isPt ? 'Dano em Área & Derretimento' : 'Area-of-Effect & Armor Melting',
      content: isPt
        ? [
            'Função Primária: Explodir aglomerações e derreter Materialistas densamente protegidos.',
            'Pontos Fortes: Raio de explosão expansivo (até 110px); até 100% de perfuração de armadura no Nível 3 (Dano Verdadeiro).',
            'Fraquezas: Projétil em arco mais lento; exige alvos agrupados para valor máximo.',
            'Habilidade Ativa — Erupção Solar: Despeja uma mini-supernova nas coordenadas indicadas, causando 400 de dano instantâneo em área.',
          ]
        : [
            'Primary Role: Exploding dense enemy packs and melting heavily armored Materialists.',
            'Strengths: Large blast radius (up to 110px); up to 100% armor penetration at Tier 3 (True Damage).',
            'Weaknesses: Slow projectile arc; requires clustered targets to maximize value.',
            'Active Ability — Solar Flare: Drops a mini-supernova at target coordinates, dealing 400 instant AoE damage.',
          ],
    },
    {
      id: 'tower_material_anchor',
      category: 'towers',
      title: isPt ? 'A Âncora Material' : 'The Material Anchor',
      subtitle: isPt ? 'Âncora Tectônica Carmesim' : 'Crimson Tectonic Anchor',
      color: '#f43f5e',
      badge: isPt ? 'Choque Cinético & Imobilização' : 'Heavy Kinetic Shock & Cripple',
      content: isPt
        ? [
            'Função Primária: Controle de multidões pesado e frenagem sísmica.',
            'Pontos Fortes: Ondas de choque causam até 70% de lentidão em uma ampla área ao redor da torre.',
            'Fraquezas: Raio de alcance mais compacto.',
            'Habilidade Ativa — Poço Gravitacional: Gera um vórtice gravitacional de alta densidade que paralisa inimigos próximos por 4 segundos.',
          ]
        : [
            'Primary Role: Heavy crowd deceleration and seismic shock.',
            'Strengths: High-impact shockwaves inflict up to 70% movement slow in a massive footprint.',
            'Weaknesses: Short firing range.',
            'Active Ability — Gravitational Well: Generates a high-density singularity anchoring all nearby enemies in place for 4 seconds.',
          ],
    },

    // DISTORTIONS / ENEMIES
    {
      id: 'enemy_void',
      category: 'enemies',
      title: isPt ? 'O Vazio' : 'The Void',
      subtitle: isPt ? 'Distorções Cósmicas Básicas' : 'Basic Cosmic Distortions',
      color: '#94a3b8',
      badge: isPt ? 'Entidade de Enxame' : 'Swarm Entity',
      content: isPt
        ? [
            'A manifestação elementar do desequilíbrio. O Vazio avança em fileiras constantes.',
            'Vulnerável a todas as torres, especialmente ao fogo rápido do Ressonador Dourado.',
          ]
        : [
            'The baseline manifestation of imbalance. The Void travels in steady columns.',
            'Vulnerable to all towers, especially the rapid fire of the Golden Resonator.',
          ],
    },
    {
      id: 'enemy_false_one',
      category: 'enemies',
      title: isPt ? 'O Falso' : 'The False One',
      subtitle: isPt ? 'Fantasma Enganador' : 'Deceptive Phantasm',
      color: '#c084fc',
      badge: isPt ? 'Desvio de Fase' : 'Phase Jitter',
      content: isPt
        ? [
            'Distorce os cálculos de distância e salta de fase na rota, confundindo o rastreamento das torres.',
            'Mais bem combatido com Motores do Pensamento (raios encadeados ignoram evasões) e Olhos Astrais.',
          ]
        : [
            'Distorts distance calculations and phase-shifts along the path, briefly confusing tower targeting.',
            'Best countered with Thought Engines (chain lightning ignores evasive hops) and Astral Eyes.',
          ],
    },
    {
      id: 'enemy_stepper',
      category: 'enemies',
      title: isPt ? 'O Saltador' : 'The Stepper',
      subtitle: isPt ? 'Corredor Hipercinético' : 'Hyper-Kinetic Sprinter',
      color: '#38bdf8',
      badge: isPt ? 'Alta Velocidade' : 'High Speed',
      content: isPt
        ? [
            'Move-se com rapidez estonteante. Pode ultrapassar torres lentas caso não haja controle de multidão.',
            'Combatido com as ondas lentas da Âncora Material e as agulhas do Ressonador Dourado.',
          ]
        : [
            'Moves with blinding speed. Can slip past slow-firing towers if no crowd control is established.',
            'Countered by Material Anchor seismic slowing and rapid Golden Resonator needles.',
          ],
    },
    {
      id: 'enemy_materialist',
      category: 'enemies',
      title: isPt ? 'O Materialista' : 'The Materialist',
      subtitle: isPt ? 'Colosso Blindado' : 'Armored Juggernaut',
      color: '#e11d48',
      badge: isPt ? 'Armadura Pesada (65% Resistência)' : 'Heavy Armor (65% Resistance)',
      content: isPt
        ? [
            'Revestido por densas conchas minerais. Ignora grande parte dos danos cinéticos convencionais.',
            'Altamente vulnerável ao Crisol Solar (que derrete armaduras) e Observatórios de nível elevado.',
          ]
        : [
            'Covered in dense mineral shells. Shrugs off physical and kinetic needle attacks.',
            'Extremely vulnerable to the Solar Crucible (which ignores and melts armor) and high-tier Silent Observatories.',
          ],
    },
    {
      id: 'enemy_agitator',
      category: 'enemies',
      title: isPt ? 'O Agitador' : 'The Agitator',
      subtitle: isPt ? 'Catalisador de Ruído' : 'Disruption Catalyst',
      color: '#facc15',
      badge: isPt ? 'Debuffador de Torres' : 'Tower Debuffer',
      content: isPt
        ? [
            'Emite uma frequência caótica que reduz a velocidade de ataque de torres próximas em 30%.',
            'Deve ser priorizado à distância por Observatórios Silenciosos antes que se aproxime do bastião.',
          ]
        : [
            'Radiates a discordant frequency that slows down the attack rate of nearby towers by 30%.',
            'Must be prioritized by long-range Silent Observatories before it closes distance.',
          ],
    },
    {
      id: 'enemy_silencer',
      category: 'enemies',
      title: isPt ? 'O Silenciador' : 'The Silencer',
      subtitle: isPt ? 'Tecelão da Névoa' : 'Veil Shrouder',
      color: '#818cf8',
      badge: isPt ? 'Camuflagem em Área' : 'Area Cloaking',
      content: isPt
        ? [
            'Dispersa uma névoa cósmica que oculta a si e aliados próximos de torres que não possuem detecção.',
            'Requer a visão penetrante do Olho Astral para revelar os invasores furtivos.',
          ]
        : [
            'Emits a shroud of cosmic fog that conceals itself and adjacent enemies from towers lacking detection.',
            'Requires an Astral Eye to pierce the veil and expose the hidden advance.',
          ],
    },
    {
      id: 'enemy_stranger',
      category: 'enemies',
      title: isPt ? 'O Estranho' : 'The Stranger',
      subtitle: isPt ? 'Anomalia Extradimensional' : 'Extradimensional Anomaly',
      color: '#fb923c',
      badge: isPt ? 'Elite / Teletransporte' : 'Mini-Boss / Blinker',
      content: isPt
        ? [
            'Um andarilho de além do espaço conhecido. Possui vitalidade prodigiosa e salta segmentos da pista.',
            'Exige desaceleração coordenada e fogo concentrado de calibre pesado.',
          ]
        : [
            'A massive wanderer from beyond known space. Possesses dense health and periodically blinks forward.',
            'Requires coordinated slow effects and focused heavy caliber firepower.',
          ],
    },
    {
      id: 'enemy_great_void',
      category: 'enemies',
      title: isPt ? 'O Grande Vazio' : 'The Great Void',
      subtitle: isPt ? 'Senhor do Colapso Primordial' : 'Lord of Primordial Collapse',
      color: '#e879f9',
      badge: isPt ? 'Chefe Cósmico Multifásico' : 'Multi-Phase Cosmic Boss',
      content: isPt
        ? [
            'O zênite da entropia cósmica. O Grande Vazio entra em campo com mais de 4.200 de vida e três fases de fúria: Égide Cósmica, Tempestade de Distorção e Cataclismo.',
            'Para derrotá-lo, o Abidante deve tecer as sete torres em uma sinfonia perfeita e disparar a Ressonância da Espiral em momentos cruciais.',
          ]
        : [
            'The cosmic apex of entropy. The Great Void enters with 4,200+ health and shifts through three combat phases: Cosmic Aegis, Distortion Storm, and Cataclysm.',
            'To overcome it, the Abider must weave all seven towers into a harmonic web and discharge Spiral Resonance at crucial moments.',
          ],
    },

    // PHILOSOPHY OF ABIDAR & GOSPEL
    {
      id: 'phil_equilibrium',
      category: 'philosophy',
      title: isPt ? 'A Cinza Sagrada e o Equilíbrio' : 'The Sacred Ash & Equilibrium',
      subtitle: isPt ? 'O Ponto de Repouso' : 'The Point of Rest',
      color: '#fbbf24',
      badge: isPt ? 'Doutrina Central' : 'Core Doctrine',
      content: isPt
        ? [
            'No centro de todas as sete Dimenúveis repousa a Cinza Sagrada. Não é um ídolo, mas o ponto de apoio sobre o qual todo o movimento se equilibra.',
            'A meta de um Abidante não é a matança desenfreada, mas a contenção e o redirecionamento. Quando o equilíbrio atinge zero, a Espiral se desfaz em ruído sem sentido.',
            'Mantenha a harmonia. O universo não exige conquista; ele exige alinhamento.',
          ]
        : [
            'At the center of all seven Dimenuous Layers lies the Sacred Ash. It is not an idol, but the pivot upon which all movement balances.',
            'The goal of an Abider is not senseless slaughter, but containment and redirection. When equilibrium drops to zero, the Spiral unravels into meaningless static.',
            'Keep the balance. The universe does not ask for conquest; it asks for alignment.',
          ],
      quote: isPt
        ? `"Aquele que luta contra o rio é levado pela corrente. Aquele que constrói o moinho gira a roda." — ${gospelRef}`
        : `"He who fights the river is swept away. He who builds the weir turns the wheel." — ${gospelRef}`,
    },
    {
      id: 'phil_spiral_resonance',
      category: 'philosophy',
      title: isPt ? 'A Ressonância da Espiral' : 'The Spiral Resonance',
      subtitle: isPt ? 'Acessando o Infinito' : 'Tapping the Infinite',
      color: '#c084fc',
      badge: isPt ? 'Poder Transcendente' : 'Transcendent Power',
      content: isPt
        ? [
            'Cada distorção contida devolve essência pura à Espiral. Quando essa ressonância culmina, o Abidante pode invocar um dos quatro decretos cósmicos:',
            '• Quietude Temporal — Congela o fluxo temporal, reduzindo invasores a uma fração de velocidade.',
            '• Espiral Dourada — Infunde cada torre com rapidez cegante e golpes críticos garantidos.',
            '• Presença Silenciosa — Canaliza tranquilidade para restaurar a integridade da Cinza Sagrada.',
            '• Reinício Cósmico — Uma onda de choque radiante que calcina as distorções do tabuleiro.',
          ]
        : [
            'Every distortion contained returns pure essence to the Spiral. When this resonance reaches its peak, the Abider may invoke one of four cosmic decrees:',
            '• Temporal Stillness — Freezes the rush of time, slowing all invaders to a crawl.',
            '• Golden Spiral — Infuses every tower with blinding speed and critical strikes.',
            '• Silent Presence — Channeling tranquility to heal the Sacred Ash directly.',
            '• Cosmic Reset — A radiant shockwave that scorches all distortions from the board.',
          ],
      quote: isPt
        ? `"O tempo certo é o pulso da maestria." — Manuscrito de Abidar VII`
        : `"Timing is the heartbeat of mastery." — Abide Scroll VII`,
    },

    // THE DUDE / O CARA
    {
      id: 'dude_wisdom_1',
      category: 'dude',
      title: isPt ? `${theDudeName} Sobre o Pânico` : `${theDudeName} on Panic`,
      subtitle: isPt ? 'Transmissões da Pista Cósmica' : 'Cosmic Bowling Alley Transmissions',
      color: '#facc15',
      badge: theDudeName,
      content: isPt
        ? [
            '"Cara, o universo já é complicado o bastante. Você não precisa piorar as coisas se desesperando a cada nova onda."',
            '"Quando um chefe gigantesco vier rolando pela pista, relaxe os ombros. Cheque sua essência, plante um bom crisol e deixe a gravidade fazer o trabalho pesado."',
          ]
        : [
            '"Man, the universe is complicated enough. You don\'t have to make it worse by stressing every single wave."',
            '"When a big boss comes rolling down the lane, don\'t tense up. Just check your essence, plant a good crucible, and let gravity do the heavy lifting."',
          ],
      quote: isPt
        ? `"Não lute contra o universo inteiro, cara. Apenas mantenha a pista desimpedida." — ${theDudeName}`
        : `"Don't fight the entire universe, man. Just keep the lane open." — ${theDudeName}`,
    },
    {
      id: 'dude_wisdom_2',
      category: 'dude',
      title: isPt ? `${theDudeName} Sobre o Equilíbrio` : `${theDudeName} on Balance`,
      subtitle: isPt ? 'O Tapete da Realidade' : 'The Rug of Reality',
      color: '#34d399',
      badge: theDudeName,
      content: isPt
        ? [
            '"Aquela Cinza Sagrada realmente amarra a sala toda, sabe? Se você deixar um monte de insetos do vazio pisarem nela, o ambiente inteiro se estraga."',
            '"Trate suas torres como sua equipe de boliche. Você tem o que acerta forte, o cara com boa visão e aquele amigo que só traz os petiscos. Harmonia, cara."',
          ]
        : [
            '"That Sacred Ash really ties the whole Spiral together, you know? You let a bunch of void bugs walk on it, and suddenly the whole room is ruined."',
            '"Treat your towers like your bowling team. You got your heavy hitter, your guy with good vision, and your buddy who just brings the snacks. Harmony, man."',
          ],
      quote: isPt
        ? `"A Espiral abida. E nós também abidamos." — ${theDudeName}`
        : `"The Spiral abides. And so do we." — ${theDudeName}`,
    },
  ];
}
