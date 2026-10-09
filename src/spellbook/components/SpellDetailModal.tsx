import React, { useState, useEffect } from 'react';
import { 
  X, Copy, Check, Printer, BookMarked, Star, Sparkles, Edit3, 
  ScrollText, Image as ImageIcon, Save, Trash2, Layers, Eye, 
  EyeOff, Plus, AlertCircle, Wand2, RefreshCw, Sliders
} from 'lucide-react';
import { Spell, Character, MagicSchool, DndClass, PrimordialMagic, SpellTarget } from '../types';
import { getSpellPrimordialMagic, PRIMORDIAL_MAGIC_MAP, PRIMORDIAL_MAGICS } from '../data/primordialMagic';
import { getSpellDamageTypes, DAMAGE_TYPES } from '../data/damageTypes';
import { getSpellTargets, SPELL_TARGET_OPTIONS } from '../data/spellTargets';
import { getSpellFunctionalities, SPELL_FUNCTIONALITIES } from '../data/spellFunctionalities';
import { ALL_CLASSES, ALL_SCHOOLS } from '../data/spells';
import { SpellIcon } from './SpellIcon';
import { MarkdownText } from './MarkdownText';
import { useVisualEditor } from '../../context/VisualEditorContext';
import { ArtGalleryPickerModal } from '../../components/ArtGalleryPickerModal';

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
  onSaveSpell?: (updatedSpell: Spell) => void;
  onDuplicateSpell?: (spell: Spell) => void;
  onDeleteSpell?: (spellId: string) => void;
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
  onSaveSpell,
  onDuplicateSpell,
  onDeleteSpell,
  onAddToList,
}) => {
  const { isVisualEditMode, showToast, saveSpellDirectly, deleteSpellDirectly } = useVisualEditor();
  const [copied, setCopied] = useState(false);
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Editable Form States
  const [editName, setEditName] = useState('');
  const [editNameEn, setEditNameEn] = useState('');
  const [editLevel, setEditLevel] = useState<number>(0);
  const [editSchool, setEditSchool] = useState<MagicSchool>('Evocación');
  const [editPrimordial, setEditPrimordial] = useState<PrimordialMagic | undefined>(undefined);
  const [editCastingTime, setEditCastingTime] = useState('');
  const [editRange, setEditRange] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editConcentration, setEditConcentration] = useState(false);
  const [editRitual, setEditRitual] = useState(false);
  const [editVerbal, setEditVerbal] = useState(true);
  const [editSomatic, setEditSomatic] = useState(true);
  const [editMaterial, setEditMaterial] = useState(false);
  const [editMaterialDesc, setEditMaterialDesc] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editHigherLevels, setEditHigherLevels] = useState('');
  const [editClasses, setEditClasses] = useState<DndClass[]>([]);
  const [editDamageTypes, setEditDamageTypes] = useState<string[]>([]);
  const [editTargets, setEditTargets] = useState<SpellTarget[]>([]);
  const [editIconUrl, setEditIconUrl] = useState('');

  // Sync state whenever selected spell changes
  useEffect(() => {
    if (spell) {
      setEditName(spell.name || '');
      setEditNameEn(spell.nameEn || spell.name || '');
      setEditLevel(spell.level ?? 0);
      setEditSchool(spell.school || 'Evocación');
      setEditPrimordial(spell.primordialMagic || getSpellPrimordialMagic(spell));
      setEditCastingTime(spell.castingTime || '1 acción');
      setEditRange(spell.range || '18 metros (60 pies)');
      setEditDuration(spell.duration || 'Instantánea');
      setEditConcentration(spell.concentration || false);
      setEditRitual(spell.ritual || false);
      setEditVerbal(spell.components?.verbal ?? true);
      setEditSomatic(spell.components?.somatic ?? true);
      setEditMaterial(spell.components?.material ?? false);
      setEditMaterialDesc(spell.components?.materialDescription || '');
      setEditDescription(spell.description || '');
      setEditHigherLevels(spell.higherLevels || '');
      setEditClasses(Array.isArray(spell.classes) ? [...spell.classes] : ['Mago']);
      setEditDamageTypes(getSpellDamageTypes(spell));
      setEditTargets(getSpellTargets(spell));
      setEditIconUrl(spell.iconUrl || spell.bg3IconUrl || '');
    }
  }, [spell]);

  if (!spell) return null;

  const isKnown = activeCharacter?.knownSpellIds.includes(spell.id) ?? false;
  const isPrepared = activeCharacter?.preparedSpellIds.includes(spell.id) ?? false;
  const isFavorite = activeCharacter?.favoriteSpellIds.includes(spell.id) ?? false;
  const schoolColor = spell.color || '#10b981';

  const primordial = editPrimordial || getSpellPrimordialMagic(spell);
  const primordialInfo = PRIMORDIAL_MAGIC_MAP[primordial];
  const PrimordialIcon = primordialInfo?.icon || Sparkles;

  const handleCopy = () => {
    const text = `**${spell.name}** (${spell.nameEn})
Nivel ${spell.level} - ${spell.school}
Tiempo de lanzamiento: ${spell.castingTime}
Alcance: ${spell.range}
Componentes: ${[
      spell.components?.verbal ? 'V' : null,
      spell.components?.somatic ? 'S' : null,
      spell.components?.material ? `M (${spell.components?.materialDescription || ''})` : null,
    ]
      .filter(Boolean)
      .join(', ')}
Duración: ${spell.duration} ${spell.concentration ? '(Concentración)' : ''}
Clases: ${spell.classes?.join(', ')}

${spell.description}
${spell.higherLevels ? `\nA niveles superiores: ${spell.higherLevels}` : ''}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Direct Save from Inline Visual Editor
  const handleSaveInline = async () => {
    if (!editName.trim()) {
      showToast?.('El nombre del conjuro no puede estar vacío.', 'warning');
      return;
    }

    setIsSaving(true);
    const updated: Spell = {
      ...spell,
      name: editName.trim(),
      nameEn: editNameEn.trim(),
      level: editLevel,
      school: editSchool,
      schoolEn: editSchool,
      primordialMagic: editPrimordial,
      castingTime: editCastingTime.trim(),
      range: editRange.trim(),
      duration: editDuration.trim(),
      concentration: editConcentration,
      ritual: editRitual,
      components: {
        verbal: editVerbal,
        somatic: editSomatic,
        material: editMaterial,
        materialDescription: editMaterialDesc.trim(),
      },
      description: editDescription.trim(),
      higherLevels: editHigherLevels.trim(),
      classes: editClasses,
      damageTypes: editDamageTypes,
      damageType: editDamageTypes[0] || '',
      targets: editTargets,
      iconUrl: editIconUrl.trim() || spell.iconUrl,
      bg3IconUrl: editIconUrl.trim() || spell.bg3IconUrl,
      isEdited: true,
      updatedAt: new Date().toISOString(),
    };

    if (onSaveSpell) {
      onSaveSpell(updated);
    } else if (saveSpellDirectly) {
      await saveSpellDirectly(updated);
    }

    setIsSaving(false);
    setIsInlineEditing(false);
    showToast?.(`✨ Conjuro "${updated.name}" guardado exitosamente.`, 'success', 3000);
  };

  // Duplicate Spell as Homebrew
  const handleDuplicate = () => {
    if (onDuplicateSpell) {
      onDuplicateSpell(spell);
      onClose();
    } else {
      const duplicated: Spell = {
        ...spell,
        id: `custom-spell-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: `${spell.name} (Copia)`,
        nameEn: spell.nameEn ? `${spell.nameEn} (Copy)` : `${spell.name} (Copy)`,
        isCustom: true,
        source: 'Homebrew',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (saveSpellDirectly) {
        saveSpellDirectly(duplicated);
      }
      onClose();
    }
  };

  // Delete Custom / Edited Spell
  const handleDelete = async () => {
    const isCustomOrEdited = spell.isCustom || spell.isEdited || spell.source === 'Homebrew';
    const msg = isCustomOrEdited
      ? `¿Estás seguro de que deseas eliminar permanentemente el conjuro "${spell.name}"?`
      : `¿Deseas restablecer este conjuro oficial a sus valores originales?`;
    
    if (!window.confirm(msg)) return;

    if (onDeleteSpell) {
      onDeleteSpell(spell.id);
      onClose();
    } else if (deleteSpellDirectly) {
      await deleteSpellDirectly(spell.id);
      onClose();
    }
  };

  const isCustomOrEdited = spell.isCustom || spell.isEdited || spell.source === 'Homebrew';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#0e161c] text-slate-100 rounded-2xl border border-[#1d2d38] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* =========================================================================
            Top Visual Edit Mode Toolbar (Matching Wiki ArticleView standard)
            ========================================================================= */}
        {isVisualEditMode && (
          <div className="bg-primary/15 border-b-2 border-primary/50 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs z-20 shrink-0 backdrop-blur-md">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-lg bg-primary text-primary-foreground shrink-0 shadow-md">
                <Edit3 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-extrabold uppercase tracking-wide text-primary text-xs">
                    Edición Visual del Conjuro:
                  </span>
                  <span className="font-bold text-foreground truncate max-w-[200px]">
                    {spell.name}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  {isInlineEditing 
                    ? 'Modifica los campos en vivo y pulsa Guardar para aplicar cambios permanentes.' 
                    : 'Modo visual activo. Puedes editar reglas, descripción o duplicar este conjuro.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsInlineEditing(!isInlineEditing)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isInlineEditing
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'bg-secondary hover:bg-secondary/80 text-foreground border-border'
                }`}
              >
                {isInlineEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                <span>{isInlineEditing ? 'Ver Vista Previa' : 'Edición Directa'}</span>
              </button>

              {onEditSpell && (
                <button
                  type="button"
                  onClick={() => onEditSpell(spell)}
                  className="px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Abrir editor completo con selector de iconos BG3 y sincronización"
                >
                  <Wand2 className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden sm:inline">Editor Avanzado</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleDuplicate}
                className="px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Clonar este hechizo como conjuro casero independiente"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Duplicar</span>
              </button>

              {isCustomOrEdited && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-2.5 py-1.5 rounded-xl bg-destructive/15 hover:bg-destructive/30 text-destructive border border-destructive/40 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  title="Eliminar este conjuro del grimorio"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Eliminar</span>
                </button>
              )}

              {isInlineEditing && (
                <button
                  type="button"
                  onClick={handleSaveInline}
                  disabled={isSaving}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-950/40 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            Modal Header: Hero Art Banner & Basic Info
            ========================================================================= */}
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

          {/* Spell Art Icon with Interactive Change on Hover in Edit Mode */}
          <div
            className={`shrink-0 relative group ${isVisualEditMode ? 'cursor-pointer hover:ring-2 hover:ring-primary rounded-xl transition-all' : ''}`}
            onClick={() => {
              if (isVisualEditMode) setShowGalleryPicker(true);
            }}
            title={isVisualEditMode ? 'Cambiar icono / ilustración con Galería de Arte' : undefined}
          >
            <SpellIcon spell={{ ...spell, iconUrl: editIconUrl || spell.iconUrl }} size="lg" />
            {isVisualEditMode && (
              <div className="absolute inset-0 bg-black/75 rounded-xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-primary font-bold gap-1 p-1 text-center">
                <ImageIcon className="w-4 h-4 text-primary" />
                <span>Cambiar Arte</span>
              </div>
            )}
          </div>

          <div className="text-center sm:text-left flex-1 min-w-0">
            {/* Title / Name Header */}
            {isInlineEditing ? (
              <div className="space-y-2 mb-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-primary tracking-wider mb-1">
                      Nombre en Español *
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Nombre del conjuro..."
                      className="w-full h-9 px-3 text-sm font-bold bg-[#101b22] border border-primary/50 rounded-xl text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">
                      Nombre en Inglés (Original D&D)
                    </label>
                    <input
                      type="text"
                      value={editNameEn}
                      onChange={(e) => setEditNameEn(e.target.value)}
                      placeholder="English name..."
                      className="w-full h-9 px-3 text-sm bg-[#101b22] border border-border rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="group/title relative inline-block">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-wide text-slate-100 uppercase">
                    {language === 'es' ? spell.name : spell.nameEn || spell.name}
                  </h2>
                  {isVisualEditMode && !isInlineEditing && (
                    <button
                      type="button"
                      onClick={() => setIsInlineEditing(true)}
                      className="p-1 rounded-md text-primary/70 hover:text-primary hover:bg-primary/20 transition-all opacity-0 group-hover/title:opacity-100"
                      title="Editar nombre"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-400 italic mt-0.5">
                  {spell.nameEn && spell.nameEn !== spell.name ? `${spell.nameEn} • ` : ''}
                  {spell.school}
                </p>
              </div>
            )}

            {/* Tags: Level, School, Ritual, Concentration, Primordial */}
            {isInlineEditing ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-2 border-t border-white/10">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1">Nivel</label>
                  <select
                    value={editLevel}
                    onChange={(e) => setEditLevel(Number(e.target.value))}
                    className="w-full h-8 px-2 text-xs bg-[#121c23] border border-border rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value={0}>Truco (Nivel 0)</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                      <option key={lvl} value={lvl}>Nivel {lvl}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1">Escuela</label>
                  <select
                    value={editSchool}
                    onChange={(e) => setEditSchool(e.target.value as MagicSchool)}
                    className="w-full h-8 px-2 text-xs bg-[#121c23] border border-border rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {ALL_SCHOOLS.map((sch) => (
                      <option key={sch} value={sch}>{sch}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1">Magia Primordial</label>
                  <select
                    value={editPrimordial || ''}
                    onChange={(e) => setEditPrimordial(e.target.value ? (e.target.value as PrimordialMagic) : undefined)}
                    className="w-full h-8 px-2 text-xs bg-[#121c23] border border-border rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Por defecto / Ninguna</option>
                    {PRIMORDIAL_MAGICS.map((p) => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editRitual}
                      onChange={(e) => setEditRitual(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                    />
                    <span>Ritual</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editConcentration}
                      onChange={(e) => setEditConcentration(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                    />
                    <span>Concentración</span>
                  </label>
                </div>
              </div>
            ) : (
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

                {isCustomOrEdited && (
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-950/70 text-purple-300 border border-purple-500/50 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>{spell.isCustom ? 'Hechizo Casero' : 'Hechizo Modificado'}</span>
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
            )}
          </div>
        </div>

        {/* =========================================================================
            Modal Body: Stats, Rules, Markdown & Inline Forms
            ========================================================================= */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {isInlineEditing ? (
            /* Inline Form Editor Mode */
            <div className="space-y-5">
              {/* Tactical Stats Form */}
              <div className="p-4 rounded-xl bg-[#111a21] border border-primary/30 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Reglas de Lanzamiento & Componentes</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Tiempo de casteo</label>
                    <input
                      type="text"
                      value={editCastingTime}
                      onChange={(e) => setEditCastingTime(e.target.value)}
                      placeholder="1 acción, 1 acción adicional, reacción..."
                      className="w-full h-8 px-2.5 text-xs bg-[#0d151b] border border-border rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Alcance</label>
                    <input
                      type="text"
                      value={editRange}
                      onChange={(e) => setEditRange(e.target.value)}
                      placeholder="Personal, 18 metros (60 pies)..."
                      className="w-full h-8 px-2.5 text-xs bg-[#0d151b] border border-border rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Duración</label>
                    <input
                      type="text"
                      value={editDuration}
                      onChange={(e) => setEditDuration(e.target.value)}
                      placeholder="Instantánea, 1 minuto, 1 hora..."
                      className="w-full h-8 px-2.5 text-xs bg-[#0d151b] border border-border rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-medium text-slate-400">Componentes:</span>
                    <label className="inline-flex items-center gap-1 text-xs text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editVerbal}
                        onChange={(e) => setEditVerbal(e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                      />
                      <span>V (Verbal)</span>
                    </label>
                    <label className="inline-flex items-center gap-1 text-xs text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editSomatic}
                        onChange={(e) => setEditSomatic(e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                      />
                      <span>S (Somático)</span>
                    </label>
                    <label className="inline-flex items-center gap-1 text-xs text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editMaterial}
                        onChange={(e) => setEditMaterial(e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                      />
                      <span>M (Material)</span>
                    </label>
                  </div>

                  {editMaterial && (
                    <input
                      type="text"
                      value={editMaterialDesc}
                      onChange={(e) => setEditMaterialDesc(e.target.value)}
                      placeholder="Descripción del componente material (ej. una pizca de azufre)..."
                      className="w-full h-8 px-2.5 text-xs bg-[#0d151b] border border-border rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  )}
                </div>
              </div>

              {/* Classes Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Clases con acceso a este conjuro:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_CLASSES.map((cls) => {
                    const isSelected = editClasses.includes(cls);
                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => {
                          setEditClasses((prev) =>
                            isSelected ? prev.filter((c) => c !== cls) : [...prev, cls]
                          );
                        }}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary/20 text-primary border-primary font-bold shadow-xs'
                            : 'bg-[#101920] text-slate-400 border-[#1f2d38] hover:text-slate-200'
                        }`}
                      >
                        {cls} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Damage Types Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tipos de daño asociados:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {DAMAGE_TYPES.map((dt) => {
                    const isSelected = editDamageTypes.some((d) => d.toLowerCase() === dt.name.toLowerCase());
                    return (
                      <button
                        key={dt.name}
                        type="button"
                        onClick={() => {
                          setEditDamageTypes((prev) =>
                            isSelected
                              ? prev.filter((d) => d.toLowerCase() !== dt.name.toLowerCase())
                              : [...prev, dt.name]
                          );
                        }}
                        className={`text-xs px-2 py-0.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? `${dt.bgColor} ${dt.textColor} ${dt.borderColor} font-bold ring-1 ring-white/20`
                            : 'bg-[#101920] text-slate-400 border-[#1f2d38] hover:text-slate-200'
                        }`}
                      >
                        {dt.name} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description Markdown Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-primary">
                    Descripción del Hechizo (Soporta Markdown) *
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {editDescription.length} caracteres
                  </span>
                </div>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Detalla el efecto mágico, tiradas de salvación, daño o curación..."
                  rows={6}
                  className="w-full p-3 text-xs sm:text-sm bg-[#0d151b] border border-border focus:border-primary rounded-xl text-slate-100 leading-relaxed resize-y focus:outline-none"
                />
              </div>

              {/* Higher Levels Editor */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-cyan-300">
                  Efecto a Niveles Superiores (Opcional)
                </label>
                <textarea
                  value={editHigherLevels}
                  onChange={(e) => setEditHigherLevels(e.target.value)}
                  placeholder="Cuando lanzas este conjuro usando un espacio de conjuro de nivel..."
                  rows={2}
                  className="w-full p-2.5 text-xs bg-[#0d151b] border border-border focus:border-cyan-500 rounded-xl text-slate-100 leading-relaxed resize-y focus:outline-none"
                />
              </div>

              {/* Icon URL input */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  URL de Icono o Imagen Personalizada:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editIconUrl}
                    onChange={(e) => setEditIconUrl(e.target.value)}
                    placeholder="https://... o selecciona de la galería"
                    className="flex-1 h-9 px-3 text-xs bg-[#0d151b] border border-border rounded-xl text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGalleryPicker(true)}
                    className="px-3 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-xl text-primary text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Galería</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Preview / Normal View Mode */
            <div className="space-y-6">
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
                      spell.components?.verbal && 'V',
                      spell.components?.somatic && 'S',
                      spell.components?.material && 'M',
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>

                {spell.components?.material && spell.components?.materialDescription && (
                  <div className="col-span-2 sm:col-span-4 pt-2 border-t border-[#1b2b35]">
                    <p className="text-[11px] text-slate-400">Material requerido:</p>
                    <p className="text-xs text-slate-300 italic">{spell.components.materialDescription}</p>
                  </div>
                )}
              </div>

              {/* Spell Description */}
              <div className="space-y-2.5 group/desc relative">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading text-sm uppercase tracking-widest font-bold text-sky-400">
                    Descripción del Hechizo
                  </h4>
                  {isVisualEditMode && (
                    <button
                      type="button"
                      onClick={() => setIsInlineEditing(true)}
                      className="text-xs text-primary/80 hover:text-primary flex items-center gap-1 opacity-0 group-hover/desc:opacity-100 transition-opacity"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar Texto</span>
                    </button>
                  )}
                </div>
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
          )}
        </div>

        {/* =========================================================================
            Footer actions: Prepare, Spellbook, Copy, Print & Save
            ========================================================================= */}
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
            {isInlineEditing ? (
              <button
                type="button"
                onClick={handleSaveInline}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-950/40 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Guardando...' : 'Guardar Conjuro'}</span>
              </button>
            ) : (
              <>
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isVisualEditMode
                        ? 'bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 hover:opacity-90'
                        : 'bg-[#14282c] hover:bg-[#1a383e] text-[#bafafd] border border-[#bafafd]/50'
                    }`}
                    title={language === 'es' ? 'Editar este hechizo' : 'Edit this spell'}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{language === 'es' ? 'Editar' : 'Edit'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#14282c] hover:bg-[#1a2e3a] text-slate-200 border border-[#213744] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#bafafd]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>

                {onPrintSingle && (
                  <button
                    type="button"
                    onClick={() => onPrintSingle(spell)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#14282c] hover:bg-[#1a2e3a] text-slate-200 border border-[#213744] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#bafafd]" />
                    <span>Imprimir</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Art Gallery Picker Modal */}
      {showGalleryPicker && (
        <ArtGalleryPickerModal
          isOpen={showGalleryPicker}
          onClose={() => setShowGalleryPicker(false)}
          onSelectImage={(imageUrl) => {
            setEditIconUrl(imageUrl);
            setShowGalleryPicker(false);
            showToast?.('Ilustración seleccionada de la Galería de Arte.', 'success', 2500);
          }}
        />
      )}
    </div>
  );
};
