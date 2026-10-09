import React from 'react';
import {
  Heart,
  Swords,
  Eye,
  MessageSquare,
  Dice5,
  Sparkles,
  LucideIcon,
} from 'lucide-react';
import { Spell, SpellUtility } from '../types';

export interface SpellUtilityInfo {
  name: SpellUtility;
  nameEn: string;
  icon: LucideIcon;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export const SPELL_UTILITIES: SpellUtilityInfo[] = [
  {
    name: 'Curación',
    nameEn: 'Healing',
    icon: Heart,
    color: '#10b981',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-950/40',
    borderColor: 'border-emerald-500/40',
    description: 'Recuperación de puntos de golpe, restauración de heridas, supresión de venenos y resurrección.',
  },
  {
    name: 'Combate',
    nameEn: 'Combat',
    icon: Swords,
    color: '#ef4444',
    textColor: 'text-red-400',
    bgColor: 'bg-red-950/40',
    borderColor: 'border-red-500/40',
    description: 'Ataques mágicos directos, daño elemental, castigos (smites), armaduras protectoras y control táctico ofensivo.',
  },
  {
    name: 'Detección',
    nameEn: 'Detection',
    icon: Eye,
    color: '#06b6d4',
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-950/40',
    borderColor: 'border-cyan-500/40',
    description: 'Detección mágica, adivinación, localización de criaturas u objetos, visión en la oscuridad y escudriñamiento.',
  },
  {
    name: 'Comunicación',
    nameEn: 'Communication',
    icon: MessageSquare,
    color: '#a855f7',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-950/40',
    borderColor: 'border-purple-500/40',
    description: 'Transmisión de mensajes, telepatía, comprensión y don de idiomas, y hablar con bestias, plantas o difuntos.',
  },
  {
    name: 'Tiradas',
    nameEn: 'Rolls & Modifiers',
    icon: Dice5,
    color: '#f59e0b',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-950/40',
    borderColor: 'border-amber-500/40',
    description: 'Modificación directa de dados d20: bonos a tiradas (+1d4, etc.), ventaja, desventaja y manipulación de pruebas o salvaciones.',
  },
];

// Curated canonical ID sets verified one by one across all D&D spells
export const HEALING_SPELL_IDS = new Set<string>([
  'spare-the-dying',
  'xphb-spare-the-dying',
  'goodberry',
  'cure-wounds',
  'healing-word',
  'aid',
  'xge-healing-spirit',
  'scc-wither-and-bloom',
  'prayer-of-healing',
  'lesser-restoration',
  'xphb-aura-of-vitality',
  'aura-of-vitality',
  'mass-healing-word',
  'revivify',
  'beacon-of-hope',
  'xge-life-transference',
  'aura-of-life',
  'aura-of-purity',
  'death-ward',
  'mass-cure-wounds',
  'reincarnate',
  'greater-restoration',
  'raise-dead',
  'heal',
  'heroes-feast',
  'regenerate',
  'resurrection',
  'mass-heal',
  'power-word-heal',
  'true-resurrection',
]);

export const DETECTION_SPELL_IDS = new Set<string>([
  'alarm',
  'detect-evil-and-good',
  'detect-magic',
  'detect-poison-and-disease',
  'identify',
  'augury',
  'detect-thoughts',
  'find-traps',
  'locate-animals-or-plants',
  'locate-object',
  'beast-sense',
  'xphb-beast-sense',
  'see-invisibility',
  'darkvision',
  'clairvoyance',
  'divination',
  'locate-creature',
  'arcane-eye',
  'commune',
  'commune-with-nature',
  'legend-lore',
  'conocer-las-leyendas',
  'contact-other-plane',
  'scrying',
  'find-the-path',
  'true-seeing',
  'zone-of-truth',
  'mind-blank',
]);

export const COMMUNICATION_SPELL_IDS = new Set<string>([
  'ggr-encode-thoughts',
  'message',
  'comprehend-languages',
  'speak-with-animals',
  'beast-bond',
  'xge-beast-bond',
  'magic-mouth',
  'animal-messenger',
  'tongues',
  'speak-with-plants',
  'speak-with-dead',
  'sending',
  'rarys-telepathic-bond',
  'telepathic-bond',
  'dream',
  'telepathy',
  'xphb-telepathy',
  'zone-of-truth',
]);

export const ROLLS_SPELL_IDS = new Set<string>([
  'guidance',
  'resistance',
  'true-strike',
  'xphb-mind-sliver',
  'bless',
  'bane',
  'faerie-fire',
  'guiding-bolt',
  'scc-silvery-barbs',
  'egw-gift-of-alacrity',
  'enhance-ability',
  'divine-favor',
  'hex',
  'hunters-mark',
  'beacon-of-hope',
  'blindness-deafness',
  'bestow-curse',
  'slow',
  'circle-of-power',
  'xphb-circle-of-power',
  'glibness',
  'foresight',
  'feeblemind',
  'counterspell',
  'sanctuary',
  'ray-of-enfeeblement',
  'xphb-friends',
  'xge-skill-empowerment',
  'holy-aura',
  'xphb-compelled-duel',
  'xge-cause-fear',
]);

export const COMBAT_EXTRA_IDS = new Set<string>([
  'shield',
  'mage-armor',
  'shield-of-faith',
  'blade-ward',
  'hellish-rebuke',
  'armor-of-agathys',
  'mirror-image',
  'blur',
  'barkskin',
  'stoneskin',
  'spiritual-weapon',
  'magic-weapon',
  'elemental-weapon',
  'holy-weapon',
  'spirit-guardians',
  'fire-shield',
  'hold-person',
  'hold-monster',
  'tashas-hideous-laughter',
  'wrathful-smite',
  'thunderous-smite',
  'searing-smite',
  'branding-smite',
  'blinding-smite',
  'staggering-smite',
  'banishing-smite',
  'destructive-wave',
  'entangle',
  'web',
  'hypnotic-pattern',
  'fear',
  'confusion',
  'banishment',
  'eyebite',
  'forcecage',
  'wall-of-force',
  'globe-of-invulnerability',
  'tce-tasha-s-otherworldly-guise',
  'holy-aura',
  'conjure-animals',
  'xphb-summon-beast',
  'xphb-summon-undead',
  'tce-summon-shadowspawn',
  'xge-summon-greater-demon',
  'xphb-summon-elemental',
  'bmt-spirit-of-death',
  'xphb-summon-celestial',
  'xge-danse-macabre',
  'xge-infernal-calling',
  'xphb-summon-fiend',
  'animate-dead',
  'create-undead',
  'power-word-stun',
  'power-word-kill',
  'polymorph',
  'true-polymorph',
  'guiding-bolt',
  'xphb-mind-sliver',
  'ray-of-enfeeblement',
  'blindness-deafness',
]);

/**
 * Returns all matching utilities for a given spell without false positives.
 */
export function getSpellUtilities(spell: Spell): SpellUtility[] {
  const id = spell.id.toLowerCase();
  const name = spell.name.toLowerCase();
  const nameEn = (spell.nameEn || '').toLowerCase();
  const utilities: SpellUtility[] = [];

  // 1. Curación
  const isHealing =
    HEALING_SPELL_IDS.has(id) ||
    name.startsWith('curar') ||
    name.startsWith('sanar') ||
    name.startsWith('palabra de curación') ||
    name.startsWith('restablecimiento') ||
    name.startsWith('revivir') ||
    name.startsWith('resurrección') ||
    name.startsWith('regenerar') ||
    name.startsWith('reencarnar') ||
    nameEn.startsWith('cure') ||
    nameEn.startsWith('heal') ||
    nameEn.startsWith('reviv') ||
    nameEn.startsWith('resurrection');

  if (isHealing) {
    utilities.push('Curación');
  }

  // 2. Combate
  const isCombat =
    Boolean(spell.damageType) ||
    COMBAT_EXTRA_IDS.has(id) ||
    name.includes('castigo') ||
    nameEn.includes('smite') ||
    name.includes('arma espiritual') ||
    name.includes('espada de sombra') ||
    name.includes('hoja retumbante') ||
    name.includes('filo verdeante');

  if (isCombat) {
    utilities.push('Combate');
  }

  // 3. Detección
  const isDetection =
    DETECTION_SPELL_IDS.has(id) ||
    name.startsWith('detectar ') ||
    name.startsWith('localizar ') ||
    name === 'ver invisibilidad' ||
    name === 'visión verdadera' ||
    name === 'visión veraz' ||
    name === 'ojo arcano' ||
    name === 'sentido bestial' ||
    name === 'clarividencia' ||
    name === 'adivinación' ||
    name === 'augurio' ||
    name === 'escudriñar' ||
    name === 'identificar' ||
    name === 'encontrar el camino' ||
    name === 'conocer las leyendas' ||
    name === 'alarma' ||
    nameEn.startsWith('detect ') ||
    nameEn.startsWith('locate ') ||
    nameEn === 'true seeing' ||
    nameEn === 'see invisibility' ||
    nameEn === 'arcane eye' ||
    nameEn === 'clairvoyance' ||
    nameEn === 'scrying';

  if (isDetection) {
    utilities.push('Detección');
  }

  // 4. Comunicación
  const isCommunication =
    COMMUNICATION_SPELL_IDS.has(id) ||
    name.startsWith('hablar con ') ||
    name === 'mensaje' ||
    name === 'recado' ||
    name === 'entender idiomas' ||
    name === 'don de lenguas' ||
    name === 'enlace telepático' ||
    name === 'telepatía' ||
    name === 'mensajero animal' ||
    name === 'boca mágica' ||
    nameEn.startsWith('speak with') ||
    nameEn === 'message' ||
    nameEn === 'sending' ||
    nameEn === 'comprehend languages' ||
    nameEn === 'tongues' ||
    nameEn === 'telepathy';

  if (isCommunication) {
    utilities.push('Comunicación');
  }

  // 5. Tiradas
  const isRolls =
    ROLLS_SPELL_IDS.has(id) ||
    name === 'guía' ||
    name === 'resistencia' ||
    name === 'bendecir' ||
    name === 'bendición' ||
    name === 'perdición' ||
    name === 'fuego feérico' ||
    name === 'saeta guiada' ||
    name === 'saeta guía' ||
    name === 'púa plateada' ||
    name === 'don de la labia' ||
    name === 'labia' ||
    name === 'presciencia' ||
    name === 'presagio' ||
    name === 'romper la mente' ||
    name === 'contraconguro' ||
    name === 'contrahechizo' ||
    name === 'santuario' ||
    nameEn === 'guidance' ||
    nameEn === 'resistance' ||
    nameEn === 'bless' ||
    nameEn === 'bane' ||
    nameEn === 'faerie fire' ||
    nameEn === 'guiding bolt' ||
    nameEn === 'silvery barbs' ||
    nameEn === 'glibness' ||
    nameEn === 'foresight' ||
    nameEn === 'counterspell';

  if (isRolls) {
    utilities.push('Tiradas');
  }

  return utilities;
}

/**
 * Returns primary utility for grouping and hierarchical sorting.
 */
export function getPrimarySpellUtility(spell: Spell): SpellUtility | 'Otras' {
  const utils = getSpellUtilities(spell);
  if (utils.length === 0) return 'Otras';

  // Priority order for grouping: Curación > Detección > Comunicación > Tiradas > Combate
  if (utils.includes('Curación')) return 'Curación';
  if (utils.includes('Detección')) return 'Detección';
  if (utils.includes('Comunicación')) return 'Comunicación';
  if (utils.includes('Tiradas')) return 'Tiradas';
  if (utils.includes('Combate')) return 'Combate';

  return utils[0];
}

export function matchesUtility(spell: Spell, utility: SpellUtility | string): boolean {
  if (!utility) return true;
  const list = getSpellUtilities(spell);
  return list.includes(utility as SpellUtility);
}

export const UTILITY_SORT_WEIGHT: Record<string, number> = {
  Curación: 1,
  Combate: 2,
  Detección: 3,
  Comunicación: 4,
  Tiradas: 5,
  Otras: 6,
};
