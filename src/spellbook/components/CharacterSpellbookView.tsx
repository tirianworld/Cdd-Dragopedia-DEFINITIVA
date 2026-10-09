import React, { useState } from 'react';
import { User, Sparkles, Plus, Trash2, Moon, Sun, Wand2, Star, BookMarked, CheckCircle2 } from 'lucide-react';
import { Character, DndClass } from '../types';
import { ALL_CLASSES } from '../data/spells';

interface CharacterSpellbookViewProps {
  characters: Character[];
  activeCharacter: Character | null;
  onSelectCharacter: (id: string) => void;
  onCreateCharacter: (char: Omit<Character, 'id'>) => void;
  onDeleteCharacter: (id: string) => void;
  onToggleSlot: (level: number, slotIndex: number) => void;
  onLongRest: () => void;
  onShortRest: () => void;
  onGoToSpellbook: () => void;
  language: 'es' | 'en';
}

export const CharacterSpellbookView: React.FC<CharacterSpellbookViewProps> = ({
  characters,
  activeCharacter,
  onSelectCharacter,
  onCreateCharacter,
  onDeleteCharacter,
  onToggleSlot,
  onLongRest,
  onShortRest,
  onGoToSpellbook,
  language,
}) => {
  const [showNewCharForm, setShowNewCharForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newClass, setNewClass] = useState<DndClass>('Mago');
  const [newLevel, setNewLevel] = useState<number>(3);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const getSlotsForLevel = (lvl: number) => {
      const slots: Record<number, { max: number; used: number }> = {
        1: { max: lvl >= 1 ? (lvl === 1 ? 2 : lvl === 2 ? 3 : 4) : 0, used: 0 },
        2: { max: lvl >= 3 ? (lvl === 3 ? 2 : 3) : 0, used: 0 },
        3: { max: lvl >= 5 ? (lvl === 5 ? 2 : 3) : 0, used: 0 },
        4: { max: lvl >= 7 ? (lvl === 7 ? 1 : lvl === 8 ? 2 : 3) : 0, used: 0 },
        5: { max: lvl >= 9 ? (lvl === 9 ? 1 : 2) : 0, used: 0 },
        6: { max: lvl >= 11 ? (lvl >= 19 ? 2 : 1) : 0, used: 0 },
        7: { max: lvl >= 13 ? (lvl >= 20 ? 2 : 1) : 0, used: 0 },
        8: { max: lvl >= 15 ? 1 : 0, used: 0 },
        9: { max: lvl >= 17 ? 1 : 0, used: 0 },
      };
      return slots;
    };

    onCreateCharacter({
      name: newName.trim(),
      class: newClass,
      level: newLevel,
      spellcastingAbility:
        newClass === 'Clérigo' || newClass === 'Druida' || newClass === 'Explorador'
          ? 'WIS'
          : newClass === 'Bardo' ||
            newClass === 'Brujo' ||
            newClass === 'Hechicero' ||
            newClass === 'Paladín'
          ? 'CHA'
          : 'INT',
      spellSlots: getSlotsForLevel(newLevel),
      knownSpellIds: [],
      preparedSpellIds: [],
      favoriteSpellIds: [],
    });

    setNewName('');
    setShowNewCharForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Character Selection & New Character button (Dragopedia Style) */}
      <div className="bg-[#10181e] rounded-2xl border border-[#1b2a33] p-5 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#14282c] border border-[#bafafd]/40 flex items-center justify-center text-[#bafafd] shadow-sm">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-wider text-slate-100">
                {activeCharacter ? activeCharacter.name : (language === 'es' ? 'Gestor de Magia' : 'Magic Manager')}
              </h2>
              {activeCharacter && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-[#bafafd]/60 text-[#bafafd] bg-[#14282c]">
                  {activeCharacter.class} Nivel {activeCharacter.level}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeCharacter
                ? `Habilidad de conjuro: ${activeCharacter.spellcastingAbility || 'INT'} • ${activeCharacter.preparedSpellIds.length} preparados hoy`
                : (language === 'es' ? 'Crea o selecciona un personaje para rastrear ranuras' : 'Create or select a character to track slots')}
            </p>
          </div>
        </div>

        {/* Action Buttons: Switch Character, Long Rest, Short Rest */}
        <div className="flex flex-wrap items-center gap-2">
          {activeCharacter && (
            <>
              <button
                type="button"
                onClick={onLongRest}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#14282c] hover:bg-[#18363e] text-[#bafafd] border border-[#bafafd]/40 transition-colors shadow-sm cursor-pointer"
              >
                <Sun className="w-4 h-4 text-[#bafafd]" />
                <span>{language === 'es' ? 'Descanso Largo (Recuperar todo)' : 'Long Rest (Recover all)'}</span>
              </button>

              <button
                type="button"
                onClick={onShortRest}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#14282c] hover:bg-[#18363e] text-[#bafafd] border border-[#bafafd]/40 transition-colors shadow-sm cursor-pointer"
              >
                <Moon className="w-4 h-4 text-[#bafafd]" />
                <span>{language === 'es' ? 'Descanso Corto' : 'Short Rest'}</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setShowNewCharForm(!showNewCharForm)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#bafafd] hover:bg-[#c7fbfe] text-slate-950 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'es' ? 'Nuevo Personaje' : 'New Character'}</span>
          </button>
        </div>
      </div>

      {/* New Character Modal/Card */}
      {showNewCharForm && (
        <form
          onSubmit={handleCreate}
          className="bg-[#10181e] border border-[#bafafd]/40 rounded-2xl p-5 shadow-2xl space-y-4"
        >
          <h3 className="font-heading text-base font-bold text-[#bafafd] uppercase tracking-wide">
            {language === 'es' ? 'Crear Nuevo Personaje de D&D' : 'Create New D&D Character'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="char-name-input" className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'es' ? 'Nombre del personaje:' : 'Character name:'}
              </label>
              <input
                id="char-name-input"
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="ej: Mordenkainen, Elara..."
                className="w-full bg-[#14222a] text-slate-100 text-xs rounded-lg px-3 py-2 border border-[#213540] focus:outline-none focus:border-[#bafafd]/70"
              />
            </div>

            <div>
              <label htmlFor="char-class-select" className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'es' ? 'Clase de lanzador:' : 'Spellcaster class:'}
              </label>
              <select
                id="char-class-select"
                aria-label="Clase de lanzador"
                value={newClass}
                onChange={(e) => setNewClass(e.target.value as DndClass)}
                className="w-full bg-[#14222a] text-slate-100 text-xs rounded-lg px-3 py-2 border border-[#213540] focus:outline-none focus:border-[#bafafd]/70 cursor-pointer"
              >
                {ALL_CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="char-level-input" className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'es' ? 'Nivel (1 a 20):' : 'Level (1 to 20):'}
              </label>
              <input
                id="char-level-input"
                type="number"
                min={1}
                max={20}
                value={newLevel}
                onChange={(e) => setNewLevel(Math.max(1, Math.min(20, Number(e.target.value))))}
                className="w-full bg-[#14222a] text-slate-100 text-xs rounded-lg px-3 py-2 border border-[#213540] focus:outline-none focus:border-[#bafafd]/70"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowNewCharForm(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              {language === 'es' ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#bafafd] hover:bg-[#c7fbfe] text-slate-950 shadow-xs cursor-pointer"
            >
              {language === 'es' ? 'Guardar Personaje' : 'Save Character'}
            </button>
          </div>
        </form>
      )}

      {/* Active Character Spell Slots Tracker (Diario del Cazador / Ranuras) */}
      {activeCharacter && (
        <div className="bg-[#10181e] rounded-2xl border border-[#1b2a33] p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#1b2a33] pb-3">
            <div>
              <h3 className="font-heading text-base font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#bafafd]" />
                {language === 'es' ? 'Rastreador de Ranuras de Conjuro' : 'Spell Slots Tracker'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'es'
                  ? 'Haz clic en una ranura para marcarla como gastada o recuperarla.'
                  : 'Click on a slot to toggle between available and used.'}
              </p>
            </div>

            <button
              type="button"
              onClick={onGoToSpellbook}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#14282c] text-[#bafafd] border border-[#bafafd]/40 hover:bg-[#18363e] transition-colors cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Ver Hechizos Preparados' : 'View Prepared Spells'}</span>
            </button>
          </div>

          {/* Slots Grid: Level 1 to Level 9 with glowing neon ice blue mana pips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => {
              const slot = activeCharacter.spellSlots[lvl] || { max: 0, used: 0 };
              const available = Math.max(0, slot.max - slot.used);

              return (
                <div
                  key={lvl}
                  className={`p-3.5 rounded-xl border transition-all ${
                    slot.max > 0
                      ? 'bg-[#14222a] border-[#213540] shadow-xs'
                      : 'bg-[#0e161c] border-[#18262e] opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-200">
                      {language === 'es' ? `Nivel ${lvl}` : `Level ${lvl}`}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 font-mono">
                      {available} / {slot.max} {language === 'es' ? 'disponibles' : 'available'}
                    </span>
                  </div>

                  {slot.max > 0 ? (
                    <div className="flex items-center gap-2">
                      {Array.from({ length: slot.max }).map((_, index) => {
                        const isUsed = index >= available;
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => onToggleSlot(lvl, index)}
                            title={isUsed ? 'Ranura gastada (Clic para recuperar)' : 'Ranura disponible (Clic para gastar)'}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-transform transform active:scale-95 border cursor-pointer ${
                              !isUsed
                                ? 'bg-[#bafafd]/20 text-[#bafafd] border-[#bafafd] shadow-[0_0_8px_rgba(186,250,253,0.35)]'
                                : 'bg-[#0c1317] text-slate-600 border-[#19252d]'
                            }`}
                          >
                            {!isUsed ? '✦' : '—'}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">
                      {language === 'es' ? 'Sin ranuras a este nivel' : 'No slots at this level'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary Cards: Known, Prepared, Favorites */}
      {activeCharacter && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#10181e] rounded-xl border border-[#1b2a33] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#14282c] text-[#bafafd] border border-[#bafafd]/40 flex items-center justify-center">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-100 font-mono">
                {activeCharacter.knownSpellIds.length}
              </div>
              <div className="text-xs text-slate-400">
                {language === 'es' ? 'Conjuros en el grimorio' : 'Spells in spellbook'}
              </div>
            </div>
          </div>

          <div className="bg-[#10181e] rounded-xl border border-[#1b2a33] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#14282c] text-[#bafafd] border border-[#bafafd]/40 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-100 font-mono">
                {activeCharacter.preparedSpellIds.length}
              </div>
              <div className="text-xs text-slate-400">
                {language === 'es' ? 'Conjuros preparados hoy' : 'Prepared spells today'}
              </div>
            </div>
          </div>

          <div className="bg-[#10181e] rounded-xl border border-[#1b2a33] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#14282c] text-[#bafafd] border border-[#bafafd]/40 flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-100 font-mono">
                {activeCharacter.favoriteSpellIds.length}
              </div>
              <div className="text-xs text-slate-400">
                {language === 'es' ? 'Conjuros favoritos' : 'Favorite spells'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Character List Management */}
      <div className="bg-[#10181e] rounded-2xl border border-[#1b2a33] p-5 shadow-sm space-y-3">
        <h3 className="font-heading text-base font-bold uppercase tracking-wide text-slate-100">
          {language === 'es' ? 'Tus Personajes Guardados' : 'Your Saved Characters'}
        </h3>
        <div className="divide-y divide-[#18262e]">
          {characters.map((c) => {
            const isSelected = activeCharacter?.id === c.id;
            return (
              <div
                key={c.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-[#14222a] px-2 rounded-lg transition-colors"
              >
                <div
                  className="cursor-pointer flex-1"
                  onClick={() => onSelectCharacter(c.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-100 text-sm">{c.name}</span>
                    {isSelected && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-sky-500/60 text-sky-400 bg-sky-950/40">
                        {language === 'es' ? 'Activo' : 'Active'}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">
                    {c.class} • {language === 'es' ? 'Nivel' : 'Level'} {c.level} • {c.knownSpellIds.length} {language === 'es' ? 'hechizos' : 'spells'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectCharacter(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-sky-600 text-white'
                        : 'bg-[#14232c] text-slate-300 hover:text-white border border-[#213744]'
                    }`}
                  >
                    {isSelected
                      ? language === 'es'
                        ? 'Seleccionado'
                        : 'Selected'
                      : language === 'es'
                      ? 'Seleccionar'
                      : 'Select'}
                  </button>

                  {characters.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteCharacter(c.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title={language === 'es' ? 'Eliminar personaje' : 'Delete character'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
