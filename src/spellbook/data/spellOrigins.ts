import React from 'react';
import {
  Flame,
  Sun,
  Wind,
  Sparkles,
  Skull,
  MoonStar,
  Orbit,
  LucideIcon,
} from 'lucide-react';
import { SpellOrigin } from '../types';

export interface OriginInfo {
  id: SpellOrigin;
  name: SpellOrigin;
  nameEn: string;
  icon: LucideIcon;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  accentGlow: string;
  description: string;
  descriptionEn: string;
}

export const ALL_SPELL_ORIGINS: SpellOrigin[] = [
  'Infernal',
  'Celestial',
  'Elemental',
  'Feérica',
  'Shadowfell',
  'Onírico',
  'Astral',
];

export const SPELL_ORIGIN_OPTIONS: OriginInfo[] = [
  {
    id: 'Infernal',
    name: 'Infernal',
    nameEn: 'Infernal',
    icon: Flame,
    color: '#ef4444',
    textColor: 'text-red-400',
    bgColor: 'bg-red-950/40',
    borderColor: 'border-red-500/40',
    accentGlow: 'rgba(239, 68, 68, 0.75)',
    description: 'Poderes de los Nueve Infiernos y el Caos Abisal: fuego infernal, demonios, diablos, azufre, pactos oscuros y tormento.',
    descriptionEn: 'Powers of the Nine Hells and the Abyss: hellfire, fiends, brimstone, dark pacts and torment.',
  },
  {
    id: 'Celestial',
    name: 'Celestial',
    nameEn: 'Celestial',
    icon: Sun,
    color: '#facc15',
    textColor: 'text-yellow-300',
    bgColor: 'bg-yellow-950/40',
    borderColor: 'border-yellow-500/40',
    accentGlow: 'rgba(250, 204, 21, 0.75)',
    description: 'Luz sacra de los Planos Superiores: huestes celestiales, bendición divina, resplandor solar y milagros de curación.',
    descriptionEn: 'Sacred light of Upper Planes: celestial hosts, divine blessing, solar radiance and healing miracles.',
  },
  {
    id: 'Elemental',
    name: 'Elemental',
    nameEn: 'Elemental',
    icon: Wind,
    color: '#06b6d4',
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-950/40',
    borderColor: 'border-cyan-500/40',
    accentGlow: 'rgba(6, 182, 212, 0.75)',
    description: 'Fuerzas puras de los Planos Elementales: fuego, frío/hielo, relámpagos, trueno, tierra/piedra, viento/aire y agua.',
    descriptionEn: 'Pure forces of Elemental Planes: fire, cold/ice, lightning, thunder, earth/stone, wind/air and water.',
  },
  {
    id: 'Feérica',
    name: 'Feérica',
    nameEn: 'Fey',
    icon: Sparkles,
    color: '#10b981',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-950/40',
    borderColor: 'border-emerald-500/40',
    accentGlow: 'rgba(16, 185, 129, 0.75)',
    description: 'Magia salvaje y caprichosa del Feywild: encantos feéricos, hadas, naturaleza primordial, risa, metamorfosis y niebla.',
    descriptionEn: 'Wild and whimsical Feywild magic: faerie glamour, fey, primal nature, laughter, shapeshifting and mists.',
  },
  {
    id: 'Shadowfell',
    name: 'Shadowfell',
    nameEn: 'Shadowfell',
    icon: Skull,
    color: '#09090b',
    textColor: 'text-zinc-200',
    bgColor: 'bg-black',
    borderColor: 'border-zinc-700',
    accentGlow: 'rgba(228, 228, 231, 0.65)',
    description: 'Reino del Páramo Sombrío y la Reina Cuervo: nigromancia, muerte, no-muertos, sombras, almas, frío sepulcral y drenaje vital.',
    descriptionEn: 'Realm of the Shadowfell and the Raven Queen: necromancy, death, undead, shadows, souls, sepulchral cold and life drain.',
  },
  {
    id: 'Onírico',
    name: 'Onírico',
    nameEn: 'Oneiric',
    icon: MoonStar,
    color: '#818cf8',
    textColor: 'text-indigo-300',
    bgColor: 'bg-indigo-950/40',
    borderColor: 'border-indigo-500/40',
    accentGlow: 'rgba(129, 140, 248, 0.75)',
    description: 'Dimensión de los Sueños y el Inconsciente: ensoñaciones, siestas místicas, pesadillas vivientes, ilusiones mentales y trance onírico.',
    descriptionEn: 'Dimension of Dreams and the Subconscious: reveries, mystic slumber, waking nightmares, mental phantasms and oneiric trance.',
  },
  {
    id: 'Astral',
    name: 'Astral',
    nameEn: 'Astral',
    icon: Orbit,
    color: '#38bdf8',
    textColor: 'text-sky-300',
    bgColor: 'bg-sky-950/40',
    borderColor: 'border-sky-500/40',
    accentGlow: 'rgba(56, 189, 248, 0.75)',
    description: 'Mar Astral y Vacío Plateado: viaje interplanar, teletransporte, portales dimensionales, gravedad cósmica y proyección astral.',
    descriptionEn: 'Astral Sea and Silver Void: interplanar travel, teleportation, dimensional portals, cosmic gravity and astral projection.',
  },
];

export const SPELL_ORIGINS = SPELL_ORIGIN_OPTIONS;

export const ORIGIN_MAP: Record<string, OriginInfo> = {
  Infernal: SPELL_ORIGIN_OPTIONS[0],
  Celestial: SPELL_ORIGIN_OPTIONS[1],
  Elemental: SPELL_ORIGIN_OPTIONS[2],
  Feérica: SPELL_ORIGIN_OPTIONS[3],
  Feérico: SPELL_ORIGIN_OPTIONS[3], // Alias
  Shadowfell: SPELL_ORIGIN_OPTIONS[4],
  Onírico: SPELL_ORIGIN_OPTIONS[5],
  Onirico: SPELL_ORIGIN_OPTIONS[5], // Alias without accent
  Astral: SPELL_ORIGIN_OPTIONS[6],
};

// Pure infernal/abyssal magic (fiends, devils, demons, hellfire, dark pacts)
const INFERNAL_SPELL_IDS = new Set([
  'hellish-rebuke',
  'xge-infernal-calling',
  'xge-summon-lesser-demons',
  'xge-summon-greater-demon',
  'xphb-summon-fiend',
  'xphb-arms-of-hadar',
  'xphb-hunger-of-hadar',
  'xphb-crown-of-madness',
  'hex',
  'planar-binding',
]);

// Pure Shadowfell magic (Shadowfell / Páramo Sombrío: necromancy, undead, shadows, sorrow, soul cages, life drain)
const SHADOWFELL_SPELL_IDS = new Set([
  'xphb-toll-the-dead',
  'chill-touch',
  'xge-cause-fear',
  'fear',
  'ray-of-sickness',
  'ray-of-enfeeblement',
  'inflict-wounds',
  'darkness',
  'xge-shadow-blade',
  'xge-shadow-of-moil',
  'tce-summon-shadowspawn',
  'tce-spirit-shroud',
  'animate-dead',
  'create-undead',
  'xphb-summon-undead',
  'speak-with-dead',
  'xphb-feign-death',
  'bestow-curse',
  'vampiric-touch',
  'bmt-spirit-of-death',
  'blight',
  'xge-danse-macabre',
  'xge-enervation',
  'xge-negative-energy-flood',
  'circle-of-death',
  'harm',
  'xge-soul-cage',
  'eyebite',
  'finger-of-death',
  'xge-abi-dalzim-s-horrid-wilting',
  'xge-maddening-darkness',
  'scc-wither-and-bloom',
  'egw-dark-star',
  'xge-illusory-dragon',
]);

// Pure Upper Planes celestial / divine radiance & holy restoration
const CELESTIAL_SPELL_IDS = new Set([
  'bendicion-de-astraea',
  'sacred-flame',
  'xphb-word-of-radiance',
  'bless',
  'cure-wounds',
  'healing-word',
  'guiding-bolt',
  'sanctuary',
  'shield-of-faith',
  'divine-favor',
  'spiritual-weapon',
  'branding-smite',
  'xge-healing-spirit',
  'prayer-of-healing',
  'lesser-restoration',
  'warding-bond',
  'xphb-aura-of-vitality',
  'xphb-blinding-smite',
  'spirit-guardians',
  'mass-healing-word',
  'revivify',
  'beacon-of-hope',
  'aura-of-life',
  'xphb-aura-of-purity',
  'guardian-of-faith',
  'xphb-staggering-smite',
  'xge-dawn',
  'xge-holy-weapon',
  'xphb-banishing-smite',
  'commune',
  'hallow',
  'xphb-summon-celestial',
  'mass-cure-wounds',
  'greater-restoration',
  'raise-dead',
  'heal',
  'sunbeam',
  'conjure-celestial',
  'xge-crown-of-stars',
  'divine-word',
  'resurrection',
  'xge-temple-of-the-gods',
  'holy-aura',
  'sunburst',
  'mass-heal',
  'power-word-heal',
  'true-resurrection',
  'death-ward',
  'remove-curse',
]);

// Pure Elemental Planes (fire, cold, lightning, thunder, earth/stone, wind/air, water)
const ELEMENTAL_SPELL_IDS = new Set([
  'shocking-grasp',
  'xge-frostbite',
  'xge-control-flames',
  'xge-create-bonfire',
  'produce-flame',
  'fire-bolt',
  'tce-booming-blade',
  'tce-green-flame-blade',
  'tce-lightning-lure',
  'xge-shape-water',
  'xge-mold-earth',
  'xge-magic-stone',
  'xge-gust',
  'ray-of-frost',
  'acid-splash',
  'xphb-thunderclap',
  'xge-absorb-elements',
  'create-or-destroy-water',
  'ice-knife',
  'burning-hands',
  'thunderwave',
  'shatter',
  'xge-earth-tremor',
  'xge-aganazzar-s-scorcher',
  'dragons-breath',
  'flaming-sphere',
  'xge-pyrotechnics',
  'gust-of-wind',
  'scorching-ray',
  'xphb-elemental-weapon',
  'fireball',
  'xphb-lightning-arrow',
  'xge-flame-arrows',
  'call-lightning',
  'xge-wall-of-water',
  'wind-wall',
  'xge-tidal-wave',
  'xge-thunder-step',
  'lightning-bolt',
  'xge-erupting-earth',
  'sleet-storm',
  'conjure-minor-elementals',
  'control-water',
  'xphb-summon-elemental',
  'xge-storm-sphere',
  'wall-of-fire',
  'ice-storm',
  'xge-watery-sphere',
  'conjure-elemental',
  'cone-of-cold',
  'flame-strike',
  'xge-immolation',
  'wall-of-stone',
  'freezing-sphere',
  'xge-investiture-of-ice',
  'xge-investiture-of-flame',
  'xge-investiture-of-wind',
  'xge-investiture-of-stone',
  'wall-of-ice',
  'chain-lightning',
  'delayed-blast-fireball',
  'xge-whirlwind',
  'fire-storm',
  'earthquake',
  'tsunami',
  'meteor-swarm',
  'xge-dust-devil',
  'xge-bones-of-the-earth',
  'xge-maelstrom',
]);

// Pure Feywild magic (fey nature, charms, tricks, laughter, polymorph)
const FEERICA_SPELL_IDS = new Set([
  'vicious-mockery',
  'xphb-thorn-whip',
  'druidcraft',
  'xge-primal-savagery',
  'shillelagh',
  'goodberry',
  'disguise-self',
  'animal-friendship',
  'entangle',
  'faerie-fire',
  'speak-with-animals',
  'hideous-laughter',
  'spike-growth',
  'locate-animals-or-plants',
  'pass-without-trace',
  'misty-step',
  'barkskin',
  'xphb-beast-sense',
  'xge-beast-bond',
  'xphb-summon-beast',
  'suggestion',
  'xphb-summon-fey',
  'plant-growth',
  'speak-with-plants',
  'confusion',
  'conjure-woodland-beings',
  'xphb-grasping-vine',
  'polymorph',
  'awaken',
  'tree-stride',
  'irresistible-dance',
  'conjure-fey',
  'mass-suggestion',
  'wind-walk',
  'transport-via-plants',
  'animal-shapes',
  'xge-mass-polymorph',
  'true-polymorph',
  'charm-person',
  'charm-monster',
  'commune-with-nature',
  'xge-wrath-of-nature',
]);

// Pure Oneiric / Dream magic (Dimension of Dreams, sleep, nightmares, psychic trance, mental phantasms)
const ONIRICO_SPELL_IDS = new Set([
  'dream',
  'tce-dream-of-the-blue-veil',
  'sleep',
  'xge-catnap',
  'phantasmal-force',
  'phantasmal-killer',
  'weird',
  'dissonant-whispers',
  'tce-tasha-s-mind-whip',
  'mind-spike',
  'xphb-synaptic-static',
  'xge-mental-prison',
  'hallucinatory-terrain',
  'hypnotic-pattern',
  'modify-memory',
  'detect-thoughts',
  'calm-emotions',
  'mind-blank',
  'feeblemind',
  'xphb-mind-sliver',
]);

// Pure Astral Sea / Planar travel & cosmic gravity magic
const ASTRAL_SPELL_IDS = new Set([
  'astral-projection',
  'plane-shift',
  'gate',
  'teleport',
  'teleportation-circle',
  'dimension-door',
  'blink',
  'xphb-arcane-gate',
  'banishment',
  'demiplane',
  'maze',
  'contact-other-plane',
  'magnificent-mansion',
  'secret-chest',
  'reverse-gravity',
  'egw-magnify-gravity',
  'egw-gravity-sinkhole',
  'egw-gravity-fissure',
  'egw-ravenous-void',
  'scc-vortex-warp',
  'xge-scatter',
  'aag-create-spelljamming-helm',
  'sato-gate-seal',
]);

/**
 * Accurately determines if a spell has one of the cosmic planar origins:
 * Infernal, Celestial, Elemental, Feérica, Shadowfell, Onírico, Astral.
 *
 * If the spell does not belong to any of these planar origins (e.g., standard arcane spells
 * like Magic Missile, Shield, Counterspell, Alarm, Mage Armor, Wish, Mage Hand, etc.),
 * it returns `undefined` without forcing it into a wrong category.
 */
export function getSpellOrigin(spell: {
  id?: string;
  name?: string;
  nameEn?: string;
  origin?: SpellOrigin;
  description?: string;
}): SpellOrigin | undefined {
  // If explicitly assigned in user custom spell or edit modal
  if (spell.origin) {
    if (spell.origin === 'Feérico' || spell.origin === 'Feérica') return 'Feérica';
    if (spell.origin === 'Infernal') return 'Infernal';
    if (spell.origin === 'Celestial') return 'Celestial';
    if (spell.origin === 'Elemental') return 'Elemental';
    if (spell.origin === 'Shadowfell') return 'Shadowfell';
    if (spell.origin === 'Onírico' || (spell.origin as string) === 'Onirico') return 'Onírico';
    if (spell.origin === 'Astral') return 'Astral';
    return undefined;
  }

  const id = (spell.id || '').toLowerCase().trim();

  // 1. Exact canonical ID matching (100% precision with zero overlaps)
  if (INFERNAL_SPELL_IDS.has(id)) return 'Infernal';
  if (SHADOWFELL_SPELL_IDS.has(id)) return 'Shadowfell';
  if (CELESTIAL_SPELL_IDS.has(id)) return 'Celestial';
  if (ELEMENTAL_SPELL_IDS.has(id)) return 'Elemental';
  if (FEERICA_SPELL_IDS.has(id)) return 'Feérica';
  if (ONIRICO_SPELL_IDS.has(id)) return 'Onírico';
  if (ASTRAL_SPELL_IDS.has(id)) return 'Astral';

  // 2. Strict title matching for user-created custom spells (title only, never description body)
  const name = (spell.name || '').toLowerCase();
  const nameEn = (spell.nameEn || '').toLowerCase();
  const title = `${name} ${nameEn}`;

  if (title.includes('astral') || title.includes('spelljam') || title.includes('gravity') || title.includes('gravedad')) {
    return 'Astral';
  }
  if (title.includes('oníric') || title.includes('oniric') || title.includes('ensueño') || title.includes('pesadilla')) {
    return 'Onírico';
  }
  if (title.includes('shadowfell') || title.includes('páramo sombrío') || title.includes('paramo sombrio')) {
    return 'Shadowfell';
  }
  if (title.includes('infernal') || title.includes('hadar') || title.includes('demoniac')) {
    return 'Infernal';
  }
  if (title.includes('celestial') || title.includes('astraea')) {
    return 'Celestial';
  }
  if (title.includes('elemental')) {
    return 'Elemental';
  }
  if (title.includes('feéric') || title.includes('feerico') || title.includes('faerie') || title.includes('fey')) {
    return 'Feérica';
  }

  // Pure arcane, martial or universal utility spells have no planar origin
  return undefined;
}
