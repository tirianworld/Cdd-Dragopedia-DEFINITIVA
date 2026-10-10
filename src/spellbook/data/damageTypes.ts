import React from 'react';
import { LucideIcon } from 'lucide-react';
import {
  FireDamageIcon,
  ColdDamageIcon,
  LightningDamageIcon,
  ThunderDamageIcon,
  AcidDamageIcon,
  PoisonDamageIcon,
  NecroticDamageIcon,
  RadiantDamageIcon,
  ForceDamageIcon,
  PsychicDamageIcon,
  BludgeoningDamageIcon,
  SlashingDamageIcon,
  PiercingDamageIcon,
} from '../components/DamageTypeIcon';

import { Spell } from '../types';

export interface DamageTypeInfo {
  name: string;
  nameEn: string;
  icon: React.FC<{ className?: string; style?: React.CSSProperties }> | LucideIcon;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

export const DAMAGE_TYPES: DamageTypeInfo[] = [
  {
    name: 'Fuego',
    nameEn: 'Fire',
    icon: FireDamageIcon,
    color: '#ef4444',
    textColor: 'text-red-400',
    bgColor: 'bg-red-950/40',
    borderColor: 'border-red-500/40',
  },
  {
    name: 'Frío',
    nameEn: 'Cold',
    icon: ColdDamageIcon,
    color: '#38bdf8',
    textColor: 'text-sky-400',
    bgColor: 'bg-sky-950/40',
    borderColor: 'border-sky-500/40',
  },
  {
    name: 'Relámpago',
    nameEn: 'Lightning',
    icon: LightningDamageIcon,
    color: '#fbbf24',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-950/40',
    borderColor: 'border-amber-500/40',
  },
  {
    name: 'Trueno',
    nameEn: 'Thunder',
    icon: ThunderDamageIcon,
    color: '#818cf8',
    textColor: 'text-indigo-400',
    bgColor: 'bg-indigo-950/40',
    borderColor: 'border-indigo-500/40',
  },
  {
    name: 'Ácido',
    nameEn: 'Acid',
    icon: AcidDamageIcon,
    color: '#84cc16',
    textColor: 'text-lime-400',
    bgColor: 'bg-lime-950/40',
    borderColor: 'border-lime-500/40',
  },
  {
    name: 'Veneno',
    nameEn: 'Poison',
    icon: PoisonDamageIcon,
    color: '#10b981',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-950/40',
    borderColor: 'border-emerald-500/40',
  },
  {
    name: 'Necrótico',
    nameEn: 'Necrotic',
    icon: NecroticDamageIcon,
    color: '#a855f7',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-950/40',
    borderColor: 'border-purple-500/40',
  },
  {
    name: 'Radiante',
    nameEn: 'Radiant',
    icon: RadiantDamageIcon,
    color: '#facc15',
    textColor: 'text-yellow-300',
    bgColor: 'bg-yellow-950/40',
    borderColor: 'border-yellow-500/40',
  },
  {
    name: 'Fuerza',
    nameEn: 'Force',
    icon: ForceDamageIcon,
    color: '#ec4899',
    textColor: 'text-pink-400',
    bgColor: 'bg-pink-950/40',
    borderColor: 'border-pink-500/40',
  },
  {
    name: 'Psíquico',
    nameEn: 'Psychic',
    icon: PsychicDamageIcon,
    color: '#f43f5e',
    textColor: 'text-rose-400',
    bgColor: 'bg-rose-950/40',
    borderColor: 'border-rose-500/40',
  },
  {
    name: 'Contundente',
    nameEn: 'Bludgeoning',
    icon: BludgeoningDamageIcon,
    color: '#94a3b8',
    textColor: 'text-slate-300',
    bgColor: 'bg-slate-900/50',
    borderColor: 'border-slate-500/40',
  },
  {
    name: 'Cortante',
    nameEn: 'Slashing',
    icon: SlashingDamageIcon,
    color: '#cbd5e1',
    textColor: 'text-slate-200',
    bgColor: 'bg-slate-900/50',
    borderColor: 'border-slate-500/40',
  },
  {
    name: 'Perforante',
    nameEn: 'Piercing',
    icon: PiercingDamageIcon,
    color: '#e2e8f0',
    textColor: 'text-slate-200',
    bgColor: 'bg-slate-900/50',
    borderColor: 'border-slate-500/40',
  },
];

export const ALL_DAMAGE_TYPES = DAMAGE_TYPES.map((d) => d.name);

const DAMAGE_MAP: Record<string, string> = {
  fuego: 'Fuego',
  fire: 'Fuego',
  frio: 'Frío',
  frío: 'Frío',
  cold: 'Frío',
  relampago: 'Relámpago',
  relámpago: 'Relámpago',
  lightning: 'Relámpago',
  trueno: 'Trueno',
  thunder: 'Trueno',
  acido: 'Ácido',
  ácido: 'Ácido',
  acid: 'Ácido',
  veneno: 'Veneno',
  poison: 'Veneno',
  necrotico: 'Necrótico',
  necrótico: 'Necrótico',
  necrotic: 'Necrótico',
  radiante: 'Radiante',
  radiant: 'Radiante',
  fuerza: 'Fuerza',
  force: 'Fuerza',
  psiquico: 'Psíquico',
  psíquico: 'Psíquico',
  psychic: 'Psíquico',
  contundente: 'Contundente',
  bludgeoning: 'Contundente',
  cortante: 'Cortante',
  slashing: 'Cortante',
  perforante: 'Perforante',
  piercing: 'Perforante',
};

/**
 * Returns all damage types a spell can inflict or apply.
 * Supports single damage types, explicit damageTypes arrays,
 * and spells that offer a choice among elements (e.g., Arma Elemental, Orbe Cromático, Aliento de Dragón).
 */
export function getSpellDamageTypes(spell: Spell): string[] {
  const result = new Set<string>();

  // 1. Explicit damageType (supports comma-separated, slash-separated, and multi-damage strings)
  if (spell.damageType) {
    const raw = spell.damageType.trim();
    // Split by commas, slashes, semicolons, pipe, or conjunctions
    const parts = raw.split(/[,/;|]|\s+(?:y|o|and|or)\s+/i);
    for (const part of parts) {
      const norm = part.trim().toLowerCase();
      if (!norm) continue;
      if (DAMAGE_MAP[norm]) {
        result.add(DAMAGE_MAP[norm]);
      } else {
        // Check partial matches against damage map keys
        for (const [key, val] of Object.entries(DAMAGE_MAP)) {
          if (norm.includes(key)) {
            result.add(val);
          }
        }
      }
    }
  }

  // 2. Explicit damageTypes array
  if (spell.damageTypes && Array.isArray(spell.damageTypes)) {
    spell.damageTypes.forEach((d) => {
      const norm = d.trim().toLowerCase();
      if (DAMAGE_MAP[norm]) {
        result.add(DAMAGE_MAP[norm]);
      } else {
        for (const [key, val] of Object.entries(DAMAGE_MAP)) {
          if (norm.includes(key)) {
            result.add(val);
          }
        }
      }
    });
  }

  const desc = (spell.description || '').toLowerCase();
  const name = `${spell.name || ''} ${spell.nameEn || ''}`.toLowerCase();
  const id = (spell.id || '').toLowerCase();

  // 3. Known multi-element spells
  // Arma elemental (Elemental Weapon)
  if (id.includes('elemental-weapon') || name.includes('arma elemental') || name.includes('elemental weapon')) {
    ['Ácido', 'Frío', 'Fuego', 'Relámpago', 'Trueno'].forEach((d) => result.add(d));
  }
  // Orbe cromático (Chromatic Orb)
  if (id.includes('chromatic-orb') || name.includes('orbe cromático') || name.includes('orbe cromatico') || name.includes('chromatic orb')) {
    ['Ácido', 'Frío', 'Fuego', 'Relámpago', 'Veneno', 'Trueno'].forEach((d) => result.add(d));
  }
  // Aliento de dragón (Dragon's Breath)
  if (id.includes('dragons-breath') || name.includes('aliento de dragón') || name.includes('aliento de dragon')) {
    ['Ácido', 'Frío', 'Fuego', 'Relámpago', 'Veneno'].forEach((d) => result.add(d));
  }
  // Proyectil del caos / Descarga Caótica (Chaos Bolt)
  if (id.includes('chaos-bolt') || name.includes('proyectil del caos') || name.includes('descarga caótica') || name.includes('chaos bolt')) {
    ['Ácido', 'Frío', 'Fuego', 'Fuerza', 'Relámpago', 'Veneno', 'Psíquico', 'Trueno'].forEach((d) => result.add(d));
  }
  // Glifo custodio (Glyph of Warding)
  if (id.includes('glyph-of-warding') || name.includes('glifo custodio') || name.includes('glifo de custodia') || name.includes('glyph of warding')) {
    ['Ácido', 'Frío', 'Fuego', 'Relámpago', 'Trueno'].forEach((d) => result.add(d));
  }
  // Escudo de fuego (Fire Shield)
  if (id.includes('fire-shield') || name.includes('escudo de fuego') || name.includes('fire shield')) {
    ['Fuego', 'Frío'].forEach((d) => result.add(d));
  }
  // Absorber elementos (Absorb Elements)
  if (id.includes('absorb-elements') || name.includes('absorber elementos') || name.includes('absorb elements')) {
    ['Ácido', 'Frío', 'Fuego', 'Relámpago', 'Trueno'].forEach((d) => result.add(d));
  }
  // Cólera Elemental (Elemental Bane)
  if (id.includes('elemental-bane') || name.includes('cólera elemental') || name.includes('elemental bane')) {
    ['Ácido', 'Frío', 'Fuego', 'Relámpago', 'Trueno'].forEach((d) => result.add(d));
  }
  // Cuchillo de Hielo (Ice Knife)
  if (id.includes('ice-knife') || name.includes('cuchillo de hielo') || name.includes('saeta de hielo') || name.includes('ice knife')) {
    ['Perforante', 'Frío'].forEach((d) => result.add(d));
  }
  // Tormenta de hielo (Ice Storm)
  if (id.includes('ice-storm') || name.includes('tormenta de hielo') || name.includes('ice storm')) {
    ['Contundente', 'Frío'].forEach((d) => result.add(d));
  }
  // Golpe flamígero (Flame Strike)
  if (id.includes('flame-strike') || name.includes('golpe flamígero') || name.includes('columna de llamas') || name.includes('flame strike')) {
    ['Fuego', 'Radiante'].forEach((d) => result.add(d));
  }
  // Ola destructiva (Destructive Wave)
  if (id.includes('destructive-wave') || name.includes('ola destructiva') || name.includes('destructive wave')) {
    ['Trueno', 'Radiante', 'Necrótico'].forEach((d) => result.add(d));
  }
  // Rociada prismática / Muro prismático
  if (id.includes('prismatic') || name.includes('prismátic') || name.includes('prismatic')) {
    ['Fuego', 'Ácido', 'Relámpago', 'Veneno', 'Frío'].forEach((d) => result.add(d));
    if (name.includes('muro') || id.includes('wall')) {
      result.add('Fuerza');
    }
  }
  // Tormenta de la venganza (Storm of Vengeance)
  if (id.includes('storm-of-vengeance') || name.includes('tormenta de la venganza')) {
    ['Ácido', 'Relámpago', 'Trueno', 'Frío', 'Contundente'].forEach((d) => result.add(d));
  }
  // Tromba de meteoritos (Meteor Swarm)
  if (id.includes('meteor-swarm') || name.includes('tromba de meteoritos') || name.includes('enjambre de meteoros') || name.includes('lluvia de meteoritos')) {
    ['Contundente', 'Fuego'].forEach((d) => result.add(d));
  }

  // 4. Pattern matches in spell description (such as "ácido, frío, fuego, relámpago o trueno")
  if (/ácido,\s*frío,\s*fuego,\s*relámpago\s*o\s*trueno/i.test(desc) || /acid,\s*cold,\s*fire,\s*lightning\s*or\s*thunder/i.test(desc)) {
    ['Ácido', 'Frío', 'Fuego', 'Relámpago', 'Trueno'].forEach((d) => result.add(d));
  }
  if (/ácido,\s*frío,\s*fuego,\s*relámpago\s*(?:,\s*veneno\s*)?o\s*trueno/i.test(desc)) {
    ['Ácido', 'Frío', 'Fuego', 'Relámpago', 'Trueno'].forEach((d) => result.add(d));
    if (/veneno/i.test(desc)) result.add('Veneno');
  }
  if (/ácido,\s*frío,\s*fuego,\s*relámpago\s*o\s*veneno/i.test(desc)) {
    ['Ácido', 'Frío', 'Fuego', 'Relámpago', 'Veneno'].forEach((d) => result.add(d));
  }

  // Dual damage descriptions like "X de daño de fuego y Y de daño radiante"
  const dualPatterns: { name: string; regex: RegExp }[] = [
    { name: 'Fuego', regex: /daño (?:de |por )?fuego|fuego.*(?:puntos de daño|daño adicional)/i },
    { name: 'Frío', regex: /daño (?:de |por )?frío|frío.*(?:puntos de daño|daño adicional)/i },
    { name: 'Relámpago', regex: /daño (?:de |por )?relámpago|relámpago.*(?:puntos de daño|daño adicional)/i },
    { name: 'Trueno', regex: /daño (?:de |por )?trueno|trueno.*(?:puntos de daño|daño adicional)/i },
    { name: 'Ácido', regex: /daño (?:de |por )?ácido|ácido.*(?:puntos de daño|daño adicional)/i },
    { name: 'Veneno', regex: /daño (?:de |por )?veneno|veneno.*(?:puntos de daño|daño adicional)/i },
    { name: 'Necrótico', regex: /daño (?:de |por )?necrótico|necrótico.*(?:puntos de daño|daño adicional)/i },
    { name: 'Radiante', regex: /daño (?:de |por )?radiante|radiante.*(?:puntos de daño|daño adicional)/i },
    { name: 'Fuerza', regex: /daño (?:de |por )?fuerza|fuerza.*(?:puntos de daño|daño adicional)/i },
    { name: 'Psíquico', regex: /daño (?:de |por )?psíquico|psíquico.*(?:puntos de daño|daño adicional)/i },
    { name: 'Contundente', regex: /daño (?:de |por )?contundente|contundente.*(?:puntos de daño|daño adicional)/i },
    { name: 'Cortante', regex: /daño (?:de |por )?cortante|cortante.*(?:puntos de daño|daño adicional)/i },
    { name: 'Perforante', regex: /daño (?:de |por )?perforante|perforante.*(?:puntos de daño|daño adicional)/i },
  ];

  for (const dp of dualPatterns) {
    if (dp.regex.test(desc)) {
      const isPureDefense = desc.includes(`resistencia al daño de ${dp.name.toLowerCase()}`) && !desc.includes(`sufre daño de ${dp.name.toLowerCase()}`);
      if (!isPureDefense) {
        if (result.size > 0 || /sufre.*daño|recibe.*daño|inflige.*daño|hace.*daño|causa.*daño|tirada de ataque/i.test(desc)) {
          result.add(dp.name);
        }
      }
    }
  }

  return Array.from(result);
}
