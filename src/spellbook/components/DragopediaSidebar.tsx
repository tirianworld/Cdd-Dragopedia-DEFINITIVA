import React, { useState } from 'react';
import {
  Compass,
  PlusCircle,
  X,
  ChevronRight,
  ChevronDown,
  FolderTree,
  Flame,
  Sparkles,
  Search,
  ScrollText,
  Globe,
  BookOpen,
  Target,
} from 'lucide-react';
import { Character, DndClass, MagicSchool, ViewTab, PrimordialMagic, GroupByDistribution, SpellFunctionality, SpellTarget, SpellOrigin } from '../types';
import { ALL_CLASSES, ALL_SCHOOLS } from '../data/spells';
import { PRIMORDIAL_MAGICS, PRIMORDIAL_FIRST_GEN, PRIMORDIAL_SECOND_GEN, PrimordialMagicInfo } from '../data/primordialMagic';
import { getSchoolTheme } from '../data/schools';
import { DAMAGE_TYPES } from '../data/damageTypes';
import { SPELL_FUNCTIONALITIES } from '../data/spellFunctionalities';
import { SPELL_TARGET_OPTIONS } from '../data/spellTargets';
import { SPELL_ORIGIN_OPTIONS } from '../data/spellOrigins';
import { CLASS_OPTIONS } from '../data/classOptions';

interface DragopediaSidebarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  selectedSchool?: MagicSchool | null;
  selectedSchools?: MagicSchool[];
  onToggleSchool: (school: MagicSchool) => void;
  onClearSchools?: () => void;
  selectedFunctionalities?: SpellFunctionality[];
  onToggleFunctionality?: (func: SpellFunctionality) => void;
  onClearFunctionalities?: () => void;
  selectedTargets?: SpellTarget[];
  onToggleTarget?: (target: SpellTarget) => void;
  onClearTargets?: () => void;
  selectedOrigins?: SpellOrigin[];
  onToggleOrigin?: (origin: SpellOrigin) => void;
  onClearOrigins?: () => void;
  selectedDamageType?: string | null;
  selectedDamageTypes?: string[];
  onToggleDamageType?: (damageType: string) => void;
  onClearDamageTypes?: () => void;
  selectedClass?: DndClass | null;
  selectedClasses?: DndClass[];
  onToggleClass: (cls: DndClass) => void;
  onClearClasses?: () => void;
  selectedPrimordial?: PrimordialMagic | null;
  selectedPrimordials?: PrimordialMagic[];
  onTogglePrimordial: (magic: PrimordialMagic) => void;
  onClearPrimordials?: () => void;
  onOpenPrimordialLore?: (magic: PrimordialMagicInfo) => void;
  groupBy: GroupByDistribution;
  onGroupByChange: (groupBy: GroupByDistribution) => void;
  activeCharacter: Character | null;
  totalSpellsCount: number;
  language: 'es' | 'en';
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenEmbedModal?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  isCustomSpellUnlocked?: boolean;
  listsCount?: number;
}

export const DragopediaSidebar: React.FC<DragopediaSidebarProps> = ({
  currentTab,
  onSelectTab,
  selectedSchool,
  selectedSchools,
  onToggleSchool,
  onClearSchools,
  selectedFunctionalities,
  onToggleFunctionality,
  onClearFunctionalities,
  selectedTargets,
  onToggleTarget,
  onClearTargets,
  selectedOrigins,
  onToggleOrigin,
  onClearOrigins,
  selectedDamageType,
  selectedDamageTypes,
  onToggleDamageType,
  onClearDamageTypes,
  selectedClass,
  selectedClasses,
  onToggleClass,
  onClearClasses,
  selectedPrimordial,
  selectedPrimordials,
  onTogglePrimordial,
  onClearPrimordials,
  onOpenPrimordialLore,
  groupBy,
  onGroupByChange,
  activeCharacter,
  totalSpellsCount,
  language,
  isOpenMobile,
  onCloseMobile,
  onOpenEmbedModal,
  searchQuery,
  onSearchChange,
  isCustomSpellUnlocked,
  listsCount = 0,
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    distribution: false,
    primordial: false,
    schools: false,
    functionality: false,
    targets: false,
    origins: false,
    damage: false,
    classes: false,
  });

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      {/* Backdrop on mobile */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 sm:w-80 lg:w-80 xl:w-[340px] bg-[#0c1013] border-r border-[#172127] flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header / App Brand */}
        <div className="p-4 border-b border-[#172127] flex items-center justify-between">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => {
              onSelectTab('catalog');
              onCloseMobile();
            }}
          >
            <div className="w-8 h-8 rounded-lg bg-[#14282c] border border-[#bafafd]/40 flex items-center justify-center text-[#bafafd] shadow-xs group-hover:border-[#bafafd] transition-colors">
              <Flame className="w-4 h-4 fill-[#bafafd]/20 text-[#bafafd]" />
            </div>
            <div>
              <div className="font-heading text-sm font-bold tracking-widest text-slate-100 group-hover:text-[#bafafd] transition-colors">
                DRACOPEDIA
              </div>
              <div className="text-[10px] text-[#8a9ba8] font-mono tracking-wide">
                CALDO DE DRAGÓN
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#14232c]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-5 sidebar-scroll">
          {/* Primary Quick Actions (Dragopedia Style) */}
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => {
                onSelectTab('catalog');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'catalog'
                  ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/35 shadow-xs'
                  : 'text-[#8a9ba8] hover:text-slate-100 hover:bg-[#10171d] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Compass className={`w-4 h-4 ${currentTab === 'catalog' ? 'text-[#bafafd]' : 'text-[#8a9ba8]'}`} />
                <span>{language === 'es' ? 'Inicio / Catálogo' : 'Home / Catalog'}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#14282c] text-[#bafafd] border border-[#bafafd]/20 font-mono">
                {totalSpellsCount}
              </span>
            </button>

            {/* Listas de Hechizos Tab */}
            <button
              type="button"
              onClick={() => {
                onSelectTab('spell-lists');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'spell-lists'
                  ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/35 shadow-xs'
                  : 'text-[#8a9ba8] hover:text-slate-100 hover:bg-[#10171d] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ScrollText className={`w-4 h-4 ${currentTab === 'spell-lists' ? 'text-[#bafafd]' : 'text-[#8a9ba8]'}`} />
                <span>{language === 'es' ? 'Listas de Hechizos' : 'Spell Lists'}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#14282c] text-[#bafafd] border border-[#bafafd]/20 font-mono">
                {listsCount}
              </span>
            </button>

            {/* Galería Pública Tab */}
            <button
              type="button"
              onClick={() => {
                onSelectTab('public-gallery');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'public-gallery'
                  ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/35 shadow-xs'
                  : 'text-[#8a9ba8] hover:text-slate-100 hover:bg-[#10171d] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Globe className={`w-4 h-4 ${currentTab === 'public-gallery' ? 'text-[#bafafd]' : 'text-[#8a9ba8]'}`} />
                <span>{language === 'es' ? 'Galería Pública' : 'Public Gallery'}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#14282c] text-[#bafafd] border border-[#bafafd]/20 font-mono">
                {language === 'es' ? 'Todos' : 'All'}
              </span>
            </button>

            {isCustomSpellUnlocked && (
              <button
                type="button"
                onClick={() => {
                  onSelectTab('custom');
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentTab === 'custom'
                    ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/35 shadow-xs'
                    : 'text-[#8a9ba8] hover:text-slate-100 hover:bg-[#10171d] border border-transparent'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-[#bafafd]" />
                <span>{language === 'es' ? 'Nuevo Hechizo Casero' : 'New Custom Spell'}</span>
              </button>
            )}
          </div>

          {/* Buscador por Nombre en Sidebar */}
          <div className="pt-2 border-t border-[#172127]">
            <div className="flex items-center justify-between px-1 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a9ba8] font-heading flex items-center gap-1.5">
                <Search className="w-3 h-3 text-[#bafafd]" />
                <span>{language === 'es' ? 'BUSCADOR POR NOMBRE' : 'SEARCH BY NAME'}</span>
              </span>
              {searchQuery && onSearchChange && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="text-[10px] text-[#bafafd] hover:underline cursor-pointer"
                >
                  {language === 'es' ? 'Limpiar' : 'Clear'}
                </button>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8a9ba8]" />
              <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => {
                  if (onSearchChange) onSearchChange(e.target.value);
                  if (currentTab !== 'catalog') onSelectTab('catalog');
                }}
                placeholder={
                  language === 'es'
                    ? 'Buscar hechizo por nombre...'
                    : 'Search spell by name...'
                }
                className="w-full bg-[#10171d] text-slate-100 placeholder-[#8a9ba8] text-xs rounded-xl pl-8 pr-7 py-2 border border-[#1a2832] focus:outline-none focus:border-[#bafafd]/70 transition-colors"
              />
              {searchQuery && onSearchChange && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8a9ba8] hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* View Mode & Grouping Mode */}
          <div className="pt-2 border-t border-[#172127]">
            <button
              type="button"
              onClick={() => toggleSection('distribution')}
              className="w-full flex items-center justify-between px-1 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8a9ba8] hover:text-[#bafafd] font-heading cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-1">
                <FolderTree className="w-3 h-3 text-[#bafafd]" />
                <span>{language === 'es' ? 'DISTRIBUCIÓN Y VISTA' : 'DISTRIBUTION & VIEW'}</span>
              </div>
              {collapsedSections.distribution ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {!collapsedSections.distribution && (
              <div className="space-y-3 mt-2">
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-[#8a9ba8]/80 mb-1 px-1">
                    {language === 'es' ? 'Agrupar por' : 'Group by'}
                  </div>
                  <div className="grid grid-cols-4 gap-1 bg-[#0e1419] p-1 rounded-xl border border-[#1b2832]">
                    <button
                      type="button"
                      onClick={() => onGroupByChange('level')}
                      className={`py-1 px-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        groupBy === 'level'
                          ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/50 shadow-[0_0_12px_rgba(186,250,253,0.35)]'
                          : 'text-[#8a9ba8] hover:text-slate-200'
                      }`}
                      title="Distribuir por Niveles"
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full flex items-center justify-center border border-teal-500/40 bg-[#090e12] ring-1 ring-white/15 shrink-0 relative overflow-hidden"
                        style={{
                          boxShadow: groupBy === 'level'
                            ? '0 0 10px rgba(45,212,191,0.8), inset 0 0 3px rgba(45,212,191,0.5)'
                            : '0 0 4px rgba(45,212,191,0.35)',
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                        <span className="text-[8px] font-black font-mono text-teal-300 leading-none relative z-10">#</span>
                      </div>
                      <span>{language === 'es' ? 'Nivel' : 'Level'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onGroupByChange('primordial')}
                      className={`py-1 px-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        groupBy === 'primordial'
                          ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/50 shadow-[0_0_12px_rgba(186,250,253,0.35)]'
                          : 'text-[#8a9ba8] hover:text-slate-200'
                      }`}
                      title="Distribuir por Magias Primordiales"
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full flex items-center justify-center border border-amber-500/40 bg-[#090e12] ring-1 ring-white/15 shrink-0 relative overflow-hidden"
                        style={{
                          boxShadow: groupBy === 'primordial'
                            ? '0 0 10px rgba(251,191,36,0.8), inset 0 0 3px rgba(251,191,36,0.5)'
                            : '0 0 4px rgba(251,191,36,0.35)',
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                        <Flame className="w-2.5 h-2.5 text-amber-300 relative z-10" style={{ filter: 'drop-shadow(0 0 3px currentColor)' }} />
                      </div>
                      <span>{language === 'es' ? 'Prim.' : 'Prim.'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onGroupByChange('school')}
                      className={`py-1 px-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        groupBy === 'school'
                          ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/50 shadow-[0_0_12px_rgba(186,250,253,0.35)]'
                          : 'text-[#8a9ba8] hover:text-slate-200'
                      }`}
                      title="Distribuir por Escuela de Magia"
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full flex items-center justify-center border border-indigo-500/40 bg-[#090e12] ring-1 ring-white/15 shrink-0 relative overflow-hidden"
                        style={{
                          boxShadow: groupBy === 'school'
                            ? '0 0 10px rgba(129,140,248,0.8), inset 0 0 3px rgba(129,140,248,0.5)'
                            : '0 0 4px rgba(129,140,248,0.35)',
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                        <ScrollText className="w-2.5 h-2.5 text-indigo-300 relative z-10" style={{ filter: 'drop-shadow(0 0 3px currentColor)' }} />
                      </div>
                      <span>{language === 'es' ? 'Esc.' : 'School'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onGroupByChange('origin')}
                      className={`py-1 px-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        groupBy === 'origin'
                          ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/50 shadow-[0_0_12px_rgba(186,250,253,0.35)]'
                          : 'text-[#8a9ba8] hover:text-slate-200'
                      }`}
                      title="Distribuir por Origen Cósmico"
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full flex items-center justify-center border border-fuchsia-500/40 bg-[#090e12] ring-1 ring-white/15 shrink-0 relative overflow-hidden"
                        style={{
                          boxShadow: groupBy === 'origin'
                            ? '0 0 10px rgba(232,121,249,0.8), inset 0 0 3px rgba(232,121,249,0.5)'
                            : '0 0 4px rgba(232,121,249,0.35)',
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                        <Sparkles className="w-2.5 h-2.5 text-fuchsia-300 relative z-10" style={{ filter: 'drop-shadow(0 0 3px currentColor)' }} />
                      </div>
                      <span>{language === 'es' ? 'Origen' : 'Origin'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* MAGIAS PRIMORDIALES */}
          <div className="pt-2 border-t border-[#172127]">
            <div className="flex items-center justify-between px-1 mb-2">
              <button
                type="button"
                onClick={() => toggleSection('primordial')}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#bafafd] font-heading cursor-pointer hover:underline"
              >
                <span>{language === 'es' ? 'MAGIAS PRIMORDIALES' : 'PRIMORDIAL MAGICS'}</span>
                {collapsedSections.primordial ? (
                  <ChevronRight className="w-3.5 h-3.5 text-[#bafafd]" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-[#bafafd]" />
                )}
              </button>
              {((selectedPrimordials && selectedPrimordials.length > 0) || selectedPrimordial) && (
                <button
                  type="button"
                  onClick={() => {
                    if (onClearPrimordials) {
                      onClearPrimordials();
                    } else if (selectedPrimordial) {
                      onTogglePrimordial(selectedPrimordial);
                    }
                  }}
                  className="text-[10px] text-[#bafafd] hover:underline cursor-pointer"
                >
                  Limpiar
                </button>
              )}
            </div>

            {!collapsedSections.primordial && (
              <div className="space-y-3">
                {/* 1ª Generación */}
                <div>
                  <div className="px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#bafafd] font-heading">
                    <span>{language === 'es' ? '1ª GENERACIÓN' : '1ST GENERATION'}</span>
                    <span className="text-[9px] text-[#8a9ba8] font-mono">{PRIMORDIAL_FIRST_GEN.length}</span>
                  </div>
                  <div className="space-y-1 mt-0.5">
                    {PRIMORDIAL_FIRST_GEN.map((p) => {
                      const activePrimordials = selectedPrimordials || (selectedPrimordial ? [selectedPrimordial] : []);
                      const isSelected = activePrimordials.includes(p.name);
                      const IconComp = p.icon;

                      return (
                        <div
                          key={p.name}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors group ${
                            isSelected
                              ? 'bg-[#14282c] text-slate-100 border border-[#bafafd]/40 shadow-xs'
                              : 'text-[#8a9ba8] hover:text-slate-200 hover:bg-[#10171d]'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              onTogglePrimordial(p.name);
                              if (currentTab !== 'catalog') onSelectTab('catalog');
                              onCloseMobile();
                            }}
                            className="flex items-center gap-2 flex-1 text-left cursor-pointer min-w-0"
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center border p-0.5 overflow-hidden shrink-0 bg-[#090e12] ring-1 transition-all duration-300 relative ${
                                isSelected
                                  ? 'ring-[#bafafd]/80 border-[#bafafd]'
                                  : 'ring-white/15'
                              }`}
                              style={{
                                borderColor: isSelected ? undefined : p.color,
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
                            <span className={`truncate ${isSelected ? 'font-semibold text-[#bafafd]' : ''}`}>
                              {language === 'es' ? p.name : p.nameEn}
                            </span>
                          </button>

                          <div className="flex items-center gap-1 shrink-0 ml-1">
                            {onOpenPrimordialLore && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenPrimordialLore(p);
                                }}
                                className="p-1 rounded text-slate-500 hover:text-[#bafafd] hover:bg-[#14232c] transition-colors cursor-pointer"
                                title={language === 'es' ? `Ver Lore de ${p.name}` : `View ${p.nameEn} Lore`}
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {isSelected && <ChevronRight className="w-3.5 h-3.5 text-[#bafafd]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2ª Generación */}
                <div className="pt-2 border-t border-[#172127]">
                  <div className="px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#bafafd] font-heading">
                    <span>{language === 'es' ? '2ª GENERACIÓN' : '2ND GENERATION'}</span>
                    <span className="text-[9px] text-[#8a9ba8] font-mono">{PRIMORDIAL_SECOND_GEN.length}</span>
                  </div>
                  <div className="space-y-1 mt-0.5">
                    {PRIMORDIAL_SECOND_GEN.map((p) => {
                      const activePrimordials = selectedPrimordials || (selectedPrimordial ? [selectedPrimordial] : []);
                      const isSelected = activePrimordials.includes(p.name);
                      const IconComp = p.icon;

                      return (
                        <div
                          key={p.name}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors group ${
                            isSelected
                              ? 'bg-[#14282c] text-slate-100 border border-[#bafafd]/40 shadow-xs'
                              : 'text-[#8a9ba8] hover:text-slate-200 hover:bg-[#10171d]'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              onTogglePrimordial(p.name);
                              if (currentTab !== 'catalog') onSelectTab('catalog');
                              onCloseMobile();
                            }}
                            className="flex items-center gap-2 flex-1 text-left cursor-pointer min-w-0"
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center border p-0.5 overflow-hidden shrink-0 bg-[#090e12] ring-1 transition-all duration-300 relative ${
                                isSelected
                                  ? 'ring-[#bafafd]/80 border-[#bafafd]'
                                  : 'ring-white/15'
                              }`}
                              style={{
                                borderColor: isSelected ? undefined : p.color,
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
                            <span className={`truncate ${isSelected ? 'font-semibold text-[#bafafd]' : ''}`}>
                              {language === 'es' ? p.name : p.nameEn}
                            </span>
                          </button>

                          <div className="flex items-center gap-1 shrink-0 ml-1">
                            {onOpenPrimordialLore && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenPrimordialLore(p);
                                }}
                                className="p-1 rounded text-slate-500 hover:text-[#bafafd] hover:bg-[#14232c] transition-colors cursor-pointer"
                                title={language === 'es' ? `Ver Lore de ${p.name}` : `View ${p.nameEn} Lore`}
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {isSelected && <ChevronRight className="w-3.5 h-3.5 text-[#bafafd]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lore / Magic Schools Section */}
          <div className="pt-2 border-t border-[#172127]">
            <div className="flex items-center justify-between px-1 mb-2">
              <button
                type="button"
                onClick={() => toggleSection('schools')}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#8a9ba8] hover:text-[#bafafd] font-heading cursor-pointer transition-colors"
              >
                <span>{language === 'es' ? 'ESCUELAS DE MAGIA' : 'MAGIC SCHOOLS'}</span>
                {collapsedSections.schools ? (
                  <ChevronRight className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
              {((selectedSchools && selectedSchools.length > 0) || selectedSchool) && (
                <button
                  type="button"
                  onClick={() => {
                    if (onClearSchools) {
                      onClearSchools();
                    } else if (selectedSchool) {
                      onToggleSchool(selectedSchool);
                    }
                  }}
                  className="text-[10px] text-[#bafafd] hover:underline cursor-pointer"
                >
                  Limpiar
                </button>
              )}
            </div>

            {!collapsedSections.schools && (
              <div className="space-y-1">
                {ALL_SCHOOLS.map((school) => {
                  const activeSchools = selectedSchools || (selectedSchool ? [selectedSchool] : []);
                  const isSelected = activeSchools.includes(school);
                  const schoolTheme = getSchoolTheme(school);
                  const IconComponent = schoolTheme.icon;

                  return (
                    <button
                      key={school}
                      type="button"
                      onClick={() => {
                        onToggleSchool(school);
                        if (currentTab !== 'catalog') onSelectTab('catalog');
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#14282e] text-slate-100 border border-[#bafafd]/40'
                          : 'text-[#8a9ba8] hover:text-slate-200 hover:bg-[#10171d]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5.5 h-5.5 rounded-full flex items-center justify-center border ${schoolTheme.bgColor} ${schoolTheme.borderColor} p-0.5 overflow-hidden shadow-xs shrink-0 bg-[#090e12] ring-1 ring-white/15 relative`}
                          style={{
                            boxShadow: isSelected
                              ? `0 0 16px ${schoolTheme.hexColor}, 0 0 6px ${schoolTheme.hexColor}, inset 0 0 4px ${schoolTheme.hexColor}`
                              : `0 0 8px ${schoolTheme.hexColor}66, inset 0 0 2px rgba(255,255,255,0.2)`,
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                          {(() => {
                            const VectorComp = schoolTheme.vectorIcon;
                            return (
                              <VectorComp
                                className={`w-3.5 h-3.5 ${schoolTheme.textColor} relative z-10`}
                                style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px currentColor)' }}
                              />
                            );
                          })()}
                        </div>
                        <span className={isSelected ? 'font-semibold text-[#bafafd]' : ''}>
                          {school}
                          {school === 'Reflexión' && (
                            <span className="ml-1.5 text-[9px] px-1 rounded bg-[#14282c] text-[#bafafd] border border-[#bafafd]/30">
                              NUEVA
                            </span>
                          )}
                        </span>
                      </div>
                      {isSelected && <ChevronRight className="w-3.5 h-3.5 text-[#bafafd]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Damage Types Section */}
          <div className="pt-2 border-t border-[#172127]">
            <div className="flex items-center justify-between px-1 mb-2">
              <button
                type="button"
                onClick={() => toggleSection('damage')}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#8a9ba8] hover:text-[#bafafd] font-heading cursor-pointer transition-colors"
              >
                <span>{language === 'es' ? 'TIPO DE DAÑO' : 'DAMAGE TYPE'}</span>
                {collapsedSections.damage ? (
                  <ChevronRight className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
              {(((selectedDamageTypes && selectedDamageTypes.length > 0) || Boolean(selectedDamageType)) && onToggleDamageType) && (
                <button
                  type="button"
                  onClick={() => {
                    if (onClearDamageTypes) {
                      onClearDamageTypes();
                    } else if (selectedDamageType) {
                      onToggleDamageType(selectedDamageType);
                    }
                  }}
                  className="text-[10px] text-[#bafafd] hover:underline cursor-pointer"
                >
                  Limpiar
                </button>
              )}
            </div>

            {!collapsedSections.damage && (
              <div className="space-y-1">
                {DAMAGE_TYPES.map((dt) => {
                  const activeDamageTypes = selectedDamageTypes || (selectedDamageType ? [selectedDamageType] : []);
                  const isSelected = activeDamageTypes.includes(dt.name);
                  const DtVector = dt.vectorIcon;

                  return (
                    <button
                      key={dt.name}
                      type="button"
                      onClick={() => {
                        if (onToggleDamageType) onToggleDamageType(dt.name);
                        if (currentTab !== 'catalog') onSelectTab('catalog');
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#14282e] text-slate-100 border border-[#bafafd]/40'
                          : 'text-[#8a9ba8] hover:text-slate-200 hover:bg-[#10171d]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5.5 h-5.5 rounded-full flex items-center justify-center border ${dt.bgColor} ${dt.borderColor} p-0.5 overflow-hidden shadow-xs shrink-0 bg-[#090e12] ring-1 ring-white/15 relative`}
                          style={{
                            boxShadow: isSelected
                              ? `0 0 16px ${dt.accentGlow}, 0 0 6px ${dt.accentGlow}, inset 0 0 4px ${dt.accentGlow}`
                              : `0 0 8px ${dt.accentGlow.replace(/0\.\d+\)/, '0.45)')}, inset 0 0 2px rgba(255,255,255,0.2)`,
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                          <DtVector
                            className={`w-3.5 h-3.5 ${dt.textColor} relative z-10`}
                            style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px currentColor)' }}
                          />
                        </div>
                        <span className={isSelected ? 'font-semibold text-[#bafafd]' : ''}>
                          {language === 'es' ? dt.name : dt.nameEn}
                        </span>
                      </div>
                      {isSelected && <ChevronRight className="w-3.5 h-3.5 text-[#bafafd]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Funcionalidad Section (Debajo de Tipo de Daño) */}
          <div className="pt-2 border-t border-[#172127]">
            <div className="flex items-center justify-between px-1 mb-2">
              <button
                type="button"
                onClick={() => toggleSection('functionality')}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#8a9ba8] hover:text-[#bafafd] font-heading cursor-pointer transition-colors"
              >
                <span>{language === 'es' ? 'FUNCIONALIDAD' : 'FUNCTIONALITY'}</span>
                {collapsedSections.functionality ? (
                  <ChevronRight className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
              {(selectedFunctionalities && selectedFunctionalities.length > 0 && onToggleFunctionality) && (
                <button
                  type="button"
                  onClick={() => {
                    if (onClearFunctionalities) {
                      onClearFunctionalities();
                    } else {
                      selectedFunctionalities.forEach((f) => onToggleFunctionality(f));
                    }
                  }}
                  className="text-[10px] text-[#bafafd] hover:underline cursor-pointer"
                >
                  Limpiar
                </button>
              )}
            </div>

            {!collapsedSections.functionality && (
              <div className="space-y-1">
                {SPELL_FUNCTIONALITIES.map((fn) => {
                  const isSelected = selectedFunctionalities?.includes(fn.id);
                  const FnVector = fn.vectorIcon;

                  return (
                    <button
                      key={fn.id}
                      type="button"
                      onClick={() => {
                        if (onToggleFunctionality) onToggleFunctionality(fn.id);
                        if (currentTab !== 'catalog') onSelectTab('catalog');
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#14282e] text-slate-100 border border-[#bafafd]/40'
                          : 'text-[#8a9ba8] hover:text-slate-200 hover:bg-[#10171d]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5.5 h-5.5 rounded-full flex items-center justify-center border ${fn.bgColor} ${fn.borderColor} p-0.5 overflow-hidden shadow-xs shrink-0 bg-[#090e12] ring-1 ring-white/15 relative`}
                          style={{
                            boxShadow: isSelected
                              ? `0 0 16px ${fn.accentGlow}, 0 0 6px ${fn.accentGlow}, inset 0 0 4px ${fn.accentGlow}`
                              : `0 0 8px ${fn.accentGlow.replace(/0\.\d+\)/, '0.45)')}, inset 0 0 2px rgba(255,255,255,0.2)`,
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                          <FnVector
                            className={`w-3.5 h-3.5 ${fn.textColor} relative z-10`}
                            style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px currentColor)' }}
                          />
                        </div>
                        <span className={isSelected ? 'font-semibold text-[#bafafd]' : ''}>
                          {language === 'es' ? fn.name : fn.nameEn}
                        </span>
                      </div>
                      {isSelected && <ChevronRight className="w-3.5 h-3.5 text-[#bafafd]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Objetivos Section */}
          <div className="pt-2 border-t border-[#172127]">
            <div className="flex items-center justify-between px-1 mb-2">
              <button
                type="button"
                onClick={() => toggleSection('targets')}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#8a9ba8] hover:text-[#bafafd] font-heading cursor-pointer transition-colors"
              >
                <span>{language === 'es' ? 'OBJETIVOS' : 'TARGETS'}</span>
                {collapsedSections.targets ? (
                  <ChevronRight className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
              {(selectedTargets && selectedTargets.length > 0 && onClearTargets) && (
                <button
                  type="button"
                  onClick={() => onClearTargets()}
                  className="text-[10px] text-[#bafafd] hover:underline cursor-pointer"
                >
                  Limpiar
                </button>
              )}
            </div>

            {!collapsedSections.targets && (
              <div className="space-y-1">
                {/* Todos Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (onClearTargets) onClearTargets();
                    if (currentTab !== 'catalog') onSelectTab('catalog');
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    !selectedTargets || selectedTargets.length === 0
                      ? 'bg-[#14282e] text-slate-100 border border-[#bafafd]/40 shadow-xs'
                      : 'text-[#8a9ba8] hover:text-slate-200 hover:bg-[#10171d]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5.5 h-5.5 rounded-full flex items-center justify-center border border-[#1b2a33] bg-[#090e12] ring-1 ring-white/15 shrink-0 relative overflow-hidden"
                      style={{
                        boxShadow: !selectedTargets || selectedTargets.length === 0
                          ? '0 0 14px rgba(186, 250, 253, 0.8), 0 0 5px rgba(186, 250, 253, 0.95), inset 0 0 4px rgba(186, 250, 253, 0.5)'
                          : '0 0 7px rgba(186, 250, 253, 0.35)',
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                      <Target
                        className="w-3.5 h-3.5 text-[#bafafd] relative z-10"
                        style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px currentColor)' }}
                      />
                    </div>
                    <span className={!selectedTargets || selectedTargets.length === 0 ? 'font-semibold text-[#bafafd]' : ''}>
                      {language === 'es' ? 'Todos los objetivos' : 'All targets'}
                    </span>
                  </div>
                  {(!selectedTargets || selectedTargets.length === 0) && (
                    <ChevronRight className="w-3.5 h-3.5 text-[#bafafd]" />
                  )}
                </button>

                {SPELL_TARGET_OPTIONS.map((tgt) => {
                  const isSelected = (selectedTargets || []).includes(tgt.id);
                  const TgtVector = tgt.vectorIcon;

                  return (
                    <button
                      key={tgt.id}
                      type="button"
                      onClick={() => {
                        if (onToggleTarget) onToggleTarget(tgt.id);
                        if (currentTab !== 'catalog') onSelectTab('catalog');
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#14282e] text-slate-100 border border-[#bafafd]/40'
                          : 'text-[#8a9ba8] hover:text-slate-200 hover:bg-[#10171d]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5.5 h-5.5 rounded-full flex items-center justify-center border ${tgt.bgColor} ${tgt.borderColor} p-0.5 overflow-hidden shadow-xs shrink-0 bg-[#090e12] ring-1 ring-white/15 relative`}
                          style={{
                            boxShadow: isSelected
                              ? `0 0 16px ${tgt.accentGlow}, 0 0 6px ${tgt.accentGlow}, inset 0 0 4px ${tgt.accentGlow}`
                              : `0 0 8px ${tgt.accentGlow.replace(/0\.\d+\)/, '0.45)')}, inset 0 0 2px rgba(255,255,255,0.2)`,
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                          <TgtVector
                            className={`w-3.5 h-3.5 ${tgt.textColor} relative z-10`}
                            style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px currentColor)' }}
                          />
                        </div>
                        <span className={isSelected ? 'font-semibold text-[#bafafd]' : ''}>
                          {language === 'es' ? tgt.name : tgt.nameEn}
                        </span>
                      </div>
                      {isSelected && <ChevronRight className="w-3.5 h-3.5 text-[#bafafd]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Origen Section (Infernal, Celestial, Elemental, Feérica, Shadowfell, Onírico, Astral) */}
          <div className="pt-2 border-t border-[#172127]">
            <div className="flex items-center justify-between px-1 mb-2">
              <button
                type="button"
                onClick={() => toggleSection('origins')}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#8a9ba8] hover:text-[#bafafd] font-heading cursor-pointer transition-colors"
              >
                <span>{language === 'es' ? 'ORIGEN' : 'ORIGIN'}</span>
                {collapsedSections.origins ? (
                  <ChevronRight className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
              {(selectedOrigins && selectedOrigins.length > 0 && onClearOrigins) && (
                <button
                  type="button"
                  onClick={() => onClearOrigins()}
                  className="text-[10px] text-[#bafafd] hover:underline cursor-pointer"
                >
                  Limpiar
                </button>
              )}
            </div>

            {!collapsedSections.origins && (
              <div className="space-y-1">
                {/* Todos Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (onClearOrigins) onClearOrigins();
                    if (currentTab !== 'catalog') onSelectTab('catalog');
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    !selectedOrigins || selectedOrigins.length === 0
                      ? 'bg-[#14282e] text-slate-100 border border-[#bafafd]/40 shadow-xs'
                      : 'text-[#8a9ba8] hover:text-slate-200 hover:bg-[#10171d]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5.5 h-5.5 rounded-full flex items-center justify-center border border-[#1b2a33] bg-[#090e12] ring-1 ring-white/15 shrink-0 relative overflow-hidden"
                      style={{
                        boxShadow: !selectedOrigins || selectedOrigins.length === 0
                          ? '0 0 14px rgba(186, 250, 253, 0.8), 0 0 5px rgba(186, 250, 253, 0.95), inset 0 0 4px rgba(186, 250, 253, 0.5)'
                          : '0 0 7px rgba(186, 250, 253, 0.35)',
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                      <Sparkles
                        className="w-3.5 h-3.5 text-[#bafafd] relative z-10"
                        style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px currentColor)' }}
                      />
                    </div>
                    <span className={!selectedOrigins || selectedOrigins.length === 0 ? 'font-semibold text-[#bafafd]' : ''}>
                      {language === 'es' ? 'Todos los orígenes' : 'All origins'}
                    </span>
                  </div>
                  {(!selectedOrigins || selectedOrigins.length === 0) && (
                    <ChevronRight className="w-3.5 h-3.5 text-[#bafafd]" />
                  )}
                </button>

                {SPELL_ORIGIN_OPTIONS.map((orig) => {
                  const isSelected = (selectedOrigins || []).includes(orig.name);
                  const OrigIcon = orig.icon;

                  return (
                    <button
                      key={orig.name}
                      type="button"
                      onClick={() => {
                        if (onToggleOrigin) onToggleOrigin(orig.name);
                        if (currentTab !== 'catalog') onSelectTab('catalog');
                        onCloseMobile();
                      }}
                      title={language === 'es' ? orig.description : orig.descriptionEn}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#14282e] text-slate-100 border border-[#bafafd]/40'
                          : 'text-[#8a9ba8] hover:text-slate-200 hover:bg-[#10171d]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5.5 h-5.5 rounded-full flex items-center justify-center border ${orig.bgColor} ${orig.borderColor} p-0.5 overflow-hidden shadow-xs shrink-0 bg-[#090e12] ring-1 ring-white/15 relative`}
                          style={{
                            boxShadow: isSelected
                              ? `0 0 16px ${orig.accentGlow}, 0 0 6px ${orig.accentGlow}, inset 0 0 4px ${orig.accentGlow}`
                              : `0 0 8px ${orig.accentGlow.replace(/0\.\d+\)/, '0.45)')}, inset 0 0 2px rgba(255,255,255,0.2)`,
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                          <OrigIcon
                            className={`w-3.5 h-3.5 ${orig.textColor} relative z-10`}
                            style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px currentColor)' }}
                          />
                        </div>
                        <span className={isSelected ? 'font-semibold text-[#bafafd]' : ''}>
                          {language === 'es' ? orig.name : orig.nameEn}
                        </span>
                      </div>
                      {isSelected && <ChevronRight className="w-3.5 h-3.5 text-[#bafafd]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Classes Section */}
          <div className="pt-2 border-t border-[#172127]">
            <div className="flex items-center justify-between px-1 mb-2">
              <button
                type="button"
                onClick={() => toggleSection('classes')}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#8a9ba8] hover:text-[#bafafd] font-heading cursor-pointer transition-colors"
              >
                <span>{language === 'es' ? 'CLASES DE LANZADOR' : 'CASTER CLASSES'}</span>
                {collapsedSections.classes ? (
                  <ChevronRight className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
              {((selectedClasses && selectedClasses.length > 0) || selectedClass) && (
                <button
                  type="button"
                  onClick={() => {
                    if (onClearClasses) {
                      onClearClasses();
                    } else if (selectedClass) {
                      onToggleClass(selectedClass);
                    }
                  }}
                  className="text-[10px] text-[#bafafd] hover:underline cursor-pointer"
                >
                  Limpiar
                </button>
              )}
            </div>

            {!collapsedSections.classes && (
              <div className="space-y-1">
                {CLASS_OPTIONS.map((clsOpt) => {
                  const activeClasses = selectedClasses || (selectedClass ? [selectedClass] : []);
                  const isSelected = activeClasses.includes(clsOpt.name);
                  const ClsIcon = clsOpt.icon;
                  return (
                    <button
                      key={clsOpt.name}
                      type="button"
                      onClick={() => {
                        onToggleClass(clsOpt.name);
                        if (currentTab !== 'catalog') onSelectTab('catalog');
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#14282e] text-slate-100 border border-[#bafafd]/40'
                          : 'text-[#8a9ba8] hover:text-slate-200 hover:bg-[#10171d]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5.5 h-5.5 rounded-full flex items-center justify-center border ${clsOpt.bgColor} ${clsOpt.borderColor} p-0.5 overflow-hidden shadow-xs shrink-0 bg-[#090e12] ring-1 ring-white/15 relative`}
                          style={{
                            boxShadow: isSelected
                              ? `0 0 16px ${clsOpt.accentGlow}, 0 0 6px ${clsOpt.accentGlow}, inset 0 0 4px ${clsOpt.accentGlow}`
                              : `0 0 8px ${clsOpt.accentGlow.replace(/0\.\d+\)/, '0.45)')}, inset 0 0 2px rgba(255,255,255,0.2)`,
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none rounded-full" />
                          <ClsIcon
                            className={`w-3.5 h-3.5 ${clsOpt.textColor} relative z-10`}
                            style={{ filter: 'drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px currentColor)' }}
                          />
                        </div>
                        <span className={isSelected ? 'font-semibold text-[#bafafd]' : ''}>
                          {language === 'es' ? clsOpt.name : clsOpt.nameEn}
                        </span>
                      </div>
                      {isSelected && <ChevronRight className="w-3.5 h-3.5 text-[#bafafd]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Lore Note (Matching Dragopedia bottom box) */}
        <div className="p-3 border-t border-[#172127] bg-[#090d10]">
          <div className="p-2.5 rounded-xl bg-[#10171d] border border-[#1a2832]">
            <div className="text-[10px] font-bold text-[#bafafd] uppercase tracking-widest font-heading">
              DRACOPEDIA • COMPENDIO MÁGICO
            </div>
            <div className="text-[11px] text-[#8a9ba8] leading-tight mt-1">
              Magia de los Espejos (Reflexión) & Las Cinco Magias Primordiales.
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
