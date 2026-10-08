import React from 'react';
import {
  Flame,
  Wind,
  Sparkles,
  Sun,
  Shield,
  Moon,
  Compass,
  CloudMoon,
  LucideIcon,
} from 'lucide-react';
import { SpellOrigin } from '../types';

export interface OriginInfo {
  name: SpellOrigin;
  nameEn: string;
  icon: LucideIcon;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  description: string;
  descriptionEn: string;
}

export const SPELL_ORIGINS: OriginInfo[] = [
  {
    name: 'Infernal',
    nameEn: 'Infernal',
    icon: Flame,
    color: '#ef4444',
    textColor: 'text-red-400',
    bgColor: 'bg-red-950/40',
    borderColor: 'border-red-500/40',
    description: 'Poder de los Nueve Infiernos, el Abismo, azufre y pactos demoníacos.',
    descriptionEn: 'Power of the Nine Hells, Abyss, brimstone and demonic pacts.',
  },
  {
    name: 'Elemental',
    nameEn: 'Elemental',
    icon: Wind,
    color: '#06b6d4',
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-950/40',
    borderColor: 'border-cyan-500/40',
    description: 'Fuerzas puras de los planos elementales: fuego, agua, tierra y aire.',
    descriptionEn: 'Raw forces from elemental planes: fire, water, earth and air.',
  },
  {
    name: 'Feérico',
    nameEn: 'Fey',
    icon: Sparkles,
    color: '#10b981',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-950/40',
    borderColor: 'border-emerald-500/40',
    description: 'Encantos salvajes del Feywild, naturaleza caprichosa y magia feérica.',
    descriptionEn: 'Wild Feywild enchantments, whimsical nature and fey magic.',
  },
  {
    name: 'Celestial',
    nameEn: 'Celestial',
    icon: Sun,
    color: '#facc15',
    textColor: 'text-yellow-300',
    bgColor: 'bg-yellow-950/40',
    borderColor: 'border-yellow-500/40',
    description: 'Luz sacra de los Planos Superiores, coros angélicos y gracia divina.',
    descriptionEn: 'Sacred light from Upper Planes, angelic choirs and divine grace.',
  },
  {
    name: 'Mortal',
    nameEn: 'Mortal',
    icon: Shield,
    color: '#94a3b8',
    textColor: 'text-slate-300',
    bgColor: 'bg-slate-900/50',
    borderColor: 'border-slate-500/40',
    description: 'Ingenio humanoide, alquimia, técnicas marciales y magia del plano material.',
    descriptionEn: 'Humanoid craft, alchemy, martial grit and material realm magic.',
  },
  {
    name: 'Shadowfell',
    nameEn: 'Shadowfell',
    icon: Moon,
    color: '#a855f7',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-950/40',
    borderColor: 'border-purple-500/40',
    description: 'Penumbras del Páramo Sombrío, decadencia, nigromancia y ecos espectrales.',
    descriptionEn: 'Gloom of the Shadowfell, decay, necromancy and spectral echoes.',
  },
  {
    name: 'Astral',
    nameEn: 'Astral',
    icon: Compass,
    color: '#38bdf8',
    textColor: 'text-sky-300',
    bgColor: 'bg-sky-950/40',
    borderColor: 'border-sky-500/40',
    description: 'El Mar de Plata del Plano Astral, psiónica, mente pura y espacio intemporal.',
    descriptionEn: 'The Silver Sea of the Astral Plane, psionics, pure mind and timeless space.',
  },
  {
    name: 'Onírico',
    nameEn: 'Oneiric / Dream',
    icon: CloudMoon,
    color: '#f472b6',
    textColor: 'text-pink-300',
    bgColor: 'bg-pink-950/40',
    borderColor: 'border-pink-500/40',
    description: 'Magia nacida de los sueños, pesadillas, ilusiones subconscientes y el tejido onírico.',
    descriptionEn: 'Magic born from dreams, nightmares, subconscious illusions and oneiric weaves.',
  },
];

export const ORIGIN_MAP: Record<SpellOrigin, OriginInfo> = SPELL_ORIGINS.reduce((acc, curr) => {
  acc[curr.name] = curr;
  return acc;
}, {} as Record<SpellOrigin, OriginInfo>);

export function getSpellOrigin(spell: { origin?: SpellOrigin; primordialMagic?: string; school?: string; name?: string; description?: string; damageType?: string }): SpellOrigin {
  if (spell.origin) return spell.origin;

  const text = `${spell.name || ''} ${spell.description || ''}`.toLowerCase();

  // Keyword check
  if (text.includes('pesadilla') || text.includes('sueño') || text.includes('dormir') || text.includes('onírico') || text.includes('fantasmagor')) {
    return 'Onírico';
  }
  if (text.includes('demonio') || text.includes('diablo') || text.includes('infierno') || text.includes('infernal') || text.includes('abismo') || text.includes('azufre') || text.includes('fuego fátuo') || text.includes('pacto')) {
    return 'Infernal';
  }
  if (text.includes('sombra') || text.includes('páramo sombrío') || text.includes('muerte') || text.includes('necrótico') || text.includes('cadáver') || text.includes('zombi') || text.includes('espectro') || text.includes('penumbra')) {
    return 'Shadowfell';
  }
  if (text.includes('hada') || text.includes('feérico') || text.includes('fey') || text.includes('encanto') || text.includes('faerie') || text.includes('bosque') || text.includes('duende')) {
    return 'Feérico';
  }
  if (text.includes('celestial') || text.includes('ángel') || text.includes('radiante') || text.includes('divino') || text.includes('sagrado') || text.includes('sant') || text.includes('bendición') || text.includes('curación')) {
    return 'Celestial';
  }
  if (text.includes('astral') || text.includes('psíquic') || text.includes('mente') || text.includes('telepat') || text.includes('telequ') || text.includes('espacio') || text.includes('teletrans')) {
    return 'Astral';
  }
  if (text.includes('fuego') || text.includes('frío') || text.includes('hielo') || text.includes('relámpago') || text.includes('trueno') || text.includes('ácido') || text.includes('viento') || text.includes('tierra') || text.includes('agua') || text.includes('elemental') || text.includes('llamas')) {
    return 'Elemental';
  }

  // Fallback by primordial magic or school
  if (spell.primordialMagic === 'Magia Divina') return 'Celestial';
  if (spell.primordialMagic === 'Magia Profana') return 'Infernal';
  if (spell.primordialMagic === 'Magia Extraplanar') return 'Astral';
  if (spell.primordialMagic === 'Magia Natural') return 'Elemental';
  if (spell.primordialMagic === 'Magia Salvaje') return 'Feérico';

  if (spell.school === 'Nigromancia') return 'Shadowfell';
  if (spell.school === 'Evocación') return 'Elemental';
  if (spell.school === 'Ilusión') return 'Onírico';
  if (spell.school === 'Encantamiento') return 'Feérico';
  if (spell.school === 'Adivinación') return 'Astral';

  return 'Mortal';
}
