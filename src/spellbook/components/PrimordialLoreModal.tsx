import React from 'react';
import { X, Sparkles, BookOpen, Shield, Dna, Flame, TreePine, HeartHandshake, Eye, Skull } from 'lucide-react';
import { PrimordialMagicInfo } from '../data/primordialMagic';
import { MarkdownText } from './MarkdownText';

interface PrimordialLoreModalProps {
  primordial: PrimordialMagicInfo | null;
  onClose: () => void;
  language: 'es' | 'en';
  onFilterByThisMagic?: (name: string) => void;
}

export const PrimordialLoreModal: React.FC<PrimordialLoreModalProps> = ({
  primordial,
  onClose,
  language,
  onFilterByThisMagic,
}) => {
  if (!primordial) return null;

  const IconComp = primordial.icon;
  const isSecondGen = primordial.generation === 2;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-[#0c141a] text-slate-100 rounded-2xl border shadow-2xl flex flex-col my-auto max-h-[92vh] overflow-hidden"
        style={{
          borderColor: `${primordial.color}60`,
          boxShadow: `0 0 35px ${primordial.color}25, 0 20px 40px rgba(0,0,0,0.8)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header with glowing ambient banner */}
        <div
          className="relative px-6 py-5 border-b flex items-start justify-between gap-4 overflow-hidden"
          style={{
            borderColor: `${primordial.color}35`,
            background: `radial-gradient(circle at top left, ${primordial.color}25 0%, rgba(12,20,26,0.95) 75%)`,
          }}
        >
          <div className="flex items-center gap-4 min-w-0">
            {/* Glowing Icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border p-2 bg-[#090e12] ring-2"
              style={{
                borderColor: primordial.color,
                boxShadow: `0 0 20px ${primordial.accentGlow}`,
              }}
            >
              <IconComp className="w-full h-full object-contain" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: `${primordial.color}20`,
                    borderColor: `${primordial.color}60`,
                    color: primordial.color,
                  }}
                >
                  {primordial.generationLabel || (isSecondGen ? '2ª Generación (Fusión)' : '1ª Generación (Primordial Pura)')}
                </span>

                {isSecondGen && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-950/70 text-amber-300 border border-amber-500/40">
                    Fusión: Divina + Natural
                  </span>
                )}
              </div>

              <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-wide text-slate-100 mt-1">
                {language === 'es' ? primordial.name : primordial.nameEn}
              </h2>
              <p className="text-xs text-slate-400 italic truncate max-w-lg">
                {primordial.source}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#14232c] hover:bg-[#1a2e3a] text-slate-400 hover:text-white border border-[#213744] transition-colors cursor-pointer shrink-0"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Lore Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-sm text-slate-200 leading-relaxed font-serif-body">
          {/* Quick Domain Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#101920] border border-[#1b2b35] text-xs font-sans">
            <div>
              <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Dominio y Esencia:</p>
              <p className="text-slate-200 mt-0.5">{primordial.domain}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Efecto en la Adamantita:</p>
              <p className="text-slate-200 mt-0.5">{primordial.adamantiteEffect}</p>
            </div>
          </div>

          {/* Structured Presentation (Consistent high-fidelity cards for 1ª Gen and 2ª Gen Magia Áurea) */}
          <div className="space-y-4">
            {primordial.cosmicOrigin && (
              <div className="space-y-2">
                <h3 className="font-heading text-base font-bold uppercase tracking-wider" style={{ color: primordial.color }}>
                  Origen Cósmico & Naturaleza
                </h3>
                <p className="text-slate-200 leading-relaxed">{primordial.cosmicOrigin}</p>
              </div>
            )}

            {primordial.properties && (
              <div className="space-y-2 pt-2 border-t border-[#1b2b35]">
                <h3 className="font-heading text-base font-bold uppercase tracking-wider text-slate-200">
                  {isSecondGen ? 'Características Principales & Propiedades' : 'Propiedades Fundamentales'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                  <div className="p-2.5 rounded-lg bg-[#0e161c] border border-[#1c2c36]">
                    <span className="font-bold text-amber-300 block mb-1">
                      {isSecondGen ? 'Curación:' : 'Indomable:'}
                    </span>
                    <span className="text-slate-300">{primordial.properties.indomable}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0e161c] border border-[#1c2c36]">
                    <span className="font-bold text-emerald-300 block mb-1">
                      {isSecondGen ? 'Regeneración:' : 'Transformable:'}
                    </span>
                    <span className="text-slate-300">{primordial.properties.transformable}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0e161c] border border-[#1c2c36]">
                    <span className="font-bold text-cyan-300 block mb-1">
                      {isSecondGen ? 'Resurrección:' : 'Inestable:'}
                    </span>
                    <span className="text-slate-300">{primordial.properties.inestable}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0e161c] border border-[#1c2c36]">
                    <span className="font-bold text-purple-300 block mb-1">
                      {isSecondGen ? 'Creación de Leyendas:' : 'Eterna:'}
                    </span>
                    <span className="text-slate-300">{primordial.properties.eterna}</span>
                  </div>
                </div>
              </div>
            )}

            {primordial.treeOfAvalonRelation && (
              <div className="space-y-2 pt-2 border-t border-[#1b2b35]">
                <h3 className="font-heading text-base font-bold uppercase tracking-wider text-amber-300">
                  Relación con el Árbol Áureo (Ávalon)
                </h3>
                <div className="p-3.5 rounded-xl bg-[#14232c]/80 border border-amber-500/30 text-xs font-sans space-y-2 text-slate-200">
                  <p>{primordial.treeOfAvalonRelation}</p>
                </div>
              </div>
            )}

            {primordial.masters && primordial.masters.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#1b2b35]">
                <h3 className="font-heading text-base font-bold uppercase tracking-wider" style={{ color: primordial.color }}>
                  {primordial.mastersTitle || 'Poderes y Manifestaciones'}
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs font-sans text-slate-300">
                  {primordial.masters.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>
            )}

            {primordial.dangers && primordial.dangers.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#1b2b35]">
                <h3 className="font-heading text-base font-bold uppercase tracking-wider text-rose-400">
                  Leyes Kármicas, Peligros & Limitaciones
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs font-sans text-rose-200/80">
                  {primordial.dangers.map((d, idx) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
              </div>
            )}

            {(primordial.loreImportance || primordial.curiosities || primordial.realmNotes) && (
              <div className="p-3.5 rounded-xl bg-[#14232c]/70 border border-[#213744] text-xs font-sans space-y-2">
                {primordial.loreImportance && (
                  <div>
                    <span className="font-bold text-[#bafafd] uppercase tracking-wider text-[10px] block mb-1">
                      Importancia en el Lore de Ávalon:
                    </span>
                    <p className="text-slate-300">{primordial.loreImportance}</p>
                  </div>
                )}
                {primordial.curiosities && (
                  <div className="pt-2 border-t border-[#1d323f]">
                    <span className="font-bold text-amber-300 uppercase tracking-wider text-[10px] block mb-1">
                      Curiosidades & Fusión Primordial:
                    </span>
                    <p className="text-slate-300">{primordial.curiosities}</p>
                  </div>
                )}
                {!primordial.loreImportance && !primordial.curiosities && primordial.realmNotes && (
                  <div>
                    <span className="font-bold text-[#bafafd] uppercase tracking-wider text-[10px] block mb-1">
                      Nota de los Reinos & Lore:
                    </span>
                    <p className="text-slate-300">{primordial.realmNotes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#090e12] border-t border-[#1b2a33] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-sans">
              Compendio Oficial Dracopedia • Caldo de Dragón
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onFilterByThisMagic && (
              <button
                type="button"
                onClick={() => {
                  onFilterByThisMagic(primordial.name);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-[#14282c] hover:bg-[#1a383e] text-[#bafafd] border border-[#bafafd]/50 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-2 shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-[#bafafd]" />
                <span>Ver Hechizos de {primordial.name}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#14232c] hover:bg-[#1c303c] text-slate-300 text-xs font-medium border border-[#213744] cursor-pointer transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
