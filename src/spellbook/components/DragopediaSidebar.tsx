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
} from 'lucide-react';
import { Character, DndClass, MagicSchool, ViewTab, PrimordialMagic, GroupByDistribution, SpellFunctionality, SpellTarget } from '../types';
import { ALL_CLASSES, ALL_SCHOOLS } from '../data/spells';
import { PRIMORDIAL_MAGICS } from '../data/primordialMagic';
import { getSchoolTheme } from '../data/schools';
import { DAMAGE_TYPES } from '../data/damageTypes';
import { SPELL_FUNCTIONALITIES } from '../data/spellFunctionalities';
import { SPELL_TARGET_OPTIONS } from '../data/spellTargets';

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
                  <div className="grid grid-cols-3 gap-1 bg-[#0e1419] p-1 rounded-xl border border-[#1b2832]">
                    <button
                      type="button"
                      onClick={() => onGroupByChange('level')}
                      className={`py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer text-center ${
                        groupBy === 'level'
                          ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/35 shadow-xs'
                          : 'text-[#8a9ba8] hover:text-slate-200'
                      }`}
                      title="Distribuir por Niveles"
                    >
                      {language === 'es' ? 'Nivel' : 'Level'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onGroupByChange('primordial')}
                      className={`py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer text-center ${
                        groupBy === 'primordial'
                          ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/35 shadow-xs'
                          : 'text-[#8a9ba8] hover:text-slate-200'
                      }`}
                      title="Distribuir por Magias Primordiales"
                    >
                      {language === 'es' ? 'Primordial' : 'Primordial'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onGroupByChange('school')}
                      className={`py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer text-center ${
                        groupBy === 'school'
                          ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/35 shadow-xs'
                          : 'text-[#8a9ba8] hover:text-slate-200'
                      }`}
                      title="Distribuir por Escuela de Magia"
                    >
                      {language === 'es' ? 'Escuela' : 'School'}
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
              <div className="space-y-1">
                {PRIMORDIAL_MAGICS.map((p) => {
                  const activePrimordials = selectedPrimordials || (selectedPrimordial ? [selectedPrimordial] : []);
                  const isSelected = activePrimordials.includes(p.name);
                  const IconComp = p.icon;

                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        onTogglePrimordial(p.name);
                        if (currentTab !== 'catalog') onSelectTab('catalog');
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#14282e] text-slate-100 border border-[#bafafd]/40 shadow-xs'
                          : 'text-[#8a9ba8] hover:text-slate-200 hover:bg-[#10171d]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border p-0.5 overflow-hidden shrink-0 bg-[#090e12] ring-1 transition-all duration-300 ${
                            isSelected
                              ? 'ring-[#bafafd]/80 border-[#bafafd]'
                              : 'ring-white/15'
                          }`}
                          style={{
                            borderColor: isSelected ? undefined : p.color,
                            boxShadow: isSelected
                              ? '0 0 12px rgba(186,250,253,0.6)'
                              : `0 0 8px ${p.accentGlow || 'rgba(255,255,255,0.25)'}`,
                          }}
                        >
                          <IconComp className="w-full h-full object-contain rounded-full" />
                        </div>
                        <span className={isSelected ? 'font-semibold text-[#bafafd]' : ''}>
                          {language === 'es' ? p.name : p.nameEn}
                        </span>
                      </div>
                      {isSelected && <ChevronRight className="w-3.5 h-3.5 text-[#bafafd]" />}
                    </button>
                  );
                })}
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
                          className={`w-5.5 h-5.5 rounded-full flex items-center justify-center border ${schoolTheme.bgColor} ${schoolTheme.borderColor} p-0.5 overflow-hidden shadow-xs shrink-0 bg-[#090e12] ring-1 ring-white/10`}
                        >
                          <IconComponent className="w-full h-full object-contain rounded-full" />
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
                  const DtIcon = dt.icon;

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
                          className={`w-5.5 h-5.5 rounded-full flex items-center justify-center border ${dt.bgColor} ${dt.borderColor} p-0.5 overflow-hidden shadow-xs shrink-0 bg-[#090e12] ring-1 ring-white/10`}
                        >
                          <DtIcon className="w-full h-full object-contain rounded-full" />
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
                  const FnIcon = fn.icon;

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
                          className={`w-5.5 h-5.5 rounded-full flex items-center justify-center border ${fn.bgColor} ${fn.borderColor} p-0.5 overflow-hidden shadow-xs shrink-0 bg-[#090e12] ring-1 ring-white/10`}
                        >
                          <FnIcon className="w-full h-full object-contain rounded-full" />
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
                  const TgtIcon = tgt.icon;

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
                          className={`w-5.5 h-5.5 rounded-full flex items-center justify-center border ${tgt.bgColor} ${tgt.borderColor} p-0.5 overflow-hidden shadow-xs shrink-0 bg-[#090e12] ring-1 ring-white/10`}
                        >
                          <TgtIcon className="w-full h-full object-contain rounded-full" />
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
              <div className="flex flex-wrap gap-1">
                {ALL_CLASSES.map((cls) => {
                  const activeClasses = selectedClasses || (selectedClass ? [selectedClass] : []);
                  const isSelected = activeClasses.includes(cls);
                  return (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => {
                        onToggleClass(cls);
                        if (currentTab !== 'catalog') onSelectTab('catalog');
                        onCloseMobile();
                      }}
                      className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/40 shadow-xs'
                          : 'bg-[#0e1419] text-[#8a9ba8] border-[#1b2832] hover:text-slate-200 hover:border-slate-600'
                      }`}
                    >
                      {cls}
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
