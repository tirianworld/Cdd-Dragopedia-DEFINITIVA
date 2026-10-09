import { SpellList } from '../types';

export interface ListIconOption {
  id: string;
  icon: string;
  label: string;
  category: 'elemental' | 'divine' | 'dark' | 'combat' | 'arcane' | 'nature';
}

export const LIST_ICON_OPTIONS: ListIconOption[] = [
  { id: 'fire', icon: '🔥', label: 'Fuego', category: 'elemental' },
  { id: 'ice', icon: '❄️', label: 'Hielo / Escarcha', category: 'elemental' },
  { id: 'lightning', icon: '⚡', label: 'Relámpago', category: 'elemental' },
  { id: 'water', icon: '🌊', label: 'Mareas', category: 'elemental' },
  { id: 'wind', icon: '🌪️', label: 'Tempestad', category: 'elemental' },
  { id: 'skull', icon: '💀', label: 'Nigromancia', category: 'dark' },
  { id: 'blood', icon: '🩸', label: 'Sangre', category: 'dark' },
  { id: 'ghost', icon: '👻', label: 'Espíritus', category: 'dark' },
  { id: 'moon', icon: '🌙', label: 'Luna Llena', category: 'dark' },
  { id: 'orb', icon: '🔮', label: 'Orbe Arcano', category: 'arcane' },
  { id: 'wand', icon: '🪄', label: 'Varita Mágica', category: 'arcane' },
  { id: 'book', icon: '📖', label: 'Grimorio', category: 'arcane' },
  { id: 'eye', icon: '👁️', label: 'Adivinación', category: 'arcane' },
  { id: 'mirror', icon: '🪞', label: 'Espejo / Reflejo', category: 'arcane' },
  { id: 'sparkles', icon: '✨', label: 'Luz Sagrada', category: 'divine' },
  { id: 'sun', icon: '☀️', label: 'Sol Radiante', category: 'divine' },
  { id: 'heart', icon: '💖', label: 'Curación / Vida', category: 'divine' },
  { id: 'cross', icon: '✝️', label: 'Sagrario', category: 'divine' },
  { id: 'sword', icon: '⚔️', label: 'Hoja y Acero', category: 'combat' },
  { id: 'shield', icon: '🛡️', label: 'Escudo Protector', category: 'combat' },
  { id: 'target', icon: '🎯', label: 'Puntería / Precisión', category: 'combat' },
  { id: 'dragon', icon: '🐉', label: 'Dragón Primordial', category: 'combat' },
  { id: 'leaf', icon: '🌿', label: 'Naturaleza', category: 'nature' },
  { id: 'tree', icon: '🌲', label: 'Druidismo', category: 'nature' },
  { id: 'paw', icon: '🐾', label: 'Bestias', category: 'nature' },
  { id: 'feather', icon: '🪶', label: 'Pluma / Levitación', category: 'nature' },
];

export const LIST_COLOR_OPTIONS = [
  { id: 'cyan', hex: '#bafafd', label: 'Cian Arcano' },
  { id: 'blue', hex: '#38bdf8', label: 'Zafiro Celestial' },
  { id: 'indigo', hex: '#818cf8', label: 'Índigo Místico' },
  { id: 'purple', hex: '#c084fc', label: 'Púrpura Sombrío' },
  { id: 'emerald', hex: '#34d399', label: 'Esmeralda Vital' },
  { id: 'amber', hex: '#fbbf24', label: 'Oro Solar' },
  { id: 'rose', hex: '#fb7185', label: 'Carmesí Ígneo' },
  { id: 'slate', hex: '#94a3b8', label: 'Acero Adamantino' },
];

// Sin conjuros ni listas por defecto por petición del usuario
export const DEFAULT_PUBLIC_LISTS: SpellList[] = [];
