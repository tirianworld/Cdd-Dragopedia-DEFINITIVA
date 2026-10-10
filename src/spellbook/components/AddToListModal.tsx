import React, { useState } from 'react';
import { X, Check, Plus, BookmarkCheck } from 'lucide-react';
import { Spell, SpellList } from '../types';
import { SpellIcon } from './SpellIcon';

interface AddToListModalProps {
  spell: Spell | null;
  isOpen: boolean;
  onClose: () => void;
  lists: SpellList[];
  onToggleSpellInList: (listId: string, spellId: string) => void;
  onCreateNewList: () => void;
  language: 'es' | 'en';
}

export const AddToListModal: React.FC<AddToListModalProps> = ({
  spell,
  isOpen,
  onClose,
  lists,
  onToggleSpellInList,
  onCreateNewList,
  language,
}) => {
  if (!isOpen || !spell) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#0e161c] text-slate-100 rounded-2xl border border-[#1d2d38] shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#17232b] flex items-center justify-between bg-[#121c23]">
          <div className="flex items-center gap-3">
            <div className="shrink-0">
              <SpellIcon spell={spell} size="sm" />
            </div>
            <div>
              <h2 className="font-heading text-sm font-bold text-slate-100 uppercase tracking-wide truncate max-w-[220px]">
                {language === 'es' ? spell.name : spell.nameEn || spell.name}
              </h2>
              <p className="text-[11px] text-[#8a9ba8]">
                {language === 'es' ? 'Añadir a tus listas de conjuros' : 'Add to your spell lists'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#15232c] hover:bg-[#1a2e3a] text-slate-400 hover:text-white border border-[#213744] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lists Container */}
        <div className="p-5 overflow-y-auto space-y-2 max-h-[60vh]">
          {lists.length > 0 ? (
            lists.map((lst) => {
              const inList = lst.spellIds.includes(spell.id);
              const listColor = lst.color || '#bafafd';

              return (
                <div
                  key={lst.id}
                  onClick={() => onToggleSpellInList(lst.id, spell.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    inList
                      ? 'bg-[#14282c] border-[#bafafd]/60 shadow-xs'
                      : 'bg-[#121c23] hover:bg-[#15232b] border-[#1c2e39]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-base border shrink-0"
                      style={{
                        backgroundColor: `${listColor}15`,
                        borderColor: `${listColor}40`,
                      }}
                    >
                      {lst.icon || '📖'}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${inList ? 'text-[#bafafd]' : 'text-slate-200'}`}>
                        {lst.name}
                      </p>
                      <p className="text-[10px] text-[#8a9ba8]">
                        {lst.spellIds.length} {language === 'es' ? 'hechizos' : 'spells'}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                      inList
                        ? 'bg-[#bafafd] border-[#bafafd] text-slate-950'
                        : 'border-[#294251] bg-[#14222b]'
                    }`}
                  >
                    {inList && <Check className="w-3.5 h-3.5 stroke-3" />}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 px-3 bg-[#121c23] rounded-xl border border-[#1c2e39]">
              <BookmarkCheck className="w-8 h-8 text-[#8a9ba8] mx-auto mb-2 opacity-60" />
              <p className="text-xs text-slate-300 font-semibold mb-1">
                {language === 'es' ? 'Aún no tienes listas de hechizos' : 'You do not have any spell lists yet'}
              </p>
              <p className="text-[11px] text-[#8a9ba8]">
                {language === 'es'
                  ? 'Crea tu primera lista para organizar tus conjuros favoritos.'
                  : 'Create your first list to organize your favorite spells.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#17232b] bg-[#121c23] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onCreateNewList();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#15232c] hover:bg-[#1a2d39] text-[#bafafd] border border-[#233a49] text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#bafafd]" />
            <span>{language === 'es' ? 'Nueva Lista' : 'New List'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#14282c] hover:bg-[#19353e] text-[#bafafd] border border-[#bafafd]/50 cursor-pointer"
          >
            {language === 'es' ? 'Listo' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
