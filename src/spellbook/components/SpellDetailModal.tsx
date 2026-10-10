import React, { useState } from 'react';
import { X, Copy, Check, Printer, BookMarked, Star, Sparkles, Edit3, ScrollText } from 'lucide-react';
import { Spell, Character } from '../types';
import { getSpellPrimordialMagic, PRIMORDIAL_MAGIC_MAP } from '../data/primordialMagic';
import { getSpellDamageTypes, DAMAGE_TYPES } from '../data/damageTypes';
import { getSpellTargets, SPELL_TARGET_OPTIONS } from '../data/spellTargets';
import { getSpellFunctionalities, SPELL_FUNCTIONALITIES } from '../data/spellFunctionalities';
import { SpellIcon } from './SpellIcon';
import { MarkdownText } from './MarkdownText';

interface SpellDetailModalProps {
  spell: Spell | null;
  onClose: () => void;
  language: 'es' | 'en';
  activeCharacter: Character | null;
  onToggleKnown?: (spellId: string) => void;
  onTogglePrepared?: (spellId: string) => void;
  onToggleFavorite?: (spellId: string) => void;
  onCastSpellWithSlot?: (spell: Spell, slotLevel: number) => void;
  onPrintSingle?: (spell: Spell) => void;
  onEditSpell?: (spell: Spell) => void;
  onAddToList?: (spell: Spell) => void;
}

export const SpellDetailModal: React.FC<SpellDetailModalProps> = ({
  spell,
  onClose,
  language,
  activeCharacter,
  onToggleKnown,
  onTogglePrepared,
  onToggleFavorite,
  onPrintSingle,
  onEditSpell,
  onAddToList,
}) => {
  const [copied, setCopied] = useState(false);

  if (!spell) return null;

  const isKnown = activeCharacter?.knownSpellIds.includes(spell.id) ?? false;
  const isPrepared = activeCharacter?.preparedSpellIds.includes(spell.id) ?? false;
  const isFavorite = activeCharacter?.favoriteSpellIds.includes(spell.id) ?? false;
  const schoolColor = spell.color || '#10b981';

  const primordial = getSpellPrimordialMagic(spell);
  const primordialInfo = PRIMORDIAL_MAGIC_MAP[primordial];
  const PrimordialIcon = primordialInfo?.icon || Sparkles;

  const handleCopy = () => {
    const text = `**${spell.name}** (${spell.nameEn})
Nivel ${spell.level} - ${spell.school}
Tiempo de lanzamiento: ${spell.castingTime}
Alcance: ${spell.range}
Componentes: ${[
      spell.components.verbal ? 'V' : null,
      spell.components.somatic ? 'S' : null,
      spell.components.material ? `M (${spell.components.materialDescription || ''})` : null,
    ]
      .filter(Boolean)
      .join(', ')}
Duración: ${spell.duration} ${spell.concentration ? '(Concentración)' : ''}
Clases: ${spell.classes.join(', ')}

${spell.description}
${spell.higherLevels ? `\nA niveles superiores: ${spell.higherLevels}` : ''}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0e161c] text-slate-100 rounded-2xl border border-[#1d2d38] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with official BG3 artwork banner & close button */}
        <div
          className="relative px-6 py-6 border-b border-[#1b2a33] flex flex-col sm:flex-row items-center sm:items-start gap-4"
          style={{
            background: `linear-gradient(135deg, ${schoolColor}25 0%, rgba(14,22,28,0.98) 70%)`,
          }}
        >
          <div className="absolute right-4 top-4 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#14232c] hover:bg-[#1a2e3a] text-slate-400 hover:text-white border border-[#213744] transition-colors cursor-pointer"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Spell Art Icon */}
          <div className="shrink-0 relative group">
            <SpellIcon spell={spell} size="lg" />
          </div>

          <div className="text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-wide text-slate-100 uppercase">
                {language === 'es' ? spell.name : spell.nameEn}
              </h2>
            </div>
            <p className="text-sm text-slate-400 italic mt-0.5">
              {spell.nameEn && spell.nameEn !== spell.name ? `${spell.nameEn} • ` : ''}
              {spell.school}
            </p>

            {/* Tags: Level, School, Ritual, Concentration */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mt-2.5">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#14282c] text-[#bafafd] border border-[#bafafd]/50">
                {spell.level === 0 ? 'TRUCO' : `NIVEL ${spell.level}`}
              </span>

              <span
                className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md border"
                style={{
                  backgroundColor: `${schoolColor}20`,
                  color: schoolColor,
                  borderColor: `${schoolColor}50`,
                }}
              >
                {spell.school}
              </span>

              {spell.ritual && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#14282c] text-[#bafafd] border border-[#bafafd]/40">
                  RITUAL
                </span>
              )}

              {spell.concentration && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#14282c] text-[#bafafd] border border-[#bafafd]/40">
                  CONCENTRACIÓN
                </span>
              )}

              {(spell.isCustom || spell.source === 'Homebrew') && (
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-950/70 text-purple-300 border border-purple-500/50 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>{language === 'es' ? 'Hechizo Creado' : 'Custom Spell'}</span>
                </span>
              )}

              {getSpellDamageTypes(spell).map((dt) => {
                const dtInfo = DAMAGE_TYPES.find((d) => d.name.toLowerCase() === dt.toLowerCase());
                const DtIcon = dtInfo?.icon;
                return (
                  <span
                    key={dt}
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 shadow-xs ${
                      dtInfo
                        ? `${dtInfo.bgColor} ${dtInfo.textColor} ${dtInfo.borderColor}`
                        : 'bg-red-950/60 text-red-300 border-red-500/40'
                    }`}
                  >
                    {DtIcon && (
                      <div className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-[#090e12] ring-1 ring-white/10">
                        <DtIcon className="w-full h-full object-contain rounded-full" />
                      </div>
                    )}
                    {dt}
                  </span>
                );
              })}

              {primordialInfo && (
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${primordialInfo.bgColor} ${primordialInfo.borderColor} ${primordialInfo.textColor} flex items-center gap-1.5 shadow-xs`}
                  style={{
                    boxShadow: `0 0 10px ${primordialInfo.accentGlow || 'rgba(186,250,253,0.4)'}`,
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-[#090e12] ring-1 ring-white/20"
                    style={{
                      boxShadow: `0 0 6px ${primordialInfo.accentGlow || 'rgba(255,255,255,0.4)'}`,
                    }}
                  >
                    <PrimordialIcon className="w-full h-full object-contain rounded-full" />
                  </div>
                  <span>{primordial}</span>
                </span>
              )}

              {getSpellFunctionalities(spell).map((fnId) => {
                const fnInfo = SPELL_FUNCTIONALITIES.find((f) => f.id === fnId);
                if (!fnInfo) return null;
                const FnIcon = fnInfo.icon;
                return (
                  <span
                    key={fnId}
                    title={fnInfo.description}
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 shadow-xs ${fnInfo.bgColor} ${fnInfo.textColor} ${fnInfo.borderColor}`}
                  >
                    <div className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-[#090e12] ring-1 ring-white/10">
                      <FnIcon className="w-full h-full object-contain rounded-full" />
                    </div>
                    <span>{language === 'es' ? fnInfo.name : fnInfo.nameEn}</span>
                  </span>
                );
              })}

              {getSpellTargets(spell).map((tgtId) => {
                const opt = SPELL_TARGET_OPTIONS.find((o) => o.id === tgtId);
                if (!opt) return null;
                const OptIcon = opt.icon;
                return (
                  <span
                    key={tgtId}
                    title={language === 'es' ? opt.description : opt.descriptionEn}
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 shadow-xs ${opt.bgColor} ${opt.textColor} ${opt.borderColor}`}
                  >
                    <div className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-[#090e12] ring-1 ring-white/10">
                      <OptIcon className="w-full h-full object-contain rounded-full" />
                    </div>
                    <span>{language === 'es' ? opt.name : opt.nameEn}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Tactical Stat Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-[#111a21] border border-[#1b2b35] text-xs">
            <div>
              <p className="text-[11px] font-medium tracking-wide text-slate-400">Tiempo de casteo</p>
              <p className="font-semibold text-slate-100">{spell.castingTime}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-wide text-slate-400">Alcance</p>
              <p className="font-semibold text-slate-100">{spell.range}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-wide text-slate-400">Duración</p>
              <p className="font-semibold text-slate-100">{spell.duration}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-wide text-slate-400">Componentes</p>
              <p className="font-semibold text-slate-100 font-mono">
                {[
                  spell.components.verbal && 'V',
                  spell.components.somatic && 'S',
                  spell.components.material && 'M',
                ]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>

            {spell.components.material && spell.components.materialDescription && (
              <div className="col-span-2 sm:col-span-4 pt-2 border-t border-[#1b2b35]">
                <p className="text-[11px] text-slate-400">Material requerido:</p>
                <p className="text-xs text-slate-300 italic">{spell.components.materialDescription}</p>
              </div>
            )}
          </div>

          {/* Spell Description */}
          <div className="space-y-2.5">
            <h4 className="font-heading text-sm uppercase tracking-widest font-bold text-sky-400">
              Descripción del Hechizo
            </h4>
            <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-serif-body">
              <MarkdownText content={spell.description} />
            </div>
          </div>

          {/* Higher Levels Callout */}
          {spell.higherLevels && (
            <div className="p-3.5 rounded-xl bg-[#12212a] border border-cyan-500/30">
              <h5 className="font-heading text-xs uppercase tracking-widest font-bold text-cyan-300 mb-1.5">
                A Niveles Superiores
              </h5>
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif-body">
                <MarkdownText content={spell.higherLevels} />
              </div>
            </div>
          )}

          {/* D&D Classes */}
          {spell.classes && spell.classes.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-1.5 font-heading uppercase tracking-wider">
                Clases con acceso:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {spell.classes.map((cls) => (
                  <span
                    key={cls}
                    className="text-xs px-2.5 py-1 rounded-lg bg-[#14232c] text-slate-200 border border-[#213744]"
                  >
                    {cls}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions: Prepare, Spellbook, Copy, Print */}
        <div className="p-4 bg-[#0a0f13] border-t border-[#1b2a33] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {activeCharacter && onToggleKnown && (
              <button
                type="button"
                onClick={() => onToggleKnown(spell.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isKnown
                    ? 'bg-[#14282c] text-[#bafafd] border-[#bafafd]/60'
                    : 'bg-[#14232c] text-slate-200 border-[#213744] hover:border-slate-500'
                }`}
              >
                <BookMarked className="w-3.5 h-3.5 text-[#bafafd]" />
                <span>{isKnown ? 'En el Grimorio ✓' : 'Añadir al Grimorio'}</span>
              </button>
            )}

            {activeCharacter && onTogglePrepared && (
              <button
                type="button"
                onClick={() => onTogglePrepared(spell.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isPrepared
                    ? 'bg-[#14282c] text-[#bafafd] border-[#bafafd]/60 shadow-xs'
                    : 'bg-[#14232c] text-slate-200 border-[#213744] hover:border-slate-500'
                }`}
              >
                <span>{isPrepared ? 'Preparado ✓' : 'Preparar'}</span>
              </button>
            )}

            {activeCharacter && onToggleFavorite && (
              <button
                type="button"
                onClick={() => onToggleFavorite(spell.id)}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  isFavorite
                    ? 'bg-[#14282c] text-[#bafafd] border-[#bafafd]/50'
                    : 'bg-[#14232c] text-slate-400 border-[#213744] hover:text-[#bafafd]'
                }`}
                title="Favorito"
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-[#bafafd] text-[#bafafd]' : ''}`} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onAddToList && (
              <button
                type="button"
                onClick={() => onAddToList(spell)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#14282c] hover:bg-[#18363e] text-[#bafafd] border border-[#bafafd]/50 flex items-center gap-1.5 transition-colors cursor-pointer"
                title={language === 'es' ? 'Añadir este hechizo a una lista' : 'Add to spell list'}
              >
                <ScrollText className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Añadir a Lista' : 'Add to List'}</span>
              </button>
            )}

            {onEditSpell && (
              <button
                type="button"
                onClick={() => onEditSpell(spell)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#14282c] hover:bg-[#1a383e] text-[#bafafd] border border-[#bafafd]/50 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Editar este hechizo"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#14232c] hover:bg-[#1a2e3a] text-slate-200 border border-[#213744] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#bafafd]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>

            {onPrintSingle && (
              <button
                type="button"
                onClick={() => onPrintSingle(spell)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#14232c] hover:bg-[#1a2e3a] text-slate-200 border border-[#213744] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#bafafd]" />
                <span>Imprimir Tarjeta</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
