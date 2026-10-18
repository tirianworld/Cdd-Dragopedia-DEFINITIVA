/**
 * Image Service for Dragopedia
 * Handles caching, resolving, and authenticated loading of GitHub and remote spell icons.
 */
import { githubService } from './githubService';
import {
  safeLocalStorageGet,
  safeLocalStorageSet,
  saveImageToIDB,
  loadImagesFromIDB,
} from './storageHelper';

// In-memory cache for resolved blob/data URLs to ensure zero latency on re-renders
const urlCache = new Map<string, string>();
const pendingRequests = new Map<string, Promise<string>>();

const STORAGE_KEY_CUSTOM_IMAGES = 'dragopedia_custom_images_v2';

// Load initial images from IndexedDB asynchronously into memory cache
if (typeof window !== 'undefined') {
  loadImagesFromIDB()
    .then((images) => {
      Object.entries(images).forEach(([key, data]) => {
        if (!urlCache.has(key)) {
          urlCache.set(key, data);
        }
      });
    })
    .catch(() => {
      // Ignore
    });
}

/**
 * Get all cached custom base64 images from localStorage
 */
export function getLocalCustomImages(): Record<string, string> {
  try {
    const raw = safeLocalStorageGet(STORAGE_KEY_CUSTOM_IMAGES);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Save a custom image base64 into localStorage cache & IndexedDB
 */
export function saveLocalCustomImage(key: string, base64DataUrl: string): void {
  try {
    urlCache.set(key, base64DataUrl);
    // Persist to IndexedDB (safe large storage)
    saveImageToIDB(key, base64DataUrl);

    // Also attempt localStorage cache if size allows
    const current = getLocalCustomImages();
    // Only store in localStorage if base64 is reasonable (< 150KB) to prevent blowing quota
    if (base64DataUrl.length < 150000) {
      current[key] = base64DataUrl;
      safeLocalStorageSet(STORAGE_KEY_CUSTOM_IMAGES, JSON.stringify(current));
    }
  } catch (err) {
    console.warn('Could not save custom image to localStorage:', err);
  }
}

/**
 * Remove a custom cached image from localStorage cache
 */
export function removeLocalCustomImage(key: string): void {
  try {
    const current = getLocalCustomImages();
    delete current[key];
    safeLocalStorageSet(STORAGE_KEY_CUSTOM_IMAGES, JSON.stringify(current));
    urlCache.delete(key);
  } catch (err) {
    console.warn('Could not remove custom image from localStorage:', err);
  }
}

/**
 * Synchronously checks if a resolved URL is already available in cache
 */
export function getCachedImageUrl(rawUrl: string | null | undefined, spellId?: string): string | null {
  // 1. Direct data URLs or blob URLs need no resolution
  if (rawUrl && (rawUrl.startsWith('data:') || rawUrl.startsWith('blob:'))) {
    return rawUrl;
  }

  // 2. Direct public CDNs (spellbookdnd or bg3.wiki static) should be used directly
  if (rawUrl && (rawUrl.includes('spellbookdnd.com') || rawUrl.includes('bg3.wiki/w/images/'))) {
    return rawUrl;
  }

  // 3. Check in-memory cache for rawUrl
  if (rawUrl && urlCache.has(rawUrl)) {
    return urlCache.get(rawUrl)!;
  }

  // 4. Check localStorage custom images by spellId or rawUrl (e.g. for GitHub uploads/fallbacks)
  const localImages = getLocalCustomImages();
  if (spellId && localImages[spellId]) {
    return localImages[spellId];
  }
  if (rawUrl && localImages[rawUrl]) {
    return localImages[rawUrl];
  }

  return null;
}

/**
 * Resolves any image URL, downloading private/authenticated GitHub images if needed
 */
export async function resolveSpellImageUrl(
  rawUrl: string | null | undefined,
  spellId?: string
): Promise<string> {
  if (!rawUrl) return '';

  const cached = getCachedImageUrl(rawUrl, spellId);
  if (cached) return cached;

  // If already a standard non-GitHub HTTP URL or local path, return as-is
  const isGithubRaw = rawUrl.includes('raw.githubusercontent.com') || rawUrl.includes('github.com');
  if (!isGithubRaw) {
    return rawUrl;
  }

  // Prevent duplicate concurrent requests for the same URL
  if (pendingRequests.has(rawUrl)) {
    return pendingRequests.get(rawUrl)!;
  }

  const fetchPromise = (async () => {
    try {
      const token = githubService.getToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(rawUrl, { headers });
      if (!res.ok) {
        throw new Error(`Failed to fetch image: ${res.status}`);
      }

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      urlCache.set(rawUrl, objectUrl);

      // If spellId is provided, also associate with spellId
      if (spellId) {
        urlCache.set(spellId, objectUrl);
      }

      return objectUrl;
    } catch (err) {
      console.warn('Authenticated image fetch failed, returning rawUrl:', err);
      return rawUrl;
    } finally {
      pendingRequests.delete(rawUrl);
    }
  })();

  pendingRequests.set(rawUrl, fetchPromise);
  return fetchPromise;
}
