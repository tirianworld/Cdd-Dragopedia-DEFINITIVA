import React, { useState } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  Star,
  BookMarked,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  FolderTree,
  Sparkles,
  BookOpen,
  Target,
  Minimize2,
  Maximize2,
  Scroll,
  Hourglass,
  Volume2,
  Hand,
  Gem,
  Layers,
  Orbit,
} from 'lucide-react';
import { DndClass, FilterState, MagicSchool, PrimordialMagic, SpellFunctionality, SpellTarget, SpellOrigin } from '../types';
import { ALL_CLASSES, ALL_SCHOOLS } from '../data/spells';
import { PRIMORDIAL_MAGICS, PRIMORDIAL_FIRST_GEN, PRIMORDIAL_SECOND_GEN, PrimordialMagicInfo } from '../data/primordialMagic';
import { DAMAGE_TYPES } from '../data/damageTypes';
import { SPELL_FUNCTIONALITIES } from '../data/spellFunctionalities';
import { SPELL_TARGET_OPTIONS } from '../data/spellTargets';
import { SPELL_ORIGIN_OPTIONS } from '../data/spellOrigins';
import { getSchoolTheme } from '../data/schools';
import { CLASS_OPTIONS } from '../data/classOptions';
import { MesaRedondaWatermark } from './MesaRedondaWatermark';

interface SpellFilterBarProps {
  filter: FilterState;
  onFilterChange: (newFilter: FilterState) => void;
  language: 'es' | 'en';
  hasActiveCharacter: boolean;
  activeCharacterName?: string;
  totalFiltered: number;
  onOpenPrimordialLore?: (magic: PrimordialMagicInfo) => void;
}

interface LevelFilterOption {
  level: number;
  labelEs: string;
  labelEn: string;
  badgeContent: 'icon' | 'number';
  textColor: string;
  bgColor: string;
  borderColor: string;
  accentGlow: string;
}

const LEVEL_FILTER_OPTIONS: LevelFilterOption[] = [
  {
    level: 0,
    labelEs: 'Trucos',
    labelEn: 'Cantrips',
    badgeContent: 'icon',
    textColor: 'text-teal-300',
    bgColor: 'bg-teal-950/40',
    borderColor: 'border-teal-500/40',
    accentGlow: 'rgba(45, 212, 191, 0.75)',
  },
  {
    level: 1,
    labelEs: 'Nivel 1',
    labelEn: 'Level 1',
    badgeContent: 'number',
    textColor: 'text-sky-300',
    bgColor: 'bg-sky-950/40',
    borderColor: 'border-sky-500/40',
    accentGlow: 'rgba(56, 189, 248, 0.75)',
  },
  {
    level: 2,
    labelEs: 'Nivel 2',
    labelEn: 'Level 2',
    badgeContent: 'number',
    textColor: 'text-emerald-300',
    bgColor: 'bg-emerald-950/40',
    borderColor: 'border-emerald-500/40',
    accentGlow: 'rgba(52, 211, 153, 0.75)',
  },
  {
    level: 3,
    labelEs: 'Nivel 3',
    labelEn: 'Level 3',
    badgeContent: 'number',
    textColor: 'text-amber-300',
    bgColor: 'bg-amber-950/40',
    borderColor: 'border-amber-500/40',
    accentGlow: 'rgba(251, 191, 36, 0.75)',
  },
  {
    level: 4,
    labelEs: 'Nivel 4',
    labelEn: 'Level 4',
    badgeContent: 'number',
    textColor: 'text-orange-300',
    bgColor: 'bg-orange-950/40',
    borderColor: 'border-orange-500/40',
    accentGlow: 'rgba(251, 146, 60, 0.75)',
  },
  {
    level: 5,
    labelEs: 'Nivel 5',
    labelEn: 'Level 5',
    badgeContent: 'number',
    textColor: 'text-rose-300',
    bgColor: 'bg-rose-950/40',
    borderColor: 'border-rose-500/40',
    accentGlow: 'rgba(244, 63, 94, 0.75)',
  },
  {
    level: 6,
    labelEs: 'Nivel 6',
    labelEn: 'Level 6',
    badgeContent: 'number',
    textColor: 'text-purple-300',
    bgColor: 'bg-purple-950/40',
    borderColor: 'border-purple-500/40',
    accentGlow: 'rgba(192, 132, 252, 0.75)',
  },
  {
    level: 7,
    labelEs: 'Nivel 7',
    labelEn: 'Level 7',
    badgeContent: 'number',
    textColor: 'text-indigo-300',
    bgColor: 'bg-indigo-950/40',
    borderColor: 'border-indigo-500/40',
    accentGlow: 'rgba(129, 140, 248, 0.75)',
  },
  {
    level: 8,
    labelEs: 'Nivel 8',
    labelEn: 'Level 8',
    badgeContent: 'number',
    textColor: 'text-fuchsia-300',
    bgColor: 'bg-fuchsia-950/40',
    borderColor: 'border-fuchsia-500/40',
    accentGlow: 'rgba(232, 121, 249, 0.75)',
  },
  {
    level: 9,
    labelEs: 'Nivel 9',
    labelEn: 'Level 9',
    badgeContent: 'number',
    textColor: 'text-yellow-200',
    bgColor: 'bg-yellow-950/40',
    borderColor: 'border-amber-400/60',
    accentGlow: 'rgba(250, 204, 21, 0.85)',
  },
];

export const SpellFilterBar: React.FC<SpellFilterBarProps> = ({
  filter,
  onFilterChange,
  language,
  hasActiveCharacter,
  activeCharacterName,
  totalFiltered,
  onOpenPrimordialLore,
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dragopedia_filterbar_minimized') === 'true';
    } catch {
      return false;
    }
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleMinimize = () => {
    setIsMinimized((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('dragopedia_filterbar_minimized', String(next));
      } catch {}
      return next;
    });
  };
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    primordial: false,
    functionality: false,
    schools: false,
    damage: false,
    targets: false,
    origins: false,
    classes: false,
  });

  const toggleSection = (sec: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sec]: !prev[sec],
    }));
  };

  const toggleLevel = (lvl: number) => {
    const exists = filter.levels.includes(lvl);
    const newLevels = exists
      ? filter.levels.filter((l) => l !== lvl)
      : [...filter.levels, lvl];
    onFilterChange({ ...filter, levels: newLevels });
  };

  const toggleClass = (cls: DndClass) => {
    const exists = filter.classes.includes(cls);
    const newClasses = exists
      ? filter.classes.filter((c) => c !== cls)
      : [...filter.classes, cls];
    onFilterChange({ ...filter, classes: newClasses });
  };

  const toggleSchool = (sch: MagicSchool) => {
    const exists = filter.schools.includes(sch);
    const newSchools = exists
      ? filter.schools.filter((s) => s !== sch)
      : [...filter.schools, sch];
    onFilterChange({ ...filter, schools: newSchools });
  };

  const togglePrimordial = (p: PrimordialMagic) => {
    const current = filter.primordialMagics || [];
    const exists = current.includes(p);
    const newPrimordials = exists
      ? current.filter((m) => m !== p)
      : [...current, p];
    onFilterChange({ ...filter, primordialMagics: newPrimordials });
  };

  const toggleFunctionality = (func: SpellFunctionality) => {
    const current = filter.functionalities || [];
    const exists = current.includes(func);
    const newFuncs = exists
      ? current.filter((f) => f !== func)
      : [...current, func];
    onFilterChange({ ...filter, functionalities: newFuncs });
  };

  const toggleTarget = (target: SpellTarget) => {
    const current = filter.targets || [];
    const exists = current.includes(target);
    const newTargets = exists
      ? current.filter((t) => t !== target)
      : [...current, target];
    onFilterChange({ ...filter, targets: newTargets });
  };

  const toggleOrigin = (origin: SpellOrigin) => {
    const current = filter.origins || [];
    const exists = current.includes(origin);
    const newOrigins = exists
      ? current.filter((o) => o !== origin)
      : [...current, origin];
    onFilterChange({ ...filter, origins: newOrigins });
  };

  const toggleDamageType = (dtName: string) => {
    const current = filter.damageTypes || (filter.damageType ? [filter.damageType] : []);
    const exists = current.includes(dtName);
    const newDamageTypes = exists
      ? current.filter((d) => d !== dtName)
      : [...current, dtName];
    onFilterChange({
      ...filter,
      damageTypes: newDamageTypes,
      damageType: newDamageTypes[0] || '',
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      ...filter,
      search: '',
      levels: [],
      classes: [],
      schools: [],
      primordialMagics: [],
      functionalities: [],
      targets: [],
      origins: [],
      castingTime: '',
      concentration: null,
      ritual: null,
      components: { verbal: false, somatic: false, material: false },
      damageTypes: [],
      damageType: '',
      onlyPrepared: false,
      onlyFavorites: false,
      onlySpellbook: false,
      onlyCustom: false,
      onlyVanilla: false,
    });
  };

  const isFiltered =
    filter.search.trim() !== '' ||
    filter.levels.length > 0 ||
    filter.classes.length > 0 ||
    filter.schools.length > 0 ||
    (filter.primordialMagics && filter.primordialMagics.length > 0) ||
    (filter.functionalities && filter.functionalities.length > 0) ||
    (filter.targets && filter.targets.length > 0) ||
    (filter.origins && filter.origins.length > 0) ||
    filter.concentration !== null ||
    filter.ritual !== null ||
    filter.components.verbal ||
    filter.components.somatic ||
    filter.components.material ||
    (filter.damageTypes && filter.damageTypes.length > 0) ||
    Boolean(filter.damageType) ||
    filter.onlyPrepared ||
    filter.onlyFavorites ||
    filter.onlySpellbook ||
    filter.onlyCustom ||
    filter.onlyVanilla;

  const activeFiltersCount =
    (filter.search.trim() ? 1 : 0) +
    filter.levels.length +
    filter.classes.length +
    filter.schools.length +
    (filter.primordialMagics?.length || 0) +
    (filter.functionalities?.length || 0) +
    (filter.targets?.length || 0) +
    (filter.origins?.length || 0) +
    (filter.damageTypes?.length || 0) +
    (filter.concentration !== null ? 1 : 0) +
    (filter.ritual !== null ? 1 : 0) +
    (filter.components.verbal ? 1 : 0) +
    (filter.components.somatic ? 1 : 0) +
    (filter.components.material ? 1 : 0) +
    (filter.onlyPrepared ? 1 : 0) +
    (filter.onlyFavorites ? 1 : 0) +
    (filter.onlySpellbook ? 1 : 0) +
    (filter.onlyCustom ? 1 : 0) +
    (filter.onlyVanilla ? 1 : 0);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[#1a2832] bg-[#10171d] shadow-xs transition-all duration-300 ${
        isMinimized ? 'p-3 space-y-2.5' : 'p-4 space-y-4'
      }`}
    >
      {/* Marca de agua de la Mesa Redonda: cuadrante ampliado anclado al borde derecho */}
      <div
        className="pointer-events-none select-none absolute z-0 hidden min-[540px]:block text-[#bafafd] transition-opacity duration-300"
        style={{
          opacity: 0.07,
          top: '-90px',
          right: '-275px',
        }}
        aria-hidden="true"
      >
        <MesaRedondaWatermark
          size={620}
          className="w-[620px] h-[620px]"
        />
      </div>

      {/* Buscador por Nombre & Primary Sort & View Switcher */}
      <div className="relative z-10 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a9ba8] group-focus-within:text-[#bafafd] transition-colors" />
          <input
            type="text"
            value={filter.search}
            onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
            placeholder={
              language === 'es'
                ? 'Buscador por nombre (ej: Bola de fuego, Escudo, Curar heridas, Rayo...)'
                : 'Search by name (e.g. Fireball, Shield, Cure Wounds, Ray of Frost...)'
            }
            className="w-full bg-[#0c1217] text-slate-100 placeholder-[#8a9ba8] text-sm rounded-xl pl-10 pr-9 py-2.5 border border-[#1a2832] focus:outline-none focus:border-[#bafafd]/70 transition-colors"
          />
          {filter.search && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filter, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a9ba8] hover:text-white cursor-pointer"
              title={language === 'es' ? 'Borrar búsqueda' : 'Clear search'}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Switcher, Sort & Filter toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Distribution Mode selector */}
          <div className="flex items-center bg-[#0c1217] p-1 rounded-xl border border-[#1a2832]">
            <span className="text-[10px] font-bold text-[#8a9ba8] px-2 uppercase font-heading hidden md:inline flex items-center gap-1">
              <FolderTree className="w-3 h-3 text-[#bafafd] inline" />
              {language === 'es' ? 'Distribuir:' : 'Distribute:'}
            </span>
            <button
              type="button"
              onClick={() => onFilterChange({ ...filter, groupBy: 'level' })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter.groupBy === 'level'
                  ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/50 shadow-xs'
                  : 'text-[#8a9ba8] hover:text-white'
              }`}
              title={language === 'es' ? 'Distribuir por Nivel (Trucos a Nivel 9)' : 'By Level'}
            >
              <div
                className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 border bg-teal-950/40 border-teal-500/50 bg-[#090e12] ring-1 ring-white/10 transition-all duration-300 relative"
                style={{
                  boxShadow: filter.groupBy === 'level'
                    ? '0 0 14px rgba(45, 212, 191, 0.8), 0 0 5px rgba(45, 212, 191, 0.95), inset 0 0 4px rgba(45, 212, 191, 0.5)'
                    : '0 0 7px rgba(45, 212, 191, 0.45), inset 0 0 2px rgba(255,255,255,0.2)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                <span
                  className="text-[9px] font-black font-mono text-teal-300 leading-none relative z-10"
                  style={{ filter: 'drop-shadow(0 0 2.5px currentColor) drop-shadow(0 0 5px currentColor)' }}
                >
                  #
                </span>
              </div>
              <span>{language === 'es' ? 'Nivel' : 'Level'}</span>
            </button>
            <button
              type="button"
              onClick={() => onFilterChange({ ...filter, groupBy: 'primordial' })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter.groupBy === 'primordial'
                  ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/50 shadow-xs'
                  : 'text-[#8a9ba8] hover:text-white'
              }`}
              title={language === 'es' ? 'Distribuir por Magias Primordiales' : 'By Primordial Magic'}
            >
              <div
                className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 border bg-cyan-950/40 border-cyan-500/50 bg-[#090e12] ring-1 ring-white/10 transition-all duration-300 relative"
                style={{
                  boxShadow: filter.groupBy === 'primordial'
                    ? '0 0 14px rgba(6, 182, 212, 0.8), 0 0 5px rgba(6, 182, 212, 0.95), inset 0 0 4px rgba(6, 182, 212, 0.5)'
                    : '0 0 7px rgba(6, 182, 212, 0.45), inset 0 0 2px rgba(255,255,255,0.2)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                <Sparkles
                  className="w-2.5 h-2.5 text-cyan-300 relative z-10"
                  style={{ filter: 'drop-shadow(0 0 2.5px currentColor) drop-shadow(0 0 5px currentColor)' }}
                />
              </div>
              <span>{language === 'es' ? 'Primordial' : 'Primordial'}</span>
            </button>
            <button
              type="button"
              onClick={() => onFilterChange({ ...filter, groupBy: 'school' })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter.groupBy === 'school'
                  ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/50 shadow-xs'
                  : 'text-[#8a9ba8] hover:text-white'
              }`}
              title={language === 'es' ? 'Distribuir por Escuela de Magia' : 'By School'}
            >
              <div
                className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 border bg-amber-950/40 border-amber-500/50 bg-[#090e12] ring-1 ring-white/10 transition-all duration-300 relative"
                style={{
                  boxShadow: filter.groupBy === 'school'
                    ? '0 0 14px rgba(245, 158, 11, 0.8), 0 0 5px rgba(245, 158, 11, 0.95), inset 0 0 4px rgba(245, 158, 11, 0.5)'
                    : '0 0 7px rgba(245, 158, 11, 0.45), inset 0 0 2px rgba(255,255,255,0.2)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                <BookOpen
                  className="w-2.5 h-2.5 text-amber-300 relative z-10"
                  style={{ filter: 'drop-shadow(0 0 2.5px currentColor) drop-shadow(0 0 5px currentColor)' }}
                />
              </div>
              <span>{language === 'es' ? 'Escuela' : 'School'}</span>
            </button>
            <button
              type="button"
              onClick={() => onFilterChange({ ...filter, groupBy: 'origin' })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter.groupBy === 'origin'
                  ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/50 shadow-xs'
                  : 'text-[#8a9ba8] hover:text-white'
              }`}
              title={language === 'es' ? 'Distribuir por Origen Cósmico' : 'By Cosmic Origin'}
            >
              <div
                className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 border bg-sky-950/40 border-sky-500/50 bg-[#090e12] ring-1 ring-white/10 transition-all duration-300 relative"
                style={{
                  boxShadow: filter.groupBy === 'origin'
                    ? '0 0 14px rgba(56, 189, 248, 0.8), 0 0 5px rgba(56, 189, 248, 0.95), inset 0 0 4px rgba(56, 189, 248, 0.5)'
                    : '0 0 7px rgba(56, 189, 248, 0.45), inset 0 0 2px rgba(255,255,255,0.2)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                <Orbit
                  className="w-2.5 h-2.5 text-sky-300 relative z-10"
                  style={{ filter: 'drop-shadow(0 0 2.5px currentColor) drop-shadow(0 0 5px currentColor)' }}
                />
              </div>
              <span>{language === 'es' ? 'Origen' : 'Origin'}</span>
            </button>
          </div>

          <select
            aria-label="Ordenar conjuros"
            value={filter.sortBy}
            onChange={(e) => onFilterChange({ ...filter, sortBy: e.target.value as FilterState['sortBy'] })}
            className="bg-[#0c1217] text-xs font-medium text-slate-200 border border-[#1a2832] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#bafafd]/70 cursor-pointer"
          >
            <option value="level-asc">{language === 'es' ? 'Nivel: Menor a Mayor' : 'Level: Low to High'}</option>
            <option value="level-desc">{language === 'es' ? 'Nivel: Mayor a Menor' : 'Level: High to Low'}</option>
            <option value="name-asc">{language === 'es' ? 'Nombre: A - Z' : 'Name: A - Z'}</option>
            <option value="name-desc">{language === 'es' ? 'Nombre: Z - A' : 'Name: Z - A'}</option>
            <option value="school">{language === 'es' ? 'Por Escuela' : 'By School'}</option>
          </select>

          <button
            type="button"
            onClick={() => {
              if (isMinimized) setIsMinimized(false);
              setShowAdvanced(!showAdvanced);
            }}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              showAdvanced
                ? 'bg-[#14282e] border-[#bafafd]/50 text-[#bafafd]'
                : 'bg-[#0c1217] border-[#1a2832] text-slate-300 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#bafafd]" />
            <span className="hidden sm:inline">{language === 'es' ? 'Filtros' : 'Filters'}</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Minimize / Expand Toggle Button */}
          <button
            type="button"
            onClick={toggleMinimize}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isMinimized
                ? 'bg-[#14282e] border-[#bafafd]/50 text-[#bafafd] hover:bg-[#18323a] shadow-xs'
                : 'bg-[#0c1217] border-[#1a2832] text-slate-300 hover:text-white hover:border-[#233a48]'
            }`}
            title={
              isMinimized
                ? (language === 'es' ? 'Expandir panel de filtros' : 'Expand filter panel')
                : (language === 'es' ? 'Minimizar panel de filtros' : 'Minimize filter panel')
            }
          >
            {isMinimized ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-[#bafafd]" />
                <span className="hidden sm:inline font-heading tracking-wide">
                  {language === 'es' ? 'Expandir' : 'Expand'}
                </span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                <span className="hidden sm:inline font-heading tracking-wide">
                  {language === 'es' ? 'Minimizar' : 'Minimize'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* If Minimized: Show sleek compact summary row */}
      {isMinimized && (
        <div className="relative z-10 flex items-center justify-between text-xs text-[#8a9ba8] pt-1 px-1 border-t border-[#17232b]/60">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-slate-300 font-medium">
              {language === 'es'
                ? `Mostrando ${totalFiltered} hechizos coincidentes`
                : `Showing ${totalFiltered} matching spells`}
            </span>
            {activeFiltersCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#14282e] text-[#bafafd] border border-[#bafafd]/40 shadow-xs">
                <span>{activeFiltersCount} {language === 'es' ? 'filtros activos' : 'active filters'}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {isFiltered && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>{language === 'es' ? 'Limpiar filtros' : 'Clear filters'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={toggleMinimize}
              className="text-[11px] text-[#bafafd] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
            >
              <span>{language === 'es' ? 'Expandir panel' : 'Expand panel'}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* If Not Minimized: Render full level chips, target chips, source filters, and footer */}
      {!isMinimized && (
        <>

      {/* Spell Levels Filter Chips (Dragopedia style pills with circular badges) */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a9ba8] font-heading flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#bafafd]" />
            <span>{language === 'es' ? 'Nivel de Hechizo' : 'Spell Level'}</span>
          </span>
          {filter.levels.length > 0 && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filter, levels: [] })}
              className="text-[11px] text-[#bafafd] hover:underline cursor-pointer"
            >
              {language === 'es' ? 'Ver todos los niveles' : 'All levels'}
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => onFilterChange({ ...filter, levels: [] })}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter.levels.length === 0
                ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/50 shadow-xs'
                : 'bg-[#0e1419] text-[#8a9ba8] border border-[#1b2832] hover:text-slate-200'
            }`}
          >
            {language === 'es' ? 'Todos' : 'All'}
          </button>
          {LEVEL_FILTER_OPTIONS.map((lvlOpt) => {
            const isSelected = filter.levels.includes(lvlOpt.level);
            return (
              <button
                key={lvlOpt.level}
                type="button"
                onClick={() => toggleLevel(lvlOpt.level)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#14282c] text-[#bafafd] shadow-xs border border-[#bafafd]/60'
                    : 'bg-[#0e1419] text-[#8a9ba8] border border-[#1b2832] hover:text-white hover:border-[#233a48]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 border ${lvlOpt.bgColor} ${lvlOpt.borderColor} bg-[#090e12] ring-1 ring-white/15 transition-all duration-300 relative`}
                  style={{
                    boxShadow: isSelected
                      ? `0 0 16px ${lvlOpt.accentGlow}, 0 0 6px ${lvlOpt.accentGlow}, inset 0 0 4px ${lvlOpt.accentGlow}`
                      : `0 0 8px ${lvlOpt.accentGlow.replace(/0\.\d+\)/, '0.45)')}, inset 0 0 2px rgba(255,255,255,0.2)`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                  {lvlOpt.badgeContent === 'icon' ? (
                    <Sparkles
                      className={`w-2.5 h-2.5 ${lvlOpt.textColor} relative z-10`}
                      style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px currentColor)' }}
                    />
                  ) : (
                    <span
                      className={`text-[10px] font-black font-mono leading-none ${lvlOpt.textColor} relative z-10`}
                      style={{ filter: 'drop-shadow(0 0 2.5px currentColor) drop-shadow(0 0 5px currentColor)' }}
                    >
                      {lvlOpt.level}
                    </span>
                  )}
                </div>
                <span>{language === 'es' ? lvlOpt.labelEs : lvlOpt.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Objetivos Filter Chips */}
      <div className="relative z-10 pt-2 border-t border-[#17232b]/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a9ba8] font-heading flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#bafafd]" style={{ filter: 'drop-shadow(0 0 3px rgba(186,250,253,0.8))' }} />
            <span>{language === 'es' ? 'Objetivos' : 'Targets'}</span>
          </span>
          {filter.targets && filter.targets.length > 0 && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filter, targets: [] })}
              className="text-[11px] text-[#bafafd] hover:underline cursor-pointer"
            >
              {language === 'es' ? 'Ver todos los objetivos' : 'All targets'}
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => onFilterChange({ ...filter, targets: [] })}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              !filter.targets || filter.targets.length === 0
                ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/50 shadow-xs'
                : 'bg-[#0e1419] text-[#8a9ba8] border border-[#1b2832] hover:text-slate-200'
            }`}
          >
            {language === 'es' ? 'Todos' : 'All'}
          </button>
          {SPELL_TARGET_OPTIONS.map((opt) => {
            const isSelected = (filter.targets || []).includes(opt.id);
            const TgtVector = opt.vectorIcon;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleTarget(opt.id)}
                title={language === 'es' ? opt.description : opt.descriptionEn}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#14282c] text-[#bafafd] shadow-xs border border-[#bafafd]/60'
                    : 'bg-[#0e1419] text-[#8a9ba8] border border-[#1b2832] hover:text-white hover:border-[#233a48]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 border ${opt.bgColor} ${opt.borderColor} bg-[#090e12] ring-1 ring-white/15 transition-all duration-300 relative`}
                  style={{
                    boxShadow: isSelected
                      ? `0 0 16px ${opt.accentGlow}, 0 0 6px ${opt.accentGlow}, inset 0 0 4px ${opt.accentGlow}`
                      : `0 0 8px ${opt.accentGlow.replace(/0\.\d+\)/, '0.45)')}, inset 0 0 2px rgba(255,255,255,0.2)`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                  <TgtVector
                    className={`w-2.5 h-2.5 ${opt.textColor} relative z-10`}
                    style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px currentColor)' }}
                  />
                </div>
                <span>{language === 'es' ? opt.name : opt.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Origen Filter Chips (Infernal, Celestial, Elemental, Feérica, Shadowfell, Onírico, Astral) */}
      <div className="relative z-10 pt-2 border-t border-[#17232b]/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a9ba8] font-heading flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#bafafd]" style={{ filter: 'drop-shadow(0 0 3px rgba(186,250,253,0.8))' }} />
            <span>{language === 'es' ? 'Origen' : 'Origin'}</span>
          </span>
          {filter.origins && filter.origins.length > 0 && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filter, origins: [] })}
              className="text-[11px] text-[#bafafd] hover:underline cursor-pointer"
            >
              {language === 'es' ? 'Ver todos los orígenes' : 'All origins'}
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => onFilterChange({ ...filter, origins: [] })}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              !filter.origins || filter.origins.length === 0
                ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/50 shadow-xs'
                : 'bg-[#0e1419] text-[#8a9ba8] border border-[#1b2832] hover:text-slate-200'
            }`}
          >
            {language === 'es' ? 'Todos' : 'All'}
          </button>
          {SPELL_ORIGIN_OPTIONS.map((opt) => {
            const isSelected = (filter.origins || []).includes(opt.name);
            const IconComp = opt.icon;
            return (
              <button
                key={opt.name}
                type="button"
                onClick={() => toggleOrigin(opt.name)}
                title={language === 'es' ? opt.description : opt.descriptionEn}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#14282c] text-[#bafafd] shadow-xs border border-[#bafafd]/60'
                    : 'bg-[#0e1419] text-[#8a9ba8] border border-[#1b2832] hover:text-white hover:border-[#233a48]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 border ${opt.bgColor} ${opt.borderColor} bg-[#090e12] ring-1 ring-white/15 transition-all duration-300 relative`}
                  style={{
                    boxShadow: isSelected
                      ? `0 0 16px ${opt.accentGlow}, 0 0 6px ${opt.accentGlow}, inset 0 0 4px ${opt.accentGlow}`
                      : `0 0 8px ${opt.accentGlow.replace(/0\.\d+\)/, '0.45)')}, inset 0 0 2px rgba(255,255,255,0.2)`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                  <IconComp
                    className={`w-2.5 h-2.5 ${opt.textColor} relative z-10`}
                    style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px currentColor)' }}
                  />
                </div>
                <span>{language === 'es' ? opt.name : opt.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Character & Source Quick State Filters */}
      <div className="relative z-10 flex flex-wrap items-center gap-2 pt-2 border-t border-[#17232b]">
        {hasActiveCharacter && (
          <>
            <button
              type="button"
              onClick={() => onFilterChange({ ...filter, onlyPrepared: !filter.onlyPrepared })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                filter.onlyPrepared
                  ? 'bg-[#14282c] text-[#bafafd] border-[#bafafd]/60 shadow-xs'
                  : 'bg-[#0e1419] text-[#8a9ba8] border-[#1b2832] hover:text-white hover:border-[#233a48]'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 border bg-emerald-950/40 border-emerald-500/50 bg-[#090e12] ring-1 ring-white/15 transition-all duration-300 relative"
                style={{
                  boxShadow: filter.onlyPrepared
                    ? '0 0 16px rgba(16, 185, 129, 0.85), 0 0 6px rgba(16, 185, 129, 0.95), inset 0 0 4px rgba(16, 185, 129, 0.5)'
                    : '0 0 8px rgba(16, 185, 129, 0.45), inset 0 0 2px rgba(255,255,255,0.2)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                <CheckCircle2
                  className="w-2.5 h-2.5 text-emerald-400 relative z-10"
                  style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px #10b981)' }}
                />
              </div>
              <span>{language === 'es' ? 'Solo Preparados' : 'Prepared Only'}</span>
            </button>

            <button
              type="button"
              onClick={() => onFilterChange({ ...filter, onlyFavorites: !filter.onlyFavorites })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                filter.onlyFavorites
                  ? 'bg-[#14282c] text-[#bafafd] border-[#bafafd]/60 shadow-xs'
                  : 'bg-[#0e1419] text-[#8a9ba8] border-[#1b2832] hover:text-white hover:border-[#233a48]'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 border bg-amber-950/40 border-amber-500/50 bg-[#090e12] ring-1 ring-white/15 transition-all duration-300 relative"
                style={{
                  boxShadow: filter.onlyFavorites
                    ? '0 0 16px rgba(245, 158, 11, 0.85), 0 0 6px rgba(245, 158, 11, 0.95), inset 0 0 4px rgba(245, 158, 11, 0.5)'
                    : '0 0 8px rgba(245, 158, 11, 0.45), inset 0 0 2px rgba(255,255,255,0.2)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                <Star
                  className={`w-2.5 h-2.5 relative z-10 ${filter.onlyFavorites ? 'text-amber-300 fill-amber-300' : 'text-amber-400'}`}
                  style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px #f59e0b)' }}
                />
              </div>
              <span>{language === 'es' ? 'Favoritos' : 'Favorites'}</span>
            </button>
          </>
        )}

        {/* Quick toggles for Caseros / Creados vs Vanilla / Oficiales */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => onFilterChange({ ...filter, onlyCustom: false, onlyVanilla: false })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              !filter.onlyCustom && !filter.onlyVanilla
                ? 'bg-[#14282c] text-[#bafafd] border border-[#bafafd]/50 shadow-xs'
                : 'bg-[#0e1419] text-[#8a9ba8] border border-[#1b2832] hover:text-white hover:border-[#233a48]'
            }`}
            title={language === 'es' ? 'Mostrar hechizos oficiales (vanilla) y caseros creados juntos' : 'Show vanilla and custom spells together'}
          >
            <div
              className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 border bg-slate-900 border-slate-700 bg-[#090e12] ring-1 ring-white/15 transition-all duration-300 relative"
              style={{
                boxShadow: !filter.onlyCustom && !filter.onlyVanilla
                  ? '0 0 16px rgba(186, 250, 253, 0.85), 0 0 6px rgba(186, 250, 253, 0.95), inset 0 0 4px rgba(186, 250, 253, 0.5)'
                  : '0 0 8px rgba(186, 250, 253, 0.45), inset 0 0 2px rgba(255,255,255,0.2)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
              <Layers
                className="w-2.5 h-2.5 text-[#bafafd] relative z-10"
                style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px #bafafd)' }}
              />
            </div>
            <span>{language === 'es' ? 'Vanilla + Creados' : 'Vanilla + Created'}</span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange({ ...filter, onlyCustom: !filter.onlyCustom, onlyVanilla: false })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter.onlyCustom
                ? 'bg-[#14282c] text-[#bafafd] border border-[#bafafd]/50 shadow-xs'
                : 'bg-[#0e1419] text-[#8a9ba8] border border-[#1b2832] hover:text-white hover:border-[#233a48]'
            }`}
            title={language === 'es' ? 'Mostrar únicamente hechizos caseros / creados' : 'Show only custom created spells'}
          >
            <div
              className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 border bg-cyan-950/40 border-cyan-500/50 bg-[#090e12] ring-1 ring-white/15 transition-all duration-300 relative"
              style={{
                boxShadow: filter.onlyCustom
                  ? '0 0 16px rgba(6, 182, 212, 0.85), 0 0 6px rgba(6, 182, 212, 0.95), inset 0 0 4px rgba(6, 182, 212, 0.5)'
                  : '0 0 8px rgba(6, 182, 212, 0.45), inset 0 0 2px rgba(255,255,255,0.2)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
              <Sparkles
                className="w-2.5 h-2.5 text-cyan-300 relative z-10"
                style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px #06b6d4)' }}
              />
            </div>
            <span>{language === 'es' ? 'Solo Creados' : 'Created Only'}</span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange({ ...filter, onlyVanilla: !filter.onlyVanilla, onlyCustom: false })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter.onlyVanilla
                ? 'bg-[#14282c] text-[#bafafd] border border-[#bafafd]/50 shadow-xs'
                : 'bg-[#0e1419] text-[#8a9ba8] border border-[#1b2832] hover:text-white hover:border-[#233a48]'
            }`}
            title={language === 'es' ? 'Mostrar únicamente hechizos oficiales / vanilla' : 'Show only vanilla spells'}
          >
            <div
              className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 border bg-blue-950/40 border-blue-500/50 bg-[#090e12] ring-1 ring-white/15 transition-all duration-300 relative"
              style={{
                boxShadow: filter.onlyVanilla
                  ? '0 0 16px rgba(59, 130, 246, 0.85), 0 0 6px rgba(59, 130, 246, 0.95), inset 0 0 4px rgba(59, 130, 246, 0.5)'
                  : '0 0 8px rgba(59, 130, 246, 0.45), inset 0 0 2px rgba(255,255,255,0.2)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
              <BookOpen
                className="w-2.5 h-2.5 text-blue-300 relative z-10"
                style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px #3b82f6)' }}
              />
            </div>
            <span>{language === 'es' ? 'Solo Vanilla' : 'Vanilla Only'}</span>
          </button>
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="ml-auto text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer py-1.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Restablecer filtros' : 'Reset filters'}</span>
          </button>
        )}
      </div>

      {/* Advanced Expandable Filter Panel */}
      {showAdvanced && (
        <div className="relative z-10 pt-3 border-t border-[#17232b] space-y-3">
          {/* Magias Primordiales */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <button
                type="button"
                onClick={() => toggleSection('primordial')}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#bafafd] font-heading cursor-pointer hover:underline"
              >
                <span>{language === 'es' ? 'Magias Primordiales' : 'Primordial Magics'}</span>
                {collapsedSections.primordial ? (
                  <ChevronRight className="w-3 h-3 text-[#bafafd]" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-[#bafafd]" />
                )}
              </button>
              {(filter.primordialMagics && filter.primordialMagics.length > 0) && (
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filter, primordialMagics: [] })}
                  className="text-[10px] text-[#bafafd] hover:underline cursor-pointer"
                >
                  {language === 'es' ? 'Limpiar' : 'Clear'}
                </button>
              )}
            </div>

            {!collapsedSections.primordial && (
              <div className="space-y-2">
                {/* 1ª Generación */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1 select-none">
                    {language === 'es' ? '1ª Gen:' : '1st Gen:'}
                  </span>
                  {PRIMORDIAL_FIRST_GEN.map((p) => {
                    const isSelected = (filter.primordialMagics || []).includes(p.name);
                    const IconComp = p.icon;
                    return (
                      <div key={p.name} className="inline-flex items-center rounded-full">
                        <button
                          type="button"
                          onClick={() => togglePrimordial(p.name)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#14282e] text-[#bafafd] border-[#bafafd]/60 shadow-xs'
                              : 'bg-[#0e1419] text-[#8a9ba8] border-[#1b2832] hover:text-white'
                          }`}
                        >
                          <div
                            className="w-4.5 h-4.5 rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-[#090e12] ring-1 ring-white/15 transition-all duration-300 relative"
                            style={{
                              boxShadow: isSelected
                                ? `0 0 16px ${p.accentGlow || 'rgba(186,250,253,0.8)'}, 0 0 6px ${p.accentGlow || 'rgba(186,250,253,0.95)'}, inset 0 0 4px ${p.accentGlow || 'rgba(186,250,253,0.5)'}`
                                : `0 0 8px ${p.accentGlow ? p.accentGlow.replace(/0\.\d+\)/, '0.45)') : 'rgba(255,255,255,0.35)'}, inset 0 0 2px rgba(255,255,255,0.2)`,
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                            <IconComp
                              className="w-full h-full object-contain rounded-full relative z-10"
                              style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 5px currentColor)' }}
                            />
                          </div>
                          <span>{language === 'es' ? p.name : p.nameEn}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* 2ª Generación */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#172127]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#bafafd] mr-1 select-none font-heading">
                    {language === 'es' ? '2ª Gen:' : '2nd Gen:'}
                  </span>
                  {PRIMORDIAL_SECOND_GEN.map((p) => {
                    const isSelected = (filter.primordialMagics || []).includes(p.name);
                    const IconComp = p.icon;
                    return (
                      <div key={p.name} className="inline-flex items-center rounded-full">
                        <button
                          type="button"
                          onClick={() => togglePrimordial(p.name)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#14282c] text-[#bafafd] border-[#bafafd]/60 shadow-xs'
                              : 'bg-[#0e1419] text-[#8a9ba8] border-[#1b2832] hover:text-white'
                          }`}
                        >
                          <div
                            className="w-4.5 h-4.5 rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-[#090e12] ring-1 ring-white/15 transition-all duration-300 relative"
                            style={{
                              boxShadow: isSelected
                                ? `0 0 16px ${p.accentGlow || 'rgba(186,250,253,0.8)'}, 0 0 6px ${p.accentGlow || 'rgba(186,250,253,0.95)'}, inset 0 0 4px ${p.accentGlow || 'rgba(186,250,253,0.5)'}`
                                : `0 0 8px ${p.accentGlow ? p.accentGlow.replace(/0\.\d+\)/, '0.45)') : 'rgba(255,255,255,0.35)'}, inset 0 0 2px rgba(255,255,255,0.2)`,
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                            <IconComp
                              className="w-full h-full object-contain rounded-full relative z-10"
                              style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 5px currentColor)' }}
                            />
                          </div>
                          <span>{language === 'es' ? p.name : p.nameEn}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Schools */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <button
                type="button"
                onClick={() => toggleSection('schools')}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8a9ba8] hover:text-[#bafafd] font-heading cursor-pointer transition-colors"
              >
                <span>{language === 'es' ? 'Escuelas de Magia' : 'Magic Schools'}</span>
                {collapsedSections.schools ? (
                  <ChevronRight className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
              {filter.schools.length > 0 && (
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filter, schools: [] })}
                  className="text-[10px] text-[#bafafd] hover:underline cursor-pointer"
                >
                  {language === 'es' ? 'Limpiar' : 'Clear'}
                </button>
              )}
            </div>

            {!collapsedSections.schools && (
              <div className="flex flex-wrap gap-1.5">
                {ALL_SCHOOLS.map((school) => {
                  const isSelected = filter.schools.includes(school);
                  const schoolTheme = getSchoolTheme(school);
                  const SchoolVector = schoolTheme.vectorIcon;
                  return (
                    <button
                      key={school}
                      type="button"
                      onClick={() => toggleSchool(school)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#14282e] text-[#bafafd] border-[#bafafd]/50 shadow-xs'
                          : 'bg-[#0e1419] text-[#8a9ba8] border-[#1b2832] hover:text-slate-200'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 border ${schoolTheme.bgColor} ${schoolTheme.borderColor} bg-[#090e12] ring-1 ring-white/15 transition-all duration-300 relative`}
                        style={{
                          boxShadow: isSelected
                            ? `0 0 16px ${schoolTheme.hexColor}, 0 0 6px ${schoolTheme.hexColor}, inset 0 0 4px ${schoolTheme.hexColor}`
                            : `0 0 8px ${schoolTheme.hexColor}66, inset 0 0 2px rgba(255,255,255,0.2)`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                        <SchoolVector
                          className={`w-2.5 h-2.5 ${schoolTheme.textColor} relative z-10`}
                          style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px currentColor)' }}
                        />
                      </div>
                      <span>{school}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Damage Types */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <button
                type="button"
                onClick={() => toggleSection('damage')}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8a9ba8] hover:text-[#bafafd] font-heading cursor-pointer transition-colors"
              >
                <span>{language === 'es' ? 'Tipos de Daño' : 'Damage Types'}</span>
                {collapsedSections.damage ? (
                  <ChevronRight className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
              {((filter.damageTypes && filter.damageTypes.length > 0) || Boolean(filter.damageType)) && (
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filter, damageTypes: [], damageType: '' })}
                  className="text-[10px] text-[#bafafd] hover:underline cursor-pointer"
                >
                  {language === 'es' ? 'Limpiar daño' : 'Clear damage'}
                </button>
              )}
            </div>

            {!collapsedSections.damage && (
              <div className="flex flex-wrap gap-1.5">
                {DAMAGE_TYPES.map((dt) => {
                  const currentSelected = (filter.damageTypes && filter.damageTypes.length > 0)
                    ? filter.damageTypes
                    : (filter.damageType ? [filter.damageType] : []);
                  const isSelected = currentSelected.includes(dt.name);
                  const DtVector = dt.vectorIcon;
                  return (
                    <button
                      key={dt.name}
                      type="button"
                      onClick={() => toggleDamageType(dt.name)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#14282e] text-[#bafafd] border-[#bafafd]/50 shadow-xs'
                          : 'bg-[#0e1419] text-[#8a9ba8] border-[#1b2832] hover:text-slate-200'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 border ${dt.bgColor} ${dt.borderColor} bg-[#090e12] ring-1 ring-white/15 transition-all duration-300 relative`}
                        style={{
                          boxShadow: isSelected
                            ? `0 0 16px ${dt.accentGlow}, 0 0 6px ${dt.accentGlow}, inset 0 0 4px ${dt.accentGlow}`
                            : `0 0 8px ${dt.accentGlow.replace(/0\.\d+\)/, '0.45)')}, inset 0 0 2px rgba(255,255,255,0.2)`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                        <DtVector
                          className={`w-2.5 h-2.5 ${dt.textColor} relative z-10`}
                          style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px currentColor)' }}
                        />
                      </div>
                      <span>{language === 'es' ? dt.name : dt.nameEn}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Funcionalidad */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <button
                type="button"
                onClick={() => toggleSection('functionality')}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8a9ba8] hover:text-[#bafafd] font-heading cursor-pointer transition-colors"
              >
                <span>{language === 'es' ? 'Funcionalidad' : 'Functionality'}</span>
                {collapsedSections.functionality ? (
                  <ChevronRight className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
              {(filter.functionalities && filter.functionalities.length > 0) && (
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filter, functionalities: [] })}
                  className="text-[10px] text-[#bafafd] hover:underline cursor-pointer"
                >
                  {language === 'es' ? 'Limpiar funcionalidad' : 'Clear functionality'}
                </button>
              )}
            </div>

            {!collapsedSections.functionality && (
              <div className="flex flex-wrap gap-1.5">
                {SPELL_FUNCTIONALITIES.map((fn) => {
                  const isSelected = (filter.functionalities || []).includes(fn.id);
                  const FnVector = fn.vectorIcon;
                  return (
                    <button
                      key={fn.id}
                      type="button"
                      onClick={() => toggleFunctionality(fn.id)}
                      title={fn.description}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#14282e] text-[#bafafd] border-[#bafafd]/50 shadow-xs'
                          : 'bg-[#0e1419] text-[#8a9ba8] border-[#1b2832] hover:text-slate-200'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 border ${fn.bgColor} ${fn.borderColor} bg-[#090e12] ring-1 ring-white/15 transition-all duration-300 relative`}
                        style={{
                          boxShadow: isSelected
                            ? `0 0 16px ${fn.accentGlow}, 0 0 6px ${fn.accentGlow}, inset 0 0 4px ${fn.accentGlow}`
                            : `0 0 8px ${fn.accentGlow.replace(/0\.\d+\)/, '0.45)')}, inset 0 0 2px rgba(255,255,255,0.2)`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                        <FnVector
                          className={`w-2.5 h-2.5 ${fn.textColor} relative z-10`}
                          style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px currentColor)' }}
                        />
                      </div>
                      <span>{language === 'es' ? fn.name : fn.nameEn}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Objetivos */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <button
                type="button"
                onClick={() => toggleSection('targets')}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8a9ba8] hover:text-[#bafafd] font-heading cursor-pointer transition-colors"
              >
                <span>{language === 'es' ? 'Objetivos' : 'Targets'}</span>
                {collapsedSections.targets ? (
                  <ChevronRight className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
              {(filter.targets && filter.targets.length > 0) && (
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filter, targets: [] })}
                  className="text-[10px] text-[#bafafd] hover:underline cursor-pointer"
                >
                  {language === 'es' ? 'Limpiar objetivos' : 'Clear targets'}
                </button>
              )}
            </div>

            {!collapsedSections.targets && (
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filter, targets: [] })}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                    !filter.targets || filter.targets.length === 0
                      ? 'bg-[#14282e] text-[#bafafd] border-[#bafafd]/50 shadow-xs'
                      : 'bg-[#0e1419] text-[#8a9ba8] border-[#1b2832] hover:text-slate-200'
                  }`}
                >
                  {language === 'es' ? 'Todos' : 'All'}
                </button>
                {SPELL_TARGET_OPTIONS.map((opt) => {
                  const isSelected = (filter.targets || []).includes(opt.id);
                  const TgtVector = opt.vectorIcon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleTarget(opt.id)}
                      title={language === 'es' ? opt.description : opt.descriptionEn}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#14282e] text-[#bafafd] border-[#bafafd]/50 shadow-xs'
                          : 'bg-[#0e1419] text-[#8a9ba8] border-[#1b2832] hover:text-slate-200'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 border ${opt.bgColor} ${opt.borderColor} bg-[#090e12] ring-1 ring-white/15 transition-all duration-300 relative`}
                        style={{
                          boxShadow: isSelected
                            ? `0 0 16px ${opt.accentGlow}, 0 0 6px ${opt.accentGlow}, inset 0 0 4px ${opt.accentGlow}`
                            : `0 0 8px ${opt.accentGlow.replace(/0\.\d+\)/, '0.45)')}, inset 0 0 2px rgba(255,255,255,0.2)`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                        <TgtVector
                          className={`w-2.5 h-2.5 ${opt.textColor} relative z-10`}
                          style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px currentColor)' }}
                        />
                      </div>
                      <span>{language === 'es' ? opt.name : opt.nameEn}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Origen (Infernal, Celestial, Elemental, Feérica, Shadowfell, Onírico, Astral) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <button
                type="button"
                onClick={() => toggleSection('origins')}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8a9ba8] hover:text-[#bafafd] font-heading cursor-pointer transition-colors"
              >
                <span>{language === 'es' ? 'Origen' : 'Origin'}</span>
                {collapsedSections.origins ? (
                  <ChevronRight className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
              {(filter.origins && filter.origins.length > 0) && (
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filter, origins: [] })}
                  className="text-[10px] text-[#bafafd] hover:underline cursor-pointer"
                >
                  {language === 'es' ? 'Limpiar origen' : 'Clear origin'}
                </button>
              )}
            </div>

            {!collapsedSections.origins && (
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filter, origins: [] })}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                    !filter.origins || filter.origins.length === 0
                      ? 'bg-[#14282e] text-[#bafafd] border-[#bafafd]/50 shadow-xs'
                      : 'bg-[#0e1419] text-[#8a9ba8] border-[#1b2832] hover:text-slate-200'
                  }`}
                >
                  {language === 'es' ? 'Todos' : 'All'}
                </button>
                {SPELL_ORIGIN_OPTIONS.map((opt) => {
                  const isSelected = (filter.origins || []).includes(opt.name);
                  const IconComp = opt.icon;
                  return (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => toggleOrigin(opt.name)}
                      title={language === 'es' ? opt.description : opt.descriptionEn}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#14282e] text-[#bafafd] border-[#bafafd]/50 shadow-xs'
                          : 'bg-[#0e1419] text-[#8a9ba8] border-[#1b2832] hover:text-slate-200'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 border ${opt.bgColor} ${opt.borderColor} bg-[#090e12] ring-1 ring-white/15 transition-all duration-300 relative`}
                        style={{
                          boxShadow: isSelected
                            ? `0 0 16px ${opt.accentGlow}, 0 0 6px ${opt.accentGlow}, inset 0 0 4px ${opt.accentGlow}`
                            : `0 0 8px ${opt.accentGlow.replace(/0\.\d+\)/, '0.45)')}, inset 0 0 2px rgba(255,255,255,0.2)`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                        <IconComp
                          className={`w-2.5 h-2.5 ${opt.textColor} relative z-10`}
                          style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px currentColor)' }}
                        />
                      </div>
                      <span className={isSelected ? 'text-[#bafafd] font-semibold' : ''}>
                        {language === 'es' ? opt.name : opt.nameEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Classes */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <button
                type="button"
                onClick={() => toggleSection('classes')}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8a9ba8] hover:text-[#bafafd] font-heading cursor-pointer transition-colors"
              >
                <span>{language === 'es' ? 'Clases de D&D' : 'D&D Classes'}</span>
                {collapsedSections.classes ? (
                  <ChevronRight className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
              {filter.classes.length > 0 && (
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filter, classes: [] })}
                  className="text-[10px] text-[#bafafd] hover:underline cursor-pointer"
                >
                  {language === 'es' ? 'Limpiar' : 'Clear'}
                </button>
              )}
            </div>

            {!collapsedSections.classes && (
              <div className="flex flex-wrap gap-1.5">
                {CLASS_OPTIONS.map((clsOpt) => {
                  const isSelected = filter.classes.includes(clsOpt.name);
                  const ClsIcon = clsOpt.icon;
                  return (
                    <button
                      key={clsOpt.name}
                      type="button"
                      onClick={() => toggleClass(clsOpt.name)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#14282e] text-[#bafafd] border-[#bafafd]/50 shadow-xs'
                          : 'bg-[#0e1419] text-[#8a9ba8] border-[#1b2832] hover:text-slate-200'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 border ${clsOpt.bgColor} ${clsOpt.borderColor} bg-[#090e12] ring-1 ring-white/15 transition-all duration-300 relative`}
                        style={{
                          boxShadow: isSelected
                            ? `0 0 16px ${clsOpt.accentGlow}, 0 0 6px ${clsOpt.accentGlow}, inset 0 0 4px ${clsOpt.accentGlow}`
                            : `0 0 8px ${clsOpt.accentGlow.replace(/0\.\d+\)/, '0.45)')}, inset 0 0 2px rgba(255,255,255,0.2)`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                        <ClsIcon
                          className={`w-2.5 h-2.5 ${clsOpt.textColor} relative z-10`}
                          style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px currentColor)' }}
                        />
                      </div>
                      <span>{language === 'es' ? clsOpt.name : clsOpt.nameEn}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Properties: Ritual, Concentration, Components with circular badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() =>
                onFilterChange({
                  ...filter,
                  ritual: filter.ritual === true ? null : true,
                })
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                filter.ritual === true
                  ? 'bg-[#14282c] text-[#bafafd] border-[#bafafd]/60 shadow-xs'
                  : 'bg-[#0e1419] text-[#8a9ba8] border-[#1b2832] hover:text-white hover:border-[#233a48]'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 border bg-violet-950/40 border-violet-500/50 bg-[#090e12] ring-1 ring-white/15 transition-all duration-300 relative"
                style={{
                  boxShadow: filter.ritual === true
                    ? '0 0 16px rgba(167, 139, 250, 0.85), 0 0 6px rgba(167, 139, 250, 0.95), inset 0 0 4px rgba(167, 139, 250, 0.5)'
                    : '0 0 8px rgba(167, 139, 250, 0.45), inset 0 0 2px rgba(255,255,255,0.2)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                <Scroll
                  className="w-2.5 h-2.5 text-violet-400 relative z-10"
                  style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px #a78bfa)' }}
                />
              </div>
              <span>Ritual</span>
            </button>

            <button
              type="button"
              onClick={() =>
                onFilterChange({
                  ...filter,
                  concentration: filter.concentration === true ? null : true,
                })
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                filter.concentration === true
                  ? 'bg-[#14282c] text-[#bafafd] border-[#bafafd]/60 shadow-xs'
                  : 'bg-[#0e1419] text-[#8a9ba8] border-[#1b2832] hover:text-white hover:border-[#233a48]'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 border bg-amber-950/40 border-amber-500/50 bg-[#090e12] ring-1 ring-white/15 transition-all duration-300 relative"
                style={{
                  boxShadow: filter.concentration === true
                    ? '0 0 16px rgba(251, 191, 36, 0.85), 0 0 6px rgba(251, 191, 36, 0.95), inset 0 0 4px rgba(251, 191, 36, 0.5)'
                    : '0 0 8px rgba(251, 191, 36, 0.45), inset 0 0 2px rgba(255,255,255,0.2)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                <Hourglass
                  className="w-2.5 h-2.5 text-amber-400 relative z-10"
                  style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px #fbbf24)' }}
                />
              </div>
              <span>{language === 'es' ? 'Concentración' : 'Concentration'}</span>
            </button>

            <button
              type="button"
              onClick={() =>
                onFilterChange({
                  ...filter,
                  components: {
                    ...filter.components,
                    verbal: !filter.components.verbal,
                  },
                })
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                filter.components.verbal
                  ? 'bg-[#14282c] text-[#bafafd] border-[#bafafd]/60 shadow-xs'
                  : 'bg-[#0e1419] text-[#8a9ba8] border-[#1b2832] hover:text-white hover:border-[#233a48]'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 border bg-sky-950/40 border-sky-500/50 bg-[#090e12] ring-1 ring-white/15 transition-all duration-300 relative"
                style={{
                  boxShadow: filter.components.verbal
                    ? '0 0 16px rgba(56, 189, 248, 0.85), 0 0 6px rgba(56, 189, 248, 0.95), inset 0 0 4px rgba(56, 189, 248, 0.5)'
                    : '0 0 8px rgba(56, 189, 248, 0.45), inset 0 0 2px rgba(255,255,255,0.2)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                <Volume2
                  className="w-2.5 h-2.5 text-sky-400 relative z-10"
                  style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px #38bdf8)' }}
                />
              </div>
              <span>V (Verbal)</span>
            </button>

            <button
              type="button"
              onClick={() =>
                onFilterChange({
                  ...filter,
                  components: {
                    ...filter.components,
                    somatic: !filter.components.somatic,
                  },
                })
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                filter.components.somatic
                  ? 'bg-[#14282c] text-[#bafafd] border-[#bafafd]/60 shadow-xs'
                  : 'bg-[#0e1419] text-[#8a9ba8] border-[#1b2832] hover:text-white hover:border-[#233a48]'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 border bg-emerald-950/40 border-emerald-500/50 bg-[#090e12] ring-1 ring-white/15 transition-all duration-300 relative"
                style={{
                  boxShadow: filter.components.somatic
                    ? '0 0 16px rgba(52, 211, 153, 0.85), 0 0 6px rgba(52, 211, 153, 0.95), inset 0 0 4px rgba(52, 211, 153, 0.5)'
                    : '0 0 8px rgba(52, 211, 153, 0.45), inset 0 0 2px rgba(255,255,255,0.2)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                <Hand
                  className="w-2.5 h-2.5 text-emerald-400 relative z-10"
                  style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px #34d399)' }}
                />
              </div>
              <span>S (Somático)</span>
            </button>

            <button
              type="button"
              onClick={() =>
                onFilterChange({
                  ...filter,
                  components: {
                    ...filter.components,
                    material: !filter.components.material,
                  },
                })
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                filter.components.material
                  ? 'bg-[#14282c] text-[#bafafd] border-[#bafafd]/60 shadow-xs'
                  : 'bg-[#0e1419] text-[#8a9ba8] border-[#1b2832] hover:text-white hover:border-[#233a48]'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 border bg-rose-950/40 border-rose-500/50 bg-[#090e12] ring-1 ring-white/15 transition-all duration-300 relative"
                style={{
                  boxShadow: filter.components.material
                    ? '0 0 16px rgba(251, 113, 133, 0.85), 0 0 6px rgba(251, 113, 133, 0.95), inset 0 0 4px rgba(251, 113, 133, 0.5)'
                    : '0 0 8px rgba(251, 113, 133, 0.45), inset 0 0 2px rgba(255,255,255,0.2)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                <Gem
                  className="w-2.5 h-2.5 text-rose-400 relative z-10"
                  style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px #fb7185)' }}
                />
              </div>
              <span>M (Material)</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter Summary Footer */}
      <div className="relative z-10 flex items-center justify-between text-[11px] text-[#8a9ba8] pt-1">
        <span>
          {language === 'es'
            ? `Mostrando ${totalFiltered} hechizos coincidentes`
            : `Showing ${totalFiltered} matching spells`}
        </span>
        {isFiltered && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-[#bafafd] hover:underline cursor-pointer"
          >
            {language === 'es' ? 'Limpiar todos los filtros' : 'Clear all filters'}
          </button>
        )}
      </div>
        </>
      )}
    </div>
  );
};
