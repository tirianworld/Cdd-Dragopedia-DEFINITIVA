import React, { useState } from 'react';
import {
  Plus,
  Share2,
  Edit2,
  Trash2,
  Globe,
  Sparkles,
  ArrowLeft,
  Search,
  Check,
  BookOpen,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { Spell, SpellList, Character } from '../types';
import { SpellGrid } from './SpellGrid';
import { SpellIcon } from './SpellIcon';
import { generateShareUrl } from '../services/spellListService';

interface SpellListsViewProps {
  lists: SpellList[];
  spells: Spell[];
  activeCharacter: Character | null;
  language: 'es' | 'en';
  onCreateNewList: () => void;
  onEditList: (list: SpellList) => void;
  onDeleteList: (listId: string) => void;
  onPublishList: (list: SpellList) => void;
  onRemoveSpellFromList: (listId: string, spellId: string) => void;
  onAddSpellToList: (listId: string, spellId: string) => void;
  onOpenSpellDetails: (spell: Spell) => void;
  onGoToPublicGallery: () => void;
  selectedListId?: string | null;
  onSelectActiveList?: (listId: string | null) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'warn') => void;
}

export const SpellListsView: React.FC<SpellListsViewProps> = ({
  lists,
  spells,
  activeCharacter,
  language,
  onCreateNewList,
  onEditList,
  onDeleteList,
  onPublishList,
  onRemoveSpellFromList,
  onAddSpellToList,
  onOpenSpellDetails,
  onGoToPublicGallery,
  selectedListId: propSelectedListId,
  onSelectActiveList,
  onShowToast,
}) => {
  const [internalSelectedListId, setInternalSelectedListId] = useState<string | null>(null);
  const activeListId = propSelectedListId !== undefined ? propSelectedListId : internalSelectedListId;

  const setActiveListId = (id: string | null) => {
    if (onSelectActiveList) {
      onSelectActiveList(id);
    } else {
      setInternalSelectedListId(id);
    }
  };

  const [spellSearchQuery, setSpellSearchQuery] = useState('');
  const [isAddSpellPickerOpen, setIsAddSpellPickerOpen] = useState(false);

  const activeList = lists.find((l) => l.id === activeListId);

  // Spells in the active list
  const activeListSpells = React.useMemo(() => {
    if (!activeList) return [];
    const set = new Set(activeList.spellIds);
    return spells.filter((s) => set.has(s.id));
  }, [activeList, spells]);

  // Available spells to add to active list
  const availableSpellsToAdd = React.useMemo(() => {
    if (!activeList) return [];
    const set = new Set(activeList.spellIds);
    const q = spellSearchQuery.trim().toLowerCase();
    return spells
      .filter((s) => !set.has(s.id))
      .filter((s) => {
        if (!q) return true;
        return (
          s.name.toLowerCase().includes(q) ||
          (s.nameEn && s.nameEn.toLowerCase().includes(q)) ||
          s.school.toLowerCase().includes(q) ||
          s.classes.some((c) => c.toLowerCase().includes(q))
        );
      })
      .slice(0, 15);
  }, [activeList, spells, spellSearchQuery]);

  const handleShare = (list: SpellList, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const url = generateShareUrl(list);
    navigator.clipboard.writeText(url);
    onShowToast(
      language === 'es'
        ? `¡Enlace de "${list.name}" copiado al portapapeles!`
        : `Share link for "${list.name}" copied to clipboard!`,
      'success'
    );
  };

  // If a specific list is selected, show its spells & management
  if (activeList) {
    const listColor = activeList.color || '#bafafd';

    return (
      <div className="space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0e161c] border border-[#1b2a33] shadow-xs">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              onClick={() => setActiveListId(null)}
              className="p-2 rounded-xl bg-[#14232c] hover:bg-[#1a2e3a] text-slate-400 hover:text-white border border-[#213744] transition-colors cursor-pointer shrink-0"
              title="Volver"
            >
              <ArrowLeft className="w-5 h-5 text-[#bafafd]" />
            </button>

            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border shrink-0 shadow-xs"
              style={{
                backgroundColor: `${listColor}18`,
                borderColor: `${listColor}60`,
                color: listColor,
              }}
            >
              {activeList.icon || '📖'}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-100 uppercase tracking-wide truncate">
                  {activeList.name}
                </h2>
                {activeList.isPublic && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#14282c] text-[#bafafd] border border-[#bafafd]/40 font-mono font-semibold">
                    {language === 'es' ? 'Pública en Galería' : 'Public'}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8a9ba8] mt-0.5 truncate max-w-xl">
                {activeList.description || (language === 'es' ? 'Sin descripción' : 'No description')}
                {activeList.author && ` • Por ${activeList.author}`}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setIsAddSpellPickerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#14282c] hover:bg-[#18363e] text-[#bafafd] border border-[#bafafd]/50 hover:border-[#bafafd] transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#bafafd]" />
              <span>{language === 'es' ? 'Añadir Hechizos' : 'Add Spells'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleShare(activeList)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#121c23] hover:bg-[#16242d] text-slate-200 border border-[#213744] transition-colors cursor-pointer"
              title="Copiar enlace para compartir"
            >
              <Share2 className="w-3.5 h-3.5 text-[#bafafd]" />
              <span className="hidden sm:inline">{language === 'es' ? 'Compartir' : 'Share'}</span>
            </button>

            <button
              type="button"
              onClick={() => onEditList(activeList)}
              className="p-2 rounded-xl bg-[#121c23] hover:bg-[#16242d] text-slate-300 hover:text-white border border-[#213744] transition-colors cursor-pointer"
              title="Editar nombre, icono y detalles"
            >
              <Edit2 className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>

        {/* Modal / Dropdown to quickly add spells to this list */}
        {isAddSpellPickerOpen && (
          <div className="p-4 rounded-2xl bg-[#121c23] border border-[#1f323f] shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#bafafd] font-heading flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>{language === 'es' ? 'Buscar y Añadir Hechizo a la Lista' : 'Search & Add Spell'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsAddSpellPickerOpen(false)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                {language === 'es' ? 'Cerrar' : 'Close'}
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={spellSearchQuery}
                onChange={(e) => setSpellSearchQuery(e.target.value)}
                placeholder={language === 'es' ? 'Escribe el nombre del hechizo (ej. Bola de Fuego, Escudo...)' : 'Type spell name...'}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#0e161c] border border-[#233845] focus:border-[#bafafd] focus:outline-none text-slate-100 placeholder:text-slate-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-56 overflow-y-auto pt-1">
              {availableSpellsToAdd.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#14232c] border border-[#1e3442] hover:border-[#bafafd]/50 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <SpellIcon spell={s} size="sm" />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-100 truncate">{language === 'es' ? s.name : s.nameEn || s.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {s.level === 0 ? 'Truco' : `Nivel ${s.level}`} • {s.school}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onAddSpellToList(activeList.id, s.id);
                      onShowToast(language === 'es' ? `Añadido "${s.name}" a la lista` : `Added "${s.name}"`, 'success');
                    }}
                    className="p-1 rounded-lg bg-[#14282c] text-[#bafafd] border border-[#bafafd]/40 hover:bg-[#18363e] cursor-pointer"
                    title="Añadir a esta lista"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {availableSpellsToAdd.length === 0 && (
                <p className="col-span-full text-center py-4 text-xs text-slate-400">
                  {language === 'es' ? 'No se encontraron hechizos nuevos con ese término.' : 'No new spells found.'}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Spells in this list */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-heading text-sm sm:text-base font-bold tracking-widest text-slate-100 uppercase">
              {language === 'es' ? 'HECHIZOS DE ESTA COLECCIÓN' : 'SPELLS IN THIS COLLECTION'}
            </h3>
            <span className="text-xs text-[#bafafd] font-mono">
              {activeListSpells.length} {language === 'es' ? 'hechizos guardados' : 'saved spells'}
            </span>
          </div>

          {activeListSpells.length > 0 ? (
            <SpellGrid
              spells={activeListSpells}
              language={language}
              activeCharacter={activeCharacter}
              onOpenDetails={onOpenSpellDetails}
              groupBy="level"
            />
          ) : (
            <div className="text-center py-16 px-4 bg-[#10181e] rounded-2xl border border-[#1b2a33] space-y-3">
              <BookOpen className="w-12 h-12 text-slate-500 mx-auto opacity-60" />
              <h3 className="font-heading text-lg font-bold text-slate-200 uppercase tracking-wide">
                {language === 'es' ? 'Tu lista está vacía' : 'Your list is empty'}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {language === 'es'
                  ? 'Añade conjuros a esta lista usando el botón superior "Añadir Hechizos" o mientras exploras el catálogo.'
                  : 'Add spells to this list using the "Add Spells" button above or while browsing the catalog.'}
              </p>
              <button
                type="button"
                onClick={() => setIsAddSpellPickerOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#14282c] hover:bg-[#18363e] text-[#bafafd] border border-[#bafafd]/50 transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'es' ? 'Añadir Hechizos Ahora' : 'Add Spells Now'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Otherwise, render all lists overview
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-[#1b2a33] bg-[#0e161c] p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#14282c] border border-[#bafafd]/40 flex items-center justify-center text-2xl text-[#bafafd] shadow-xs">
            📜
          </div>
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <span>{language === 'es' ? 'Listas de Hechizos' : 'Spell Lists'}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#14282c] text-[#bafafd] border border-[#bafafd]/30">
                {lists.length}
              </span>
            </h2>
            <p className="text-xs text-[#8a9ba8] mt-0.5 max-w-xl">
              {language === 'es'
                ? 'Crea listas temáticas, personaliza su nombre e icono, y compártelas con cualquier jugador mediante enlace o publícalas en la galería.'
                : 'Create thematic lists, customize their name and icon, and share them via link or publish to the public gallery.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={onGoToPublicGallery}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#121c23] hover:bg-[#16242d] text-slate-200 border border-[#213744] hover:border-[#bafafd]/40 transition-all cursor-pointer"
          >
            <Globe className="w-4 h-4 text-[#bafafd]" />
            <span>{language === 'es' ? 'Galería Pública' : 'Public Gallery'}</span>
          </button>

          <button
            type="button"
            onClick={onCreateNewList}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#14282c] hover:bg-[#18363e] text-[#bafafd] border border-[#bafafd]/50 hover:border-[#bafafd] transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#bafafd]" />
            <span>{language === 'es' ? 'Nueva Lista' : 'New List'}</span>
          </button>
        </div>
      </div>

      {/* Empty State or Grid of lists */}
      {lists.length === 0 ? (
        <div className="text-center py-20 px-4 bg-[#0e161c] rounded-2xl border border-[#1b2a33] space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#14282c] border border-[#bafafd]/30 flex items-center justify-center text-3xl shadow-xs">
            📜
          </div>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-100 uppercase tracking-wide">
            {language === 'es' ? 'No tienes listas de hechizos creadas todavía' : 'No spell lists created yet'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            {language === 'es'
              ? 'Crea tu primera lista personalizada para organizar tus hechizos por campaña, temática o estrategia. Elige su nombre, icono y color, y compártela mediante un enlace único.'
              : 'Create your first custom list to organize spells by campaign or theme. Pick a name, icon, and color, and share it with a link.'}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onCreateNewList}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#14282c] hover:bg-[#18363e] text-[#bafafd] border border-[#bafafd]/50 hover:border-[#bafafd] transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#bafafd]" />
              <span>{language === 'es' ? '+ Crear Mi Primera Lista' : '+ Create My First List'}</span>
            </button>
            <button
              type="button"
              onClick={onGoToPublicGallery}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#121c23] hover:bg-[#16242d] text-slate-300 border border-[#213744] hover:border-[#bafafd]/40 transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#bafafd]" />
              <span>{language === 'es' ? 'Explorar Galería Pública' : 'Explore Public Gallery'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((lst) => {
            const listColor = lst.color || '#bafafd';
            // Find spell objects to display mini previews
            const previewSpells = lst.spellIds
              .map((id) => spells.find((s) => s.id === id))
              .filter(Boolean) as Spell[];

            return (
              <div
                key={lst.id}
                onClick={() => setActiveListId(lst.id)}
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-[#10181e] hover:bg-[#142129] border border-[#192731] hover:border-[#bafafd]/50 transition-all cursor-pointer shadow-xs space-y-4"
              >
                {/* Header card info */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl border shadow-xs transition-transform group-hover:scale-105"
                        style={{
                          backgroundColor: `${listColor}15`,
                          borderColor: `${listColor}50`,
                          color: listColor,
                        }}
                      >
                        {lst.icon || '📖'}
                      </div>

                      <div>
                        <h3 className="font-heading text-sm font-bold text-slate-100 group-hover:text-[#bafafd] transition-colors line-clamp-1">
                          {lst.name}
                        </h3>
                        <p className="text-[11px] text-[#8a9ba8]">
                          {lst.spellIds.length} {language === 'es' ? 'conjuros' : 'spells'}
                          {lst.author && ` • ${lst.author}`}
                        </p>
                      </div>
                    </div>

                    {lst.isPublic && (
                      <span
                        title="Visible en la Galería Pública"
                        className="p-1 rounded-md bg-[#14282c] border border-[#bafafd]/30 text-[#bafafd]"
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {lst.description && (
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed opacity-90">
                      {lst.description}
                    </p>
                  )}
                </div>

                {/* Spell Mini Preview Icons */}
                {previewSpells.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-hidden py-1 border-t border-[#18262f]/80">
                    {previewSpells.slice(0, 6).map((sp) => (
                      <div key={sp.id} title={language === 'es' ? sp.name : sp.nameEn} className="shrink-0">
                        <SpellIcon spell={sp} size="sm" />
                      </div>
                    ))}
                    {previewSpells.length > 6 && (
                      <span className="text-[10px] text-slate-400 font-mono pl-1">
                        +{previewSpells.length - 6}
                      </span>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div
                  className="flex items-center justify-between pt-2 border-t border-[#192731] text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleShare(lst, e)}
                      className="p-1.5 rounded-lg bg-[#14222b] hover:bg-[#1a2e3b] text-slate-300 hover:text-[#bafafd] border border-[#203644] transition-colors cursor-pointer"
                      title={language === 'es' ? 'Compartir enlace' : 'Share link'}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    {!lst.isPublic && (
                      <button
                        type="button"
                        onClick={() => onPublishList(lst)}
                        className="p-1.5 rounded-lg bg-[#14222b] hover:bg-[#1a2e3b] text-slate-300 hover:text-[#bafafd] border border-[#203644] transition-colors cursor-pointer"
                        title={language === 'es' ? 'Publicar en la Galería Pública' : 'Publish to gallery'}
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onEditList(lst)}
                      className="p-1.5 rounded-lg bg-[#14222b] hover:bg-[#1a2e3b] text-slate-300 hover:text-white border border-[#203644] transition-colors cursor-pointer"
                      title={language === 'es' ? 'Editar nombre e icono' : 'Edit name & icon'}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(language === 'es' ? `¿Eliminar "${lst.name}"?` : `Delete "${lst.name}"?`)) {
                          onDeleteList(lst.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-[#14222b] hover:bg-rose-950/50 text-slate-400 hover:text-rose-300 border border-[#203644] transition-colors cursor-pointer"
                      title={language === 'es' ? 'Eliminar lista' : 'Delete list'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveListId(lst.id)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#14282c] text-[#bafafd] border border-[#bafafd]/30 group-hover:border-[#bafafd]/60 transition-colors"
                  >
                    {language === 'es' ? 'Abrir' : 'Open'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
