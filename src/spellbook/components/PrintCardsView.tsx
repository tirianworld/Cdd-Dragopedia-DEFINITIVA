import React, { useState } from 'react';
import { Printer, CheckCircle2, BookMarked, Star } from 'lucide-react';
import { Spell, Character } from '../types';
import { SpellIcon } from './SpellIcon';
import { stripMarkdown } from './MarkdownText';
import { SchoolEmbroideryWatermark } from './SchoolEmbroideryWatermark';

interface PrintCardsViewProps {
  spells: Spell[];
  activeCharacter: Character | null;
  language: 'es' | 'en';
}

export const PrintCardsView: React.FC<PrintCardsViewProps> = ({
  spells,
  activeCharacter,
  language,
}) => {
  const [printFilter, setPrintFilter] = useState<'all' | 'spellbook' | 'prepared' | 'favorites'>('all');

  const filteredForPrint = spells.filter((s) => {
    if (!activeCharacter) return true;
    if (printFilter === 'spellbook') return activeCharacter.knownSpellIds.includes(s.id);
    if (printFilter === 'prepared') return activeCharacter.preparedSpellIds.includes(s.id);
    if (printFilter === 'favorites') return activeCharacter.favoriteSpellIds.includes(s.id);
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar (Hidden during actual print) */}
      <div className="no-print bg-[#10181e] rounded-2xl border border-[#1b2a33] p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wide">
            <Printer className="w-5 h-5 text-[#bafafd]" />
            {language === 'es' ? 'Generador de Tarjetas Imprimibles' : 'Printable Spell Cards Generator'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'es'
              ? `Diseño optimizado para recortar o usar en tus partidas de rol (${filteredForPrint.length} tarjetas con arte oficial de BG3).`
              : `Optimized layout to cut out or use in your tabletop games (${filteredForPrint.length} cards with official BG3 artwork).`}
          </p>
        </div>

        {/* Filter Pills and Print Button */}
        <div className="flex flex-wrap items-center gap-2">
          {activeCharacter && (
            <div className="flex items-center bg-[#0c1217] p-1 rounded-xl border border-[#1a2832] text-xs">
              <button
                type="button"
                onClick={() => setPrintFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  printFilter === 'all'
                    ? 'bg-[#14282c] text-[#bafafd] border border-[#bafafd]/50 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {language === 'es' ? 'Todos' : 'All'}
              </button>
              <button
                type="button"
                onClick={() => setPrintFilter('spellbook')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  printFilter === 'spellbook'
                    ? 'bg-[#14282c] text-[#bafafd] border border-[#bafafd]/50 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {language === 'es' ? 'Grimorio' : 'Spellbook'}
              </button>
              <button
                type="button"
                onClick={() => setPrintFilter('prepared')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  printFilter === 'prepared'
                    ? 'bg-[#14282c] text-[#bafafd] border border-[#bafafd]/50 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {language === 'es' ? 'Preparados' : 'Prepared'}
              </button>
              <button
                type="button"
                onClick={() => setPrintFilter('favorites')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  printFilter === 'favorites'
                    ? 'bg-[#14282c] text-[#bafafd] border border-[#bafafd]/50 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {language === 'es' ? 'Favoritos' : 'Favorites'}
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#bafafd] hover:bg-[#c7fbfe] text-slate-950 shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'es' ? 'Imprimir Tarjetas' : 'Print Cards'}</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 print:grid-cols-3 print:gap-3 print:m-0">
        {filteredForPrint.map((spell) => {
          const schoolColor = spell.color || '#10b981';
          return (
            <div
              key={spell.id}
              className="bg-[#10181e] print:bg-white print:text-black border rounded-xl p-3.5 flex flex-col justify-between shadow-sm print:shadow-none break-inside-avoid print:border-black"
              style={{ borderColor: schoolColor }}
            >
              <div>
                {/* Header */}
                <div className="flex items-start gap-2.5 pb-2 border-b border-[#1c2a33] print:border-stone-300">
                  <div className="w-10 h-10 min-w-10 min-h-10 rounded-lg bg-[#14232c] border border-[#213744] flex items-center justify-center overflow-hidden">
                    <SpellIcon
                      spell={spell}
                      size="sm"
                      className="w-9 h-9"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-heading text-sm font-bold text-slate-100 print:text-black truncate uppercase">
                      {language === 'es' ? spell.name : spell.nameEn}
                    </h4>
                    <p className="text-[10px] text-slate-400 print:text-stone-600 truncate italic">
                      {spell.level === 0
                        ? language === 'es'
                          ? 'Truco'
                          : 'Cantrip'
                        : language === 'es'
                        ? `Nivel ${spell.level}`
                        : `Level ${spell.level}`}{' '}
                      • {spell.school}
                    </p>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="relative overflow-hidden grid grid-cols-2 gap-1 py-1.5 text-[9px] text-slate-300 print:text-stone-700 font-mono border-b border-[#18262e] print:border-stone-200">
                  <div
                    className="pointer-events-none select-none absolute right-1 top-1/2 -translate-y-1/2 z-0 print:opacity-15"
                    style={{ color: schoolColor, opacity: 0.12 }}
                    aria-hidden="true"
                  >
                    <SchoolEmbroideryWatermark school={spell.school} size={48} />
                  </div>
                  <div className="relative z-10">
                    <span className="font-bold text-slate-400">Lanzamiento:</span> {spell.castingTime}
                  </div>
                  <div className="relative z-10">
                    <span className="font-bold text-slate-400">Alcance:</span> {spell.range}
                  </div>
                  <div className="relative z-10">
                    <span className="font-bold text-slate-400">Duración:</span> {spell.duration}
                  </div>
                  <div className="relative z-10">
                    <span className="font-bold text-slate-400">Componentes:</span>{' '}
                    {[
                      spell.components.verbal && 'V',
                      spell.components.somatic && 'S',
                      spell.components.material && 'M',
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                </div>

                {/* Description */}
                <p className="text-[10px] text-slate-300 print:text-stone-800 line-clamp-6 leading-relaxed pt-2 font-serif-body">
                  {stripMarkdown(spell.description)}
                </p>

                {spell.higherLevels && (
                  <p className="text-[9px] text-emerald-400 print:text-emerald-900 line-clamp-2 mt-1.5 pt-1 border-t border-[#18262e] font-serif-body italic">
                    <span className="font-bold">Nivel sup:</span> {stripMarkdown(spell.higherLevels)}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="mt-2 pt-2 border-t border-[#18262e] print:border-stone-200 flex items-center justify-between text-[9px] text-slate-400 print:text-stone-500">
                <span className="truncate">{spell.classes.slice(0, 3).join(', ')}</span>
                {spell.version && spell.version !== '2024' && (
                  <span className="font-bold uppercase tracking-wider">{spell.version}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
