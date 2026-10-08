import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { DragopediaSidebar } from './components/DragopediaSidebar';
import { SpellFilterBar } from './components/SpellFilterBar';
import { SpellGrid } from './components/SpellGrid';
import { SpellDetailModal } from './components/SpellDetailModal';
import { CharacterSpellbookView } from './components/CharacterSpellbookView';
import { PrintCardsView } from './components/PrintCardsView';
import { CustomSpellModal } from './components/CustomSpellModal';
import { SpellEditModal } from './components/SpellEditModal';
import { EmbedModal } from './components/EmbedModal';
import { SpellListsView } from './components/SpellListsView';
import { PublicGalleryView } from './components/PublicGalleryView';
import { EditSpellListModal } from './components/EditSpellListModal';
import { AddToListModal } from './components/AddToListModal';
import { Character, FilterState, Spell, ViewTab, MagicSchool, DndClass, PrimordialMagic, GroupByDistribution, SpellFunctionality, SpellTarget, SpellList } from './types';
import { ALL_SPELLS } from './data/allSpells';
import { DEFAULT_CHARACTERS } from './data/spells';
import { DEFAULT_PUBLIC_LISTS } from './data/defaultPublicLists';
import {
  getLocalSpellLists,
  saveSingleSpellList,
  deleteSpellList,
  addSpellToList,
  removeSpellFromList,
  fetchPublicSpellLists,
  publishListToServer,
  likePublicList,
  decodeListFromUrl,
} from './services/spellListService';
import { getSpellPrimordialMagic } from './data/primordialMagic';
import { getSpellFunctionalities } from './data/spellFunctionalities';
import { getSpellDamageTypes } from './data/damageTypes';
import { getSpellTargets } from './data/spellTargets';
import { sanitizeBg3Url } from './data/bg3IconHelper';
import { githubService, GitHubSaveResult } from './services/githubService';
import {
  safeLocalStorageGet,
  safeLocalStorageSet,
  purgeObsoleteStorage,
  saveSpellsToIDB,
  loadSpellsFromIDB,
  saveCharactersToIDB,
  loadCharactersFromIDB,
} from './services/storageHelper';
import { Sparkles, BookOpen, AlertCircle, CheckCircle2, Wand2, Compass } from 'lucide-react';

const STORAGE_KEYS = {
  SPELLS: 'spellbook_dnd_spells_v2',
  CHARACTERS: 'spellbook_dnd_characters_v2',
  ACTIVE_CHAR: 'spellbook_dnd_active_char_v2',
  VERSION: 'spellbook_dnd_version_v2',
  LANG: 'spellbook_dnd_lang_v2',
};

const CLASS_NORM_MAP: Record<string, string> = {
  mago: 'mago',
  wizard: 'mago',
  hechicero: 'hechicero',
  sorcerer: 'hechicero',
  clerigo: 'clerigo',
  clérigo: 'clerigo',
  cleric: 'clerigo',
  paladin: 'paladin',
  paladín: 'paladin',
  druida: 'druida',
  druid: 'druida',
  explorador: 'explorador',
  ranger: 'explorador',
  brujo: 'brujo',
  warlock: 'brujo',
  bardo: 'bardo',
  bard: 'bardo',
  artifice: 'artifice',
  artífice: 'artifice',
  artificer: 'artifice',
};

function normalizeClass(name: string): string {
  const clean = (name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  return CLASS_NORM_MAP[clean] || clean;
}

const SCHOOL_NORM_MAP: Record<string, string> = {
  abjuracion: 'abjuracion',
  abjuration: 'abjuracion',
  adivinacion: 'adivinacion',
  divination: 'adivinacion',
  conjuracion: 'conjuracion',
  conjuration: 'conjuracion',
  encantamiento: 'encantamiento',
  enchantment: 'encantamiento',
  evocacion: 'evocacion',
  evocation: 'evocacion',
  ilusion: 'ilusion',
  illusion: 'ilusion',
  nigromancia: 'nigromancia',
  necromancy: 'nigromancia',
  transmutacion: 'transmutacion',
  transmutation: 'transmutacion',
  reflexion: 'reflexion',
  reflection: 'reflexion',
};

function normalizeSchool(name: string): string {
  const clean = (name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  return SCHOOL_NORM_MAP[clean] || clean;
}

// Purge obsolete and heavy legacy cache keys on initial script evaluation
purgeObsoleteStorage();

export interface SpellbookAppProps {
  initialSearch?: string;
}

export function SpellbookApp({ initialSearch }: SpellbookAppProps = {}) {
  // Version and Language state
  const [version, setVersion] = useState<'2014' | '2024'>(() => {
    const saved = safeLocalStorageGet(STORAGE_KEYS.VERSION);
    return saved === '2024' ? '2024' : '2014';
  });

  const [language, setLanguage] = useState<'es' | 'en'>(() => {
    const saved = safeLocalStorageGet(STORAGE_KEYS.LANG);
    return saved === 'en' ? 'en' : 'es';
  });

  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Embed modal state
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);

  // Secret Easter Egg: Custom spell creation unlocked only by pressing Space 10 times in 2 seconds
  const [isCustomSpellUnlocked, setIsCustomSpellUnlocked] = useState(false);
  const [showUnlockToast, setShowUnlockToast] = useState(false);

  // Current view tab
  const [currentTab, setCurrentTab] = useState<ViewTab>('catalog');

  // Personal Spell Lists State
  const [userSpellLists, setUserSpellLists] = useState<SpellList[]>(() => getLocalSpellLists());
  // Public Spell Lists Gallery State
  const [publicSpellLists, setPublicSpellLists] = useState<SpellList[]>(() => DEFAULT_PUBLIC_LISTS);
  // Modal for creating/editing a spell list
  const [isEditListModalOpen, setIsEditListModalOpen] = useState(false);
  const [editingSpellList, setEditingSpellList] = useState<SpellList | null>(null);
  // Modal for adding a spell to a list
  const [spellToAddToList, setSpellToAddToList] = useState<Spell | null>(null);
  // Currently viewed spell list inside SpellListsView
  const [selectedSpellListId, setSelectedSpellListId] = useState<string | null>(null);

  // Active spell being edited in modal
  const [editingSpell, setEditingSpell] = useState<Spell | null>(null);

  // Master spells state (all official spells + custom/edited homebrew)
  const [spells, setSpells] = useState<Spell[]>(() => {
    try {
      const saved = safeLocalStorageGet(STORAGE_KEYS.SPELLS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const map = new Map<string, Spell>();
          ALL_SPELLS.forEach((s) => map.set(s.id, s));
          parsed.forEach((s: Spell) => {
            const base = map.get(s.id);
            const sanitizedIcon = sanitizeBg3Url(s.iconUrl) || undefined;
            const sanitizedBg3 = sanitizeBg3Url(s.bg3IconUrl);
            if (base) {
              if (s.isCustom || s.isEdited) {
                map.set(s.id, {
                  ...base,
                  ...s,
                  iconUrl: (sanitizedIcon && !sanitizedIcon.includes('raw.githubusercontent.com')) ? sanitizedIcon : (base.iconUrl || sanitizedIcon),
                  bg3IconUrl: (sanitizedBg3 && !sanitizedBg3.includes('raw.githubusercontent.com')) ? sanitizedBg3 : (base.bg3IconUrl || sanitizedBg3),
                });
              } else {
                map.set(s.id, {
                  ...base,
                  iconUrl: (sanitizedIcon && !sanitizedIcon.includes('raw.githubusercontent.com')) ? sanitizedIcon : (base.iconUrl || sanitizedIcon),
                  bg3IconUrl: (sanitizedBg3 && !sanitizedBg3.includes('raw.githubusercontent.com')) ? sanitizedBg3 : (base.bg3IconUrl || sanitizedBg3),
                });
              }
            } else {
              map.set(s.id, {
                ...s,
                iconUrl: sanitizedIcon,
                bg3IconUrl: sanitizedBg3,
              });
            }
          });
          return Array.from(map.values());
        }
      }
    } catch {
      // Fallback
    }
    return ALL_SPELLS;
  });

  // Characters state
  const [characters, setCharacters] = useState<Character[]>(() => {
    try {
      const saved = safeLocalStorageGet(STORAGE_KEYS.CHARACTERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return DEFAULT_CHARACTERS;
  });

  // Active Character
  const [activeCharacterId, setActiveCharacterId] = useState<string>(() => {
    const saved = safeLocalStorageGet(STORAGE_KEYS.ACTIVE_CHAR);
    return saved || DEFAULT_CHARACTERS[0]?.id || 'char-1';
  });

  // Hydrate custom spells and characters from IndexedDB in case localStorage hit quotas
  useEffect(() => {
    loadSpellsFromIDB().then((idbSpells) => {
      if (idbSpells && idbSpells.length > 0) {
        setSpells((prev) => {
          const map = new Map<string, Spell>();
          prev.forEach((s) => map.set(s.id, s));
          let changed = false;
          idbSpells.forEach((s) => {
            if (!map.has(s.id) || s.isCustom || s.isEdited) {
              map.set(s.id, { ...map.get(s.id), ...s });
              changed = true;
            }
          });
          return changed ? Array.from(map.values()) : prev;
        });
      }
    });

    loadCharactersFromIDB().then((idbChars) => {
      if (idbChars && idbChars.length > 0) {
        setCharacters((prev) => (prev.length === 0 ? idbChars : prev));
      }
    });
  }, []);

  // Active Spell for Modal Detail
  const [activeSpellDetail, setActiveSpellDetail] = useState<Spell | null>(null);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'info' | 'warn';
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warn' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Filter State
  const [filterState, setFilterState] = useState<FilterState>({
    search: initialSearch || '',
    levels: [],
    classes: [],
    schools: [],
    primordialMagics: [],
    functionalities: [],
    targets: [],
    groupBy: 'primordial',
    castingTime: '',
    concentration: null,
    ritual: null,
    components: {
      verbal: false,
      somatic: false,
      material: false,
    },
    damageTypes: [],
    damageType: '',
    sortBy: 'level-asc',
    onlyPrepared: false,
    onlyFavorites: false,
    onlySpellbook: false,
    onlyCustom: false,
    onlyVanilla: false,
  });

  // Persist State safely without crashing on quota exceeded
  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.VERSION, version);
  }, [version]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.LANG, language);
  }, [language]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.ACTIVE_CHAR, activeCharacterId);
  }, [activeCharacterId]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters));
    saveCharactersToIDB(characters);
  }, [characters]);

  useEffect(() => {
    const customAndEdited = spells.filter((s) => s.isCustom || s.isEdited);
    safeLocalStorageSet(STORAGE_KEYS.SPELLS, JSON.stringify(customAndEdited));
    saveSpellsToIDB(customAndEdited);
  }, [spells]);

  // Sincronizar automáticamente con el repositorio GitHub de la Dragopedia si está disponible
  useEffect(() => {
    githubService
      .getRemoteSpellsFile()
      .then(({ spells: remoteSpells }) => {
        if (remoteSpells && remoteSpells.length > 0) {
          setSpells((prev) => {
            const map = new Map<string, Spell>();
            prev.forEach((s) => map.set(s.id, s));
            remoteSpells.forEach((s: Spell) => {
              const existing = map.get(s.id);
              const sanitizedIcon = sanitizeBg3Url(s.iconUrl) || undefined;
              const sanitizedBg3 = sanitizeBg3Url(s.bg3IconUrl);
              if (existing) {
                if (s.isCustom || s.isEdited) {
                  map.set(s.id, {
                    ...existing,
                    ...s,
                    iconUrl: (sanitizedIcon && !sanitizedIcon.includes('raw.githubusercontent.com')) ? sanitizedIcon : existing.iconUrl,
                    bg3IconUrl: (sanitizedBg3 && !sanitizedBg3.includes('raw.githubusercontent.com')) ? sanitizedBg3 : existing.bg3IconUrl,
                  });
                } else {
                  map.set(s.id, {
                    ...existing,
                    iconUrl: (sanitizedIcon && !sanitizedIcon.includes('raw.githubusercontent.com')) ? sanitizedIcon : existing.iconUrl,
                    bg3IconUrl: (sanitizedBg3 && !sanitizedBg3.includes('raw.githubusercontent.com')) ? sanitizedBg3 : existing.bg3IconUrl,
                  });
                }
              } else {
                map.set(s.id, {
                  ...s,
                  iconUrl: sanitizedIcon,
                  bg3IconUrl: sanitizedBg3,
                });
              }
            });
            return Array.from(map.values());
          });
        }
      })
      .catch((err) => {
        console.warn('Sync remote spells non-fatal:', err);
      });
  }, []);

  // Secret Easter Egg listener: 10 spacebar presses in 2 seconds unlocks "Nuevo Hechizo Casero"
  useEffect(() => {
    const spaceTimestamps: number[] = [];

    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger if typing in form inputs, textareas or contenteditables
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.getAttribute('role') === 'textbox');

      if (isInput) return;

      const isSpace = e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar';

      if (isSpace) {
        // Prevent browser viewport from scrolling down when pressing spacebar
        e.preventDefault();

        const now = Date.now();
        spaceTimestamps.push(now);

        // Keep timestamps strictly within the last 2000 milliseconds (2 seconds)
        while (spaceTimestamps.length > 0 && now - spaceTimestamps[0] > 2000) {
          spaceTimestamps.shift();
        }

        if (spaceTimestamps.length >= 10) {
          spaceTimestamps.length = 0;
          setIsCustomSpellUnlocked(true);
          setCurrentTab('custom');
          setShowUnlockToast(true);
          setTimeout(() => setShowUnlockToast(false), 5000);
        }
      } else if (e.key !== 'Shift' && e.key !== 'Control' && e.key !== 'Alt' && e.key !== 'Meta') {
        // Any other non-modifier key resets the consecutive spacebar streak
        spaceTimestamps.length = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Fetch live public lists & inspect URL for shared spell lists
  useEffect(() => {
    fetchPublicSpellLists().then((fetched) => {
      if (fetched && fetched.length > 0) {
        setPublicSpellLists(fetched);
      }
    });

    try {
      const decoded = decodeListFromUrl();
      if (decoded) {
        setUserSpellLists((prev) => {
          const exists = prev.find((l) => l.id === decoded.id || l.name === decoded.name);
          if (exists) return prev;
          const updated = [decoded, ...prev];
          saveSingleSpellList(decoded);
          return updated;
        });
        setSelectedSpellListId(decoded.id);
        setCurrentTab('spell-lists');
        showToast(
          language === 'es'
            ? `¡Colección compartida "${decoded.name}" cargada!`
            : `Shared list "${decoded.name}" loaded!`,
          'success'
        );
      } else {
        const params = new URLSearchParams(window.location.search);
        const listIdParam = params.get('listId');
        if (listIdParam) {
          setSelectedSpellListId(listIdParam);
          setCurrentTab('spell-lists');
        }
      }
    } catch (e) {
      console.warn('URL list parsing non-fatal:', e);
    }
  }, []);

  // Handlers for Spell Lists
  const handleSaveSpellList = async (list: SpellList, publishToGallery: boolean) => {
    const updated = saveSingleSpellList(list);
    setUserSpellLists(updated);
    showToast(
      language === 'es'
        ? `Lista "${list.name}" guardada con éxito.`
        : `List "${list.name}" saved successfully.`,
      'success'
    );

    if (publishToGallery) {
      const pub = await publishListToServer(list);
      if (pub) {
        setPublicSpellLists((prev) => [pub, ...prev.filter((l) => l.id !== pub.id)]);
        showToast(
          language === 'es'
            ? `¡"${list.name}" se publicó en la Galería Pública!`
            : `Published "${list.name}" to Public Gallery!`,
          'success'
        );
      }
    }
  };

  const handleDeleteSpellList = (listId: string) => {
    const updated = deleteSpellList(listId);
    setUserSpellLists(updated);
    if (selectedSpellListId === listId) {
      setSelectedSpellListId(null);
    }
    showToast(language === 'es' ? 'Lista eliminada.' : 'List deleted.', 'info');
  };

  const handlePublishSpellList = async (list: SpellList) => {
    const pub = await publishListToServer(list);
    if (pub) {
      setPublicSpellLists((prev) => [pub, ...prev.filter((l) => l.id !== pub.id)]);
      const updated = saveSingleSpellList({ ...list, isPublic: true });
      setUserSpellLists(updated);
      showToast(
        language === 'es'
          ? `¡"${list.name}" publicada en la Galería Pública!`
          : `Published "${list.name}" to Public Gallery!`,
        'success'
      );
    } else {
      showToast(language === 'es' ? 'Error al publicar lista.' : 'Failed to publish list.', 'warn');
    }
  };

  const handleLikePublicList = async (listId: string) => {
    setPublicSpellLists((prev) =>
      prev.map((l) => (l.id === listId ? { ...l, likes: (l.likes || 0) + 1 } : l))
    );
    await likePublicList(listId);
  };

  const handleClonePublicList = (list: SpellList) => {
    const cloned: SpellList = {
      ...list,
      id: `list-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `${list.name} (${language === 'es' ? 'Copia' : 'Clone'})`,
      author: 'Yo',
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = saveSingleSpellList(cloned);
    setUserSpellLists(updated);
  };

  const handleToggleSpellInList = (listId: string, spellId: string) => {
    const target = userSpellLists.find((l) => l.id === listId);
    if (!target) return;
    let updated: SpellList[];
    if (target.spellIds.includes(spellId)) {
      updated = removeSpellFromList(listId, spellId);
      showToast(language === 'es' ? 'Hechizo retirado de la lista' : 'Spell removed from list', 'info');
    } else {
      updated = addSpellToList(listId, spellId);
      showToast(language === 'es' ? 'Hechizo añadido a la lista' : 'Spell added to list', 'success');
    }
    setUserSpellLists(updated);
  };

  const activeCharacter = useMemo(() => {
    return characters.find((c) => c.id === activeCharacterId) || characters[0] || null;
  }, [characters, activeCharacterId]);

  // Actions for Spells in Active Character
  const handleToggleKnown = (spellId: string) => {
    if (!activeCharacter) return;
    const isKnown = activeCharacter.knownSpellIds.includes(spellId);
    const updatedKnown = isKnown
      ? activeCharacter.knownSpellIds.filter((id) => id !== spellId)
      : [...activeCharacter.knownSpellIds, spellId];

    const updatedPrepared = isKnown
      ? activeCharacter.preparedSpellIds.filter((id) => id !== spellId)
      : activeCharacter.preparedSpellIds;

    const spell = spells.find((s) => s.id === spellId);
    const spellName = spell ? spell.name : 'Hechizo';

    setCharacters((prev) =>
      prev.map((c) =>
        c.id === activeCharacter.id
          ? { ...c, knownSpellIds: updatedKnown, preparedSpellIds: updatedPrepared }
          : c
      )
    );

    if (isKnown) {
      showToast(`Hechizo "${spellName}" eliminado del grimorio`, 'info');
    } else {
      showToast(`✨ Hechizo "${spellName}" añadido al grimorio de ${activeCharacter.name}`, 'success');
    }
  };

  const handleTogglePrepared = (spellId: string) => {
    if (!activeCharacter) return;
    const isPrepared = activeCharacter.preparedSpellIds.includes(spellId);
    const updatedPrepared = isPrepared
      ? activeCharacter.preparedSpellIds.filter((id) => id !== spellId)
      : [...activeCharacter.preparedSpellIds, spellId];

    const updatedKnown = activeCharacter.knownSpellIds.includes(spellId)
      ? activeCharacter.knownSpellIds
      : [...activeCharacter.knownSpellIds, spellId];

    const spell = spells.find((s) => s.id === spellId);
    const spellName = spell ? spell.name : 'Hechizo';

    setCharacters((prev) =>
      prev.map((c) =>
        c.id === activeCharacter.id
          ? { ...c, preparedSpellIds: updatedPrepared, knownSpellIds: updatedKnown }
          : c
      )
    );

    if (isPrepared) {
      showToast(`Hechizo "${spellName}" desmarcado como preparado`, 'info');
    } else {
      showToast(`⚡ Hechizo "${spellName}" preparado para la batalla`, 'success');
    }
  };

  const handleToggleFavorite = (spellId: string) => {
    if (!activeCharacter) return;
    const isFav = activeCharacter.favoriteSpellIds.includes(spellId);
    const updatedFav = isFav
      ? activeCharacter.favoriteSpellIds.filter((id) => id !== spellId)
      : [...activeCharacter.favoriteSpellIds, spellId];

    setCharacters((prev) =>
      prev.map((c) => (c.id === activeCharacter.id ? { ...c, favoriteSpellIds: updatedFav } : c))
    );
  };

  const handleCastSpell = (spell: Spell, specificSlotLevel?: number) => {
    if (!activeCharacter) {
      setActiveSpellDetail(spell);
      return;
    }

    if (spell.level === 0) {
      showToast(`🪄 ¡Has lanzado el truco "${spell.name}"! (Sin coste de ranura)`, 'success');
      return;
    }

    const slotLevel = specificSlotLevel !== undefined ? specificSlotLevel : spell.level;
    const currentSlot = activeCharacter.spellSlots[slotLevel];

    if (!currentSlot || currentSlot.used >= currentSlot.max) {
      showToast(`⚠️ No tienes ranuras disponibles de nivel ${slotLevel}!`, 'warn');
      return;
    }

    const newSlots = {
      ...activeCharacter.spellSlots,
      [slotLevel]: {
        ...currentSlot,
        used: currentSlot.used + 1,
      },
    };

    setCharacters((prev) =>
      prev.map((c) => (c.id === activeCharacter.id ? { ...c, spellSlots: newSlots } : c))
    );

    const remaining = currentSlot.max - (currentSlot.used + 1);
    showToast(
      `⚡ ¡"${spell.name}" lanzado con ranura Nivel ${slotLevel}! (${remaining} restantes)`,
      'success'
    );
  };

  const handleToggleSlot = (level: number, slotIndex: number) => {
    if (!activeCharacter) return;
    const slot = activeCharacter.spellSlots[level];
    if (!slot) return;

    const available = slot.max - slot.used;
    const isCurrentlyUsed = slotIndex >= available;

    const newUsed = isCurrentlyUsed ? slot.used - 1 : slot.used + 1;
    const clampedUsed = Math.max(0, Math.min(slot.max, newUsed));

    const newSlots = {
      ...activeCharacter.spellSlots,
      [level]: { ...slot, used: clampedUsed },
    };

    setCharacters((prev) =>
      prev.map((c) => (c.id === activeCharacter.id ? { ...c, spellSlots: newSlots } : c))
    );
  };

  const handleLongRest = () => {
    if (!activeCharacter) return;
    const recoveredSlots: Record<number, { max: number; used: number }> = {};
    for (const [lvlStr, val] of Object.entries(activeCharacter.spellSlots)) {
      recoveredSlots[Number(lvlStr)] = { max: val.max, used: 0 };
    }

    setCharacters((prev) =>
      prev.map((c) => (c.id === activeCharacter.id ? { ...c, spellSlots: recoveredSlots } : c))
    );
    showToast(`☀️ Descanso Largo completado para ${activeCharacter.name}. ¡Todas las ranuras recuperadas!`, 'success');
  };

  const handleShortRest = () => {
    if (!activeCharacter) return;
    if (activeCharacter.class === 'Brujo') {
      const recoveredSlots: Record<number, { max: number; used: number }> = {};
      for (const [lvlStr, val] of Object.entries(activeCharacter.spellSlots)) {
        recoveredSlots[Number(lvlStr)] = { max: val.max, used: 0 };
      }
      setCharacters((prev) =>
        prev.map((c) => (c.id === activeCharacter.id ? { ...c, spellSlots: recoveredSlots } : c))
      );
      showToast(`🌙 Descanso Corto (Brujo): Ranuras de pacto recuperadas.`, 'success');
    } else {
      showToast(`🌙 Descanso Corto completado. Puedes gastar Dados de Golpe.`, 'info');
    }
  };

  const handleCreateCharacter = (newCharData: Omit<Character, 'id'>) => {
    const newChar: Character = {
      ...newCharData,
      id: `char-${Date.now()}`,
    };
    setCharacters((prev) => [...prev, newChar]);
    setActiveCharacterId(newChar.id);
    showToast(`👤 Personaje "${newChar.name}" creado con éxito.`, 'success');
  };

  const handleDeleteCharacter = (id: string) => {
    if (characters.length <= 1) {
      showToast('No puedes eliminar tu único personaje.', 'warn');
      return;
    }
    setCharacters((prev) => prev.filter((c) => c.id !== id));
    if (activeCharacterId === id) {
      const remaining = characters.filter((c) => c.id !== id);
      if (remaining.length > 0) setActiveCharacterId(remaining[0].id);
    }
    showToast('Personaje eliminado.', 'info');
  };

  const handleSaveCustomSpell = (newSpell: Spell) => {
    setSpells((prev) => [newSpell, ...prev]);
    if (activeCharacter) {
      setCharacters((prev) =>
        prev.map((c) => {
          if (c.id === activeCharacter.id) {
            return {
              ...c,
              knownSpellIds: [...c.knownSpellIds, newSpell.id],
              preparedSpellIds: [...c.preparedSpellIds, newSpell.id],
            };
          }
          return c;
        })
      );
    }
    setCurrentTab('catalog');
    showToast(`✨ Hechizo "${newSpell.name}" guardado y añadido a tu grimorio!`, 'success');
  };

  // Open spell editor for modifying existing or custom spell
  const handleOpenEditSpell = (spellToEdit: Spell) => {
    setEditingSpell(spellToEdit);
  };

  // Save edited spell locally and update active detail modal if open
  const handleSaveEditedSpell = (updatedSpell: Spell) => {
    setSpells((prev) => {
      const idx = prev.findIndex((s) => s.id === updatedSpell.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updatedSpell;
        return copy;
      }
      return [updatedSpell, ...prev];
    });

    if (activeSpellDetail?.id === updatedSpell.id) {
      setActiveSpellDetail(updatedSpell);
    }

    showToast(`✨ Hechizo "${updatedSpell.name}" guardado exitosamente`, 'success');
  };

  // GitHub sync success notification
  const handleSaveGitHubSuccess = (result: GitHubSaveResult) => {
    showToast(`🚀 ${result.message}`, 'success');
  };

  // Quick school filter toggle from Sidebar
  const handleToggleSchoolFromSidebar = (school: MagicSchool) => {
    setFilterState((prev) => {
      const exists = prev.schools.includes(school);
      return {
        ...prev,
        schools: exists ? prev.schools.filter((s) => s !== school) : [...prev.schools, school],
      };
    });
  };

  const handleClearSchoolsFromSidebar = () => {
    setFilterState((prev) => ({ ...prev, schools: [] }));
  };

  // Quick class filter toggle from Sidebar
  const handleToggleClassFromSidebar = (cls: DndClass) => {
    setFilterState((prev) => {
      const exists = prev.classes.includes(cls);
      return {
        ...prev,
        classes: exists ? prev.classes.filter((c) => c !== cls) : [...prev.classes, cls],
      };
    });
  };

  const handleClearClassesFromSidebar = () => {
    setFilterState((prev) => ({ ...prev, classes: [] }));
  };

  // Quick primordial magic toggle from Sidebar
  const handleTogglePrimordialFromSidebar = (magic: PrimordialMagic) => {
    setFilterState((prev) => {
      const current = prev.primordialMagics || [];
      const exists = current.includes(magic);
      return {
        ...prev,
        primordialMagics: exists ? current.filter((m) => m !== magic) : [...current, magic],
      };
    });
  };

  const handleClearPrimordialsFromSidebar = () => {
    setFilterState((prev) => ({ ...prev, primordialMagics: [] }));
  };

  // Quick damage type toggle from Sidebar
  const handleToggleDamageTypeFromSidebar = (damageType: string) => {
    setFilterState((prev) => {
      const current = prev.damageTypes || (prev.damageType ? [prev.damageType] : []);
      const exists = current.includes(damageType);
      const next = exists ? current.filter((d) => d !== damageType) : [...current, damageType];
      return {
        ...prev,
        damageTypes: next,
        damageType: next[0] || '',
      };
    });
  };

  const handleClearDamageTypesFromSidebar = () => {
    setFilterState((prev) => ({ ...prev, damageTypes: [], damageType: '' }));
  };

  // Quick functionality filter toggle from Sidebar
  const handleToggleFunctionalityFromSidebar = (func: SpellFunctionality) => {
    setFilterState((prev) => {
      const current = prev.functionalities || [];
      const exists = current.includes(func);
      return {
        ...prev,
        functionalities: exists ? current.filter((f) => f !== func) : [...current, func],
      };
    });
  };

  const handleClearFunctionalitiesFromSidebar = () => {
    setFilterState((prev) => ({ ...prev, functionalities: [] }));
  };

  // Quick targets filter toggle from Sidebar
  const handleToggleTargetFromSidebar = (target: SpellTarget) => {
    setFilterState((prev) => {
      const current = prev.targets || [];
      const exists = current.includes(target);
      return {
        ...prev,
        targets: exists ? current.filter((t) => t !== target) : [...current, target],
      };
    });
  };

  const handleClearTargetsFromSidebar = () => {
    setFilterState((prev) => ({ ...prev, targets: [] }));
  };

  // Filter and Sort Spells
  const filteredSpells = useMemo(() => {
    return spells
      .filter((s) => {
        // Tab specific filter
        if (currentTab === 'spellbook' && activeCharacter) {
          if (!activeCharacter.knownSpellIds.includes(s.id)) return false;
        }

        // Quick character flags
        if (filterState.onlyPrepared && activeCharacter) {
          if (!activeCharacter.preparedSpellIds.includes(s.id)) return false;
        }
        if (filterState.onlySpellbook && activeCharacter) {
          if (!activeCharacter.knownSpellIds.includes(s.id)) return false;
        }
        if (filterState.onlyFavorites && activeCharacter) {
          if (!activeCharacter.favoriteSpellIds.includes(s.id)) return false;
        }

        // Origin source filter (Defaults to false for both so ALL created and vanilla spells appear together)
        if (filterState.onlyCustom && !s.isCustom && s.source !== 'Homebrew') return false;
        if (filterState.onlyVanilla && (s.isCustom || s.source === 'Homebrew')) return false;

        // Buscador por nombre (Matches Spanish and English name, accent-insensitive)
        if (filterState.search.trim()) {
          const rawQuery = filterState.search.trim().toLowerCase();
          const query = rawQuery.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          const nameNormalized = s.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          const nameEnNormalized = (s.nameEn || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          const matchesName = nameNormalized.includes(query) || nameEnNormalized.includes(query);
          if (!matchesName) return false;
        }

        // Level filter (shows spells matching any selected level)
        if (filterState.levels.length > 0) {
          if (!filterState.levels.includes(s.level)) return false;
        }

        // Class filter (shows spells castable by any selected class, normalizing ES/EN variants)
        if (filterState.classes.length > 0) {
          const spellClasses = Array.isArray(s.classes) ? s.classes : [];
          const hasClass = filterState.classes.some((filterCls) => {
            const normFilter = normalizeClass(filterCls);
            return spellClasses.some((c) => normalizeClass(c) === normFilter);
          });
          if (!hasClass) return false;
        }

        // School filter (shows spells belonging to any selected school, normalizing accents and ES/EN)
        if (filterState.schools.length > 0) {
          const hasSchool = filterState.schools.some((filterSchool) => {
            const normFilter = normalizeSchool(filterSchool);
            return (
              normalizeSchool(s.school) === normFilter ||
              normalizeSchool(s.schoolEn || '') === normFilter
            );
          });
          if (!hasSchool) return false;
        }

        // Primordial Magic filter (shows spells matching any selected primordial magic)
        if (filterState.primordialMagics && filterState.primordialMagics.length > 0) {
          const spellPrimordial = getSpellPrimordialMagic(s);
          if (!filterState.primordialMagics.includes(spellPrimordial)) return false;
        }

        // Functionality filter (shows spells matching any selected functionality)
        if (filterState.functionalities && filterState.functionalities.length > 0) {
          const spellFuncs = getSpellFunctionalities(s);
          const hasMatchingFunc = filterState.functionalities.some((f) => spellFuncs.includes(f));
          if (!hasMatchingFunc) return false;
        }

        // Objetivos (Targets) filter (shows spells matching any selected target: propio, enemigo, enemigos, aliados, objeto)
        if (filterState.targets && filterState.targets.length > 0) {
          const spellTargets = getSpellTargets(s);
          const hasMatchingTarget = filterState.targets.some((t) => spellTargets.includes(t));
          if (!hasMatchingTarget) return false;
        }

        // Concentration
        if (filterState.concentration !== null) {
          if (s.concentration !== filterState.concentration) return false;
        }

        // Ritual
        if (filterState.ritual !== null) {
          if (s.ritual !== filterState.ritual) return false;
        }

        // Components
        if (filterState.components?.verbal && !s.components?.verbal) return false;
        if (filterState.components?.somatic && !s.components?.somatic) return false;
        if (filterState.components?.material && !s.components?.material) return false;

        // Damage Type (shows spells matching any selected damage type, including multi-element choices)
        const activeDamageTypes = (filterState.damageTypes && filterState.damageTypes.length > 0)
          ? filterState.damageTypes
          : (filterState.damageType ? [filterState.damageType] : []);
        if (activeDamageTypes.length > 0) {
          const spellDamages = getSpellDamageTypes(s);
          const hasMatchingDamage = activeDamageTypes.some((d) => spellDamages.includes(d));
          if (!hasMatchingDamage) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filterState.sortBy) {
          case 'level-asc':
            return a.level - b.level || a.name.localeCompare(b.name, 'es');
          case 'level-desc':
            return b.level - a.level || a.name.localeCompare(b.name, 'es');
          case 'name-asc':
            return a.name.localeCompare(b.name, 'es');
          case 'name-desc':
            return b.name.localeCompare(a.name, 'es');
          case 'school':
            return a.school.localeCompare(b.school, 'es') || a.level - b.level;
          default:
            return 0;
        }
      });
  }, [spells, filterState, activeCharacter, currentTab]);

  return (
    <div className="min-h-screen dragopedia-canvas bg-[#090e12] text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce duration-300">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-xs sm:text-sm font-semibold backdrop-blur ${
              toastMessage.type === 'success'
                ? 'bg-[#0d1822] border-sky-500/60 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                : toastMessage.type === 'warn'
                ? 'bg-[#1a2530] border-cyan-500/60 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'bg-[#101c24] border-sky-400/60 text-sky-200'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
            ) : toastMessage.type === 'warn' ? (
              <AlertCircle className="w-4 h-4 text-cyan-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-sky-400" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Dragopedia Left Sidebar */}
      <DragopediaSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        selectedSchool={filterState.schools.length === 1 ? filterState.schools[0] : null}
        selectedSchools={filterState.schools}
        onToggleSchool={handleToggleSchoolFromSidebar}
        onClearSchools={handleClearSchoolsFromSidebar}
        selectedFunctionalities={filterState.functionalities}
        onToggleFunctionality={handleToggleFunctionalityFromSidebar}
        onClearFunctionalities={handleClearFunctionalitiesFromSidebar}
        selectedTargets={filterState.targets}
        onToggleTarget={handleToggleTargetFromSidebar}
        onClearTargets={handleClearTargetsFromSidebar}
        selectedDamageType={filterState.damageType || null}
        selectedDamageTypes={filterState.damageTypes}
        onToggleDamageType={handleToggleDamageTypeFromSidebar}
        onClearDamageTypes={handleClearDamageTypesFromSidebar}
        searchQuery={filterState.search}
        onSearchChange={(q) => setFilterState((prev) => ({ ...prev, search: q }))}
        selectedClass={filterState.classes.length === 1 ? filterState.classes[0] : null}
        selectedClasses={filterState.classes}
        onToggleClass={handleToggleClassFromSidebar}
        onClearClasses={handleClearClassesFromSidebar}
        selectedPrimordial={filterState.primordialMagics && filterState.primordialMagics.length === 1 ? filterState.primordialMagics[0] : null}
        selectedPrimordials={filterState.primordialMagics}
        onTogglePrimordial={handleTogglePrimordialFromSidebar}
        onClearPrimordials={handleClearPrimordialsFromSidebar}
        groupBy={filterState.groupBy || 'level'}
        onGroupByChange={(mode) => setFilterState((prev) => ({ ...prev, groupBy: mode }))}
        activeCharacter={activeCharacter}
        totalSpellsCount={spells.length}
        language={language}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
        isCustomSpellUnlocked={isCustomSpellUnlocked}
        listsCount={userSpellLists.length}
      />

      {/* Main Workspace Area (Offset by sidebar width on large screens) */}
      <div className="lg:pl-80 xl:pl-[340px] flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <Navbar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          characters={characters}
          activeCharacter={activeCharacter}
          onSelectCharacter={setActiveCharacterId}
          version={version}
          onChangeVersion={setVersion}
          language={language}
          onChangeLanguage={setLanguage}
          onQuickLongRest={handleLongRest}
          totalSpellsCount={spells.length}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
        />

        {/* Page Content Container - Full Screen Width */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-7">
          {/* Tab: Catalog (All Spells) or Spellbook */}
          {(currentTab === 'catalog' || currentTab === 'spellbook') && (
            <div className="space-y-7">
              {/* My Spellbook View Banner */}
              {currentTab === 'spellbook' && activeCharacter && (
                <div className="rounded-2xl border border-[#bafafd]/40 bg-[#10171d] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#14282c] border border-[#bafafd]/40 flex items-center justify-center text-[#bafafd]">
                      <Wand2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg font-bold text-slate-100 uppercase tracking-wide">
                        {language === 'es' ? `Grimorio de ${activeCharacter.name}` : `${activeCharacter.name}'s Spellbook`}
                      </h2>
                      <p className="text-xs text-[#8a9ba8] mt-0.5">
                        {activeCharacter.knownSpellIds.length} {language === 'es' ? 'conjuros en el grimorio' : 'spells in spellbook'} •{' '}
                        {activeCharacter.preparedSpellIds.length} {language === 'es' ? 'preparados para la batalla' : 'prepared today'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFilterState((prev) => ({ ...prev, onlyPrepared: !prev.onlyPrepared }))}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        filterState.onlyPrepared
                          ? 'bg-sky-600 text-white border-sky-500 shadow-xs'
                          : 'bg-[#14232c] text-slate-300 border-[#213744] hover:text-white'
                      }`}
                    >
                      {language === 'es' ? 'Solo Preparados' : 'Prepared Only'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentTab('catalog')}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#14232c] border border-[#213744] text-slate-300 hover:text-sky-400 cursor-pointer"
                    >
                      {language === 'es' ? 'Explorar catálogo' : 'Browse catalog'}
                    </button>
                  </div>
                </div>
              )}

              {/* Section 2: Dragopedia Spell Filter Bar */}
              <SpellFilterBar
                filter={filterState}
                onFilterChange={setFilterState}
                language={language}
                hasActiveCharacter={Boolean(activeCharacter)}
                activeCharacterName={activeCharacter?.name}
                totalFiltered={filteredSpells.length}
              />

              {/* Section 3: Spells Presentation (Always Icon Grid) */}
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="font-heading text-sm sm:text-base font-bold tracking-widest text-slate-100 uppercase">
                    {currentTab === 'spellbook'
                      ? (language === 'es' ? 'HECHIZOS EN TU GRIMORIO' : 'SPELLS IN YOUR SPELLBOOK')
                      : (language === 'es' ? 'CATÁLOGO DE CONJUROS' : 'SPELLS CATALOG')}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {filteredSpells.length} {language === 'es' ? 'conjuros encontrados' : 'spells found'}
                  </span>
                </div>

                {filteredSpells.length > 0 ? (
                  <SpellGrid
                    spells={filteredSpells}
                    language={language}
                    activeCharacter={activeCharacter}
                    onOpenDetails={(s) => setActiveSpellDetail(s)}
                    onToggleKnown={handleToggleKnown}
                    onTogglePrepared={handleTogglePrepared}
                    onToggleFavorite={handleToggleFavorite}
                    onCastSpell={(s) => handleCastSpell(s)}
                    onEditSpell={handleOpenEditSpell}
                    onAddToList={(s) => setSpellToAddToList(s)}
                    groupBy={filterState.groupBy || 'level'}
                  />
                ) : (
                  <div className="text-center py-16 px-4 bg-[#10181e] rounded-2xl border border-[#1b2a33] space-y-3">
                    <BookOpen className="w-12 h-12 text-slate-500 mx-auto opacity-60" />
                    <h3 className="font-heading text-lg font-bold text-slate-200 uppercase tracking-wide">
                      {language === 'es' ? 'No se encontraron hechizos' : 'No spells found'}
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      {language === 'es'
                        ? 'No hay hechizos que coincidan con tus criterios de búsqueda o filtros seleccionados.'
                        : 'No spells match your selected search criteria or filters.'}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setFilterState({
                          search: '',
                          levels: [],
                          classes: [],
                          schools: [],
                          primordialMagics: [],
                          functionalities: [],
                          targets: [],
                          groupBy: 'primordial',
                          castingTime: '',
                          concentration: null,
                          ritual: null,
                          components: { verbal: false, somatic: false, material: false },
                          damageTypes: [],
                          damageType: '',
                          sortBy: 'level-asc',
                          onlyPrepared: false,
                          onlyFavorites: false,
                          onlySpellbook: false,
                        })
                      }
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition-colors cursor-pointer shadow-xs"
                    >
                      {language === 'es' ? 'Restablecer filtros' : 'Reset filters'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: Character & Spell Slots Management (Diario del Cazador) */}
          {currentTab === 'character' && (
            <CharacterSpellbookView
              characters={characters}
              activeCharacter={activeCharacter}
              onSelectCharacter={setActiveCharacterId}
              onCreateCharacter={handleCreateCharacter}
              onDeleteCharacter={handleDeleteCharacter}
              onToggleSlot={handleToggleSlot}
              onLongRest={handleLongRest}
              onShortRest={handleShortRest}
              onGoToSpellbook={() => {
                setFilterState((prev) => ({ ...prev, onlyPrepared: true }));
                setCurrentTab('spellbook');
              }}
              language={language}
            />
          )}

          {/* Tab: Printable Cards */}
          {currentTab === 'print' && (
            <PrintCardsView
              spells={filteredSpells}
              activeCharacter={activeCharacter}
              language={language}
            />
          )}

          {/* Tab: Create Homebrew Spell */}
          {currentTab === 'custom' && (
            <CustomSpellModal
              onSave={handleSaveCustomSpell}
              onCancel={() => setCurrentTab('catalog')}
              language={language}
            />
          )}

          {/* Tab: Spell Lists (Personal Lists) */}
          {currentTab === 'spell-lists' && (
            <SpellListsView
              lists={userSpellLists}
              spells={spells}
              activeCharacter={activeCharacter}
              language={language}
              onCreateNewList={() => {
                setEditingSpellList(null);
                setIsEditListModalOpen(true);
              }}
              onEditList={(list) => {
                setEditingSpellList(list);
                setIsEditListModalOpen(true);
              }}
              onDeleteList={handleDeleteSpellList}
              onPublishList={handlePublishSpellList}
              onRemoveSpellFromList={(listId, spellId) => {
                const updated = removeSpellFromList(listId, spellId);
                setUserSpellLists(updated);
                showToast(language === 'es' ? 'Hechizo retirado de la lista' : 'Spell removed from list', 'info');
              }}
              onAddSpellToList={(listId, spellId) => {
                const updated = addSpellToList(listId, spellId);
                setUserSpellLists(updated);
              }}
              onOpenSpellDetails={(s) => setActiveSpellDetail(s)}
              onGoToPublicGallery={() => setCurrentTab('public-gallery')}
              selectedListId={selectedSpellListId}
              onSelectActiveList={setSelectedSpellListId}
              onShowToast={showToast}
            />
          )}

          {/* Tab: Public Gallery */}
          {currentTab === 'public-gallery' && (
            <PublicGalleryView
              publicLists={publicSpellLists}
              spells={spells}
              activeCharacter={activeCharacter}
              language={language}
              onCloneList={handleClonePublicList}
              onLikeList={handleLikePublicList}
              onOpenSpellDetails={(s) => setActiveSpellDetail(s)}
              onOpenCreateModal={() => {
                setEditingSpellList(null);
                setIsEditListModalOpen(true);
              }}
              userLists={userSpellLists}
              onPublishUserList={handlePublishSpellList}
              onShowToast={showToast}
            />
          )}
        </main>

        {/* Spell Detail Modal */}
        {activeSpellDetail && (
          <SpellDetailModal
            spell={activeSpellDetail}
            onClose={() => setActiveSpellDetail(null)}
            language={language}
            activeCharacter={activeCharacter}
            onToggleKnown={handleToggleKnown}
            onTogglePrepared={handleTogglePrepared}
            onToggleFavorite={handleToggleFavorite}
            onCastSpellWithSlot={(s, slotLvl) => {
              handleCastSpell(s, slotLvl);
            }}
            onPrintSingle={(s) => {
              setActiveSpellDetail(null);
              setFilterState((prev) => ({ ...prev, search: s.name }));
              setCurrentTab('print');
            }}
            onEditSpell={(s) => {
              handleOpenEditSpell(s);
            }}
            onAddToList={(s) => {
              setSpellToAddToList(s);
            }}
          />
        )}

        {/* Spell Edit Modal with GitHub sync */}
        {editingSpell && (
          <SpellEditModal
            key={`${editingSpell.id}-${editingSpell.updatedAt || ''}-${editingSpell.iconUrl || ''}-${editingSpell.bg3IconUrl || ''}`}
            spell={editingSpell}
            isOpen={!!editingSpell}
            onClose={() => setEditingSpell(null)}
            onSaveLocal={handleSaveEditedSpell}
            onSaveGitHubSuccess={handleSaveGitHubSuccess}
            language={language}
          />
        )}

        {/* Embed Modal for Web embedding */}
        <EmbedModal
          isOpen={isEmbedModalOpen}
          onClose={() => setIsEmbedModalOpen(false)}
          language={language}
        />

        {/* Edit / Create Spell List Modal */}
        <EditSpellListModal
          list={editingSpellList}
          isOpen={isEditListModalOpen}
          onClose={() => {
            setIsEditListModalOpen(false);
            setEditingSpellList(null);
          }}
          onSave={handleSaveSpellList}
          language={language}
        />

        {/* Add Spell to List Modal */}
        <AddToListModal
          spell={spellToAddToList}
          isOpen={!!spellToAddToList}
          onClose={() => setSpellToAddToList(null)}
          lists={userSpellLists}
          onToggleSpellInList={handleToggleSpellInList}
          onCreateNewList={() => {
            setEditingSpellList(null);
            setIsEditListModalOpen(true);
          }}
          language={language}
        />

        {/* Footer */}
        <footer className="no-print mt-auto border-t border-[#172127] bg-[#0c1013] py-6 text-center text-xs text-[#8a9ba8]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              DRACOPEDIA • Caldo de Dragón • Compendio Oficial de Magias Primordiales & D&D 5E
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsEmbedModalOpen(true)}
                className="text-[#bafafd] hover:underline cursor-pointer font-semibold"
              >
                {language === 'es' ? 'Incrustar en web' : 'Embed widget'}
              </button>
              {isCustomSpellUnlocked && (
                <>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('custom')}
                    className="text-[#bafafd] hover:underline cursor-pointer font-semibold"
                  >
                    {language === 'es' ? '+ Nuevo Hechizo' : '+ New Spell'}
                  </button>
                </>
              )}
              <span>•</span>
              <button
                type="button"
                onClick={handleLongRest}
                className="text-[#bafafd] hover:underline cursor-pointer font-semibold"
              >
                {language === 'es' ? 'Descanso Largo' : 'Long Rest'}
              </button>
            </div>
          </div>
        </footer>

        {/* Secret Easter Egg Toast Notification */}
        {showUnlockToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0f1d24]/95 backdrop-blur-md border border-[#bafafd] shadow-2xl text-slate-100 animate-bounce">
            <div className="p-2 rounded-xl bg-[#14282c] text-[#bafafd] border border-[#bafafd]/30">
              <Sparkles className="w-5 h-5 text-[#bafafd]" />
            </div>
            <div>
              <p className="font-heading text-xs font-bold text-[#bafafd] uppercase tracking-wide">
                {language === 'es' ? '¡Nuevo Hechizo Casero Activado!' : 'Custom Spell Mode Activated!'}
              </p>
              <p className="text-[11px] text-slate-300">
                {language === 'es'
                  ? 'Has pulsado 10 veces espacio en menos de 2s.'
                  : 'Detected 10 spacebar presses within 2s.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
