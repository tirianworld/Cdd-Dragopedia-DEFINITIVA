import {
  Wrench,
  Music,
  Flame,
  Sun,
  Leaf,
  Compass,
  Swords,
  Sparkles,
  BookOpen,
  Hand,
  Shield,
  Feather,
  LucideIcon,
} from 'lucide-react';
import { DndClass } from '../types';

export interface ClassInfo {
  name: DndClass;
  nameEn: string;
  icon: LucideIcon;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  accentGlow: string;
}

export const CLASS_OPTIONS: ClassInfo[] = [
  {
    name: 'Artífice',
    nameEn: 'Artificer',
    icon: Wrench,
    color: '#38bdf8',
    textColor: 'text-sky-400',
    bgColor: 'bg-sky-950/40',
    borderColor: 'border-sky-500/40',
    accentGlow: 'rgba(56, 189, 248, 0.75)',
  },
  {
    name: 'Bardo',
    nameEn: 'Bard',
    icon: Music,
    color: '#f472b6',
    textColor: 'text-pink-400',
    bgColor: 'bg-pink-950/40',
    borderColor: 'border-pink-500/40',
    accentGlow: 'rgba(244, 114, 182, 0.75)',
  },
  {
    name: 'Brujo',
    nameEn: 'Warlock',
    icon: Flame,
    color: '#a855f7',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-950/40',
    borderColor: 'border-purple-500/40',
    accentGlow: 'rgba(168, 85, 247, 0.75)',
  },
  {
    name: 'Clérigo',
    nameEn: 'Cleric',
    icon: Sun,
    color: '#facc15',
    textColor: 'text-yellow-300',
    bgColor: 'bg-yellow-950/40',
    borderColor: 'border-yellow-500/40',
    accentGlow: 'rgba(250, 204, 21, 0.75)',
  },
  {
    name: 'Druida',
    nameEn: 'Druid',
    icon: Leaf,
    color: '#10b981',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-950/40',
    borderColor: 'border-emerald-500/40',
    accentGlow: 'rgba(16, 185, 129, 0.75)',
  },
  {
    name: 'Explorador',
    nameEn: 'Ranger',
    icon: Compass,
    color: '#14b8a6',
    textColor: 'text-teal-400',
    bgColor: 'bg-teal-950/40',
    borderColor: 'border-teal-500/40',
    accentGlow: 'rgba(20, 184, 166, 0.75)',
  },
  {
    name: 'Guerrero',
    nameEn: 'Fighter',
    icon: Swords,
    color: '#ef4444',
    textColor: 'text-red-400',
    bgColor: 'bg-red-950/40',
    borderColor: 'border-red-500/40',
    accentGlow: 'rgba(239, 68, 68, 0.75)',
  },
  {
    name: 'Hechicero',
    nameEn: 'Sorcerer',
    icon: Sparkles,
    color: '#c084fc',
    textColor: 'text-purple-300',
    bgColor: 'bg-purple-950/40',
    borderColor: 'border-purple-400/40',
    accentGlow: 'rgba(192, 132, 252, 0.75)',
  },
  {
    name: 'Mago',
    nameEn: 'Wizard',
    icon: BookOpen,
    color: '#60a5fa',
    textColor: 'text-blue-400',
    bgColor: 'bg-blue-950/40',
    borderColor: 'border-blue-500/40',
    accentGlow: 'rgba(96, 165, 250, 0.75)',
  },
  {
    name: 'Monje',
    nameEn: 'Monk',
    icon: Hand,
    color: '#fb923c',
    textColor: 'text-orange-400',
    bgColor: 'bg-orange-950/40',
    borderColor: 'border-orange-500/40',
    accentGlow: 'rgba(251, 146, 60, 0.75)',
  },
  {
    name: 'Paladín',
    nameEn: 'Paladin',
    icon: Shield,
    color: '#fde047',
    textColor: 'text-amber-300',
    bgColor: 'bg-amber-950/40',
    borderColor: 'border-amber-400/40',
    accentGlow: 'rgba(253, 224, 71, 0.75)',
  },
  {
    name: 'Pícaro',
    nameEn: 'Rogue',
    icon: Feather,
    color: '#94a3b8',
    textColor: 'text-slate-300',
    bgColor: 'bg-slate-900/60',
    borderColor: 'border-slate-500/40',
    accentGlow: 'rgba(148, 163, 184, 0.65)',
  },
];

export const CLASS_MAP: Record<string, ClassInfo> = CLASS_OPTIONS.reduce((acc, c) => {
  acc[c.name] = c;
  return acc;
}, {} as Record<string, ClassInfo>);
