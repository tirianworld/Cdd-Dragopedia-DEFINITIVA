// Helper utility to scan and match images from the user's Downloads folder
// using the modern File System Access API and IndexedDB persistence.

export interface MatchedDownloadImage {
  id: string;
  name: string;
  file: File;
  previewUrl: string;
  size: number;
  lastModified: number;
  score: number;
}

const HANDLE_DB_NAME = "Dragopedia_DownloadsHandleDB";
const HANDLE_STORE_NAME = "directory_handles";
const HANDLE_KEY = "user_downloads_handle";

// Open dedicated IndexedDB for storing DirectoryHandle
function openHandleDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB no soportado"));
    }
    const req = indexedDB.open(HANDLE_DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(HANDLE_STORE_NAME)) {
        db.createObjectStore(HANDLE_STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("Error abriendo DB de handles"));
  });
}

/**
 * Saves the FileSystemDirectoryHandle in IndexedDB.
 */
export async function saveDownloadsDirectoryHandle(handle: FileSystemDirectoryHandle): Promise<void> {
  try {
    const db = await openHandleDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(HANDLE_STORE_NAME, "readwrite");
      const store = tx.objectStore(HANDLE_STORE_NAME);
      const req = store.put(handle, HANDLE_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("No se pudo guardar directory handle en IndexedDB:", err);
  }
}

/**
 * Retrieves stored FileSystemDirectoryHandle from IndexedDB.
 */
export async function getStoredDownloadsDirectoryHandle(): Promise<FileSystemDirectoryHandle | null> {
  try {
    const db = await openHandleDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(HANDLE_STORE_NAME, "readonly");
      const store = tx.objectStore(HANDLE_STORE_NAME);
      const req = store.get(HANDLE_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("No se pudo recuperar directory handle de IndexedDB:", err);
    return null;
  }
}

/**
 * Clears stored handle from IndexedDB.
 */
export async function clearStoredDownloadsDirectoryHandle(): Promise<void> {
  try {
    const db = await openHandleDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(HANDLE_STORE_NAME, "readwrite");
      const store = tx.objectStore(HANDLE_STORE_NAME);
      const req = store.delete(HANDLE_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("Error al borrar handle de IndexedDB:", err);
  }
}

/**
 * Normalizes text: lowercase, trims, removes accents and special characters.
 */
export function normalizeText(text: string): string {
  return (text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Computes a matching relevance score between a filename and a search query.
 * Returns score > 0 if matched, 0 if no match.
 */
export function computeMatchScore(filename: string, searchTerm: string): number {
  if (!filename || !searchTerm) return 0;

  // Clean filename: remove extension and replace symbols
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  const normFile = normalizeText(nameWithoutExt);
  const normQuery = normalizeText(searchTerm);

  if (!normQuery) return 0;

  // 1. Exact match
  if (normFile === normQuery) return 100;

  // 2. Starts with query
  if (normFile.startsWith(normQuery)) return 90;

  // 3. Contains entire query
  if (normFile.includes(normQuery)) return 80;

  // 4. Token-based matching (e.g. "dragon rojo" matches "dragon_rojo_anciano.png" or "gran-dragon-rojo.jpg")
  const queryTokens = normQuery.split(/\s+/).filter((t) => t.length > 2);
  if (queryTokens.length === 0) {
    return normFile.includes(normQuery) ? 50 : 0;
  }

  const fileTokens = normFile.split(/[\s-_]+/).filter((t) => t.length > 0);
  let matchedTokensCount = 0;

  for (const qToken of queryTokens) {
    if (fileTokens.some((fToken) => fToken.includes(qToken) || qToken.includes(fToken))) {
      matchedTokensCount++;
    }
  }

  if (matchedTokensCount === queryTokens.length) {
    return 70; // All tokens matched
  }

  if (matchedTokensCount > 0 && queryTokens.length > 1) {
    const ratio = matchedTokensCount / queryTokens.length;
    if (ratio >= 0.5) {
      return Math.round(40 * ratio);
    }
  }

  return 0;
}

const IMAGE_EXTENSIONS_REGEX = /\.(png|jpe?g|webp|gif|svg|bmp|avif)$/i;

/**
 * Scans a FileSystemDirectoryHandle for image files matching a given searchTerm.
 */
export async function scanDirectoryForMatchingImages(
  dirHandle: FileSystemDirectoryHandle,
  searchTerm: string,
  maxResults = 24
): Promise<MatchedDownloadImage[]> {
  const matches: MatchedDownloadImage[] = [];

  try {
    // @ts-ignore
    for await (const entry of dirHandle.values()) {
      if (entry.kind === "file" && IMAGE_EXTENSIONS_REGEX.test(entry.name)) {
        const score = computeMatchScore(entry.name, searchTerm);
        if (score > 0) {
          try {
            const file = await entry.getFile();
            const previewUrl = URL.createObjectURL(file);
            matches.push({
              id: `match_${entry.name}_${file.lastModified}`,
              name: entry.name,
              file,
              previewUrl,
              size: file.size,
              lastModified: file.lastModified,
              score
            });
          } catch (fileErr) {
            console.warn("No se pudo leer archivo del directorio:", entry.name, fileErr);
          }
        }
      }
    }
  } catch (err) {
    console.error("Error escaneando directorio de descargas:", err);
    throw err;
  }

  // Sort by highest score first, then newest lastModified
  matches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.lastModified - a.lastModified;
  });

  return matches.slice(0, maxResults);
}

/**
 * Filters and scores an array of File objects (e.g. from file input or drag-drop) matching a searchTerm.
 */
export function filterMatchingFiles(files: FileList | File[], searchTerm: string): MatchedDownloadImage[] {
  const matches: MatchedDownloadImage[] = [];
  const list = Array.from(files);

  for (const file of list) {
    if (file.type.startsWith("image/") || IMAGE_EXTENSIONS_REGEX.test(file.name)) {
      const score = computeMatchScore(file.name, searchTerm);
      if (score > 0) {
        matches.push({
          id: `match_${file.name}_${file.lastModified}`,
          name: file.name,
          file,
          previewUrl: URL.createObjectURL(file),
          size: file.size,
          lastModified: file.lastModified,
          score
        });
      }
    }
  }

  matches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.lastModified - a.lastModified;
  });

  return matches;
}

/**
 * Requests the user to pick their Downloads folder via showDirectoryPicker,
 * saves the handle in IndexedDB, and returns the handle.
 */
export async function requestDownloadsDirectoryPicker(): Promise<FileSystemDirectoryHandle | null> {
  if (typeof window === "undefined" || !("showDirectoryPicker" in window)) {
    return null;
  }

  try {
    // @ts-ignore
    const dirHandle = await window.showDirectoryPicker({
      id: "dragopedia_downloads_folder",
      mode: "read",
      startIn: "downloads"
    });

    if (dirHandle) {
      await saveDownloadsDirectoryHandle(dirHandle);
      return dirHandle;
    }
  } catch (err: any) {
    if (err.name !== "AbortError") {
      console.warn("Error seleccionando carpeta de descargas:", err);
    }
  }
  return null;
}
