import React, { useState, useMemo, useRef } from 'react';
import {
  PlusCircle,
  Sparkles,
  X,
  Check,
  Search,
  Upload,
  Link as LinkIcon,
  Wand2,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Image as ImageIcon,
  Flame,
  Layers,
} from 'lucide-react';
import { Spell, MagicSchool, DndClass, SpellOrigin, PrimordialMagic } from '../types';
import { ALL_CLASSES, ALL_SCHOOLS } from '../data/spells';
import { PRIMORDIAL_MAGICS } from '../data/primordialMagic';
import { SPELL_ORIGINS } from '../data/spellOrigins';
import { DAMAGE_TYPES } from '../data/damageTypes';
import { SpellIcon } from './SpellIcon';
import { OfficialSpellLineIcon } from './OfficialSpellLineIcon';
import { MarkdownText } from './MarkdownText';
import bg3IconsData from '../data/bg3Icons.json';
import officialSpellbookIcons from '../data/officialSpellbookIcons.json';
import {
  saveLocalCustomImage,
  getLocalCustomImages,
  removeLocalCustomImage,
} from '../services/imageService';
import { compressImageIcon } from '../services/storageHelper';

interface CustomSpellModalProps {
  onSave: (spell: Spell) => void;
  onCancel: () => void;
  language: 'es' | 'en';
}

const AI_PRESETS = [
  { label: '❄️ Frío Umbrío', prompt: 'Rayo de hielo espectral que congela el suelo y ralentiza a los enemigos' },
  { label: '🔥 Fuego Dracónico', prompt: 'Aliento de dragón carmesí que calcina armaduras y crea ceniza cegadora' },
  { label: '⚡ Relámpago Arcano', prompt: 'Cadena de arcos voltaicos que saltan entre enemigos y sobrecargan metal' },
  { label: '💀 Nigromancia de Almas', prompt: 'Invocación de espectros encadenados que drenan fuerza vital' },
  { label: '🌿 Espinas Primigenias', prompt: 'Zarcillos con espinas venenosas que brotan del suelo e inmovilizan' },
  { label: '🛡️ Barrera Sagrada', prompt: 'Cúpula de luz celestial que absorbe daño y purifica maldiciones' },
];

export const CustomSpellModal: React.FC<CustomSpellModalProps> = ({
  onSave,
  onCancel,
  language,
}) => {
  // Spell Attributes
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [level, setLevel] = useState<number>(1);
  const [school, setSchool] = useState<MagicSchool>('Evocación');
  const [castingTime, setCastingTime] = useState('1 acción');
  const [range, setRange] = useState('18 metros (60 pies)');
  const [duration, setDuration] = useState('Instantáneo');
  const [concentration, setConcentration] = useState(false);
  const [ritual, setRitual] = useState(false);
  const [verbal, setVerbal] = useState(true);
  const [somatic, setSomatic] = useState(true);
  const [material, setMaterial] = useState(false);
  const [materialDesc, setMaterialDesc] = useState('');
  const [selectedClasses, setSelectedClasses] = useState<DndClass[]>(['Mago', 'Hechicero']);
  const [damageType, setDamageType] = useState('Fuego');
  const [primordialMagic, setPrimordialMagic] = useState<PrimordialMagic | ''>('');
  const [origin, setOrigin] = useState<SpellOrigin>('Elemental');
  const [description, setDescription] = useState('');
  const [higherLevels, setHigherLevels] = useState('');
  const [showDescPreview, setShowDescPreview] = useState(false);

  // Icon State
  const [icon, setIcon] = useState('fireball');
  const [bg3IconUrl, setBg3IconUrl] = useState<string>('https://bg3.wiki/w/images/c/cb/Fireball_Icon.webp');
  const [bg3IconName, setBg3IconName] = useState<string>('Fireball Icon');
  const [iconMode, setIconMode] = useState<'bg3' | 'custom' | 'official'>('bg3');

  // BG3 Icon Picker State
  const [bg3Search, setBg3Search] = useState('');
  const [bg3SchoolFilter, setBg3SchoolFilter] = useState('all');
  const [bg3VisibleCount, setBg3VisibleCount] = useState(32);

  // Custom User Upload State
  const [customGallery, setCustomGallery] = useState<Record<string, string>>(() => getLocalCustomImages());
  const [externalUrlInput, setExternalUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Spell Generator State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiProvider, setAiProvider] = useState<'auto' | 'cerebras' | 'mistral'>('auto');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccessMsg, setAiSuccessMsg] = useState<string | null>(null);

  // Format full BG3 icons catalog list
  const bg3List = useMemo(() => {
    return Object.entries(bg3IconsData).map(([key, info]: [string, any]) => ({
      key,
      name: info.name || key,
      file: info.file || '',
      url: info.url || '',
    }));
  }, []);

  // Filter BG3 Icons by search query
  const filteredBg3Icons = useMemo(() => {
    let list = bg3List;
    if (bg3Search.trim()) {
      const q = bg3Search.toLowerCase().trim();
      list = list.filter((item) =>
        item.name.toLowerCase().includes(q) || item.key.toLowerCase().includes(q)
      );
    }
    return list.slice(0, bg3VisibleCount);
  }, [bg3List, bg3Search, bg3VisibleCount]);

  // Handle uploading custom image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    compressImageIcon(file, 256, 256, 0.85)
      .then((base64) => {
        const customKey = `custom_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        saveLocalCustomImage(customKey, base64);
        setCustomGallery(getLocalCustomImages());
        setBg3IconUrl(base64);
        setBg3IconName(file.name);
        setIcon(customKey);
      })
      .catch(() => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          const customKey = `custom_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          saveLocalCustomImage(customKey, base64);
          setCustomGallery(getLocalCustomImages());
          setBg3IconUrl(base64);
          setBg3IconName(file.name);
          setIcon(customKey);
        };
        reader.readAsDataURL(file);
      });
  };

  // Handle external URL submission
  const handleApplyExternalUrl = () => {
    if (!externalUrlInput.trim()) return;
    const url = externalUrlInput.trim();
    const customKey = `url_${Date.now()}`;
    saveLocalCustomImage(customKey, url);
    setCustomGallery(getLocalCustomImages());
    setBg3IconUrl(url);
    setBg3IconName('Imagen URL');
    setIcon(customKey);
    setExternalUrlInput('');
  };

  // Delete custom imported image
  const handleDeleteCustom = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeLocalCustomImage(key);
    setCustomGallery(getLocalCustomImages());
    if (icon === key || bg3IconName === key) {
      setBg3IconUrl('https://bg3.wiki/w/images/c/cb/Fireball_Icon.webp');
      setBg3IconName('Fireball Icon');
      setIcon('fireball');
    }
  };

  // Handle AI generation
  const handleGenerateWithAi = async (customPrompt?: string) => {
    const promptToUse = (customPrompt || aiPrompt).trim();
    if (!promptToUse) return;

    setAiLoading(true);
    setAiError(null);
    setAiSuccessMsg(null);

    try {
      const res = await fetch('/api/ai/generate-spell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          level: level > 0 ? level : undefined,
          school,
          provider: aiProvider,
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.details || data.error || 'Error al generar el conjuro');
      }

      const s = data.spell;
      if (s) {
        if (s.name) setName(s.name);
        if (s.nameEn) setNameEn(s.nameEn);
        if (typeof s.level === 'number') setLevel(s.level);
        if (s.school && ALL_SCHOOLS.includes(s.school as MagicSchool)) setSchool(s.school as MagicSchool);
        if (s.castingTime) setCastingTime(s.castingTime);
        if (s.range) setRange(s.range);
        if (s.duration) setDuration(s.duration);
        if (typeof s.concentration === 'boolean') setConcentration(s.concentration);
        if (typeof s.ritual === 'boolean') setRitual(s.ritual);
        if (typeof s.verbal === 'boolean') setVerbal(s.verbal);
        if (typeof s.somatic === 'boolean') setSomatic(s.somatic);
        if (typeof s.material === 'boolean') setMaterial(s.material);
        if (s.materialDesc) setMaterialDesc(s.materialDesc);
        if (Array.isArray(s.classes)) {
          const validClasses = s.classes.filter((c: any) => ALL_CLASSES.includes(c as DndClass));
          if (validClasses.length > 0) setSelectedClasses(validClasses as DndClass[]);
        }
        if (s.damageType) setDamageType(s.damageType);
        if (s.origin) setOrigin(s.origin);
        if (s.description) setDescription(s.description);
        if (s.higherLevels) setHigherLevels(s.higherLevels);

        // Auto-match best BG3 icon
        const queryTerm = (s.suggestedIcon || s.nameEn || s.name || s.damageType || '').toLowerCase();
        const matchedIcon = bg3List.find(
          (ic) => ic.name.toLowerCase().includes(queryTerm) || ic.key.toLowerCase().includes(queryTerm)
        );
        if (matchedIcon) {
          setBg3IconUrl(matchedIcon.url);
          setBg3IconName(matchedIcon.name);
          setIcon(matchedIcon.key);
        }

        setAiSuccessMsg(
          language === 'es'
            ? `¡Hechizo generado con éxito mediante ${data.providerUsed || 'IA'}!`
            : `Spell successfully generated with ${data.providerUsed || 'AI'}!`
        );
      }
    } catch (err: any) {
      setAiError(err.message || 'Error al conectar con el servicio de IA');
    } finally {
      setAiLoading(false);
    }
  };

  const toggleClass = (cls: DndClass) => {
    setSelectedClasses((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newId = `custom-${Date.now()}`;

    // Cache local image with the new ID for instant resolution
    if (bg3IconUrl) {
      saveLocalCustomImage(newId, bg3IconUrl);
      saveLocalCustomImage(bg3IconUrl, bg3IconUrl);
    }

    const newSpell: Spell = {
      id: newId,
      name: name.trim(),
      nameEn: nameEn.trim() || name.trim(),
      level,
      school,
      schoolEn: school,
      castingTime,
      range,
      duration,
      components: {
        verbal,
        somatic,
        material,
        materialDescription: material ? materialDesc : undefined,
      },
      concentration,
      ritual,
      classes: selectedClasses.length > 0 ? selectedClasses : ['Mago'],
      description: description.trim(),
      higherLevels: higherLevels.trim() || undefined,
      icon,
      bg3IconUrl: bg3IconUrl || undefined,
      bg3IconName: bg3IconName || undefined,
      iconUrl: bg3IconUrl || undefined,
      isCustom: true,
      version: '2024',
      source: 'Homebrew',
      primordialMagic: primordialMagic || undefined,
      damageType: damageType.trim() || undefined,
      origin,
    };

    onSave(newSpell);
  };

  // Preview spell for live icon rendering
  const previewSpell: Spell = {
    id: 'custom-preview',
    name: name || 'Nuevo Hechizo',
    nameEn: nameEn || 'New Spell',
    level,
    school,
    schoolEn: school,
    castingTime,
    range,
    duration,
    concentration,
    ritual,
    version: '2024',
    source: 'Homebrew',
    components: { verbal, somatic, material },
    classes: selectedClasses,
    description,
    icon,
    bg3IconUrl,
    iconUrl: bg3IconUrl,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0c141a] border border-[#213540] shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1b2b35] bg-[#0f1920]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#14282c] border border-[#bafafd]/30 text-[#bafafd]">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold tracking-wide text-slate-100 uppercase">
                {language === 'es' ? 'Crear Hechizo Casero' : 'Create Homebrew Spell'}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'es'
                  ? 'Añade tu propia creación mágica a tu compendio arcano con iconos oficiales o importados'
                  : 'Add your custom spell with official BG3 or imported artwork'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl bg-[#14232c] hover:bg-[#1a2e3a] text-slate-400 hover:text-white border border-[#213744] transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* AI SPELL GENERATOR PANEL */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#10242e] via-[#0d1c23] to-[#0a151b] border border-[#bafafd]/30 shadow-lg space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#bafafd]/10 text-[#bafafd]">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-[#bafafd] uppercase tracking-wide">
                    {language === 'es' ? 'Crear Hechizo con Inteligencia Artificial' : 'AI Spell Creator'}
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    {language === 'es'
                      ? 'Cerebras AI (ultra-rápido) y Mistral AI diseñan el conjuro con mecánicas y formato completo'
                      : 'Generate a complete D&D 5e balanced spell using Cerebras or Mistral AI'}
                  </p>
                </div>
              </div>

              {/* Provider selector */}
              <div className="flex items-center gap-1 bg-[#0a1216] p-1 rounded-xl border border-[#1b2b35] text-xs">
                <button
                  type="button"
                  onClick={() => setAiProvider('auto')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    aiProvider === 'auto'
                      ? 'bg-[#14282c] text-[#bafafd] border border-[#bafafd]/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ⚡ Auto
                </button>
                <button
                  type="button"
                  onClick={() => setAiProvider('cerebras')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    aiProvider === 'cerebras'
                      ? 'bg-[#14282c] text-[#bafafd] border border-[#bafafd]/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Cerebras AI (Inferencia Ultra-Rápida)"
                >
                  Cerebras
                </button>
                <button
                  type="button"
                  onClick={() => setAiProvider('mistral')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    aiProvider === 'mistral'
                      ? 'bg-[#14282c] text-[#bafafd] border border-[#bafafd]/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Mistral AI (Alta Fidelidad D&D)"
                >
                  Mistral
                </button>
              </div>
            </div>

            {/* Prompt input */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleGenerateWithAi();
                    }
                  }}
                  placeholder={
                    language === 'es'
                      ? 'Escribe tu idea (ej. Rayo de escarcha negra que congela y roba vida, Lluvia de dagas sombrías...)'
                      : 'Describe your idea (e.g. Shadow frost ray that slows and steals life, Spectral blade storm...)'
                  }
                  className="w-full pl-3.5 pr-28 py-2.5 rounded-xl bg-[#091116] border border-[#213540] text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-[#bafafd] text-xs sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleGenerateWithAi()}
                  disabled={aiLoading || !aiPrompt.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-lg bg-[#bafafd] hover:bg-[#cbfcfe] disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  {aiLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>{aiLoading ? 'Generando...' : 'Generar'}</span>
                </button>
              </div>

              {/* Inspiration Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[11px] text-slate-400 font-medium mr-1">Inspiración rápida:</span>
                {AI_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setAiPrompt(preset.prompt);
                      handleGenerateWithAi(preset.prompt);
                    }}
                    className="px-2.5 py-0.5 rounded-full bg-[#13232c] hover:bg-[#1a3340] border border-[#213744] hover:border-[#bafafd]/50 text-[11px] text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Messages */}
            {aiSuccessMsg && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{aiSuccessMsg}</span>
              </div>
            )}
            {aiError && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{aiError}</span>
              </div>
            )}
          </div>

          <form id="custom-spell-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Primary Grid: Names, Level, School */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
              <div>
                <label className="block font-medium mb-1 text-slate-300">
                  {language === 'es' ? 'Nombre en Español: *' : 'Spanish Name: *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ej: Lluvia de Espadas, Rayo Espectral..."
                  className="w-full bg-[#14222a] text-slate-100 rounded-lg px-3 py-2 border border-[#213540] focus:outline-hidden focus:border-[#bafafd]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-slate-300">
                  {language === 'es' ? 'Nombre en Inglés:' : 'English Name:'}
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Spectral Ray, Blade Storm..."
                  className="w-full bg-[#14222a] text-slate-100 rounded-lg px-3 py-2 border border-[#213540] focus:outline-hidden focus:border-[#bafafd]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-slate-300">
                  {language === 'es' ? 'Nivel de Conjuro:' : 'Spell Level:'}
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  className="w-full bg-[#14222a] text-slate-100 rounded-lg px-3 py-2 border border-[#213540] focus:outline-hidden focus:border-[#bafafd] cursor-pointer"
                >
                  <option value={0}>{language === 'es' ? 'Truco (Nivel 0)' : 'Cantrip (Level 0)'}</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {language === 'es' ? `Nivel ${lvl}` : `Level ${lvl}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1 text-slate-300">
                  {language === 'es' ? 'Escuela de Magia:' : 'Magic School:'}
                </label>
                <select
                  value={school}
                  onChange={(e) => setSchool(e.target.value as MagicSchool)}
                  className="w-full bg-[#14222a] text-slate-100 rounded-lg px-3 py-2 border border-[#213540] focus:outline-hidden focus:border-[#bafafd] cursor-pointer"
                >
                  {ALL_SCHOOLS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1 text-slate-300">
                  {language === 'es' ? 'Tipo de daño (opcional):' : 'Damage type (optional):'}
                </label>
                <div className="flex gap-2">
                  <select
                    value={DAMAGE_TYPES.some((d) => d.name.toLowerCase() === damageType.toLowerCase()) ? damageType : (damageType ? 'custom' : '')}
                    onChange={(e) => {
                      if (e.target.value !== 'custom') {
                        setDamageType(e.target.value);
                      }
                    }}
                    className="w-1/2 bg-[#14222a] text-slate-100 rounded-lg px-2.5 py-2 border border-[#213540] focus:outline-hidden focus:border-[#bafafd] cursor-pointer text-xs"
                  >
                    <option value="">{language === 'es' ? '(Sin daño / Ninguno)' : '(No damage)'}</option>
                    {DAMAGE_TYPES.map((dt) => (
                      <option key={dt.name} value={dt.name}>
                        {language === 'es' ? dt.name : dt.nameEn}
                      </option>
                    ))}
                    <option value="custom">{language === 'es' ? 'Personalizado / Varios...' : 'Custom / Multiple...'}</option>
                  </select>
                  <input
                    type="text"
                    value={damageType}
                    onChange={(e) => setDamageType(e.target.value)}
                    placeholder="Fuego, Fuerza, Frío..."
                    className="w-1/2 bg-[#14222a] text-slate-100 rounded-lg px-2.5 py-2 border border-[#213540] focus:outline-hidden focus:border-[#bafafd] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1 text-slate-300">
                  {language === 'es' ? 'Magia Primordial:' : 'Primordial Magic:'}
                </label>
                <select
                  value={primordialMagic}
                  onChange={(e) => setPrimordialMagic(e.target.value as PrimordialMagic | '')}
                  className="w-full bg-[#14222a] text-slate-100 rounded-lg px-3 py-2 border border-[#213540] focus:outline-hidden focus:border-[#bafafd] cursor-pointer"
                >
                  <option value="">{language === 'es' ? '(Automática por afinidad canónica)' : '(Auto by canonical affinity)'}</option>
                  {PRIMORDIAL_MAGICS.map((p) => (
                    <option key={p.name} value={p.name}>
                      {language === 'es' ? p.name : p.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1 text-slate-300">
                  {language === 'es' ? 'Origen de la magia:' : 'Spell origin:'}
                </label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value as SpellOrigin)}
                  className="w-full bg-[#14222a] text-slate-100 rounded-lg px-3 py-2 border border-[#213540] focus:outline-hidden focus:border-[#bafafd] cursor-pointer"
                >
                  {SPELL_ORIGINS.map((orig) => (
                    <option key={orig.name} value={orig.name}>
                      {language === 'es' ? orig.name : orig.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ARTWORK & ICON SELECTION SYSTEM */}
            <div className="p-4 rounded-2xl bg-[#0a1217] border border-[#1b2b35] space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <SpellIcon spell={previewSpell} size="md" className="w-14 h-14 shrink-0" />
                  <div>
                    <label className="block text-xs font-bold text-slate-200">
                      {language === 'es' ? 'Icono y Arte del Hechizo' : 'Spell Artwork & Icon'}
                    </label>
                    <span className="text-[11px] text-[#bafafd] font-mono truncate block max-w-xs">
                      {bg3IconName || icon || 'Fireball Icon'}
                    </span>
                  </div>
                </div>

                {/* Tabs: BG3 vs Mis Importados vs Oficial */}
                <div className="flex items-center gap-1 bg-[#101b22] p-1 rounded-xl border border-[#213540] text-xs">
                  <button
                    type="button"
                    onClick={() => setIconMode('bg3')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      iconMode === 'bg3'
                        ? 'bg-[#14282c] text-[#bafafd] border border-[#bafafd]/50'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>Baldur's Gate 3 ({bg3List.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIconMode('custom')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      iconMode === 'custom'
                        ? 'bg-[#14282c] text-[#bafafd] border border-[#bafafd]/50'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Mis Iconos Importados ({Object.keys(customGallery).length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIconMode('official')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      iconMode === 'official'
                        ? 'bg-[#14282c] text-[#bafafd] border border-[#bafafd]/50'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>D&D Oficial</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: Baldur's Gate 3 Complete Catalog */}
              {iconMode === 'bg3' && (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={bg3Search}
                      onChange={(e) => {
                        setBg3Search(e.target.value);
                        setBg3VisibleCount(32);
                      }}
                      placeholder={
                        language === 'es'
                          ? "Buscar en Baldur's Gate 3 (ej. fire, blade, cure, ice, shadow, ray, dark, shield)..."
                          : "Search Baldur's Gate 3 (e.g. fire, blade, cure, ice, shadow, ray, dark, shield)..."
                      }
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#14222a] border border-[#213540] text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-[#bafafd] text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 max-h-56 overflow-y-auto p-2.5 bg-[#091116] rounded-xl border border-[#182630]">
                    {filteredBg3Icons.map((item) => {
                      const isSelected = bg3IconUrl === item.url || icon === item.key;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => {
                            setBg3IconUrl(item.url);
                            setBg3IconName(item.name);
                            setIcon(item.key);
                          }}
                          className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer group ${
                            isSelected
                              ? 'bg-[#14282c] border-[#bafafd] ring-2 ring-[#bafafd]/30 scale-105'
                              : 'bg-[#111c23] border-[#213744] hover:border-slate-400 hover:scale-102'
                          }`}
                          title={item.name}
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 flex items-center justify-center">
                            <img
                              src={item.url}
                              alt={item.name}
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <span className="text-[9px] font-medium text-slate-300 truncate w-full text-center">
                            {item.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {bg3VisibleCount < bg3List.length && (
                    <div className="flex justify-center pt-1">
                      <button
                        type="button"
                        onClick={() => setBg3VisibleCount((prev) => prev + 32)}
                        className="px-4 py-1.5 rounded-lg bg-[#14282c] hover:bg-[#1a383e] text-[#bafafd] border border-[#bafafd]/40 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        + Cargar más iconos BG3 (Mostrando {filteredBg3Icons.length} de {bg3List.length})
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: User Custom Imported Icons & Upload */}
              {iconMode === 'custom' && (
                <div className="space-y-4">
                  {/* Upload Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#091116] border border-[#1e2f3a]">
                    {/* File Upload Button */}
                    <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-[#263e4f] text-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-[#14282c] hover:bg-[#1a383e] text-[#bafafd] border border-[#bafafd]/50 font-semibold transition-colors cursor-pointer flex items-center gap-2 text-xs"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Subir Imagen desde mi PC...</span>
                      </button>
                      <span className="text-[10px] text-slate-400">PNG, JPG, WebP o SVG (se guarda localmente)</span>
                    </div>

                    {/* URL Input */}
                    <div className="flex flex-col justify-center space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Pegar URL de Imagen:</label>
                      <div className="flex gap-1.5">
                        <input
                          type="url"
                          value={externalUrlInput}
                          onChange={(e) => setExternalUrlInput(e.target.value)}
                          placeholder="https://ejemplo.com/icono.png"
                          className="flex-1 px-3 py-1.5 rounded-lg bg-[#14232c] border border-[#213744] text-slate-100 text-xs focus:outline-hidden focus:border-[#bafafd]"
                        />
                        <button
                          type="button"
                          onClick={handleApplyExternalUrl}
                          className="px-3 py-1.5 rounded-lg bg-[#14282c] hover:bg-[#1a383e] text-[#bafafd] border border-[#bafafd]/40 text-xs font-semibold cursor-pointer"
                        >
                          Usar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Imported Images Gallery */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 mb-2">
                      Iconos que has importado previamente ({Object.keys(customGallery).length}):
                    </h4>
                    {Object.keys(customGallery).length === 0 ? (
                      <div className="p-6 rounded-xl bg-[#091116] border border-[#182630] text-center text-slate-400 text-xs">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-500" />
                        Aún no has importado imágenes personalizadas. ¡Sube un archivo o pega una URL arriba!
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 max-h-56 overflow-y-auto p-2.5 bg-[#091116] rounded-xl border border-[#182630]">
                        {Object.entries(customGallery).map(([key, dataUrl]) => {
                          const isSelected = bg3IconUrl === dataUrl || icon === key;
                          return (
                            <div
                              key={key}
                              onClick={() => {
                                setBg3IconUrl(dataUrl);
                                setBg3IconName(key);
                                setIcon(key);
                              }}
                              className={`relative p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer group ${
                                isSelected
                                  ? 'bg-[#14282c] border-[#bafafd] ring-2 ring-[#bafafd]/30 scale-105'
                                  : 'bg-[#111c23] border-[#213744] hover:border-slate-400'
                              }`}
                            >
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 flex items-center justify-center">
                                <OfficialSpellLineIcon
                                  iconUrl={dataUrl}
                                  name={key}
                                  school={school}
                                  className="w-full h-full group-hover:scale-110 transition-transform"
                                />
                              </div>
                              <span className="text-[9px] font-medium text-slate-300 truncate w-full text-center">
                                {key.replace(/^custom_\d+_/, '')}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteCustom(key, e)}
                                title="Eliminar de mi galería"
                                className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-rose-950 text-rose-300 border border-rose-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-900 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: D&D Official / Spellbook Icons */}
              {iconMode === 'official' && (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 max-h-56 overflow-y-auto p-2.5 bg-[#091116] rounded-xl border border-[#182630]">
                  {(officialSpellbookIcons as any[]).map((item) => {
                    const isSelected = bg3IconUrl === item.iconUrl || icon === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setBg3IconUrl(item.iconUrl);
                          setBg3IconName(item.name);
                          setIcon(item.id);
                        }}
                        className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer group ${
                          isSelected
                            ? 'bg-[#14282c] border-[#bafafd] ring-2 ring-[#bafafd]/30 scale-105'
                            : 'bg-[#111c23] border-[#213744] hover:border-slate-400'
                        }`}
                        title={`${item.name} (${item.school})`}
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 flex items-center justify-center">
                          <OfficialSpellLineIcon
                            iconUrl={item.iconUrl}
                            name={item.name}
                            school={item.school}
                            className="w-full h-full group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <span className="text-[9px] font-medium text-slate-300 truncate w-full text-center">
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Casting Parameters: Time, Range, Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-medium mb-1 text-slate-300">
                  {language === 'es' ? 'Tiempo de lanzamiento:' : 'Casting Time:'}
                </label>
                <input
                  type="text"
                  value={castingTime}
                  onChange={(e) => setCastingTime(e.target.value)}
                  className="w-full bg-[#14222a] text-slate-100 rounded-lg px-3 py-2 border border-[#213540] focus:outline-hidden focus:border-[#bafafd]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-slate-300">
                  {language === 'es' ? 'Alcance:' : 'Range:'}
                </label>
                <input
                  type="text"
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                  className="w-full bg-[#14222a] text-slate-100 rounded-lg px-3 py-2 border border-[#213540] focus:outline-hidden focus:border-[#bafafd]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-slate-300">
                  {language === 'es' ? 'Duración:' : 'Duration:'}
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-[#14222a] text-slate-100 rounded-lg px-3 py-2 border border-[#213540] focus:outline-hidden focus:border-[#bafafd]"
                />
              </div>
            </div>

            {/* Checkboxes: Concentration, Ritual, Components */}
            <div className="flex flex-wrap gap-4 text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={concentration}
                  onChange={(e) => setConcentration(e.target.checked)}
                  className="rounded bg-[#14222a] border-[#213540] text-sky-500 focus:ring-sky-500"
                />
                <span>{language === 'es' ? 'Requiere Concentración' : 'Requires Concentration'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ritual}
                  onChange={(e) => setRitual(e.target.checked)}
                  className="rounded bg-[#14222a] border-[#213540] text-sky-500 focus:ring-sky-500"
                />
                <span>{language === 'es' ? 'Se puede lanzar como Ritual' : 'Ritual Spell'}</span>
              </label>

              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-400">
                  {language === 'es' ? 'Componentes:' : 'Components:'}
                </span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verbal}
                    onChange={(e) => setVerbal(e.target.checked)}
                    className="rounded text-sky-500"
                  />
                  <span>V</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={somatic}
                    onChange={(e) => setSomatic(e.target.checked)}
                    className="rounded text-sky-500"
                  />
                  <span>S</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={material}
                    onChange={(e) => setMaterial(e.target.checked)}
                    className="rounded text-sky-500"
                  />
                  <span>M</span>
                </label>
              </div>
            </div>

            {material && (
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-300">
                  {language === 'es' ? 'Descripción de componentes materiales:' : 'Material description:'}
                </label>
                <input
                  type="text"
                  value={materialDesc}
                  onChange={(e) => setMaterialDesc(e.target.value)}
                  placeholder="ej: un trozo de cuarzo o una perla valorada en 100 po..."
                  className="w-full bg-[#14222a] text-slate-100 text-xs rounded-lg px-3 py-2 border border-[#213540] focus:outline-hidden focus:border-[#bafafd]"
                />
              </div>
            )}

            {/* Classes Multi-select */}
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-300">
                {language === 'es' ? 'Clases que pueden aprenderlo:' : 'Classes:'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_CLASSES.map((cls) => {
                  const active = selectedClasses.includes(cls);
                  return (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => toggleClass(cls)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                        active
                          ? 'bg-sky-950/60 border-sky-500/60 text-[#bafafd] font-bold'
                          : 'bg-[#14222a] border-[#213540] text-slate-400 hover:text-white'
                      }`}
                    >
                      {cls}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description & Formatted Markdown Preview */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">
                  {language === 'es' ? 'Descripción del Hechizo: *' : 'Spell Description: *'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowDescPreview(!showDescPreview)}
                  className="text-[11px] text-[#bafafd] hover:text-white font-medium cursor-pointer"
                >
                  {showDescPreview ? '✏️ Modo Editor' : '👁️ Vista Previa Formateada'}
                </button>
              </div>

              {showDescPreview ? (
                <div className="w-full min-h-28 max-h-48 overflow-y-auto p-3 rounded-lg bg-[#091116] border border-[#213540] text-xs leading-relaxed">
                  <MarkdownText content={description || '(Sin descripción)'} />
                </div>
              ) : (
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe los efectos mecánicos, tiradas de salvación y alcance del conjuro (soporta **negrita**, *cursiva*, etc.)..."
                  className="w-full bg-[#14222a] text-slate-100 text-xs rounded-lg px-3 py-2 border border-[#213540] focus:outline-hidden focus:border-[#bafafd] font-sans"
                />
              )}
            </div>

            {/* Higher Levels */}
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-300">
                {language === 'es' ? 'A Niveles Superiores (opcional):' : 'At Higher Levels (optional):'}
              </label>
              <input
                type="text"
                value={higherLevels}
                onChange={(e) => setHigherLevels(e.target.value)}
                placeholder="ej: El daño aumenta en 1d8 por cada nivel de espacio por encima de 1..."
                className="w-full bg-[#14222a] text-slate-100 text-xs rounded-lg px-3 py-2 border border-[#213540] focus:outline-hidden focus:border-[#bafafd]"
              />
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#1b2b35] bg-[#0f1920]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer"
          >
            {language === 'es' ? 'Cancelar' : 'Cancel'}
          </button>
          <button
            type="submit"
            form="custom-spell-form"
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#bafafd] hover:bg-[#c7fbfe] text-slate-950 font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'es' ? 'Guardar Hechizo' : 'Save Spell'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
