import React from 'react';
import { LucideIcon } from 'lucide-react';
import {
  SelfTargetIcon,
  EnemyTargetIcon,
  EnemiesTargetIcon,
  AlliesTargetIcon,
  ObjectTargetIcon,
} from '../components/TargetIcon';
import { Spell, SpellTarget } from '../types';

export interface SpellTargetInfo {
  id: SpellTarget;
  name: string;
  nameEn: string;
  icon: React.FC<{ className?: string; style?: React.CSSProperties }> | LucideIcon;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  description: string;
  descriptionEn: string;
}

export const ALL_SPELL_TARGETS: SpellTarget[] = [
  'propio',
  'enemigo',
  'enemigos',
  'aliados',
  'objeto',
];

export const SPELL_TARGET_OPTIONS: SpellTargetInfo[] = [
  {
    id: 'propio',
    name: 'Propio',
    nameEn: 'Self',
    icon: SelfTargetIcon,
    color: '#38bdf8',
    textColor: 'text-sky-400',
    bgColor: 'bg-sky-950/40',
    borderColor: 'border-sky-500/40',
    description: 'Hechizos que afectan al propio lanzador (Personal, movilidad, defensas personales o auras).',
    descriptionEn: 'Spells that target the caster (Self, personal mobility, personal defense or auras).',
  },
  {
    id: 'enemigo',
    name: 'Enemigo',
    nameEn: 'Enemy',
    icon: EnemyTargetIcon,
    color: '#f87171',
    textColor: 'text-rose-400',
    bgColor: 'bg-rose-950/40',
    borderColor: 'border-rose-500/40',
    description: 'Hechizos dirigidos a un único objetivo enemigo (ataques directos, maleficios o control).',
    descriptionEn: 'Spells targeting a single hostile enemy (direct spell attacks, single-target saves or debuffs).',
  },
  {
    id: 'enemigos',
    name: 'Enemigos',
    nameEn: 'Enemies',
    icon: EnemiesTargetIcon,
    color: '#fb923c',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-950/40',
    borderColor: 'border-amber-500/40',
    description: 'Hechizos de área o múltiples objetivos hostiles (esferas, conos, líneas o proyectiles múltiples).',
    descriptionEn: 'Area of effect spells or multiple hostile targets (spheres, cones, lines, multiple projectiles).',
  },
  {
    id: 'aliados',
    name: 'Aliados',
    nameEn: 'Allies',
    icon: AlliesTargetIcon,
    color: '#4ade80',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-950/40',
    borderColor: 'border-emerald-500/40',
    description: 'Hechizos para ayudar o fortalecer compañeros (curación, mejoras tácticas, protección y bendiciones).',
    descriptionEn: 'Spells to assist or strengthen party members (healing, tactical buffs, protection, and blessings).',
  },
  {
    id: 'objeto',
    name: 'Objeto',
    nameEn: 'Object',
    icon: ObjectTargetIcon,
    color: '#c084fc',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-950/40',
    borderColor: 'border-purple-500/40',
    description: 'Hechizos que afectan, manipulan, reparan o encantan objetos, armas, puertas y superficies.',
    descriptionEn: 'Spells affecting, manipulating, repairing, or enchanting objects, weapons, doors, and surfaces.',
  },
];

/**
 * Determines the target categories applicable to a given spell.
 * If the spell has predefined targets, those are returned.
 */
export function getSpellTargets(spell: Spell): SpellTarget[] {
  if (spell.targets && spell.targets.length > 0) {
    return spell.targets;
  }

  const targets = new Set<SpellTarget>();
  const desc = (spell.description || '').toLowerCase();
  const name = `${spell.name || ''} ${spell.nameEn || ''}`.toLowerCase();
  const range = (spell.range || '').toLowerCase();
  const damageType = (spell.damageType || '').toLowerCase();

  const isSelfRange =
    range.includes('personal') ||
    range.includes('lanzador') ||
    range.includes('self') ||
    range.includes('a ti mismo');

  // Check for Area of Effect (AoE) keywords
  const isAoe =
    /radio|cono|cubo|l[ií]nea|esfera|cilindro|[aá]rea|radius|cone|cube|line|sphere|cylinder|area/.test(range) ||
    /en un radio de|en un cono de|en una l[ií]nea de|en una esfera de|en un cubo de|cada criatura en|a todas las criaturas|criaturas a tu elecci[oó]n dentro del [aá]rea|a cualquier criatura dentro de/i.test(desc);

  // 1. Objeto (Objects, items, weapons, locks, structures)
  if (
    /mending|remendar|knock|abrir|arcane lock|cerradura arcana|light|luz|magic weapon|arma m[aá]gica|elemental weapon|arma elemental|heat metal|calentar metal|continual flame|fuego continuo|locate object|localizar objeto|animate objects|animar objetos|fabricate|fabricar|creation|creaci[oó]n|catapult|catapulta|rope trick|truco de la cuerda|shatter|romper|disintegrate|desintegrar|telekinesis|telequinesis|glyph of warding|glifo custodio|symbol|s[ií]mbolo|prestidigitation|prestidigitaci[oó]n|identify|identificar/.test(name) ||
    /un objeto|el objeto|objeto no m[aá]gico|objeto que sostengas|toca un objeto|tocar un objeto|sobre un objeto|un arma|una armadura|cerradura|candado|puerta o cofre|superficie plana|proyectil no m[aá]gico|prendas u objetos|an object|the object|nonmagical object|touch an object/i.test(desc)
  ) {
    targets.add('objeto');
  }

  // 2. Propio (Self)
  if (
    isSelfRange ||
    /personal|lanzador|a ti mismo|sobre ti mismo|te otorgas a ti mismo|adquieres|tu velocidad|te transformas|te vuelves invisible|ganas \d+ puntos de golpe temporales|puedes teletransportarte|te rodea|alrededor de ti|sientes|te permite ver|ante ti/i.test(desc) ||
    /escudo|shield|alter self|alterar el propio aspecto|misty step|paso brumoso|mirror image|espejismo|difuminar|blur|blink|parpadeo|expeditious retreat|retirada expeditiva|armor of agathys|coraza de agathys|fire shield|escudo de fuego|shadow blade|espada de sombras|kinetic jaunt|tenser|far step|paso lejano|eyebite|ojos de dolor|investidura|investiture|wind walk|caminar por el viento|shapechange|cambio de forma/i.test(name)
  ) {
    targets.add('propio');
  }

  // 3. Aliados (Healing, buffing, protecting, restoring companions or friendly creatures)
  const isHealingOrSupport =
    damageType.includes('curaci') ||
    damageType.includes('heal') ||
    /curaci[oó]n|curar|sanar|sanaci[oó]n|revivir|resurrec|regenerar|restauraci[oó]n|reencarnar|vida temporal|estabiliza|cure wounds|healing word|healing spirit|mass heal|prayer of healing|goodberry|spare the dying|revivify|raise dead|resurrection|reincarnate|aid|restoration|beacon of hope|life transference|wither and bloom|power word heal|regenerate|fest[ií]n de los h[eé]roes|heroes. feast|bless|bendici[oó]n|aid|ayuda|heroism|hero[ií]smo|shield of faith|escudo de la fe|protection from evil|protecci[oó]n contra el mal|haste|acelerar|guidance|gu[ií]a|resistance|resistencia|freedom of movement|libertad de movimiento|water breathing|respirar bajo el agua|water walk|andar sobre las aguas|pass without trace|paso sin rastro|death ward|resguardo contra la muerte|holy aura|aura sagrada|aura of purity|aura de pureza|sanctuary|santuario|warding bond|v[ií]nculo protector/i.test(name);

  const hasAllyText =
    /criatura voluntaria|criaturas voluntarias|aliado|aliados|compa[nñ]ero|criatura amistosa|willing creature|willing creatures|ally|allies|friendly creature|recupera \d+d\d+ puntos de golpe|recuperan puntos de golpe|vuelve a la vida|estabiliza a una criatura|protege a un aliado/i.test(desc);

  if (isHealingOrSupport || hasAllyText) {
    targets.add('aliados');
    // Beneficial touch/range spells can often also be cast on oneself
    if (range.includes('toque') || range.includes('touch') || isSelfRange || range.includes('pies') || range.includes('metros')) {
      targets.add('propio');
    }
  }

  // 4. Enemigos (Multiple enemies, AoE, or multi-projectile attacks)
  if (
    isAoe ||
    /bola de fuego|fireball|rel[aá]mpago|lightning bolt|manos ardientes|burning hands|cono de fr[ií]o|cone of cold|tormenta|storm|ola tronadora|thunderwave|shatter|romper|patr[oó]n hipn[oó]tico|hypnotic pattern|lentitud|slow|maldici[oó]n|bane|fuego fe[eé]rico|faerie fire|meteor swarm|tormenta de meteoros|cadena de rel[aá]mpagos|chain lightning|nube|cloud|plaga|plague|enredo|entangle|esp[ií]ritus guardianes|spirit guardians|muro de|wall of|destello prism[aá]tico|prismatic|synaptic static|est[aá]tica sin[aá]ptica|proyectil m[aá]gico|magic missile|rayo abrasador|scorching ray/i.test(name) ||
    /cada criatura|todas las criaturas|hasta \d+ criaturas|criaturas en el [aá]rea|a todas las criaturas hostiles|sufren \d+d\d+ puntos de da[nñ]o|tirada de salvaci[oó]n todas las criaturas|un n[uú]mero de criaturas/i.test(desc)
  ) {
    // Only add if it's offensive or affects enemies (not purely mass healing/buffing)
    if (!/mass heal|mass cure wounds|prayer of healing|aid|bless|heroes. feast|aura of vitality/i.test(name)) {
      targets.add('enemigos');
    }
  }

  // 5. Enemigo (Single enemy target: targeted attacks, single saves, curses, hostile spells)
  const isOffensiveSpell =
    damageType.length > 0 && !damageType.includes('curaci') && !damageType.includes('heal');

  const hasSingleEnemyText =
    /haz un ataque de conjuro|ataque de conjuro a distancia|ataque de conjuro cuerpo a cuerpo|contra el objetivo|contra una criatura|a una criatura dentro del alcance|hacia una criatura|el objetivo sufre|si impactas|si aciertas|la criatura debe superar una tirada de salvaci[oó]n|una criatura que puedas ver|make a ranged spell attack|make a melee spell attack|target creature/i.test(desc);

  if (
    hasSingleEnemyText ||
    /saeta de fuego|fire bolt|rayo de escarcha|ray of frost|descarga sobrenatural|eldritch blast|llama sagrada|sacred flame|toque helado|chill touch|flecha [aá]cida|acid arrow|guiding bolt|saeta guiada|inflict wounds|infligir heridas|witch bolt|rayo de hechicero|chromatic orb|orbe crom[aá]tico|chaos bolt|saeta del caos|toll the dead|ta[nñ]ido por los muertos|vicious mockery|burla cruel|dissonant whispers|susurros disonantes|tasha|risa horrible|hold person|inmovilizar persona|hold monster|inmovilizar monstruo|charm person|hechizar persona|suggestion|sugesti[oó]n|polymorph|polimorfia|desintegrar|disintegrate|finger of death|dedo de la muerte|power word kill|palabra de poder mortal|blight|marchitar|bestow curse|maldecir|blindness|ceguera|crown of madness|corona de locura|phantasmal force|fuerza fantasmal|phantasmal killer|asesino fantasmal|dominate|dominar/i.test(name)
  ) {
    // Exclude spells that are purely self or friendly support
    if (!isSelfRange || isAoe || /vampiric touch|toque vamp[ií]rico/i.test(name)) {
      targets.add('enemigo');
    }
  }

  // If offensive damage or combat, ensure at least one enemy target category is set
  if (isOffensiveSpell && !targets.has('enemigo') && !targets.has('enemigos')) {
    if (isAoe) {
      targets.add('enemigos');
    } else {
      targets.add('enemigo');
    }
  }

  // If still empty (e.g. general utility or communication), fall back gracefully
  if (targets.size === 0) {
    if (isSelfRange) {
      targets.add('propio');
    } else if (desc.includes('objeto') || desc.includes('object')) {
      targets.add('objeto');
    } else {
      targets.add('propio');
    }
  }

  return Array.from(targets);
}
