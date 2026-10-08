import React from 'react';
import {
  AbjurationIcon,
  DivinationIcon,
  ConjurationIcon,
  EnchantmentIcon,
  EvocationIcon,
  IllusionIcon,
  NecromancyIcon,
  TransmutationIcon,
  ReflectionIcon,
  SCHOOL_IMAGE_MAP,
} from '../components/SchoolIcon';
import { MagicSchool } from '../types';

export interface SchoolTheme {
  name: MagicSchool;
  nameEn: string;
  icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
  iconUrl?: string;
  hexColor: string;
  textColor: string;
  textMutedColor: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  badgeClass: string;
}

export const SCHOOL_THEMES: Record<string, SchoolTheme> = {
  'Abjuración': {
    name: 'Abjuración',
    nameEn: 'Abjuration',
    icon: AbjurationIcon,
    iconUrl: SCHOOL_IMAGE_MAP['Abjuración'],
    hexColor: '#38bdf8', // Ice Blue / Sky
    textColor: 'text-sky-300',
    textMutedColor: 'text-sky-400',
    bgColor: 'bg-sky-950/40',
    borderColor: 'border-sky-500/40',
    glowColor: '#38bdf8',
    badgeClass: 'bg-sky-950/50 text-sky-300 border-sky-400/40',
  },
  'Adivinación': {
    name: 'Adivinación',
    nameEn: 'Divination',
    icon: DivinationIcon,
    iconUrl: SCHOOL_IMAGE_MAP['Adivinación'],
    hexColor: '#fbbf24', // Amber/Yellow
    textColor: 'text-amber-300',
    textMutedColor: 'text-amber-400',
    bgColor: 'bg-amber-950/40',
    borderColor: 'border-amber-500/40',
    glowColor: '#fbbf24',
    badgeClass: 'bg-amber-950/50 text-amber-300 border-amber-400/40',
  },
  'Conjuración': {
    name: 'Conjuración',
    nameEn: 'Conjuration',
    icon: ConjurationIcon,
    iconUrl: SCHOOL_IMAGE_MAP['Conjuración'],
    hexColor: '#34d399', // Emerald/Mint
    textColor: 'text-emerald-300',
    textMutedColor: 'text-emerald-400',
    bgColor: 'bg-emerald-950/40',
    borderColor: 'border-emerald-500/40',
    glowColor: '#34d399',
    badgeClass: 'bg-emerald-950/50 text-emerald-300 border-emerald-400/40',
  },
  'Encantamiento': {
    name: 'Encantamiento',
    nameEn: 'Enchantment',
    icon: EnchantmentIcon,
    iconUrl: SCHOOL_IMAGE_MAP['Encantamiento'],
    hexColor: '#f472b6', // Pink
    textColor: 'text-pink-300',
    textMutedColor: 'text-pink-400',
    bgColor: 'bg-pink-950/40',
    borderColor: 'border-pink-500/40',
    glowColor: '#f472b6',
    badgeClass: 'bg-pink-950/50 text-pink-300 border-pink-400/40',
  },
  'Evocación': {
    name: 'Evocación',
    nameEn: 'Evocation',
    icon: EvocationIcon,
    iconUrl: SCHOOL_IMAGE_MAP['Evocación'],
    hexColor: '#f97316', // Orange / Fire
    textColor: 'text-orange-300',
    textMutedColor: 'text-orange-400',
    bgColor: 'bg-orange-950/40',
    borderColor: 'border-orange-500/40',
    glowColor: '#f97316',
    badgeClass: 'bg-orange-950/50 text-orange-300 border-orange-400/40',
  },
  'Ilusión': {
    name: 'Ilusión',
    nameEn: 'Illusion',
    icon: IllusionIcon,
    iconUrl: SCHOOL_IMAGE_MAP['Ilusión'],
    hexColor: '#c084fc', // Purple / Violet
    textColor: 'text-purple-300',
    textMutedColor: 'text-purple-400',
    bgColor: 'bg-purple-950/40',
    borderColor: 'border-purple-500/40',
    glowColor: '#c084fc',
    badgeClass: 'bg-purple-950/50 text-purple-300 border-purple-400/40',
  },
  'Nigromancia': {
    name: 'Nigromancia',
    nameEn: 'Necromancy',
    icon: NecromancyIcon,
    iconUrl: SCHOOL_IMAGE_MAP['Nigromancia'],
    hexColor: '#a855f7', // Deep Violet / Necrotic
    textColor: 'text-violet-300',
    textMutedColor: 'text-violet-400',
    bgColor: 'bg-violet-950/40',
    borderColor: 'border-violet-500/40',
    glowColor: '#a855f7',
    badgeClass: 'bg-violet-950/50 text-violet-300 border-violet-400/40',
  },
  'Transmutación': {
    name: 'Transmutación',
    nameEn: 'Transmutation',
    icon: TransmutationIcon,
    iconUrl: SCHOOL_IMAGE_MAP['Transmutación'],
    hexColor: '#10b981', // Emerald / Alchemy
    textColor: 'text-emerald-300',
    textMutedColor: 'text-emerald-400',
    bgColor: 'bg-emerald-950/40',
    borderColor: 'border-emerald-500/40',
    glowColor: '#10b981',
    badgeClass: 'bg-emerald-950/50 text-emerald-300 border-emerald-400/40',
  },
  'Reflexión': {
    name: 'Reflexión',
    nameEn: 'Reflection',
    icon: ReflectionIcon,
    iconUrl: SCHOOL_IMAGE_MAP['Reflexión'],
    hexColor: '#bafafd', // Ice Crystal Mint #bafafd
    textColor: 'text-[#bafafd]',
    textMutedColor: 'text-[#bafafd]/80',
    bgColor: 'bg-[#14282e]',
    borderColor: 'border-[#bafafd]/50',
    glowColor: '#bafafd',
    badgeClass: 'bg-[#14282c] text-[#bafafd] border-[#bafafd]/40',
  },
};

export function getSchoolTheme(school?: string | null): SchoolTheme {
  if (!school) return SCHOOL_THEMES['Evocación'];
  // Normalization logic
  const normalized = school.trim();
  const directMatch = SCHOOL_THEMES[normalized];
  if (directMatch) return directMatch;

  // Search case-insensitive & accent-insensitive
  const clean = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const targetClean = clean(normalized);

  for (const key of Object.keys(SCHOOL_THEMES)) {
    if (clean(key) === targetClean) {
      return SCHOOL_THEMES[key];
    }
  }

  // English fallback matching
  for (const theme of Object.values(SCHOOL_THEMES)) {
    if (clean(theme.nameEn) === targetClean) {
      return theme;
    }
  }

  return SCHOOL_THEMES['Evocación'];
}
