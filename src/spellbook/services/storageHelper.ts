/**
 * Safe Storage & IndexedDB Persistence Helper for Dragopedia
 * 
 * Prevents QuotaExceededError by:
 * 1. Safely wrapping localStorage with quota handling, cache pruning, and size minimization.
 * 2. Providing IndexedDB as a large-quota persistent fallback for custom homebrew spells and images.
 */
import { Spell, Character } from '../types';

const DB_NAME = 'DragopediaDB_v1';
const DB_VERSION = 1;
const STORE_SPELLS = 'custom_spells';
const STORE_IMAGES = 'custom_images';
const STORE_CHARACTERS = 'characters';

// List of non-vital cache keys that can be pruned when quota is exceeded
const PURGEABLE_CACHE_KEYS = [
  'dragopedia_custom_images_v2',
  'dragopedia_custom_images',
  'spellbook_dnd_spells',
  'spellbook_dnd_characters',
  'spellbook_dnd_spells_v1',
  'spellbook_dnd_characters_v1',
];

/**
 * Safely retrieve an item from localStorage without throwing
 */
export function safeLocalStorageGet(key: string): string | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage.getItem(key);
  } catch (err) {
    console.warn(`[Storage] Failed to read key "${key}":`, err);
    return null;
  }
}

/**
 * Safely remove an item from localStorage without throwing
 */
export function safeLocalStorageRemove(key: string): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[Storage] Failed to remove key "${key}":`, err);
  }
}

/**
 * Remove legacy or purgeable cache keys to free up localStorage quota
 */
export function purgeObsoleteStorage(): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    for (const key of PURGEABLE_CACHE_KEYS) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // Ignore
  }
}

/**
 * Safely save an item to localStorage with automatic QuotaExceededError recovery
 */
export function safeLocalStorageSet(key: string, value: string): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;

  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (err: unknown) {
    console.warn(`[Storage] LocalStorage setItem failed for key "${key}". Attempting quota recovery...`, err);

    // 1. Try purging obsolete and heavy cache keys
    purgeObsoleteStorage();

    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch {
      // 2. If it is the spells key and still failing, strip out huge base64 data URLs from icons
      if (key.includes('spell')) {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            const stripped = parsed.map((item: Record<string, unknown>) => {
              const copy = { ...item };
              if (typeof copy.iconUrl === 'string' && copy.iconUrl.startsWith('data:')) {
                copy.iconUrl = '';
              }
              if (typeof copy.bg3IconUrl === 'string' && copy.bg3IconUrl.startsWith('data:')) {
                copy.bg3IconUrl = '';
              }
              return copy;
            });
            window.localStorage.setItem(key, JSON.stringify(stripped));
            console.info('[Storage] Successfully saved spells after stripping base64 images from localStorage payload.');
            return true;
          }
        } catch {
          // Ignore
        }
      }

      console.warn(`[Storage] Unable to persist key "${key}" to localStorage due to quota limit. Falling back gracefully.`);
      return false;
    }
  }
}

/**
 * Open IndexedDB database
 */
function openIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_SPELLS)) {
        db.createObjectStore(STORE_SPELLS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_IMAGES)) {
        db.createObjectStore(STORE_IMAGES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_CHARACTERS)) {
        db.createObjectStore(STORE_CHARACTERS, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save custom/edited spells to IndexedDB (asynchronous high-capacity storage)
 */
export async function saveSpellsToIDB(spells: Spell[]): Promise<void> {
  try {
    const db = await openIDB();
    const tx = db.transaction(STORE_SPELLS, 'readwrite');
    const store = tx.objectStore(STORE_SPELLS);

    // Clear existing custom store and rewrite
    await new Promise<void>((resolve, reject) => {
      const clearReq = store.clear();
      clearReq.onsuccess = () => resolve();
      clearReq.onerror = () => reject(clearReq.error);
    });

    for (const spell of spells) {
      store.put(spell);
    }

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('[IDB] Failed to save spells to IndexedDB:', err);
  }
}

/**
 * Load custom/edited spells from IndexedDB
 */
export async function loadSpellsFromIDB(): Promise<Spell[]> {
  try {
    const db = await openIDB();
    const tx = db.transaction(STORE_SPELLS, 'readonly');
    const store = tx.objectStore(STORE_SPELLS);

    return new Promise<Spell[]>((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as Spell[]) || []);
      req.onerror = () => resolve([]);
    });
  } catch (err) {
    console.warn('[IDB] Failed to load spells from IndexedDB:', err);
    return [];
  }
}

/**
 * Save custom image to IndexedDB
 */
export async function saveImageToIDB(id: string, base64Url: string): Promise<void> {
  try {
    const db = await openIDB();
    const tx = db.transaction(STORE_IMAGES, 'readwrite');
    const store = tx.objectStore(STORE_IMAGES);
    store.put({ id, data: base64Url });
  } catch (err) {
    console.warn('[IDB] Failed to save image to IndexedDB:', err);
  }
}

/**
 * Load all custom images from IndexedDB
 */
export async function loadImagesFromIDB(): Promise<Record<string, string>> {
  try {
    const db = await openIDB();
    const tx = db.transaction(STORE_IMAGES, 'readonly');
    const store = tx.objectStore(STORE_IMAGES);

    return new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => {
        const result: Record<string, string> = {};
        const items = req.result as Array<{ id: string; data: string }>;
        if (Array.isArray(items)) {
          for (const item of items) {
            result[item.id] = item.data;
          }
        }
        resolve(result);
      };
      req.onerror = () => resolve({});
    });
  } catch {
    return {};
  }
}

/**
 * Save characters to IndexedDB
 */
export async function saveCharactersToIDB(characters: Character[]): Promise<void> {
  try {
    const db = await openIDB();
    const tx = db.transaction(STORE_CHARACTERS, 'readwrite');
    const store = tx.objectStore(STORE_CHARACTERS);

    await new Promise<void>((resolve, reject) => {
      const clearReq = store.clear();
      clearReq.onsuccess = () => resolve();
      clearReq.onerror = () => reject(clearReq.error);
    });

    for (const char of characters) {
      store.put(char);
    }
  } catch (err) {
    console.warn('[IDB] Failed to save characters to IndexedDB:', err);
  }
}

/**
 * Load characters from IndexedDB
 */
export async function loadCharactersFromIDB(): Promise<Character[]> {
  try {
    const db = await openIDB();
    const tx = db.transaction(STORE_CHARACTERS, 'readonly');
    const store = tx.objectStore(STORE_CHARACTERS);

    return new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as Character[]) || []);
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/**
 * Compress / downscale an image file or base64 to a lightweight icon (max 256x256)
 * Strictly preserves aspect ratio with zero deformation or distortion.
 */
export async function compressImageIcon(
  fileOrBase64: File | string,
  maxWidth = 256,
  maxHeight = 256,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    let src = '';
    if (typeof fileOrBase64 === 'string') {
      src = fileOrBase64;
    } else {
      src = URL.createObjectURL(fileOrBase64);
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (typeof fileOrBase64 !== 'string') {
        URL.revokeObjectURL(src);
      }

      const origWidth = img.naturalWidth || img.width;
      const origHeight = img.naturalHeight || img.height;

      if (!origWidth || !origHeight) {
        return resolve(src);
      }

      // Calculate uniform scale factor to guarantee 100% preservation of aspect ratio
      const ratio = Math.min(maxWidth / origWidth, maxHeight / origHeight, 1);
      const targetWidth = Math.max(1, Math.round(origWidth * ratio));
      const targetHeight = Math.max(1, Math.round(origHeight * ratio));

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve(src);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Try webp first, fallback to png
      try {
        const webp = canvas.toDataURL('image/webp', quality);
        if (webp && webp.startsWith('data:image/webp')) {
          return resolve(webp);
        }
      } catch {
        // fallback
      }

      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      if (typeof fileOrBase64 !== 'string') {
        URL.revokeObjectURL(src);
      }
      reject(new Error('Failed to load image for compression'));
    };

    img.src = src;
  });
}
