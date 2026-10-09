import { PrimordialMagic, Spell } from '../types';
import {
  NaturalMagicIcon,
  WildMagicIcon,
  ArcaneMagicIcon,
  DivineMagicIcon,
  ExtraplanarMagicIcon,
  ProfaneMagicIcon,
  PRIMORDIAL_IMAGE_URLS,
} from '../components/PrimordialIcon';
import React from 'react';

export interface PrimordialMagicInfo {
  name: PrimordialMagic;
  nameEn: string;
  source: string;
  domain: string;
  adamantiteEffect: string;
  realmNotes: string;
  color: string; // e.g. '#10b981'
  textColor: string; // Tailwind class
  bgColor: string; // Tailwind class
  borderColor: string; // Tailwind class
  accentGlow: string;
  icon: React.FC<{ className?: string; alt?: string }>;
  iconUrl?: string;
  // Dracopedia official canonical document fields
  canonicalId?: string;
  cosmicOrigin?: string;
  properties?: {
    indomable: string;
    transformable: string;
    inestable: string;
    eterna: string;
  };
  mastersTitle?: string;
  masters?: string[];
  dangers?: string[];
  interactions?: string;
}

export const PRIMORDIAL_MAGICS: PrimordialMagicInfo[] = [
  {
    name: 'Magia Natural',
    nameEn: 'Natural Magic',
    source: 'El latido del mundo vivo y los elementos primordiales en su estado puro, presentes en cada llama, tempestad, raíz, montaña y río.',
    domain: 'Elementos (fuego, frío, relámpagos, trueno, tierra), flora, fauna, clima local y regeneración acelerada de ecosistemas',
    adamantiteEffect: 'Sintoniza con las corrientes telúricas de la tierra viva, acelerando la regeneración celular y estimulando el crecimiento vegetal instantáneo.',
    realmNotes: 'Inmune a la corrupción de la Magia Divina por su conexión intrínseca con la vida, pero vulnerable a su represión si se considera que ha desequilibrado el orden natural.',
    color: '#22c55e', // Pure Nature / Foliage Green
    textColor: 'text-green-400',
    bgColor: 'bg-green-950/45',
    borderColor: 'border-green-500/50',
    accentGlow: 'rgba(34, 197, 94, 0.55)',
    icon: NaturalMagicIcon,
    iconUrl: PRIMORDIAL_IMAGE_URLS['Magia Natural'],
    canonicalId: 'magia-natural',
    cosmicOrigin: 'La Magia Natural es el latido del mundo hecho magia, una fuerza que late en cada raíz, montaña y río. No es un don de los dioses ni un artificio de los mortales, sino la esencia misma de la existencia material.',
    properties: {
      indomable: 'Caótica en su perfección, no sigue reglas escritas, sino los instintos más profundos de la naturaleza y los elementos.',
      transformable: 'Fluye como la savia en los árboles, crece como la maleza en ruinas abandonadas y se retuerce en los volcanes para sobrevivir y equilibrar.',
      inestable: 'Desata fenómenos climáticos como tormentas purificadoras o sequías implacables para castigar a los depredadores.',
      eterna: 'Inmune a la corrupción de la Magia Divina, pues su pureza radica en su conexión con la vida misma.',
    },
    mastersTitle: 'Poderes y Manifestaciones Canónicas (Dracopedia)',
    masters: [
      'Control sobre los elementos del mundo (fuego, hielo, relámpagos, truenos y cataclismos de meteoros).',
      'Regeneración acelerada de ecosistemas y tejidos vivos dañados.',
      'Control sobre elementos orgánicos, como enredaderas que aprisionan o flores que sanan.',
      'Fenómenos climáticos locales, como tormentas que purifican o sequías que castigan a los depredadores.',
      'Comunicación y metamorfosis en bestias y plantas, permitiendo pactos ancestrales.',
    ],
    dangers: [
      'Vulnerabilidad ante la Magia Divina, que puede reprimirla si rompe el equilibrio natural.',
      'Asilvestramiento irreversible de la conciencia mortal bajo el influjo del instinto salvaje.',
      'Sobrecrecimiento desmedido de flora virulenta que consume asentamientos.',
    ],
    interactions: 'La Magia Natural es inmune a la corrupción de la Magia Divina, pues su pureza radica en su conexión con la vida misma. Sin embargo, es vulnerable a la Magia Divina, que puede reprimirla si se considera que ha desequilibrado el orden natural.',
  },
  {
    name: 'Magia Salvaje',
    nameEn: 'Wild Magic',
    source: 'El aliento del caos original, la chispa que encendió el universo antes de que existieran fórmulas, dogmas, naturalezas o corrupciones',
    domain: 'Magia en estado puro: sin fórmulas de academia, sin naturaleza ni elementos, sin divinidad ni corrupción. Fuerza bruta primordial y alteración libre de la realidad',
    adamantiteEffect: 'Imbúe la adamantita con pulsaciones caóticas primarias capaces de alterar la física local y quebrar protecciones absolutas.',
    realmNotes: 'Dominada parcialmente solo por una decena de magos en la historia: los Videntes del Caos o Tejedores de lo Primordial.',
    color: '#06b6d4', // Cyan / Electric Blue (Llama azul mística de atributo salvaje)
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-950/40',
    borderColor: 'border-cyan-500/40',
    accentGlow: 'rgba(6, 182, 212, 0.4)',
    icon: WildMagicIcon,
    iconUrl: PRIMORDIAL_IMAGE_URLS['Magia Salvaje'],
    canonicalId: 'magia-salvaje',
    cosmicOrigin: 'Esta magia no tiene un origen concreto, pues es el origen. Fluye en el vacío entre los planos, en el corazón de las estrellas moribundas y en los abismos donde el tiempo se distorsiona. Es la materia prima de la que están hechas todas las demás magias, y su naturaleza es simplemente existir, fluir y transformarse en lo que sea necesario.',
    properties: {
      indomable: 'No puede ser controlada por completo; solo puede ser guiada por quienes tienen la voluntad y el conocimiento para intentarlo.',
      transformable: 'Puede convertirse en cualquier otro tipo de magia si se la moldea con suficiente fuerza de voluntad.',
      inestable: 'Su poder es tan grande que puede corromper a quienes la manipulan sin precaución.',
      eterna: 'No tiene principio ni fin; simplemente es y siempre lo será.',
    },
    mastersTitle: 'Maestros: Videntes del Caos o Tejedores de lo Primordial',
    masters: [
      'Crear armas vivientes que se alimentan de Magia Salvaje.',
      'Abrir portales a lugares que no deberían existir.',
      'Manipular el tiempo y el espacio a voluntad (como detener el tiempo sin fórmulas fijas).',
      'Resucitar o doblar la realidad misma mediante el Deseo puro sin fórmulas de academia.',
    ],
    dangers: [
      'Perder la cordura, absorbidos por la energía caótica.',
      'Convertirse en portales vivientes, atrayendo criaturas de otros planos.',
      'Provocar cataclismos mágicos que destruyen regiones enteras.',
    ],
  },
  {
    name: 'Magia Arcana',
    nameEn: 'Arcane Magic',
    source: 'El conocimiento oculto, los secretos de los arcanos y el Quasiplano del Cristal',
    domain: 'Ilusiones, alteración de la percepción, manipulación del tiempo, espejos de azogue y artefactos mágicos',
    adamantiteEffect: 'Conductor perfecto de conjuros; multiplica el poder de los rituales y la imbuición mágica.',
    realmNotes: 'La disciplina más refinada de las academias arcanas de Aeros y la Academia de los Espejos de Drangleic.',
    color: '#3b82f6', // Sapphire Blue (Estrella de 5 puntas de atributo arcano)
    textColor: 'text-blue-400',
    bgColor: 'bg-blue-950/40',
    borderColor: 'border-blue-500/40',
    accentGlow: 'rgba(59, 130, 246, 0.4)',
    icon: ArcaneMagicIcon,
    iconUrl: PRIMORDIAL_IMAGE_URLS['Magia Arcana'],
    canonicalId: 'magia-arcana',
  },
  {
    name: 'Magia Divina',
    nameEn: 'Divine Magic',
    source: 'Los planos celestiales y las deidades primordiales',
    domain: 'Sanación, protección sagrada, bendiciones y juicios divinos',
    adamantiteEffect: 'Escudo viviente contra la corrupción, sana heridas al contacto y repele fuerzas profanas.',
    realmNotes: 'Ampliamente estudiada y venerada en el continente de Aeros.',
    color: '#eab308', // Gold / Amber (Sol de 8 puntas de atributo fe)
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-950/40',
    borderColor: 'border-amber-500/40',
    accentGlow: 'rgba(234, 179, 8, 0.4)',
    icon: DivineMagicIcon,
    iconUrl: PRIMORDIAL_IMAGE_URLS['Magia Divina'],
    canonicalId: 'magia-divina',
  },
  {
    name: 'Magia Extraplanar',
    nameEn: 'Extraplanar Magic',
    source: 'Los planos de existencia ajenos al plano material',
    domain: 'Teletransportación, invocación de entidades extradimensionales y manipulación de realidades alternas',
    adamantiteEffect: 'Portal latente que permite abrir pasadizos hacia otros planos con un sencillo ritual.',
    realmNotes: 'Arte arcano mayor que solo los magos más audaces se atreven a practicar.',
    color: '#ec4899', // Vivid Magenta / Fuchsia Pink (Vórtice espiral de atributo extraplanar)
    textColor: 'text-pink-400',
    bgColor: 'bg-pink-950/40',
    borderColor: 'border-pink-500/40',
    accentGlow: 'rgba(236, 72, 153, 0.4)',
    icon: ExtraplanarMagicIcon,
    iconUrl: PRIMORDIAL_IMAGE_URLS['Magia Extraplanar'],
    canonicalId: 'magia-extraplanar',
  },
  {
    name: 'Magia Profana',
    nameEn: 'Profane Magic',
    source: 'El residuo corrupto que queda cuando lo sagrado es mancillado. Cáncer que devora la vida y se arrastra como un veneno.',
    domain: 'Control de sombras y demonios, cegar con terror y vacío, flagelo marchitador de la naturaleza y absorción de esencia vital',
    adamantiteEffect: 'Afinidad oscura capaz de drenar la vida de enemigos, quebrar la voluntad y marchitar el entorno.',
    realmNotes: 'Linajes vinculados: Blackguards (caballeros caídos con miedo y necrosis) y Nigromantes (eruditos del vacío y ejércitos de condenados).',
    color: '#a855f7', // Purple
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-950/40',
    borderColor: 'border-purple-500/40',
    accentGlow: 'rgba(168, 85, 247, 0.4)',
    icon: ProfaneMagicIcon,
    iconUrl: PRIMORDIAL_IMAGE_URLS['Magia Profana'],
    canonicalId: 'magia-profana',
    cosmicOrigin: 'La Magia Profana, también conocida como Magia Oscura, es la antítesis de la luz y un gusano que carcome el alma de la creación. No es un componente natural del tejido del cosmos, sino una abominación contra el orden universal. Surge de actos que violan el orden natural del universo, como el asesinato de inocentes, la profanación de lo sagrado o el uso de magia prohibida, alimentándose de la corrupción moral y la voluntad de dominio absoluto.',
    properties: {
      indomable: 'Se impone quebrando las leyes morales del universo para deformar la realidad en un espejo distorsionado de tiranía y traición.',
      transformable: 'Se arrastra como un veneno que corrompe la magia natural, marchitando ecosistemas y transformando la vida en parajes de muerte.',
      inestable: 'Cuanto más se usa, más corrompe al usuario, llevándolo a la locura, la muerte o la pérdida gradual de su humanidad.',
      eterna: 'Abominación persistente alimentada por el anhelo egoísta de poder y la decadencia de lo sagrado.',
    },
    mastersTitle: 'Manifestaciones y Poderes (Dracopedia • Caldo de Dragón)',
    masters: [
      'Controlar sombras y entidades malignas: Invocación de demonios menores, frío antinatural y sombras vivientes.',
      'Cegar a los enemigos: Ilusiones de desesperación, terror y vacío que reflejan la pérdida de voluntad.',
      'Flagelo de la Naturaleza: Marchitar ecosistemas enteros, corrompiendo la magia natural en parajes de desolación.',
      'Absorber la esencia vital: Robar la fuerza de otros seres para fortalecerse, dejando cadáveres vacíos a su paso.',
    ],
    dangers: [
      'Vulnerabilidad absoluta a la Magia Divina: La luz sagrada de Resplandor actúa como su némesis natural y único contrapeso purificador.',
      'Pérdida irreversible de la propia humanidad, convirtiendo al practicante en un monstruo sin alma.',
      'Repudio universal y condena a muerte en todo el mundo civilizado.',
    ],
    interactions: 'Actúa como una plaga corrosiva contra la Magia Natural marchitando la vida, y es repelida y destruida por la luz radiante de la Magia Divina.',
  },
];

export const PRIMORDIAL_MAGIC_MAP: Record<PrimordialMagic, PrimordialMagicInfo> = {
  'Magia Natural': PRIMORDIAL_MAGICS[0],
  'Magia Salvaje': PRIMORDIAL_MAGICS[1],
  'Magia Arcana': PRIMORDIAL_MAGICS[2],
  'Magia Divina': PRIMORDIAL_MAGICS[3],
  'Magia Extraplanar': PRIMORDIAL_MAGICS[4],
  'Magia Profana': PRIMORDIAL_MAGICS[5],
};

/**
 * MAPA CANÓNICO Y EXHAUSTIVO DE CADA UNO DE LOS CONJUROS A SUS 6 MAGIAS PRIMORDIALES:
 * 1. Magia Natural: Ecosistemas, plantas, bestias, clima local y regeneración orgánica.
 * 2. Magia Salvaje: Caos primordial, energía elemental en bruto (fuego, hielo, rayos y meteoros).
 * 3. Magia Arcana: Urdimbre pura, intelecto, tiempo, fuerza, ilusiones, reflejos y transmutación.
 * 4. Magia Divina: Deidades sagradas, luz radiante celestial, bendiciones, plegarias y sanación sagrada.
 * 5. Magia Extraplanar: Salto interdimensional, teletransporte, destierro, viajes planares y entes cósmicos.
 * 6. Magia Profana: Muerte, sombras, necrosis, maldiciones oscuras y siega vital.
 */
export const CANONICAL_SPELL_PRIMORDIAL_MAP: Record<string, PrimordialMagic> = {
  // === 1. MAGIA NATURAL (23 Conjuros: Elementos + Naturaleza) ===
  // Elementos: Fuego, Frío, Relámpago, Trueno, Meteoros
  'saeta-de-fuego': 'Magia Natural',
  'rayo-de-escarcha': 'Magia Natural',
  'ola-tronante': 'Magia Natural',
  'rayo-abrasador': 'Magia Natural',
  'bola-de-fuego': 'Magia Natural',
  'relampago': 'Magia Natural',
  'muro-de-fuego': 'Magia Natural',
  'cono-de-frio': 'Magia Natural',
  'cadena-de-relampagos': 'Magia Natural',
  'lluvia-de-meteoros': 'Magia Natural',
  // Naturaleza: Flora, Fauna, Clima local y Regeneración viva
  'latigo-de-espinas': 'Magia Natural',
  'enredo': 'Magia Natural',
  'buenas-bayas': 'Magia Natural',
  'hablar-con-los-animales': 'Magia Natural',
  'piel-de-roble': 'Magia Natural',
  'rayo-de-luna': 'Magia Natural',
  'telarana': 'Magia Natural',
  'llamar-al-relampago': 'Magia Natural',
  'crecimiento-vegetal': 'Magia Natural',
  'hablar-con-las-plantas': 'Magia Natural',
  'polimorfar': 'Magia Natural',
  'muro-de-espinas': 'Magia Natural',
  'regenerar': 'Magia Natural',

  // === 2. MAGIA SALVAJE (16 Conjuros: Magia en estado puro, aliento del caos, sin fórmulas, sin naturaleza, sin divinidad, sin corrupción) ===
  'prestidigitacion': 'Magia Salvaje',
  'saeta-caotica': 'Magia Salvaje',
  'orbe-cromatico': 'Magia Salvaje',
  'rociada-de-color': 'Magia Salvaje',
  'proyectil-magico': 'Magia Salvaje',
  'parpadeo': 'Magia Salvaje',
  'patron-hipnotico': 'Magia Salvaje',
  'confusion': 'Magia Salvaje',
  'esfera-elastica-de-otiluke': 'Magia Salvaje',
  'muro-de-fuerza': 'Magia Salvaje',
  'telequinesia': 'Magia Salvaje',
  'desintegrar': 'Magia Salvaje',
  'rociada-prismatica': 'Magia Salvaje',
  'parar-el-tiempo': 'Magia Salvaje',
  'polimorfia-verdadera': 'Magia Salvaje',

  // === 3. MAGIA ARCANA (15 Conjuros: Fórmulas de academia, geometría de la urdimbre, espejos, ilusiones y artificio) ===
  'mano-de-mago': 'Magia Arcana',
  'ilusion-menor': 'Magia Arcana',
  'escudo': 'Magia Arcana',
  'armadura-de-mago': 'Magia Arcana',
  'dormir': 'Magia Arcana',
  'detectar-magia': 'Magia Arcana',
  'hechizar-persona': 'Magia Arcana',
  'caida-de-pluma': 'Magia Arcana',
  'invisibilidad': 'Magia Arcana',
  'imagen-multiple': 'Magia Arcana',
  'retener-persona': 'Magia Arcana',
  'contraconjuro': 'Magia Arcana',
  'disipar-magia': 'Magia Arcana',
  'volar': 'Magia Arcana',
  'acelerar': 'Magia Arcana',

  // === 4. MAGIA DIVINA (8 Conjuros: Deidades sagradas, luz radiante celestial, bendiciones, oraciones y milagros) ===
  'llama-sagrada': 'Magia Divina',
  'orientacion': 'Magia Divina',
  'curar-heridas': 'Magia Divina',
  'palabra-de-curacion': 'Magia Divina',
  'saeta-guiadora': 'Magia Divina',
  'arma-espiritual': 'Magia Divina',
  'guardianes-espirituales': 'Magia Divina',
  'revivir': 'Magia Divina',

  // === 5. MAGIA EXTRAPLANAR (6 Conjuros: Salto interdimensional, teletransporte, destierro y planos exteriores) ===
  'descarga-sobrenatural': 'Magia Extraplanar',
  'paso-brumoso': 'Magia Extraplanar',
  'destierro': 'Magia Extraplanar',
  'puerta-dimensional': 'Magia Extraplanar',
  'teletransporte': 'Magia Extraplanar',
  'dominar-monstruo': 'Magia Extraplanar',

  // === 6. MAGIA PROFANA (Multidisciplinar según Documento Oficial Dracopedia: Conjuración, Ilusión, Encantamiento, Evocación, Nigromancia) ===
  // Trucos
  'doble-por-los-muertos': 'Magia Profana',
  'toll-the-dead': 'Magia Profana',
  'toque-helado': 'Magia Profana',
  'chill-touch': 'Magia Profana',
  'bone-chill': 'Magia Profana',
  'burla-cruel': 'Magia Profana',
  'burla-danina': 'Magia Profana',
  'vicious-mockery': 'Magia Profana',
  'aguijon-debilitante': 'Magia Profana',
  'sapping-sting': 'Magia Profana',
  'egw-sapping-sting': 'Magia Profana',

  // Nivel 1: Sombras, dolor y entidades malignas
  'brazos-de-hadar': 'Magia Profana',
  'arms-of-hadar': 'Magia Profana',
  'xphb-arms-of-hadar': 'Magia Profana',
  'reprension-infernal': 'Magia Profana',
  'hellish-rebuke': 'Magia Profana',
  'infligir-heridas': 'Magia Profana',
  'inflict-wounds': 'Magia Profana',
  'maleficio': 'Magia Profana',
  'hex': 'Magia Profana',
  'perdicion': 'Magia Profana',
  'bane': 'Magia Profana',
  'susurros-disonantes': 'Magia Profana',
  'dissonant-whispers': 'Magia Profana',
  'causar-miedo': 'Magia Profana',
  'cause-fear': 'Magia Profana',
  'xge-cause-fear': 'Magia Profana',
  'rayo-de-enfermedad': 'Magia Profana',
  'ray-of-sickness': 'Magia Profana',
  'vida-falsa': 'Magia Profana',
  'false-life': 'Magia Profana',

  // Nivel 2: Sombras vivientes, ceguera y dominio
  'oscuridad': 'Magia Profana',
  'darkness': 'Magia Profana',
  'ceguera-sordera': 'Magia Profana',
  'blindness-deafness': 'Magia Profana',
  'corona-de-locura': 'Magia Profana',
  'crown-of-madness': 'Magia Profana',
  'xphb-crown-of-madness': 'Magia Profana',
  'espada-de-sombra': 'Magia Profana',
  'shadow-blade': 'Magia Profana',
  'xge-shadow-blade': 'Magia Profana',
  'latigo-mental-de-tasha': 'Magia Profana',
  'tashas-mind-whip': 'Magia Profana',
  'tce-tashas-mind-whip': 'Magia Profana',
  'rayo-de-debilitamiento': 'Magia Profana',
  'ray-of-enfeeblement': 'Magia Profana',

  // Nivel 3: Desesperación, terror, drenaje vital y ejércitos de condenados
  'miedo': 'Magia Profana',
  'terror': 'Magia Profana',
  'fear': 'Magia Profana',
  'hambre-de-hadar': 'Magia Profana',
  'hunger-of-hadar': 'Magia Profana',
  'toque-vampirico': 'Magia Profana',
  'vampiric-touch': 'Magia Profana',
  'animar-a-los-muertos': 'Magia Profana',
  'animate-dead': 'Magia Profana',
  'imponer-maldicion': 'Magia Profana',
  'bestow-curse': 'Magia Profana',
  'convocar-demonios-menores': 'Magia Profana',
  'summon-lesser-demons': 'Magia Profana',
  'xge-summon-lesser-demons': 'Magia Profana',
  'enemigos-abundantes': 'Magia Profana',
  'enemies-abound': 'Magia Profana',
  'xge-enemies-abound': 'Magia Profana',

  // Nivel 4: Flagelo de la naturaleza y pesadillas
  'marchitar': 'Magia Profana',
  'blight': 'Magia Profana',
  'sombra-de-moil': 'Magia Profana',
  'shadow-of-moil': 'Magia Profana',
  'xge-shadow-of-moil': 'Magia Profana',
  'asesino-fantasmal': 'Magia Profana',
  'phantasmal-killer': 'Magia Profana',
  'invocar-demonio-mayor': 'Magia Profana',
  'summon-greater-demon': 'Magia Profana',
  'xge-summon-greater-demon': 'Magia Profana',

  // Nivel 5: Enjambres devoradores del vacío y drenaje
  'plaga-de-insectos': 'Magia Profana',
  'insect-plague': 'Magia Profana',
  'enervacion': 'Magia Profana',
  'enervation': 'Magia Profana',
  'xge-enervation': 'Magia Profana',
  'danza-macabra': 'Magia Profana',
  'danse-macabre': 'Magia Profana',
  'xge-danse-macabre': 'Magia Profana',
  'estatica-sinaptica': 'Magia Profana',
  'synaptic-static': 'Magia Profana',
  'xge-synaptic-static': 'Magia Profana',
  'inundacion-de-energia-negativa': 'Magia Profana',
  'negative-energy-flood': 'Magia Profana',
  'xge-negative-energy-flood': 'Magia Profana',
  'invocar-infernal': 'Magia Profana',
  'summon-fiend': 'Magia Profana',
  'tce-summon-fiend': 'Magia Profana',
  'llamada-infernal': 'Magia Profana',
  'infernal-calling': 'Magia Profana',
  'xge-infernal-calling': 'Magia Profana',
  'contagio': 'Magia Profana',
  'contagion': 'Magia Profana',

  // Niveles 6+: Asesinato ritual, dominio absoluto y horrores
  'danar': 'Magia Profana',
  'harm': 'Magia Profana',
  'mal-de-ojo': 'Magia Profana',
  'eyebite': 'Magia Profana',
  'jaula-del-alma': 'Magia Profana',
  'soul-cage': 'Magia Profana',
  'xge-soul-cage': 'Magia Profana',
  'circulo-de-muerte': 'Magia Profana',
  'circle-of-death': 'Magia Profana',
  'crear-no-muerto': 'Magia Profana',
  'create-undead': 'Magia Profana',
  'dedo-de-la-muerte': 'Magia Profana',
  'finger-of-death': 'Magia Profana',
  'palabra-de-poder-dolor': 'Magia Profana',
  'power-word-pain': 'Magia Profana',
  'xge-power-word-pain': 'Magia Profana',
  'romper-la-mente': 'Magia Profana',
  'feeblemind': 'Magia Profana',
  'oscuridad-enloquecedora': 'Magia Profana',
  'maddening-darkness': 'Magia Profana',
  'xge-maddening-darkness': 'Magia Profana',
  'palabra-de-poder-matar': 'Magia Profana',
  'power-word-kill': 'Magia Profana',
  'terror-abyecto': 'Magia Profana',
  'weird': 'Magia Profana',

  // === MAGIA SALVAJE (Alias en inglés y códigos de libro) ===
  'chaos-bolt': 'Magia Salvaje',
  'xge-chaos-bolt': 'Magia Salvaje',
  'chromatic-orb': 'Magia Salvaje',
  'color-spray': 'Magia Salvaje',
  'magic-missile': 'Magia Salvaje',
  'blink': 'Magia Salvaje',
  'hypnotic-pattern': 'Magia Salvaje',
  'otilukes-resilient-sphere': 'Magia Salvaje',
  'resilient-sphere': 'Magia Salvaje',
  'wall-of-force': 'Magia Salvaje',
  'forcecage': 'Magia Salvaje',
  'telekinesis': 'Magia Salvaje',
  'disintegrate': 'Magia Salvaje',
  'prismatic-spray': 'Magia Salvaje',
  'prismatic-wall': 'Magia Salvaje',
  'time-stop': 'Magia Salvaje',
  'polymorph': 'Magia Salvaje',
  'true-polymorph': 'Magia Salvaje',
  'prestidigitation': 'Magia Salvaje',
  'feather-fall': 'Magia Salvaje',
  'enlarge-reduce': 'Magia Salvaje',
  'levitate': 'Magia Salvaje',
  'catapult': 'Magia Salvaje',
  'xge-catapult': 'Magia Salvaje',
  'reverse-gravity': 'Magia Salvaje',

  // === MAGIA DIVINA (Alias en inglés para evitar que milagros/curación caigan en otras ramas) ===
  'bendicion-de-astraea': 'Magia Divina',
  'bendicion-astraea': 'Magia Divina',
  'astraeas-blessing': 'Magia Divina',
  'sacred-flame': 'Magia Divina',
  'guidance': 'Magia Divina',
  'cure-wounds': 'Magia Divina',
  'healing-word': 'Magia Divina',
  'guiding-bolt': 'Magia Divina',
  'spiritual-weapon': 'Magia Divina',
  'spirit-guardians': 'Magia Divina',
  'revivify': 'Magia Divina',
  'raise-dead': 'Magia Divina',
  'resurrection': 'Magia Divina',
  'true-resurrection': 'Magia Divina',
  'spare-the-dying': 'Magia Divina',
  'mass-cure-wounds': 'Magia Divina',
  'mass-healing-word': 'Magia Divina',
  'heal': 'Magia Divina',
  'mass-heal': 'Magia Divina',
  'bless': 'Magia Divina',
  'shield-of-faith': 'Magia Divina',
  'remove-curse': 'Magia Divina',

  // === MAGIA EXTRAPLANAR (Alias en inglés) ===
  'eldritch-blast': 'Magia Extraplanar',
  'misty-step': 'Magia Extraplanar',
  'banishment': 'Magia Extraplanar',
  'dimension-door': 'Magia Extraplanar',
  'teleport': 'Magia Extraplanar',
  'teleportation-circle': 'Magia Extraplanar',
  'plane-shift': 'Magia Extraplanar',
  'gate': 'Magia Extraplanar',
  'demiplane': 'Magia Extraplanar',
  'maze': 'Magia Extraplanar',
  'contact-other-plane': 'Magia Extraplanar',
  'planar-ally': 'Magia Extraplanar',
  'planar-binding': 'Magia Extraplanar',
  'arcane-gate': 'Magia Extraplanar',

  // === MAGIA NATURAL (Alias en inglés) ===
  'fire-bolt': 'Magia Natural',
  'ray-of-frost': 'Magia Natural',
  'shocking-grasp': 'Magia Natural',
  'thunderwave': 'Magia Natural',
  'scorching-ray': 'Magia Natural',
  'fireball': 'Magia Natural',
  'lightning-bolt': 'Magia Natural',
  'wall-of-fire': 'Magia Natural',
  'cone-of-cold': 'Magia Natural',
  'chain-lightning': 'Magia Natural',
  'meteor-swarm': 'Magia Natural',
  'thorn-whip': 'Magia Natural',
  'entangle': 'Magia Natural',
  'goodberry': 'Magia Natural',
  'speak-with-animals': 'Magia Natural',
  'barkskin': 'Magia Natural',
  'moonbeam': 'Magia Natural',
  'call-lightning': 'Magia Natural',
  'plant-growth': 'Magia Natural',
  'speak-with-plants': 'Magia Natural',
  'wall-of-thorns': 'Magia Natural',
  'regenerate': 'Magia Natural',
};

function normalizeTextKey(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Obtiene de forma determinista y exacta la Magia Primordial de cualquier conjuro.
 * Cumple con el Documento Canónico de la Dracopedia:
 * - Magia Profana: Multidisciplinar (Conjuración, Ilusión, Encantamiento, Evocación y Nigromancia)
 * - Magia Salvaje: Magia pura, azar, mutación y campos de fuerza sin dogmas
 */
export function getSpellPrimordialMagic(spell: Spell): PrimordialMagic {
  // 1. Asignación explícita (normalizada para admitir variantes en español, inglés o mayúsculas/minúsculas)
  if (spell.primordialMagic) {
    const raw = spell.primordialMagic.trim().toLowerCase();
    for (const p of PRIMORDIAL_MAGICS) {
      if (
        p.name.toLowerCase() === raw ||
        p.nameEn.toLowerCase() === raw ||
        raw.includes(p.name.toLowerCase()) ||
        raw.includes(p.nameEn.toLowerCase())
      ) {
        return p.name;
      }
    }
  }

  const rawId = spell.id || '';
  const cleanId = rawId.replace(/^(xphb|xge|tce|egw|ggr|idrotf|ftd|scc|ai|aag|bmt)-/, '');
  const slugEs = normalizeTextKey(spell.name || '');
  const slugEn = normalizeTextKey(spell.nameEn || '');

  // 2. Mapeo Canónico directo por múltiples claves
  if (CANONICAL_SPELL_PRIMORDIAL_MAP[rawId]) return CANONICAL_SPELL_PRIMORDIAL_MAP[rawId];
  if (CANONICAL_SPELL_PRIMORDIAL_MAP[cleanId]) return CANONICAL_SPELL_PRIMORDIAL_MAP[cleanId];
  if (slugEs && CANONICAL_SPELL_PRIMORDIAL_MAP[slugEs]) return CANONICAL_SPELL_PRIMORDIAL_MAP[slugEs];
  if (slugEn && CANONICAL_SPELL_PRIMORDIAL_MAP[slugEn]) return CANONICAL_SPELL_PRIMORDIAL_MAP[slugEn];

  const nameIndex = ` ${normalizeTextKey(rawId)} ${normalizeTextKey(slugEs)} ${normalizeTextKey(slugEn)} `.replace(/-/g, ' ');

  // 3. Exclusiones sagradas y protectoras (milagros, curación, protecciones celestiales)
  const isSacredExclusion = [
    'remove curse', 'levantar maldicion', 'revivir', 'revivify', 'resurreccion',
    'resurrection', 'raise dead', 'spare the dying', 'sanar', 'heal', 'cure wounds',
    'curar heridas', 'healing word', 'palabra de curacion', 'sacred flame', 'llama sagrada',
    'charm person', 'hechizar persona', 'charm monster', 'encantar monstruo',
    'protection from evil', 'proteccion contra el bien', 'detect evil', 'detectar el bien',
    'dispel evil', 'disipar el bien', 'magic circle', 'circulo magico', 'find familiar'
  ].some(k => nameIndex.includes(` ${k} `));

  if (isSacredExclusion) {
    return 'Magia Divina';
  }

  // 4. MAGIA PROFANA (Dracopedia: Sombras, dolor, corrupción, terror, pérdida de voluntad, plagas y muerte)
  const PROFANE_PHRASES = [
    'hadar', 'demon', 'demonio', 'fiend', 'infernal', 'shadow blade', 'espada de sombra',
    'shadow of moil', 'sombra de moil', 'darkness', 'oscuridad', 'maddening darkness',
    'vicious mockery', 'burla cruel', 'burla danina', 'crown of madness', 'corona de locura',
    'blindness', 'ceguera', 'cause fear', 'causar miedo', 'fear', 'miedo', 'terror',
    'dissonant whispers', 'susurros disonantes', 'mind whip', 'latigo mental',
    'enemies abound', 'enemigos abundantes', 'power word kill', 'palabra de poder matar',
    'power word pain', 'palabra de poder dolor', 'blight', 'marchitar', 'insect plague',
    'plaga de insectos', 'inflict wounds', 'infligir heridas', 'vampiric touch',
    'toque vampirico', 'enervation', 'enervacion', 'finger of death', 'dedo de la muerte',
    'danse macabre', 'danza macabra', 'soul cage', 'jaula del alma', 'negative energy',
    'energia negativa', 'eyebite', 'mal de ojo', 'contagion', 'contagio', 'harm', 'danar',
    'feeblemind', 'romper la mente', 'synaptic static', 'estatica sinaptica', 'chill touch',
    'toque helado', 'bone chill', 'toll the dead', 'doble por los muertos', 'sapping sting',
    'aguijon debilitante', 'hex', 'maleficio', 'bestow curse', 'imponer maldicion',
    'bane', 'perdicion', 'ray of enfeeblement', 'rayo de debilitamiento', 'rayo debilitador',
    'ray of sickness', 'rayo de enfermedad', 'false life', 'falsa vida', 'vida falsa',
    'animate dead', 'animar a los muertos', 'create undead', 'crear muerto viviente',
    'crear no muerto', 'speak with dead', 'hablar con los muertos', 'feign death',
    'fingir muerte', 'gentle repose', 'dulce descanso', 'reposo pacifico', 'magic jar',
    'urna magica', 'recipiente magico', 'circle of death', 'circulo de la muerte',
    'circulo de muerte', 'wither and bloom', 'hellish rebuke', 'reprension infernal',
    'phantasmal killer', 'asesino fantasmal', 'weird', 'terror abyecto'
  ];

  const isProfaneMatch = PROFANE_PHRASES.some(phrase => nameIndex.includes(` ${phrase} `));

  if (isProfaneMatch || spell.school === 'Nigromancia') {
    return 'Magia Profana';
  }

  // 5. MAGIA SALVAJE (Magia en bruto, azar, mutación, fuerza pura)
  const WILD_PHRASES = [
    'chaos bolt', 'saeta caotica', 'descarga caotica', 'chromatic orb', 'orbe cromatico',
    'esfera cromatica', 'color spray', 'rociada de color', 'prismatic spray', 'rociada prismatica',
    'prismatic wall', 'muro prismatico', 'hypnotic pattern', 'patron hipnotico', 'confusion',
    'blink', 'parpadeo', 'magic missile', 'proyectil magico', 'otiluke', 'wall of force',
    'muro de fuerza', 'forcecage', 'jaula de fuerza', 'telekinesis', 'telequinesia',
    'disintegrate', 'desintegrar', 'time stop', 'parar el tiempo',
    'polymorph', 'polimorfia', 'true polymorph', 'polimorfia verdadera', 'prestidigitation',
    'prestidigitacion', 'feather fall', 'caida de pluma', 'enlarge reduce', 'agrandar reducir',
    'levitate', 'levitar', 'catapult', 'catapulta', 'reverse gravity', 'invertir la gravedad'
  ];

  const isWildMatch = WILD_PHRASES.some(phrase => nameIndex.includes(` ${phrase} `));

  if (isWildMatch) {
    return 'Magia Salvaje';
  }

  // 6. MAGIA EXTRAPLANAR
  const EXTRAPLANAR_PHRASES = [
    'eldritch blast', 'descarga sobrenatural', 'misty step', 'paso brumoso', 'banishment',
    'destierro', 'dimension door', 'puerta dimensional', 'teleport', 'teletransporte',
    'plane shift', 'cambio de plano', 'gate', 'portal', 'demiplane', 'semiplano', 'maze',
    'laberinto', 'contact other plane', 'planar ally', 'planar binding'
  ];

  const isExtraplanarMatch = EXTRAPLANAR_PHRASES.some(phrase => nameIndex.includes(` ${phrase} `));

  if (isExtraplanarMatch) {
    return 'Magia Extraplanar';
  }

  // 7. Reglas canónicas por afinidad elemental y clases
  const classes = spell.classes || [];
  const damageType = spell.damageType || '';
  const school = spell.school;

  if (classes.includes('Druida') || classes.includes('Explorador')) return 'Magia Natural';
  if (classes.includes('Clérigo') || classes.includes('Paladín')) return 'Magia Divina';
  if (classes.includes('Brujo')) return 'Magia Extraplanar';
  if (['Fuego', 'Frío', 'Relámpago', 'Trueno', 'Ácido'].includes(damageType)) return 'Magia Natural';
  if (school === 'Evocación') return 'Magia Natural';
  return 'Magia Arcana';
}
