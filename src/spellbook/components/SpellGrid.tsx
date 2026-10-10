import React, { useState } from 'react';
import { Spell, Character, GroupByDistribution } from '../types';
import { SpellIcon } from './SpellIcon';
import { ChevronDown, ChevronUp, Star, Check, Bookmark, Sparkles, FolderTree } from 'lucide-react';
import { getSpellPrimordialMagic, PRIMORDIAL_MAGICS } from '../data/primordialMagic';
import { ALL_SCHOOLS } from '../data/spells';
import { getSchoolTheme } from '../data/schools';

interface SpellGridProps {
  spells: Spell[];
  language: 'es' | 'en';
  activeCharacter: Character | null;
  onOpenDetails: (spell: Spell) => void;
  onToggleKnown?: (spellId: string) => void;
  onTogglePrepared?: (spellId: string) => void;
  onToggleFavorite?: (spellId: string) => void;
  onCastSpell?: (spell: Spell) => void;
  onEditSpell?: (spell: Spell) => void;
  onAddToList?: (spell: Spell) => void;
  groupBy?: GroupByDistribution;
}

const LEVEL_NAMES_ES: Record<number, string> = {
  0: 'Trucos (Nivel 0)',
  1: 'Conjuros de Nivel 1',
  2: 'Conjuros de Nivel 2',
  3: 'Conjuros de Nivel 3',
  4: 'Conjuros de Nivel 4',
  5: 'Conjuros de Nivel 5',
  6: 'Conjuros de Nivel 6',
  7: 'Conjuros de Nivel 7',
  8: 'Conjuros de Nivel 8',
  9: 'Conjuros de Nivel 9',
};

const LEVEL_NAMES_EN: Record<number, string> = {
  0: 'Cantrips (Level 0)',
  1: 'Level 1 Spells',
  2: 'Level 2 Spells',
  3: 'Level 3 Spells',
  4: 'Level 4 Spells',
  5: 'Level 5 Spells',
  6: 'Level 6 Spells',
  7: 'Level 7 Spells',
  8: 'Level 8 Spells',
  9: 'Level 9 Spells',
};

interface GroupSection {
  id: string;
  title: string;
  subtitle?: string;
  count: number;
  spells: Spell[];
  badgeText?: string;
  badgeColor?: string;
  icon?: React.FC<{ className?: string }>;
  lore?: {
    source: string;
    domain: string;
    adamantiteEffect: string;
    realmNotes: string;
    cosmicOrigin?: string;
    properties?: {
      indomable: string;
      transformable: string;
      inestable: string;
      eterna: string;
    };
    mastersTitle?: string;
    masters?: string[];
    dangers?: string[];
    interactions?: string;
    canonicalId?: string;
  };
}

export const SpellGrid: React.FC<SpellGridProps> = ({
  spells,
  language,
  activeCharacter,
  onOpenDetails,
  onToggleKnown,
  onTogglePrepared,
  onToggleFavorite,
  onCastSpell,
  onEditSpell,
  onAddToList,
  groupBy = 'level',
}) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroupCollapse = (groupId: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Build grouped sections based on groupBy ('level' | 'primordial' | 'school')
  const sections: GroupSection[] = React.useMemo(() => {
    if (groupBy === 'primordial') {
      return PRIMORDIAL_MAGICS.map((p) => {
        const list = spells.filter((s) => getSpellPrimordialMagic(s) === p.name);
        return {
          id: p.name,
          title: p.name,
          count: list.length,
          spells: list,
          icon: p.icon,
        };
      }).filter((section) => section.spells.length > 0);
    }

    if (groupBy === 'school') {
      return ALL_SCHOOLS.map((school) => {
        const list = spells.filter((s) => s.school === school);
        const isReflection = school === 'Reflexión';
        const schoolTheme = getSchoolTheme(school);
        return {
          id: school,
          title: school,
          subtitle: isReflection
            ? 'Magia de los Espejos • Academia de Drangleic y Quasiplano del Cristal'
            : `Escuela de Magia Arcana (${school})`,
          count: list.length,
          spells: list,
          icon: schoolTheme.icon,
          badgeText: isReflection ? 'Reflexión / Espejos' : school,
          badgeColor: isReflection
            ? 'bg-[#14282c] text-[#bafafd] border-[#bafafd]/40'
            : 'bg-[#14282c] text-[#bafafd] border-[#bafafd]/35',
          lore: isReflection
            ? {
                source: 'Quasiplano del Cristal y tratados del Rey Allant',
                domain: 'Reflejos, azogue, duplicación, distorsión y contrahechizos visuales',
                adamantiteEffect: 'Repele rayos y proyectiles mágicos refractándolos en 180°',
                realmNotes: 'Desarrollada en la Academia de los Espejos de Drangleic y los confines del Caldo de Dragón',
              }
            : undefined,
        };
      }).filter((section) => section.spells.length > 0);
    }

    // Default: Group by Level (0-9)
    const groups: GroupSection[] = [];
    for (let lvl = 0; lvl <= 9; lvl++) {
      const list = spells.filter((s) => s.level === lvl);
      if (list.length > 0) {
        groups.push({
          id: `level-${lvl}`,
          title: language === 'es' ? LEVEL_NAMES_ES[lvl] : LEVEL_NAMES_EN[lvl],
          subtitle: lvl === 0 ? 'Sin coste de ranura de magia' : `Requiere ranura de conjuro nivel ${lvl}`,
          count: list.length,
          spells: list,
          badgeText: lvl === 0 ? 'TRUCO' : `NV ${lvl}`,
          badgeColor: 'bg-[#14282c] text-[#bafafd] border-[#bafafd]/40',
        });
      }
    }
    return groups;
  }, [spells, groupBy, language]);

  return (
    <div className="flex flex-col gap-6 w-full pt-1">
      {sections.map((section) => {
        const isCollapsed = Boolean(collapsedGroups[section.id]);
        const SectionIcon = section.icon || FolderTree;

        return (
          <section
            key={section.id}
            className="rounded-2xl border border-[#1a2932] bg-[#0e161c] overflow-hidden transition-all shadow-sm"
          >
            {/* Sticky Section Header Button with Dragopedia styling */}
            <button
              type="button"
              onClick={() => toggleGroupCollapse(section.id)}
              className="sticky top-16 z-20 flex w-full items-center justify-between px-4 sm:px-6 py-3.5 bg-[#121c23] hover:bg-[#15232c] border-b border-[#1b2a33] text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#14282c] border border-[#bafafd]/40 flex items-center justify-center shrink-0 text-[#bafafd] group-hover:border-[#bafafd] overflow-hidden p-1 shadow-xs">
                  <SectionIcon className="w-full h-full object-contain rounded-full" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-heading text-base sm:text-lg font-bold tracking-wider text-slate-100 group-hover:text-[#bafafd] transition-colors uppercase truncate">
                      {section.title}
                    </h2>
                    <span className="rounded-full bg-[#14282c] border border-[#bafafd]/30 px-2.5 py-0.5 text-xs font-semibold text-[#bafafd] font-mono shrink-0">
                      {section.count} {language === 'es' ? 'conjuros' : 'spells'}
                    </span>
                    {section.badgeText && (
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border hidden sm:inline ${section.badgeColor || 'bg-[#15232c] text-slate-300 border-[#233845]'}`}>
                        {section.badgeText}
                      </span>
                    )}
                  </div>
                  {section.subtitle && (
                    <p className="text-xs text-slate-400 truncate mt-0.5 font-normal">
                      {section.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-200 transition-colors shrink-0 ml-2">
                <span className="text-xs uppercase tracking-widest font-mono hidden md:inline opacity-70">
                  {isCollapsed
                    ? (language === 'es' ? 'Desplegar' : 'Expand')
                    : (language === 'es' ? 'Plegar' : 'Collapse')}
                </span>
                {isCollapsed ? (
                  <ChevronDown className="w-5 h-5 transition-transform text-[#bafafd]" />
                ) : (
                  <ChevronUp className="w-5 h-5 transition-transform text-[#bafafd]" />
                )}
              </div>
            </button>

            {/* List of spells in this section: Always BG3 Icon Grid */}
            {!isCollapsed && (
              <div className="p-3 sm:p-5 grid grid-cols-2 min-[440px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 min-[1800px]:grid-cols-9 min-[2100px]:grid-cols-10 gap-3 sm:gap-4">
                {section.spells.map((spell) => {
                  const isKnown = activeCharacter?.knownSpellIds.includes(spell.id) ?? false;
                  const isPrepared = activeCharacter?.preparedSpellIds.includes(spell.id) ?? false;
                  const isFav = activeCharacter?.favoriteSpellIds.includes(spell.id) ?? false;

                  return (
                    <div
                      key={spell.id}
                      className="group relative flex flex-col items-center justify-between p-2.5 rounded-xl border border-[#192731] hover:border-[#bafafd]/50 bg-[#10181e] hover:bg-[#142129] transition-all cursor-pointer shadow-xs"
                      onClick={() => onOpenDetails(spell)}
                    >
                      {/* Top status badges */}
                      <div className="absolute top-2 right-2 z-20 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                        {isPrepared && (
                          <span
                            title="Preparado"
                            className="w-4 h-4 rounded-full bg-[#bafafd] text-slate-950 flex items-center justify-center text-[10px] font-bold shadow-xs"
                          >
                            <Check className="w-2.5 h-2.5 stroke-3" />
                          </span>
                        )}
                        {isKnown && !isPrepared && (
                          <span
                            title="En el Grimorio"
                            className="w-4 h-4 rounded-full bg-[#bafafd]/80 text-slate-950 flex items-center justify-center text-[10px] font-bold shadow-xs"
                          >
                            <Bookmark className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>

                      {/* Favorite button toggle */}
                      {onToggleFavorite && activeCharacter && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(spell.id);
                          }}
                          className={`absolute top-2 left-2 z-20 p-1 rounded-full transition-opacity cursor-pointer ${
                            isFav
                              ? 'text-[#bafafd] opacity-100'
                              : 'text-slate-500 opacity-0 group-hover:opacity-80 hover:text-[#bafafd]'
                          }`}
                          title="Favorito"
                        >
                          <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-[#bafafd]' : ''}`} />
                        </button>
                      )}

                      {/* Spell Icon Container */}
                      <div className="relative mt-2 mb-1 p-1 rounded-xl bg-[#14232c] border border-[#213744] group-hover:border-[#bafafd]/50 transition-colors shadow-xs">
                        <SpellIcon spell={spell} size="md" />

                        {/* Corner Level / Cantrip tag */}
                        <div className="absolute -bottom-1.5 -right-1.5 px-1 py-0.2 rounded bg-[#0b1217] border border-[#233a49] text-[9px] font-mono font-bold text-[#bafafd]">
                          {spell.level === 0 ? 'T' : spell.level}
                        </div>
                      </div>

                      {/* Spell Title & Subtitle */}
                      <div className="w-full text-center px-0.5 my-1">
                        <h3 className="w-full overflow-hidden text-xs sm:text-sm font-semibold leading-tight line-clamp-2 text-slate-100 group-hover:text-[#bafafd] transition-colors">
                          {language === 'es' ? spell.name : spell.nameEn || spell.name}
                        </h3>
                        {language === 'es' && spell.nameEn && spell.nameEn !== spell.name && (
                          <p className="text-[10px] text-slate-400 italic truncate opacity-75 mt-0.5">
                            {spell.nameEn}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};
