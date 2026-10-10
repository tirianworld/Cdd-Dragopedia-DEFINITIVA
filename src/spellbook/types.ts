export type MagicSchool = 
  | 'Abjuración'
  | 'Adivinación'
  | 'Conjuración'
  | 'Encantamiento'
  | 'Evocación'
  | 'Ilusión'
  | 'Nigromancia'
  | 'Transmutación'
  | 'Reflexión';

export type PrimordialMagic =
  | 'Magia Divina'
  | 'Magia Extraplanar'
  | 'Magia Profana'
  | 'Magia Arcana'
  | 'Magia Salvaje'
  | 'Magia Natural';

export type SpellUtility =
  | 'Curación'
  | 'Combate'
  | 'Detección'
  | 'Comunicación'
  | 'Tiradas';

export type SpellFunctionality =
  | 'invocar'
  | 'atacar'
  | 'defenderse'
  | 'utilidad'
  | 'transporte'
  | 'cambio planar'
  | 'curación';

export type SpellTarget =
  | 'propio'
  | 'enemigo'
  | 'enemigos'
  | 'aliados'
  | 'objeto';

export type SpellOrigin =
  | 'Infernal'
  | 'Elemental'
  | 'Feérico'
  | 'Celestial'
  | 'Mortal'
  | 'Shadowfell'
  | 'Astral'
  | 'Onírico';

export type GroupByDistribution = 'level' | 'primordial' | 'school';

export type DndClass =
  | 'Artífice'
  | 'Bardo'
  | 'Brujo'
  | 'Clérigo'
  | 'Druida'
  | 'Explorador'
  | 'Hechicero'
  | 'Mago'
  | 'Paladín';

export interface SpellComponents {
  verbal: boolean;
  somatic: boolean;
  material: boolean;
  materialDescription?: string;
}

export interface Spell {
  id: string;
  name: string;
  nameEn: string;
  level: number; // 0 for Truco / Cantrip, 1 to 9
  school: MagicSchool;
  schoolEn: string;
  castingTime: string;
  range: string;
  components: SpellComponents;
  duration: string;
  concentration: boolean;
  ritual: boolean;
  classes: DndClass[];
  description: string;
  higherLevels?: string;
  damageType?: string;
  damageTypes?: string[];
  icon: string;
  iconUrl?: string;
  bg3IconUrl?: string | null;
  bg3IconName?: string | null;
  color?: string;
  version: '2014' | '2024' | 'ambas';
  source: string;
  isCustom?: boolean;
  isEdited?: boolean;
  updatedAt?: string;
  primordialMagic?: PrimordialMagic;
  origin?: SpellOrigin;
  functionalities?: SpellFunctionality[];
  targets?: SpellTarget[];
}

export interface SpellSlot {
  max: number;
  used: number;
}

export interface Character {
  id: string;
  name: string;
  class: DndClass;
  level: number;
  spellcastingAbility?: 'INT' | 'WIS' | 'CHA';
  spellSlots: Record<number, SpellSlot>;
  knownSpellIds: string[];
  preparedSpellIds: string[];
  favoriteSpellIds: string[];
}

export interface SpellList {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color?: string;
  spellIds: string[];
  createdAt: string;
  updatedAt?: string;
  author?: string;
  isPublic?: boolean;
  likes?: number;
  tags?: string[];
}

export type ViewTab = 'catalog' | 'spellbook' | 'character' | 'print' | 'custom' | 'spell-lists' | 'public-gallery';

export interface FilterState {
  search: string;
  levels: number[];
  classes: DndClass[];
  schools: MagicSchool[];
  primordialMagics: PrimordialMagic[];
  functionalities: SpellFunctionality[];
  targets: SpellTarget[];
  groupBy: GroupByDistribution;
  castingTime: string;
  concentration: boolean | null;
  ritual: boolean | null;
  components: {
    verbal: boolean;
    somatic: boolean;
    material: boolean;
  };
  damageTypes: string[];
  damageType: string;
  sortBy: 'level-asc' | 'level-desc' | 'name-asc' | 'name-desc' | 'school';
  onlyPrepared: boolean;
  onlyFavorites: boolean;
  onlySpellbook: boolean;
  onlyCustom?: boolean;
  onlyVanilla?: boolean;
}
