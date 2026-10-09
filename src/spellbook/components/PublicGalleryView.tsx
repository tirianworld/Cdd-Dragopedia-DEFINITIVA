import React, { useState } from 'react';
import {
  Globe,
  Search,
  Heart,
  Share2,
  Download,
  BookOpen,
  Sparkles,
  ArrowLeft,
  Plus,
  Flame,
  Check,
} from 'lucide-react';
import { Spell, SpellList, Character } from '../types';
import { SpellGrid } from './SpellGrid';
import { SpellIcon } from './SpellIcon';
import { generateShareUrl } from '../services/spellListService';

interface PublicGalleryViewProps {
  publicLists: SpellList[];
  spells: Spell[];
  activeCharacter: Character | null;
  language: 'es' | 'en';
  onCloneList: (list: SpellList) => void;
  onLikeList: (listId: string) => void;
  onOpenSpellDetails: (spell: Spell) => void;
  onOpenCreateModal: () => void;
  userLists: SpellList[];
  onPublishUserList: (list: SpellList) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'warn') => void;
}

export const PublicGalleryView: React.FC<PublicGalleryViewProps> = ({
  publicLists,
  spells,
  activeCharacter,
  language,
  onCloneList,
  onLikeList,
  onOpenSpellDetails,
  onOpenCreateModal,
  userLists,
  onPublishUserList,
  onShowToast,
}) => {
  const [selectedList, setSelectedList] = useState<SpellList | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Available tags
  const tags = ['all', 'Combate', 'Sanación', 'Nigromancia', 'Elemental', 'Defensa', 'Comunidad'];

  // Filtered public lists
  const filteredLists = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return publicLists.filter((l) => {
      const matchTag =
        selectedTag === 'all' ||
        (l.tags && l.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())) ||
        l.description?.toLowerCase().includes(selectedTag.toLowerCase()) ||
        l.name.toLowerCase().includes(selectedTag.toLowerCase());

      if (!matchTag) return false;
      if (!q) return true;

      const inName = l.name.toLowerCase().includes(q);
      const inAuthor = l.author?.toLowerCase().includes(q);
      const inDesc = l.description?.toLowerCase().includes(q);
      const inSpells = l.spellIds.some((id) => {
        const s = spells.find((sp) => sp.id === id);
        return s && (s.name.toLowerCase().includes(q) || (s.nameEn && s.nameEn.toLowerCase().includes(q)));
      });

      return inName || inAuthor || inDesc || inSpells;
    });
  }, [publicLists, searchQuery, selectedTag, spells]);

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

  // If a list is selected to inspect its spells
  if (selectedList) {
    const listColor = selectedList.color || '#bafafd';
    const listSpells = selectedList.spellIds
      .map((id) => spells.find((s) => s.id === id))
      .filter(Boolean) as Spell[];

    return (
      <div className="space-y-6">
        {/* Detail Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0e161c] border border-[#1b2a33] shadow-xs">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              onClick={() => setSelectedList(null)}
              className="p-2 rounded-xl bg-[#14232c] hover:bg-[#1a2e3a] text-slate-400 hover:text-white border border-[#213744] transition-colors cursor-pointer shrink-0"
              title="Volver a la galería"
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
              {selectedList.icon || '📖'}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-100 uppercase tracking-wide truncate">
                  {selectedList.name}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#14282c] text-[#bafafd] border border-[#bafafd]/40 font-mono font-semibold">
                  {selectedList.spellIds.length} {language === 'es' ? 'conjuros' : 'spells'}
                </span>
              </div>
              <p className="text-xs text-[#8a9ba8] mt-0.5">
                {selectedList.author ? `Por ${selectedList.author}` : 'Comunidad de Dracopedia'}
                {selectedList.description && ` • ${selectedList.description}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => onLikeList(selectedList.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#14232c] hover:bg-[#1b2f3a] text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>{selectedList.likes || 0}</span>
            </button>

            <button
              type="button"
              onClick={() => handleShare(selectedList)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#121c23] hover:bg-[#16242d] text-slate-200 border border-[#213744] transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#bafafd]" />
              <span>{language === 'es' ? 'Compartir' : 'Share'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onCloneList(selectedList);
                onShowToast(
                  language === 'es'
                    ? `¡"${selectedList.name}" guardada en tus listas!`
                    : `Saved "${selectedList.name}" to your lists!`,
                  'success'
                );
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#14282c] hover:bg-[#18363e] text-[#bafafd] border border-[#bafafd]/50 hover:border-[#bafafd] transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4 text-[#bafafd]" />
              <span>{language === 'es' ? 'Guardar en Mis Listas' : 'Save to My Lists'}</span>
            </button>
          </div>
        </div>

        {/* Spells Grid */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-heading text-sm sm:text-base font-bold tracking-widest text-slate-100 uppercase">
              {language === 'es' ? 'CONJUROS DE LA COLECCIÓN' : 'COLLECTION SPELLS'}
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {listSpells.length} {language === 'es' ? 'hechizos' : 'spells'}
            </span>
          </div>

          <SpellGrid
            spells={listSpells}
            language={language}
            activeCharacter={activeCharacter}
            onOpenDetails={onOpenSpellDetails}
            groupBy="level"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-[#1b2a33] bg-[#0e161c] p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#14282c] border border-[#bafafd]/40 flex items-center justify-center text-2xl text-[#bafafd] shadow-xs">
            🌐
          </div>
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <span>{language === 'es' ? 'Galería Pública de Listas' : 'Public Lists Gallery'}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#14282c] text-[#bafafd] border border-[#bafafd]/30">
                {publicLists.length}
              </span>
            </h2>
            <p className="text-xs text-[#8a9ba8] mt-0.5 max-w-xl">
              {language === 'es'
                ? 'Explora las colecciones compartidas por otros jugadores, descárgalas en tus listas con un clic o publica tus propias creaciones.'
                : 'Explore collections shared by other players, clone them with one click, or publish your own creations.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsPublishModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#14282c] hover:bg-[#18363e] text-[#bafafd] border border-[#bafafd]/50 hover:border-[#bafafd] transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-[#bafafd]" />
            <span>{language === 'es' ? 'Publicar Mi Lista' : 'Publish My List'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0e161c] border border-[#18262f] space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'es' ? 'Buscar listas por nombre, autor, descripción o conjuros...' : 'Search lists by name, author, spells...'}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#14232c] border border-[#233845] focus:border-[#bafafd] focus:outline-none text-slate-100 placeholder:text-slate-500"
            />
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {tags.map((t) => {
              const isSelected = selectedTag === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTag(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#14282c] text-[#bafafd] border border-[#bafafd]/60'
                      : 'bg-[#121c23] hover:bg-[#16232b] text-slate-300 border border-[#1f303b]'
                  }`}
                >
                  {t === 'all' ? (language === 'es' ? 'Todas' : 'All') : t}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Public Lists Grid or Empty State */}
      {publicLists.length === 0 ? (
        <div className="text-center py-20 px-4 bg-[#0e161c] rounded-2xl border border-[#1b2a33] space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#14282c] border border-[#bafafd]/30 flex items-center justify-center text-3xl shadow-xs">
            🌐
          </div>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-100 uppercase tracking-wide">
            {language === 'es' ? 'Aún no hay listas públicas compartidas' : 'No public lists shared yet'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            {language === 'es'
              ? '¡Sé el primero en compartir una lista de hechizos con toda la comunidad de Dracopedia! Diseña tu colección, elige su nombre e icono, y hazla pública para todos.'
              : 'Be the first to share a spell list with the Dracopedia community! Create your list and make it public.'}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#14282c] hover:bg-[#18363e] text-[#bafafd] border border-[#bafafd]/50 hover:border-[#bafafd] transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#bafafd]" />
              <span>{language === 'es' ? '+ Crear y Publicar Lista' : '+ Create & Publish List'}</span>
            </button>
            {userLists.length > 0 && (
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#121c23] hover:bg-[#16242d] text-slate-300 border border-[#213744] hover:border-[#bafafd]/40 transition-all cursor-pointer"
              >
                <Globe className="w-4 h-4 text-[#bafafd]" />
                <span>{language === 'es' ? 'Publicar una de Mis Listas' : 'Publish One of My Lists'}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLists.map((lst) => {
            const listColor = lst.color || '#bafafd';
            const previewSpells = lst.spellIds
              .map((id) => spells.find((s) => s.id === id))
              .filter(Boolean) as Spell[];

            return (
              <div
                key={lst.id}
                onClick={() => setSelectedList(lst)}
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-[#10181e] hover:bg-[#142129] border border-[#192731] hover:border-[#bafafd]/50 transition-all cursor-pointer shadow-xs space-y-4"
              >
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
                          {lst.spellIds.length} {language === 'es' ? 'conjuros' : 'spells'} • {lst.author || 'Comunidad'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLikeList(lst.id);
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#14222b] border border-[#203644] hover:border-rose-500/40 text-rose-300 text-xs transition-colors cursor-pointer"
                      title="Votar"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span className="font-mono text-[11px]">{lst.likes || 0}</span>
                    </button>
                  </div>

                  {lst.description && (
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed opacity-90 mb-2">
                      {lst.description}
                    </p>
                  )}

                  {/* Tags */}
                  {lst.tags && lst.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {lst.tags.slice(0, 3).map((tg) => (
                        <span
                          key={tg}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-[#14242d] text-[#bafafd] border border-[#bafafd]/30 font-medium"
                        >
                          {tg}
                        </span>
                      ))}
                    </div>
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

                {/* Card Footer Actions */}
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

                    <button
                      type="button"
                      onClick={() => {
                        onCloneList(lst);
                        onShowToast(
                          language === 'es'
                            ? `¡"${lst.name}" guardada en tus listas!`
                            : `Saved "${lst.name}" to your lists!`,
                          'success'
                        );
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#14222b] hover:bg-[#1a2e3b] text-slate-200 hover:text-[#bafafd] border border-[#203644] transition-colors cursor-pointer text-xs"
                      title={language === 'es' ? 'Guardar en mis listas' : 'Clone list'}
                    >
                      <Download className="w-3.5 h-3.5 text-[#bafafd]" />
                      <span className="hidden sm:inline">{language === 'es' ? 'Guardar' : 'Save'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedList(lst)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#14282c] text-[#bafafd] border border-[#bafafd]/30 group-hover:border-[#bafafd]/60 transition-colors cursor-pointer"
                  >
                    {language === 'es' ? 'Ver Hechizos' : 'View Spells'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {publicLists.length > 0 && filteredLists.length === 0 && (
        <div className="text-center py-16 px-4 bg-[#10181e] rounded-2xl border border-[#1b2a33] space-y-3">
          <Globe className="w-12 h-12 text-slate-500 mx-auto opacity-60" />
          <h3 className="font-heading text-lg font-bold text-slate-200 uppercase tracking-wide">
            {language === 'es' ? 'No se encontraron listas' : 'No lists found'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {language === 'es'
              ? 'Prueba con otro término de búsqueda o selecciona otra categoría.'
              : 'Try a different search term or category.'}
          </p>
        </div>
      )}

      {/* Modal to pick one of user's personal lists and publish to public gallery */}
      {isPublishModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs"
          onClick={() => setIsPublishModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#0e161c] text-slate-100 rounded-2xl border border-[#1d2d38] shadow-2xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#18262f] pb-3">
              <h3 className="font-heading text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#bafafd]" />
                <span>{language === 'es' ? 'Publicar una de tus Listas' : 'Publish One of Your Lists'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#8a9ba8]">
              {language === 'es'
                ? 'Selecciona la lista que deseas hacer pública para que cualquier usuario de Dracopedia pueda explorarla y clonarla.'
                : 'Select the list you want to share with the community.'}
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {userLists.map((ul) => (
                <div
                  key={ul.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#14232c] border border-[#203442] hover:border-[#bafafd]/50"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg">{ul.icon || '📖'}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-100 truncate">{ul.name}</p>
                      <p className="text-[10px] text-slate-400">{ul.spellIds.length} hechizos</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onPublishUserList(ul);
                      setIsPublishModalOpen(false);
                      onShowToast(
                        language === 'es'
                          ? `¡"${ul.name}" publicada en la Galería Pública!`
                          : `Published "${ul.name}" to Public Gallery!`,
                        'success'
                      );
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#14282c] hover:bg-[#18363e] text-[#bafafd] border border-[#bafafd]/50 text-xs font-bold cursor-pointer"
                  >
                    {language === 'es' ? 'Publicar' : 'Publish'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
