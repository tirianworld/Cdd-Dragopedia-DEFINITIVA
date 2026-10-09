import React from 'react';
import { LucideIcon } from 'lucide-react';
import {
  SummonIcon,
  AttackIcon,
  DefenseIcon,
  UtilityIcon,
  TransportIcon,
  PlanarShiftIcon,
  HealingIcon,
} from '../components/FunctionalityIcon';
import { Spell, SpellFunctionality } from '../types';

export interface SpellFunctionalityInfo {
  id: SpellFunctionality;
  name: string;
  nameEn: string;
  icon: React.FC<{ className?: string; style?: React.CSSProperties }> | LucideIcon;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export const ALL_FUNCTIONALITIES: SpellFunctionality[] = [
  'invocar',
  'atacar',
  'defenderse',
  'utilidad',
  'transporte',
  'cambio planar',
  'curación',
];

export const SPELL_FUNCTIONALITIES: SpellFunctionalityInfo[] = [
  {
    id: 'invocar',
    name: 'Invocar',
    nameEn: 'Summon',
    icon: SummonIcon,
    color: '#a855f7',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-950/40',
    borderColor: 'border-purple-500/40',
    description: 'Invocación de criaturas, familiares, sirvientes espirituales y entidades aliadas.',
  },
  {
    id: 'atacar',
    name: 'Atacar',
    nameEn: 'Attack',
    icon: AttackIcon,
    color: '#ef4444',
    textColor: 'text-red-400',
    bgColor: 'bg-red-950/40',
    borderColor: 'border-red-500/40',
    description: 'Ataques directos, proyectiles mágicos, daño elemental y castigos de combate.',
  },
  {
    id: 'defenderse',
    name: 'Defenderse',
    nameEn: 'Defense',
    icon: DefenseIcon,
    color: '#3b82f6',
    textColor: 'text-blue-400',
    bgColor: 'bg-blue-950/40',
    borderColor: 'border-blue-500/40',
    description: 'Escudos protectores, aumento de armadura (CA), reducción de daño y salvaguardas.',
  },
  {
    id: 'utilidad',
    name: 'Utilidad',
    nameEn: 'Utility',
    icon: UtilityIcon,
    color: '#eab308',
    textColor: 'text-yellow-400',
    bgColor: 'bg-yellow-950/40',
    borderColor: 'border-yellow-500/40',
    description: 'Detección, adivinación, luz, comunicación, ilusiones e interacción con el entorno.',
  },
  {
    id: 'transporte',
    name: 'Transporte',
    nameEn: 'Transport',
    icon: TransportIcon,
    color: '#06b6d4',
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-950/40',
    borderColor: 'border-cyan-500/40',
    description: 'Teletransporte, vuelo, velocidad aumentada, saltos, levitación y movilidad táctica.',
  },
  {
    id: 'cambio planar',
    name: 'Cambio Planar',
    nameEn: 'Planar Shift',
    icon: PlanarShiftIcon,
    color: '#ec4899',
    textColor: 'text-pink-400',
    bgColor: 'bg-pink-950/40',
    borderColor: 'border-pink-500/40',
    description: 'Viajes interplanares, portales, destierro a otros planos y proyecciones astrales.',
  },
  {
    id: 'curación',
    name: 'Curación',
    nameEn: 'Healing',
    icon: HealingIcon,
    color: '#10b981',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-950/40',
    borderColor: 'border-emerald-500/40',
    description: 'Restauración de puntos de golpe, curar heridas, eliminar dolencias y revivir caídos.',
  },
];

/**
 * Categorizes any spell into its applicable functionalities.
 * If the spell has custom predefined functionalities, those are respected.
 */
export function getSpellFunctionalities(spell: Spell): SpellFunctionality[] {
  if (spell.functionalities && spell.functionalities.length > 0) {
    return spell.functionalities;
  }

  const funcs = new Set<SpellFunctionality>();
  const desc = (spell.description || '').toLowerCase();
  const name = `${spell.name || ''} ${spell.nameEn || ''}`.toLowerCase();
  const id = (spell.id || '').toLowerCase();

  // 1. Curación (Healing, restoration, reviving)
  if (
    spell.damageType?.toLowerCase().includes('curaci') ||
    spell.damageType?.toLowerCase().includes('heal') ||
    /curaci[oó]n|curar|sanar|sanaci[oó]n|revivir|resurrec|regenerar|restauraci[oó]n|reencarnar|vida temporal|estabiliza|cure wounds|healing word|healing spirit|mass heal|prayer of healing|goodberry|spare the dying|revivify|raise dead|resurrection|reincarnate|aid|restoration|beacon of hope|life transference|wither and bloom|power word heal|regenerate|festín de los héroes|heroes. feast/.test(name) ||
    /recupera.*puntos de golpe|restaura.*puntos de golpe|cura.*enfermedad|vuelve a la vida|estabiliza a una criatura|muerto viviente.*revivir/.test(desc)
  ) {
    funcs.add('curación');
  }

  // 2. Cambio planar (Interplanar, banishment, portals, extradimensional, astral)
  if (
    spell.origin === 'Astral' ||
    /planar|plano|astral|et[eé]reo|et[eé]rea|ethereal|desterrar|destierro|banish|plane shift|gate|demiplane|rope trick|truco de la cuerda|blink|parpadeo|maze|laberinto|extradimensional|portal|pocket dimension|shadowfell|feywild|abyss|astral projection|contact other plane|planar ally|planar binding/.test(name) ||
    /otro plano|plano de existencia|plano material|plano astral|plano et[eé]reo|destierra|espacio extradimensional|portal a otro plano|dimensi[oó]n de bolsillo|viaje interplanar|a su plano natal|plano de origen/.test(desc)
  ) {
    funcs.add('cambio planar');
  }

  // 3. Transporte (Movement, flight, teleport, speed, levitation)
  if (
    /teletransporte|teleport|volar|vuelo|fly|levitar|levitaci[oó]n|misty step|paso brumoso|dimension door|puerta dimensional|word of recall|palabra de regreso|water walk|spider climb|patas de araña|gaseous form|forma gaseosa|phantom steed|corcel|retirada expeditiva|expeditious retreat|acelerar|haste|salto|jump|feather fall|ca[ií]da de pluma|tree stride|wind walk|freedom of movement|libertad de movimiento|kinetic jaunt|arcane gate|desplazamiento|andar sobre las aguas|caminar por los arboles/.test(name) ||
    /se teletransporta|te teletransportas|velocidad de vuelo|velocidad de trepar|velocidad de nataci[oó]n|adquiere una velocidad de|duplica su velocidad|cae lentamente|evita el da[nñ]o por ca[ií]da|abres un portal que conecta dos puntos/.test(desc)
  ) {
    funcs.add('transporte');
  }

  // 4. Invocar (Summoning, conjuring, animating creatures/servants)
  if (
    spell.school === 'Conjuración' && /criatura|aliad|sirviente|familiar|bestia|monstruo|espíritu/i.test(desc) ||
    /invocar|summon|conjurar|conjure|animar|animate|crear no muerto|familiar|unseen servant|servidor invisible|espada espiritual|spiritual weapon|esp[ií]ritu guardi[aá]n|guardian of faith|simulacro|simulacrum|clon|clone|steed|tent[aá]culos|hound|sabueso|beast|elemental|fey|undead|aberration|fiend|celestial|construct|shadowspawn|draconic spirit|crear muertos vivientes/.test(name) ||
    /invocas a|invocas un|invocas una|haces aparecer a una criatura|manifiestas una criatura|anima a|transformas los cad[aá]veres|sirviente leal|criatura invocada|obedece tus [oó]rdenes/.test(desc)
  ) {
    funcs.add('invocar');
  }

  // 5. Atacar (Offensive direct damage, spell attacks)
  const nonAttackUtility = /dimension-door|passwall|rope-trick|misty-step|fly|levitate|expeditious-retreat|spider-climb|water-walk|jump|feather-fall/.test(id);
  if (!nonAttackUtility) {
    if (
      (spell.damageType && !/sanctuary/.test(id) && !spell.damageType.toLowerCase().includes('curaci')) ||
      spell.school === 'Evocación' ||
      /ataque|da[nñ]o|damage|strike|smite|blast|bolt|ray|rayo|flecha|arrow|bola de fuego|fireball|rel[aá]mpago|lightning|misil|missile|desintegrar|disintegrate|destrucci[oó]n|cuchilla|blade|dardo|touch|toque vamp|arma|weapon|golpe|castigo/.test(name) ||
      (/tirada de ataque de conjuro|sufre \d+d\d+ puntos de da[nñ]o|da[nñ]o igual a|mitad de da[nñ]o en una salvaci[oó]n con [eé]xito/.test(desc) && !/no puede realizar ataques|no puede atacar/.test(desc))
    ) {
      funcs.add('atacar');
    }
  }

  // 6. Defenderse (Shields, wards, protection, resistance, AC boost)
  if (
    spell.school === 'Abjuración' || spell.school === 'Reflexión' ||
    /escudo|shield|absorb|contrahechizo|counterspell|disipar|dispel|armadura|armor|santuario|sanctuary|protecci[oó]n|protection|resistencia|resistance|invulnerab|antimag|ward|resguardo|espejismo|mirror image|difuminar|blur|muro de fuerza|wall of force|barrera|aura of purity|defens|fortaleza|caparaz[oó]n|bastion|death ward|resguardo contra la muerte/.test(name) ||
    /clase de armadura aumenta|bonificador a la ca|inmune al da[nñ]o|resistencia al da[nñ]o|no puede ser afectado por conjuros|anula el efecto|interrumpes el conjuro|protege contra/.test(desc)
  ) {
    funcs.add('defenderse');
  }

  // 7. Utilidad (Everything else, utility, detection, illusions, exploration, communication)
  if (
    /detectar|detect|identificar|identify|luz|light|prestidigitaci[oó]n|taumaturgia|thaumaturgy|ilusi[oó]n|illusion|reparar|mending|mensaje|message|comprensi[oó]n|comprehend|abrir|knock|invisib|disfraz|disguise|silencio|silence|ver lo invisible|see invisibility|localizar|locate|escudri[nñ]ar|scrying|sugesti[oó]n|suggestion|dormir|sleep|hechizar|charm|verdad|truth|respirar|water breathing|lenguas|tongues|enviar|sending|pasar sin dejar|polimorfia|polymorph|ojo arcano|cofre|mansi[oó]n|mansion|truco|alarma|alarm|luces|danzantes|compren|comunicaci[oó]n|visi[oó]n|sue[nñ]o|modificar|crear|falsificar|adivinaci[oó]n|divination/.test(name) ||
    funcs.size === 0 ||
    /puedes entender|te comunicas|detectas la presencia|se vuelve invisible|sabes la localizaci[oó]n|crea una ilusi[oó]n|se duerme|responde a tus preguntas|ilumina/.test(desc)
  ) {
    funcs.add('utilidad');
  }

  return Array.from(funcs);
}
