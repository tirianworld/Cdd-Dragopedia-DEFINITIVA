import React, { useState, useMemo, useRef } from 'react';
import {
  X,
  Sparkles,
  Upload,
  Link as LinkIcon,
  Search,
  Check,
  Github,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Layers,
  Wand2,
  ExternalLink,
  Flame,
  Info,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import {
  Spell,
  MagicSchool,
  DndClass,
  PrimordialMagic,
  SpellOrigin,
} from '../types';
import { ALL_CLASSES, ALL_SCHOOLS } from '../data/spells';
import { ALL_SPELLS } from '../data/allSpells';
import { PRIMORDIAL_MAGICS } from '../data/primordialMagic';
import { SPELL_ORIGINS } from '../data/spellOrigins';
import { DAMAGE_TYPES } from '../data/damageTypes';
import bg3IconsData from '../data/bg3Icons.json';
import officialSpellbookIcons from '../data/officialSpellbookIcons.json';
import { getSchoolTheme } from '../data/schools';
import { githubService, GitHubSaveResult } from '../services/githubService';
import { SpellIcon } from './SpellIcon';
import { OfficialSpellLineIcon } from './OfficialSpellLineIcon';
import { MarkdownText } from './MarkdownText';
import { saveLocalCustomImage, removeLocalCustomImage, getCachedImageUrl } from '../services/imageService';
import { compressImageIcon } from '../services/storageHelper';

interface SpellEditModalProps {
  spell: Spell;
  isOpen: boolean;
  onClose: () => void;
  onSaveLocal: (updatedSpell: Spell) => void;
  onSaveGitHubSuccess?: (result: GitHubSaveResult) => void;
  language: 'es' | 'en';
}

const CLASSIC_ICONS = [
  'fireball',
  'cure_wounds',
  'magic_missile',
  'shield',
  'mage_armor',
  'eldritch_blast',
  'misty_step',
  'counterspell',
  'lightning_bolt',
  'ray_of_frost',
  'thunderwave',
  'invisibility',
  'fly',
  'haste',
  'sacred_flame',
  'guiding_bolt',
  'toll_the_dead',
  'spiritual_weapon',
  'spirit_guardians',
  'hold_person',
  'polymorph',
  'revivify',
  'banishment',
  'wall_of_fire',
  'cone_of_cold',
  'disintegrate',
  'teleport',
  'finger_of_death',
  'dominate_monster',
  'meteor_swarm',
  'wish',
  'time_stop',
  'power_word_kill',
  'sleep',
  'web',
  'darkness',
];

type TabType = 'general' | 'icon' | 'rules' | 'github';

export const SpellEditModal: React.FC<SpellEditModalProps> = ({
  spell,
  isOpen,
  onClose,
  onSaveLocal,
  onSaveGitHubSuccess,
  language,
}) => {
  // Form State
  const [name, setName] = useState(spell.name);
  const [nameEn, setNameEn] = useState(spell.nameEn || spell.name);
  const [level, setLevel] = useState<number>(spell.level);
  const [school, setSchool] = useState<MagicSchool>(spell.school);
  const [primordialMagic, setPrimordialMagic] = useState<PrimordialMagic | undefined>(
    spell.primordialMagic
  );
  const [origin, setOrigin] = useState<SpellOrigin | undefined>(spell.origin);
  const [damageType, setDamageType] = useState<string>(spell.damageType || '');
  const [selectedClasses, setSelectedClasses] = useState<DndClass[]>(spell.classes || ['Mago']);

  // Casting & Rules
  const [castingTime, setCastingTime] = useState(spell.castingTime || '1 acción');
  const [range, setRange] = useState(spell.range || '18 metros (60 pies)');
  const [duration, setDuration] = useState(spell.duration || 'Instantánea');
  const [concentration, setConcentration] = useState(spell.concentration || false);
  const [ritual, setRitual] = useState(spell.ritual || false);
  const [verbal, setVerbal] = useState(spell.components?.verbal ?? true);
  const [somatic, setSomatic] = useState(spell.components?.somatic ?? true);
  const [material, setMaterial] = useState(spell.components?.material ?? false);
  const [materialDescription, setMaterialDescription] = useState(
    spell.components?.materialDescription || ''
  );
  const [source, setSource] = useState(spell.source || 'Dracopedia / Grimorio Sagrado');

  // Text & Lore
  const [description, setDescription] = useState(spell.description || '');
  const [higherLevels, setHigherLevels] = useState(spell.higherLevels || '');
  const [showDescPreview, setShowDescPreview] = useState(false);

  // Icon State
  const initialCached = getCachedImageUrl(spell.bg3IconUrl || spell.iconUrl, spell.id);
  const [currentIcon, setCurrentIcon] = useState<string>(spell.icon || 'bendicion_astraea');
  const [currentIconUrl, setCurrentIconUrl] = useState<string>(
    initialCached || spell.iconUrl || spell.bg3IconUrl || ''
  );
  const [bg3IconUrl, setBg3IconUrl] = useState<string | null | undefined>(
    initialCached || spell.bg3IconUrl || spell.iconUrl
  );
  const [bg3IconName, setBg3IconName] = useState<string | null | undefined>(
    spell.bg3IconName || spell.name
  );

  // Icon Picker sub-mode: default to 'official' so users see hundreds of working HD icons
  const [iconMode, setIconMode] = useState<'official' | 'bg3' | 'upload' | 'url' | 'classic'>(
    'official'
  );

  // Search & Pagination states
  const [officialSearch, setOfficialSearch] = useState('');
  const [officialSchoolFilter, setOfficialSchoolFilter] = useState('all');

  const [bg3Search, setBg3Search] = useState('');
  const [bg3VisibleCount, setBg3VisibleCount] = useState(24);
  const [bg3ErrorKeys, setBg3ErrorKeys] = useState<Record<string, boolean>>({});

  const [externalUrlInput, setExternalUrlInput] = useState('');
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(initialCached || null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('general');

  // GitHub Sync State
  const [gitHubToken, setGitHubToken] = useState(githubService.getToken());
  const [isSavingGitHub, setIsSavingGitHub] = useState(false);
  const [gitHubStatus, setGitHubStatus] = useState<{
    type: 'idle' | 'success' | 'error' | 'loading';
    message: string;
    commitUrl?: string;
    fileUrl?: string;
  }>({ type: 'idle', message: '' });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state whenever spell prop changes
  React.useEffect(() => {
    setName(spell.name);
    setNameEn(spell.nameEn || spell.name);
    setLevel(spell.level);
    setSchool(spell.school);
    setPrimordialMagic(spell.primordialMagic);
    setOrigin(spell.origin);
    setDamageType(spell.damageType || '');
    setSelectedClasses(spell.classes || ['Mago']);
    setCastingTime(spell.castingTime || '1 acción');
    setRange(spell.range || '18 metros (60 pies)');
    setDuration(spell.duration || 'Instantánea');
    setConcentration(spell.concentration || false);
    setRitual(spell.ritual || false);
    setVerbal(spell.components?.verbal ?? true);
    setSomatic(spell.components?.somatic ?? true);
    setMaterial(spell.components?.material ?? false);
    setMaterialDescription(spell.components?.materialDescription || '');
    setSource(spell.source || 'Dracopedia / Grimorio Sagrado');
    setDescription(spell.description || '');
    setHigherLevels(spell.higherLevels || '');
    setCurrentIcon(spell.icon || 'bendicion_astraea');
    const cached = getCachedImageUrl(spell.bg3IconUrl || spell.iconUrl, spell.id);
    setCurrentIconUrl(cached || spell.iconUrl || spell.bg3IconUrl || '');
    setBg3IconUrl(cached || spell.bg3IconUrl || spell.iconUrl);
    setBg3IconName(spell.bg3IconName || spell.name);
    setUploadedBase64(cached && cached.startsWith('data:') ? cached : null);
  }, [spell.id, spell.updatedAt, spell.iconUrl, spell.bg3IconUrl]);

  // Prepare Official D&D Spellbook Icons list
  const filteredOfficialIcons = useMemo(() => {
    return (
      officialSpellbookIcons as Array<{
        id: string;
        name: string;
        nameEn: string;
        school: string;
        iconUrl: string;
      }>
    )
      .filter((item) => {
        const matchSchool =
          officialSchoolFilter === 'all' ||
          item.school.toLowerCase() === officialSchoolFilter.toLowerCase();
        if (!matchSchool) return false;
        if (!officialSearch.trim()) return true;
        const q = officialSearch.toLowerCase().trim();
        return (
          item.name.toLowerCase().includes(q) ||
          item.nameEn.toLowerCase().includes(q) ||
          item.school.toLowerCase().includes(q)
        );
      })
      .slice(0, 64);
  }, [officialSearch, officialSchoolFilter]);

  // Prepare BG3 Icons list
  const bg3List = useMemo(() => {
    return Object.entries(
      bg3IconsData as Record<string, { name: string; file: string; url: string }>
    ).map(([key, data]) => ({
      key,
      name: data.name,
      url: data.url,
    }));
  }, []);

  const filteredBg3Icons = useMemo(() => {
    if (!bg3Search.trim()) return bg3List.slice(0, bg3VisibleCount);
    const q = bg3Search.toLowerCase().trim();
    return bg3List
      .filter((item) => item.name.toLowerCase().includes(q) || item.key.includes(q))
      .slice(0, bg3VisibleCount);
  }, [bg3List, bg3Search, bg3VisibleCount]);

  if (!isOpen) return null;

  const schoolTheme = getSchoolTheme(school);
  const schoolColor = schoolTheme.hexColor;

  // Live preview spell object
  const previewSpell: Spell = {
    ...spell,
    name: name.trim() || 'Nombre de Hechizo',
    nameEn: nameEn.trim() || name.trim(),
    level,
    school,
    schoolEn: school,
    primordialMagic,
    origin,
    damageType: damageType || undefined,
    castingTime,
    range,
    duration,
    concentration,
    ritual,
    components: {
      verbal,
      somatic,
      material,
      materialDescription: material ? materialDescription : undefined,
    },
    classes: selectedClasses,
    description,
    higherLevels: higherLevels || undefined,
    source,
    icon: currentIcon,
    iconUrl: currentIconUrl,
    bg3IconUrl,
    bg3IconName,
    isEdited: true,
    isCustom: true,
  };

  const toggleClass = (cls: DndClass) => {
    setSelectedClasses((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
    );
  };

  // Handle Image Upload from File
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen (PNG, JPG, WebP o SVG).');
      return;
    }

    // Automatically compress to icon resolution to keep storage under quota limits
    compressImageIcon(file, 256, 256, 0.85)
      .then((compressed) => {
        setUploadedBase64(compressed);
        setCurrentIconUrl(compressed);
        setBg3IconUrl(compressed);
        setBg3IconName(file.name);
        saveLocalCustomImage(spell.id, compressed);
      })
      .catch(() => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          setUploadedBase64(result);
          setCurrentIconUrl(result);
          setBg3IconUrl(result);
          setBg3IconName(file.name);
          saveLocalCustomImage(spell.id, result);
        };
        reader.readAsDataURL(file);
      });
  };

  // Apply External Image URL
  const handleApplyUrl = () => {
    if (!externalUrlInput.trim()) return;
    const url = externalUrlInput.trim();
    setCurrentIconUrl(url);
    setBg3IconUrl(url);
    setBg3IconName('Custom Image URL');
    setUploadedBase64(null);
  };

  // Select Official D&D Spellbook Icon
  const handleSelectOfficial = (item: {
    id: string;
    name: string;
    nameEn: string;
    school: string;
    iconUrl: string;
  }) => {
    setCurrentIcon(item.id);
    setCurrentIconUrl(item.iconUrl);
    setBg3IconUrl(item.iconUrl);
    setBg3IconName(item.name);
    setUploadedBase64(null);
  };

  // Select BG3 Icon
  const handleSelectBg3 = (item: { name: string; url: string; key: string }) => {
    setCurrentIcon(item.key);
    setCurrentIconUrl(item.url);
    setBg3IconUrl(item.url);
    setBg3IconName(item.name);
    setUploadedBase64(null);
  };

  // Build the complete updated Spell object
  const buildSpellObject = (): Spell => {
    return {
      ...spell,
      name: name.trim() || spell.name,
      nameEn: nameEn.trim() || spell.nameEn || spell.name,
      level,
      school,
      schoolEn: school,
      primordialMagic,
      origin,
      damageType: damageType.trim() || undefined,
      castingTime,
      range,
      duration,
      concentration,
      ritual,
      components: {
        verbal,
        somatic,
        material,
        materialDescription: material ? materialDescription.trim() : undefined,
      },
      classes: selectedClasses.length > 0 ? selectedClasses : ['Mago'],
      description: description.trim(),
      higherLevels: higherLevels.trim() || undefined,
      source: source.trim() || 'Dracopedia',
      icon: currentIcon,
      iconUrl: currentIconUrl || undefined,
      bg3IconUrl: bg3IconUrl || undefined,
      bg3IconName: bg3IconName || undefined,
      isCustom: true,
      isEdited: true,
      updatedAt: new Date().toISOString(),
    };
  };

  // Save Locally
  const handleSaveLocal = () => {
    const updated = buildSpellObject();
    if (uploadedBase64) {
      saveLocalCustomImage(updated.id, uploadedBase64);
      updated.iconUrl = uploadedBase64;
      updated.bg3IconUrl = uploadedBase64;
    } else {
      removeLocalCustomImage(updated.id);
    }
    onSaveLocal(updated);
    onClose();
  };

  // Save to GitHub
  const handleSaveToGitHub = async () => {
    const updated = buildSpellObject();
    setIsSavingGitHub(true);
    setGitHubStatus({
      type: 'loading',
      message: 'Sincronizando con el repositorio theworldoftirian/dragopedia...',
    });

    try {
      if (gitHubToken) {
        githubService.setToken(gitHubToken);
      }

      // Check access
      const access = await githubService.verifyAccess();
      if (!access.valid) {
        setGitHubStatus({
          type: 'error',
          message: `Error de permisos en GitHub: ${access.message}`,
        });
        setIsSavingGitHub(false);
        return;
      }

      // Perform Save
      const result = await githubService.saveSpell(updated, {
        commitMessage: `✨ Actualizar hechizo "${updated.name}" en Dracopedia`,
        customIconBase64: uploadedBase64 || undefined,
      });

      if (result.success) {
        setGitHubStatus({
          type: 'success',
          message: `¡Guardado con éxito en GitHub!`,
          commitUrl: result.commitUrl,
          fileUrl: result.fileUrl,
        });

        // Apply updated spell locally (with uploaded github image url if generated)
        const finalSpell = result.savedSpell || updated;

        // Ensure local cache maps both the spell ID and remote URL to uploadedBase64
        if (uploadedBase64) {
          saveLocalCustomImage(finalSpell.id, uploadedBase64);
          if (finalSpell.iconUrl) {
            saveLocalCustomImage(finalSpell.iconUrl, uploadedBase64);
          }
          if (finalSpell.bg3IconUrl) {
            saveLocalCustomImage(finalSpell.bg3IconUrl, uploadedBase64);
          }
        } else {
          removeLocalCustomImage(finalSpell.id);
        }

        onSaveLocal(finalSpell);

        if (onSaveGitHubSuccess) {
          onSaveGitHubSuccess(result);
        }
      } else {
        setGitHubStatus({
          type: 'error',
          message: result.message || 'Error desconocido al guardar en GitHub',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setGitHubStatus({
        type: 'error',
        message: `Excepción al conectar con GitHub: ${msg}`,
      });
    } finally {
      setIsSavingGitHub(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-[#0e161c] text-slate-100 rounded-2xl border border-[#1d2d38] shadow-2xl flex flex-col my-auto max-h-[94vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with Live Spell Preview Header */}
        <div
          className="relative px-6 py-4 border-b border-[#1b2a33] flex items-center justify-between gap-4"
          style={{
            background: `linear-gradient(135deg, ${schoolColor}25 0%, rgba(14,22,28,0.98) 75%)`,
          }}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Live spell icon widget */}
            <div className="relative group shrink-0">
              <SpellIcon spell={previewSpell} size="md" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#14282c] text-[#bafafd] border border-[#bafafd]/50">
                  {level === 0 ? 'TRUCO' : `NIVEL ${level}`}
                </span>
                <span
                  className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md border"
                  style={{
                    backgroundColor: `${schoolColor}20`,
                    color: schoolColor,
                    borderColor: `${schoolColor}50`,
                  }}
                >
                  {school}
                </span>
                {primordialMagic && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-950/60 text-amber-300 border border-amber-500/40">
                    {primordialMagic}
                  </span>
                )}
              </div>
              <h2 className="font-heading text-lg sm:text-xl font-bold tracking-wide text-slate-100 truncate mt-0.5">
                {name || 'Editar Hechizo'}
              </h2>
              <p className="text-xs text-slate-400 italic truncate">
                {nameEn && nameEn !== name ? `${nameEn} • ` : ''}
                {source}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#14232c] hover:bg-[#1a2e3a] text-slate-400 hover:text-white border border-[#213744] transition-colors cursor-pointer shrink-0"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[#1b2a33] bg-[#0c1419] px-4 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'general'
                ? 'border-[#bafafd] text-[#bafafd] bg-[#14232c]/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Datos & Textos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('icon')}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'icon'
                ? 'border-[#bafafd] text-[#bafafd] bg-[#14232c]/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Icono & Arte (D&D / BG3 / Subir)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'rules'
                ? 'border-[#bafafd] text-[#bafafd] bg-[#14232c]/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Reglas, Componentes & Clases</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('github')}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'github'
                ? 'border-[#bafafd] text-[#bafafd] bg-[#14232c]/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>GitHub Sync</span>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: General Info & Description */}
          {activeTab === 'general' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-slate-300">
                    Nombre en Español <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#14232c] border border-[#213744] text-slate-100 focus:outline-hidden focus:border-[#bafafd]"
                    placeholder="ej. Bendición de Astraea"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-slate-300">
                    Nombre en Inglés
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#14232c] border border-[#213744] text-slate-100 focus:outline-hidden focus:border-[#bafafd]"
                    placeholder="ej. Astraea's Blessing"
                  />
                </div>
              </div>

              {/* Level & School */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-slate-300">
                    Nivel del Hechizo (0 = Truco)
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#14232c] border border-[#213744] text-slate-100 focus:outline-hidden focus:border-[#bafafd] cursor-pointer"
                  >
                    <option value={0}>Nivel 0 (Truco / Cantrip)</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                      <option key={lvl} value={lvl}>
                        Nivel {lvl}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1 text-slate-300">
                    Escuela de Magia Arcana
                  </label>
                  <select
                    value={school}
                    onChange={(e) => setSchool(e.target.value as MagicSchool)}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#14232c] border border-[#213744] text-slate-100 focus:outline-hidden focus:border-[#bafafd] cursor-pointer"
                  >
                    {ALL_SCHOOLS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Primordial Magic & Planar Origin */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-slate-300">
                    Magia Primordial
                  </label>
                  <select
                    value={primordialMagic || ''}
                    onChange={(e) =>
                      setPrimordialMagic((e.target.value as PrimordialMagic) || undefined)
                    }
                    className="w-full px-2.5 py-2 rounded-lg bg-[#14232c] border border-[#213744] text-slate-100 focus:outline-hidden focus:border-[#bafafd] cursor-pointer"
                  >
                    <option value="">(Ninguna)</option>
                    {PRIMORDIAL_MAGICS.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1 text-slate-300">Origen Planar</label>
                  <select
                    value={origin || ''}
                    onChange={(e) => setOrigin((e.target.value as SpellOrigin) || undefined)}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#14232c] border border-[#213744] text-slate-100 focus:outline-hidden focus:border-[#bafafd] cursor-pointer"
                  >
                    <option value="">(Sin definir)</option>
                    {SPELL_ORIGINS.map((o) => (
                      <option key={o.name} value={o.name}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Damage Type & Source */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-slate-300">
                    Tipo de Daño / Efecto
                  </label>
                  <select
                    value={damageType}
                    onChange={(e) => setDamageType(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#14232c] border border-[#213744] text-slate-100 focus:outline-hidden focus:border-[#bafafd] cursor-pointer"
                  >
                    <option value="">Ninguno / Especial</option>
                    <option value="Curación">Curación</option>
                    {DAMAGE_TYPES.map((dt) => (
                      <option key={dt.name} value={dt.name}>
                        {dt.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1 text-slate-300">
                    Fuente / Grimorio
                  </label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#14232c] border border-[#213744] text-slate-100 focus:outline-hidden focus:border-[#bafafd]"
                    placeholder="Dracopedia / Grimorio Sagrado"
                  />
                </div>
              </div>

              {/* Spell Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-medium text-slate-300">
                    Descripción del Hechizo
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowDescPreview(!showDescPreview)}
                      className="text-[11px] text-[#bafafd] hover:text-white font-medium cursor-pointer"
                    >
                      {showDescPreview ? '✏️ Modo Editor' : '👁️ Vista Previa Formateada'}
                    </button>
                    <span className="text-[10px] text-slate-500">
                      {description.length} caracteres
                    </span>
                  </div>
                </div>

                {showDescPreview ? (
                  <div className="w-full min-h-36 max-h-60 overflow-y-auto p-3.5 rounded-lg bg-[#0e171d] border border-[#213744] text-xs leading-relaxed">
                    <MarkdownText content={description || '(Sin descripción)'} />
                  </div>
                ) : (
                  <textarea
                    rows={8}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#14232c] border border-[#213744] text-slate-100 focus:outline-hidden focus:border-[#bafafd] font-sans text-xs leading-relaxed"
                    placeholder="Escribe la descripción mágica completa del hechizo (soporta **negrita**, *cursiva*, etc.)..."
                  />
                )}
              </div>

              {/* Higher levels */}
              <div>
                <label className="block font-medium mb-1 text-slate-300">
                  A Niveles Superiores (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={higherLevels}
                  onChange={(e) => setHigherLevels(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#14232c] border border-[#213744] text-slate-100 focus:outline-hidden focus:border-[#bafafd] text-xs"
                  placeholder="Cuando lanzas este conjuro usando un espacio de conjuro de nivel mayor..."
                />
              </div>
            </div>
          )}

          {/* TAB 2: Icon & Artwork (Official D&D, BG3, Upload, URL, Classics) */}
          {activeTab === 'icon' && (
            <div className="space-y-4 text-xs">
              {/* Current Icon Preview Showcase */}
              <div className="p-4 rounded-xl bg-[#0a1014] border border-[#1b2a33] flex flex-col sm:flex-row items-center gap-5">
                <div className="flex flex-col items-center gap-2">
                  <SpellIcon spell={previewSpell} size="lg" />
                  <span className="text-[10px] font-mono text-slate-400">
                    Vista Previa en Vivo
                  </span>
                </div>

                <div className="flex-1 space-y-1.5 text-center sm:text-left">
                  <div className="text-sm font-bold text-slate-100 flex items-center justify-center sm:justify-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#bafafd]" />
                    <span>Arte del Hechizo Activo</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Nombre del icono:{' '}
                    <span className="font-mono text-[#bafafd]">
                      {bg3IconName || currentIcon}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400 break-all font-mono">
                    {currentIconUrl && currentIconUrl.startsWith('data:')
                      ? 'Imagen personalizada en memoria (Base64 local)'
                      : `URL: ${currentIconUrl ? currentIconUrl.substring(0, 85) + '...' : '(Defecto)'}`}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                      Alta Definición HD
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                      Sincronizado
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const original = ALL_SPELLS.find((s) => s.id === spell.id);
                        if (original) {
                          setCurrentIcon(original.icon || 'bendicion_astraea');
                          setCurrentIconUrl(original.iconUrl || original.bg3IconUrl || '');
                          setBg3IconUrl(original.bg3IconUrl || original.iconUrl || '');
                          setBg3IconName(original.bg3IconName || original.name);
                        } else {
                          setCurrentIcon('bendicion_astraea');
                          setCurrentIconUrl('');
                          setBg3IconUrl('');
                          setBg3IconName('');
                        }
                        setUploadedBase64(null);
                        removeLocalCustomImage(spell.id);
                      }}
                      className="text-[10px] px-2.5 py-0.5 rounded-md bg-[#14232c] hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-[#213744] hover:border-rose-500/40 transition-colors cursor-pointer flex items-center gap-1"
                      title="Restablecer el icono original no modificado"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Restaurar icono original</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sub-modes for Icon Picker */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border-b border-[#1b2a33] pb-3">
                <button
                  type="button"
                  onClick={() => setIconMode('official')}
                  className={`py-2 px-2.5 rounded-lg border text-center transition-all cursor-pointer font-semibold ${
                    iconMode === 'official'
                      ? 'bg-[#14282c] border-[#bafafd] text-[#bafafd]'
                      : 'bg-[#14232c] border-[#213744] text-slate-300 hover:text-white'
                  }`}
                >
                  Oficiales D&D (523)
                </button>
                <button
                  type="button"
                  onClick={() => setIconMode('upload')}
                  className={`py-2 px-2.5 rounded-lg border text-center transition-all cursor-pointer font-semibold ${
                    iconMode === 'upload'
                      ? 'bg-[#14282c] border-[#bafafd] text-[#bafafd]'
                      : 'bg-[#14232c] border-[#213744] text-slate-300 hover:text-white'
                  }`}
                >
                  Subir Archivo
                </button>
                <button
                  type="button"
                  onClick={() => setIconMode('bg3')}
                  className={`py-2 px-2.5 rounded-lg border text-center transition-all cursor-pointer font-semibold ${
                    iconMode === 'bg3'
                      ? 'bg-[#14282c] border-[#bafafd] text-[#bafafd]'
                      : 'bg-[#14232c] border-[#213744] text-slate-300 hover:text-white'
                  }`}
                >
                  Galería BG3 (396)
                </button>
                <button
                  type="button"
                  onClick={() => setIconMode('url')}
                  className={`py-2 px-2.5 rounded-lg border text-center transition-all cursor-pointer font-semibold ${
                    iconMode === 'url'
                      ? 'bg-[#14282c] border-[#bafafd] text-[#bafafd]'
                      : 'bg-[#14232c] border-[#213744] text-slate-300 hover:text-white'
                  }`}
                >
                  Pegar URL
                </button>
                <button
                  type="button"
                  onClick={() => setIconMode('classic')}
                  className={`py-2 px-2.5 rounded-lg border text-center transition-all cursor-pointer font-semibold ${
                    iconMode === 'classic'
                      ? 'bg-[#14282c] border-[#bafafd] text-[#bafafd]'
                      : 'bg-[#14232c] border-[#213744] text-slate-300 hover:text-white'
                  }`}
                >
                  Clásicos
                </button>
              </div>

              {/* MODE 1: Official D&D Spellbook Icons (Fast CDN, Zero 429) */}
              {iconMode === 'official' && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={officialSearch}
                        onChange={(e) => setOfficialSearch(e.target.value)}
                        placeholder="Buscar por nombre (ej. curar, fuego, bendición, rayo, escudo)..."
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#14232c] border border-[#213744] text-slate-100 focus:outline-hidden focus:border-[#bafafd]"
                      />
                    </div>
                    <select
                      value={officialSchoolFilter}
                      onChange={(e) => setOfficialSchoolFilter(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-[#14232c] border border-[#213744] text-slate-100 focus:outline-hidden focus:border-[#bafafd] cursor-pointer"
                    >
                      <option value="all">Todas las escuelas</option>
                      {ALL_SCHOOLS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Iconos oficiales D&D 5E de alta definición (Carga ultrarrápida sin límite de peticiones):
                  </p>

                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 max-h-72 overflow-y-auto p-2 bg-[#0a1014] rounded-xl border border-[#182630]">
                    {filteredOfficialIcons.map((item) => {
                      const isSelected =
                        currentIconUrl === item.iconUrl || currentIcon === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectOfficial(item)}
                          className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer group ${
                            isSelected
                              ? 'bg-[#14282c] border-[#bafafd] ring-2 ring-[#bafafd]/30 scale-105'
                              : 'bg-[#111c23] border-[#213744] hover:border-slate-400 hover:scale-102'
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
                </div>
              )}

              {/* MODE 2: BG3 Icons Grid with Staggering and Graceful Error Fallback */}
              {iconMode === 'bg3' && (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={bg3Search}
                      onChange={(e) => {
                        setBg3Search(e.target.value);
                        setBg3VisibleCount(24);
                      }}
                      placeholder="Buscar en Baldur's Gate 3 (ej. cure, heal, bless, divine, aid, shield)..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#14232c] border border-[#213744] text-slate-100 focus:outline-hidden focus:border-[#bafafd]"
                    />
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 max-h-72 overflow-y-auto p-2 bg-[#0a1014] rounded-xl border border-[#182630]">
                    {filteredBg3Icons.map((item) => {
                      const isSelected =
                        currentIconUrl === item.url || currentIcon === item.key;
                      const hasError = bg3ErrorKeys[item.key];

                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => handleSelectBg3(item)}
                          className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer group ${
                            isSelected
                              ? 'bg-[#14282c] border-[#bafafd] ring-2 ring-[#bafafd]/30 scale-105'
                              : 'bg-[#111c23] border-[#213744] hover:border-slate-400 hover:scale-102'
                          }`}
                          title={item.name}
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 flex items-center justify-center">
                            {!hasError ? (
                              <img
                                src={item.url}
                                alt={item.name}
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                onError={() => {
                                  setBg3ErrorKeys((prev) => ({
                                    ...prev,
                                    [item.key]: true,
                                  }));
                                }}
                                className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-cyan-950/50 text-[#bafafd] text-xs font-bold font-heading">
                                {item.name.substring(0, 2).toUpperCase()}
                              </div>
                            )}
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
                        onClick={() => setBg3VisibleCount((prev) => prev + 24)}
                        className="px-4 py-1.5 rounded-lg bg-[#14282c] hover:bg-[#1a383e] text-[#bafafd] border border-[#bafafd]/40 text-xs font-semibold cursor-pointer"
                      >
                        + Cargar más iconos BG3 (Mostrando {filteredBg3Icons.length} de {bg3List.length})
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* MODE 3: Upload Custom File */}
              {iconMode === 'upload' && (
                <div className="p-6 rounded-xl bg-[#0a1014] border border-dashed border-[#263e4f] text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#14232c] border border-[#213744] flex items-center justify-center mx-auto text-[#bafafd]">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100 text-sm">
                      Sube cualquier imagen desde tu ordenador
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                      Formatos soportados: PNG, JPG, WebP o SVG. Se guardará de inmediato en tu navegador y se subirá automáticamente a{' '}
                      <span className="font-mono text-[#bafafd]">public/images/uploads/</span> en GitHub al pulsar Guardar.
                    </p>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2.5 rounded-xl bg-[#14282c] hover:bg-[#1a383e] text-[#bafafd] border border-[#bafafd]/50 font-semibold transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Elegir archivo de imagen...</span>
                    </button>
                  </div>

                  {uploadedBase64 && (
                    <div className="flex flex-col items-center gap-2 pt-2">
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>¡Imagen cargada correctamente!</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {bg3IconName ? `Archivo: ${bg3IconName}` : 'Imagen lista para guardar'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* MODE 4: External URL */}
              {iconMode === 'url' && (
                <div className="p-4 rounded-xl bg-[#0a1014] border border-[#1b2a33] space-y-3">
                  <label className="block font-medium text-slate-300">
                    URL de Imagen Externa (HTTPS)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={externalUrlInput}
                      onChange={(e) => setExternalUrlInput(e.target.value)}
                      placeholder="https://ejemplo.com/icono_hechizo.png"
                      className="flex-1 px-3 py-2 rounded-lg bg-[#14232c] border border-[#213744] text-slate-100 focus:outline-hidden focus:border-[#bafafd]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className="px-4 py-2 rounded-lg bg-[#14282c] hover:bg-[#1a383e] text-[#bafafd] border border-[#bafafd]/50 font-semibold cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              )}

              {/* MODE 5: Classic Icons */}
              {iconMode === 'classic' && (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 p-2 bg-[#0a1014] rounded-xl border border-[#182630]">
                  {CLASSIC_ICONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => {
                        setCurrentIcon(ic);
                        setCurrentIconUrl('');
                        setBg3IconUrl(null);
                        setBg3IconName(ic);
                        setUploadedBase64(null);
                      }}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        currentIcon === ic && !currentIconUrl
                          ? 'bg-[#14282c] border-[#bafafd] text-[#bafafd]'
                          : 'bg-[#111c23] border-[#213744] text-slate-300 hover:text-white'
                      }`}
                    >
                      <span className="text-[10px] font-mono capitalize block truncate">
                        {ic.replace(/_/g, ' ')}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Casting Rules & Classes */}
          {activeTab === 'rules' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium mb-1 text-slate-300">
                    Tiempo de Lanzamiento
                  </label>
                  <input
                    type="text"
                    value={castingTime}
                    onChange={(e) => setCastingTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#14232c] border border-[#213744] text-slate-100 focus:outline-hidden focus:border-[#bafafd]"
                    placeholder="1 acción, 1 acción adicional..."
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-slate-300">Alcance</label>
                  <input
                    type="text"
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#14232c] border border-[#213744] text-slate-100 focus:outline-hidden focus:border-[#bafafd]"
                    placeholder="Personal, 18 metros, 9 metros..."
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-slate-300">Duración</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#14232c] border border-[#213744] text-slate-100 focus:outline-hidden focus:border-[#bafafd]"
                    placeholder="Instantánea, 1 minuto, 8 horas..."
                  />
                </div>
              </div>

              {/* Flags: Concentration, Ritual */}
              <div className="flex items-center gap-6 p-3 rounded-lg bg-[#0e161c] border border-[#1b2b35]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={concentration}
                    onChange={(e) => setConcentration(e.target.checked)}
                    className="w-4 h-4 rounded-sm border-slate-700 text-[#bafafd] focus:ring-[#bafafd] bg-[#14232c]"
                  />
                  <span className="font-semibold text-slate-200">Requiere Concentración</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ritual}
                    onChange={(e) => setRitual(e.target.checked)}
                    className="w-4 h-4 rounded-sm border-slate-700 text-[#bafafd] focus:ring-[#bafafd] bg-[#14232c]"
                  />
                  <span className="font-semibold text-slate-200">Puede lanzarse como Ritual</span>
                </label>
              </div>

              {/* Components */}
              <div className="p-3 rounded-lg bg-[#0e161c] border border-[#1b2b35] space-y-3">
                <span className="font-semibold text-slate-200 block">Componentes Requeridos:</span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={verbal}
                      onChange={(e) => setVerbal(e.target.checked)}
                      className="w-4 h-4 rounded-sm border-slate-700 text-[#bafafd] focus:ring-[#bafafd] bg-[#14232c]"
                    />
                    <span className="text-slate-300">Verbal (V)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={somatic}
                      onChange={(e) => setSomatic(e.target.checked)}
                      className="w-4 h-4 rounded-sm border-slate-700 text-[#bafafd] focus:ring-[#bafafd] bg-[#14232c]"
                    />
                    <span className="text-slate-300">Somático (S)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={material}
                      onChange={(e) => setMaterial(e.target.checked)}
                      className="w-4 h-4 rounded-sm border-slate-700 text-[#bafafd] focus:ring-[#bafafd] bg-[#14232c]"
                    />
                    <span className="text-slate-300">Material (M)</span>
                  </label>
                </div>

                {material && (
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Descripción del Componente Material:
                    </label>
                    <input
                      type="text"
                      value={materialDescription}
                      onChange={(e) => setMaterialDescription(e.target.value)}
                      placeholder="ej. Una pizca de azufre y polvo de rubí..."
                      className="w-full px-3 py-1.5 rounded-lg bg-[#14232c] border border-[#213744] text-slate-100 focus:outline-hidden focus:border-[#bafafd]"
                    />
                  </div>
                )}
              </div>

              {/* Classes checklist */}
              <div className="p-3 rounded-lg bg-[#0e161c] border border-[#1b2b35] space-y-2">
                <span className="font-semibold text-slate-200 block">
                  Clases que pueden aprender este hechizo:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ALL_CLASSES.map((cls) => {
                    const isChecked = selectedClasses.includes(cls);
                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => toggleClass(cls)}
                        className={`py-1.5 px-2.5 rounded-md border text-left flex items-center justify-between transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-[#14282c] border-[#bafafd] text-[#bafafd]'
                            : 'bg-[#14232c] border-[#213744] text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span>{cls}</span>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GitHub Integration */}
          {activeTab === 'github' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#0a1014] border border-[#1b2a33] space-y-3">
                <div className="flex items-center gap-2 text-slate-100 font-semibold text-sm">
                  <Github className="w-5 h-5 text-[#bafafd]" />
                  <span>Sincronización con GitHub (theworldoftirian/dragopedia)</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Al guardar en GitHub, los datos de este conjuro (y su imagen asociada si se ha subido una nueva) se
                  escribirán directamente en el archivo{' '}
                  <span className="font-mono text-[#bafafd]">src/data/spells.json</span> y{' '}
                  <span className="font-mono text-[#bafafd]">public/images/uploads/</span> mediante un commit con tu token oficial.
                </p>

                <div className="pt-2">
                  <label className="block font-medium mb-1 text-slate-300">
                    GitHub Personal Access Token (PAT):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={gitHubToken}
                      onChange={(e) => setGitHubToken(e.target.value)}
                      placeholder="github_pat_..."
                      className="flex-1 px-3 py-2 rounded-lg bg-[#14232c] border border-[#213744] text-slate-100 font-mono text-xs focus:outline-hidden focus:border-[#bafafd]"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        githubService.setToken(gitHubToken);
                        const res = await githubService.verifyAccess();
                        if (res.valid) {
                          setGitHubStatus({ type: 'success', message: res.message });
                        } else {
                          setGitHubStatus({ type: 'error', message: res.message });
                        }
                      }}
                      className="px-3.5 py-2 rounded-lg bg-[#14232c] hover:bg-[#1a383e] text-[#bafafd] border border-[#bafafd]/50 font-semibold cursor-pointer"
                    >
                      Verificar
                    </button>
                  </div>
                </div>

                {gitHubStatus.message && (
                  <div
                    className={`p-3 rounded-lg flex items-start gap-2.5 ${
                      gitHubStatus.type === 'success'
                        ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200'
                        : gitHubStatus.type === 'error'
                        ? 'bg-red-950/60 border border-red-500/40 text-red-200'
                        : 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-200'
                    }`}
                  >
                    {gitHubStatus.type === 'loading' && (
                      <RefreshCw className="w-4 h-4 animate-spin shrink-0 mt-0.5" />
                    )}
                    {gitHubStatus.type === 'success' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {gitHubStatus.type === 'error' && (
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p>{gitHubStatus.message}</p>
                      {gitHubStatus.commitUrl && (
                        <a
                          href={gitHubStatus.commitUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1 text-[#bafafd] hover:underline font-mono text-[11px]"
                        >
                          <span>Ver commit en GitHub</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Actions */}
        <div className="px-6 py-4 border-t border-[#1b2a33] bg-[#0a1014] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            <span>Editando: </span>
            <span className="text-slate-200 font-semibold">{name || spell.name}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#14232c] hover:bg-[#1a2e3a] text-slate-300 hover:text-white border border-[#213744] font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSaveLocal}
              className="px-4 py-2 rounded-xl bg-[#14282c] hover:bg-[#1a3a40] text-[#bafafd] border border-[#bafafd]/50 font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Local</span>
            </button>

            <button
              type="button"
              onClick={handleSaveToGitHub}
              disabled={isSavingGitHub}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isSavingGitHub ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sincronizando con GitHub...</span>
                </>
              ) : (
                <>
                  <Github className="w-4 h-4 text-slate-950" />
                  <span>Guardar y Subir a GitHub 🚀</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
