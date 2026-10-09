import React, { useState } from 'react';
import { X, Sparkles, Check, Globe, Palette } from 'lucide-react';
import { SpellList } from '../types';
import { LIST_ICON_OPTIONS, LIST_COLOR_OPTIONS } from '../data/defaultPublicLists';

interface EditSpellListModalProps {
  list: SpellList | null; // null if creating a new list
  isOpen: boolean;
  onClose: () => void;
  onSave: (list: SpellList, publishToGallery: boolean) => void;
  language: 'es' | 'en';
}

export const EditSpellListModal: React.FC<EditSpellListModalProps> = ({
  list,
  isOpen,
  onClose,
  onSave,
  language,
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(list && list.id);

  const [name, setName] = useState(list?.name || '');
  const [description, setDescription] = useState(list?.description || '');
  const [icon, setIcon] = useState(list?.icon || '🔮');
  const [customIcon, setCustomIcon] = useState('');
  const [color, setColor] = useState(list?.color || '#bafafd');
  const [author, setAuthor] = useState(list?.author || 'Archimago');
  const [publishToGallery, setPublishToGallery] = useState(list?.isPublic ?? false);
  const [error, setError] = useState('');

  const handleSelectPresetIcon = (ic: string) => {
    setIcon(ic);
    setCustomIcon('');
  };

  const handleCustomIconChange = (val: string) => {
    setCustomIcon(val);
    if (val.trim()) {
      setIcon(val.trim());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(language === 'es' ? 'Por favor ingresa un nombre para la lista.' : 'Please enter a name for the list.');
      return;
    }

    const finalList: SpellList = {
      id: list?.id || `list-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      description: description.trim(),
      icon: icon || '📖',
      color: color || '#bafafd',
      author: author.trim() || 'Archimago Anónimo',
      spellIds: list?.spellIds || [],
      createdAt: list?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: publishToGallery,
      tags: list?.tags || ['Personalizada'],
      likes: list?.likes || 0,
    };

    onSave(finalList, publishToGallery);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#0e161c] text-slate-100 rounded-2xl border border-[#1d2d38] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#17232b] flex items-center justify-between bg-[#121c23]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-xs border"
              style={{
                backgroundColor: `${color}18`,
                borderColor: `${color}60`,
                color: color,
              }}
            >
              {icon}
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-100 uppercase tracking-wide">
                {isEditing
                  ? (language === 'es' ? 'Editar Lista de Hechizos' : 'Edit Spell List')
                  : (language === 'es' ? 'Crear Nueva Lista' : 'Create New List')}
              </h2>
              <p className="text-xs text-[#8a9ba8]">
                {language === 'es'
                  ? 'Personaliza el nombre, icono y temática de tu colección'
                  : 'Customize the name, icon, and theme of your collection'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#15232c] hover:bg-[#1a2e3a] text-slate-400 hover:text-white border border-[#213744] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-600/50 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#bafafd] font-heading mb-1.5">
              {language === 'es' ? 'Nombre de la Lista *' : 'List Name *'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder={language === 'es' ? 'ej. Arsenal de Evocación y Fuego' : 'e.g. Fire & Evocation Arsenal'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#14232c] border border-[#233845] focus:border-[#bafafd] focus:outline-none text-slate-100 text-sm placeholder:text-slate-500 font-medium transition-colors"
            />
          </div>

          {/* Author Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8a9ba8] font-heading mb-1.5">
              {language === 'es' ? 'Creador / Archimago' : 'Creator / Archmage'}
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder={language === 'es' ? 'Tu nombre o personaje' : 'Your name or character'}
              className="w-full px-3.5 py-2 rounded-xl bg-[#14232c] border border-[#233845] focus:border-[#bafafd] focus:outline-none text-slate-100 text-xs placeholder:text-slate-500 transition-colors"
            />
          </div>

          {/* Icon Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8a9ba8] font-heading">
                {language === 'es' ? 'Elige un Icono' : 'Choose an Icon'}
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">
                  {language === 'es' ? 'o escribe emoji/texto:' : 'or type custom emoji:'}
                </span>
                <input
                  type="text"
                  maxLength={4}
                  value={customIcon}
                  onChange={(e) => handleCustomIconChange(e.target.value)}
                  placeholder="✨"
                  className="w-12 px-2 py-1 text-center rounded-lg bg-[#14232c] border border-[#233845] focus:border-[#bafafd] text-sm text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-2.5 rounded-xl bg-[#121c23] border border-[#1b2a33] max-h-36 overflow-y-auto">
              {LIST_ICON_OPTIONS.map((opt) => {
                const isSelected = icon === opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectPresetIcon(opt.icon)}
                    title={opt.label}
                    className={`h-10 rounded-lg flex items-center justify-center text-lg transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#18323c] border-2 border-[#bafafd] scale-105 shadow-xs'
                        : 'bg-[#15232c] hover:bg-[#1a2d39] border border-[#213542] text-slate-300'
                    }`}
                  >
                    {opt.icon}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Accent Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8a9ba8] font-heading mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#bafafd]" />
              <span>{language === 'es' ? 'Color de Identidad' : 'Accent Color'}</span>
            </label>
            <div className="flex items-center gap-2.5 flex-wrap">
              {LIST_COLOR_OPTIONS.map((c) => {
                const isSelected = color === c.hex;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.hex)}
                    title={c.label}
                    style={{ backgroundColor: c.hex }}
                    className={`w-7 h-7 rounded-full transition-transform cursor-pointer flex items-center justify-center shadow-xs ${
                      isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0e161c] scale-110' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-slate-950 stroke-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8a9ba8] font-heading mb-1.5">
              {language === 'es' ? 'Descripción o Notas' : 'Description or Notes'}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={language === 'es' ? 'Propósito táctico, trasfondo o notas de la lista...' : 'Tactical purpose, notes or lore...'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#14232c] border border-[#233845] focus:border-[#bafafd] focus:outline-none text-slate-100 text-xs placeholder:text-slate-500 font-normal transition-colors resize-none"
            />
          </div>

          {/* Public Gallery Toggle */}
          <div className="p-3.5 rounded-xl bg-[#121c23] border border-[#1f313d] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Globe className="w-5 h-5 text-[#bafafd] shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-100">
                  {language === 'es' ? 'Compartir en la Galería Pública' : 'Share to Public Gallery'}
                </p>
                <p className="text-[11px] text-[#8a9ba8]">
                  {language === 'es'
                    ? 'Permite que cualquier aventurero pueda verla, clonarla y votarla'
                    : 'Allows any adventurer to view, clone, and vote on it'}
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              id="publishToGalleryToggle"
              checked={publishToGallery}
              onChange={(e) => setPublishToGallery(e.target.checked)}
              className="w-4 h-4 rounded text-[#bafafd] focus:ring-[#bafafd] bg-[#14232c] border-[#233845] cursor-pointer"
            />
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#15232c] hover:bg-[#1a2d39] text-slate-300 border border-[#213542] transition-colors cursor-pointer"
            >
              {language === 'es' ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#14282c] hover:bg-[#19353e] text-[#bafafd] border border-[#bafafd]/50 hover:border-[#bafafd] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#bafafd]" />
              <span>
                {isEditing
                  ? (language === 'es' ? 'Guardar Cambios' : 'Save Changes')
                  : (language === 'es' ? 'Crear Lista' : 'Create List')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
