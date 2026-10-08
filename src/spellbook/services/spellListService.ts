import { SpellList } from '../types';
import { DEFAULT_PUBLIC_LISTS } from '../data/defaultPublicLists';

const LOCAL_STORAGE_KEY = 'dragopedia_spell_lists_v1';

// Get all local personal spell lists
export function getLocalSpellLists(): SpellList[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Discard any previous starter dummy list with default spells
    return parsed.filter((l) => l.id !== 'my-starter-list');
  } catch (err) {
    console.error('Error reading local spell lists:', err);
    return [];
  }
}

// Save all local personal spell lists
export function saveLocalSpellLists(lists: SpellList[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lists));
  } catch (err) {
    console.error('Error saving local spell lists:', err);
  }
}

// Add or update a personal spell list
export function saveSingleSpellList(list: SpellList): SpellList[] {
  const lists = getLocalSpellLists();
  const existingIdx = lists.findIndex((l) => l.id === list.id);
  let updated: SpellList[];
  if (existingIdx >= 0) {
    updated = [...lists];
    updated[existingIdx] = { ...list, updatedAt: new Date().toISOString() };
  } else {
    updated = [list, ...lists];
  }
  saveLocalSpellLists(updated);
  return updated;
}

// Delete a personal spell list
export function deleteSpellList(id: string): SpellList[] {
  const lists = getLocalSpellLists();
  const filtered = lists.filter((l) => l.id !== id);
  saveLocalSpellLists(filtered);
  return filtered;
}

// Add spell to list
export function addSpellToList(listId: string, spellId: string): SpellList[] {
  const lists = getLocalSpellLists();
  const target = lists.find((l) => l.id === listId);
  if (!target) return lists;
  if (!target.spellIds.includes(spellId)) {
    target.spellIds = [...target.spellIds, spellId];
    target.updatedAt = new Date().toISOString();
    saveLocalSpellLists(lists);
  }
  return lists;
}

// Remove spell from list
export function removeSpellFromList(listId: string, spellId: string): SpellList[] {
  const lists = getLocalSpellLists();
  const target = lists.find((l) => l.id === listId);
  if (!target) return lists;
  target.spellIds = target.spellIds.filter((id) => id !== spellId);
  target.updatedAt = new Date().toISOString();
  saveLocalSpellLists(lists);
  return lists;
}

// Fetch public gallery lists from server
export async function fetchPublicSpellLists(): Promise<SpellList[]> {
  try {
    const res = await fetch('/api/public-lists');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.lists)) {
        return data.lists;
      }
    }
  } catch (e) {
    console.warn('Could not fetch public lists from server:', e);
  }
  return [];
}

// Publish or sync list to server's public gallery
export async function publishListToServer(list: SpellList): Promise<SpellList | null> {
  try {
    const res = await fetch('/api/public-lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...list, isPublic: true }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.list;
    }
  } catch (e) {
    console.error('Error publishing list to server:', e);
  }
  return null;
}

// Like a public list
export async function likePublicList(listId: string): Promise<number | null> {
  try {
    const res = await fetch(`/api/public-lists/${encodeURIComponent(listId)}/like`, {
      method: 'POST',
    });
    if (res.ok) {
      const data = await res.json();
      return data.likes;
    }
  } catch (e) {
    console.error('Error liking list:', e);
  }
  return null;
}

// Generate share URL for a list
export function generateShareUrl(list: SpellList): string {
  try {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('listId', list.id);
    // Encode full data as payload so link opens even without backend network connectivity
    const miniData = {
      id: list.id,
      name: list.name,
      description: list.description,
      icon: list.icon,
      color: list.color,
      author: list.author,
      spellIds: list.spellIds,
    };
    const jsonStr = JSON.stringify(miniData);
    const b64 = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    ));
    url.searchParams.set('shareData', b64);
    return url.toString();
  } catch (e) {
    return `${window.location.origin}/?listId=${encodeURIComponent(list.id)}`;
  }
}

// Decode list from URL params
export function decodeListFromUrl(): SpellList | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const shareData = params.get('shareData');
    if (shareData) {
      const decodedStr = decodeURIComponent(
        Array.prototype.map
          .call(atob(shareData), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const parsed = JSON.parse(decodedStr);
      if (parsed && parsed.name && Array.isArray(parsed.spellIds)) {
        return {
          id: parsed.id || `shared-${Date.now()}`,
          name: parsed.name,
          description: parsed.description || '',
          icon: parsed.icon || '📖',
          color: parsed.color || '#bafafd',
          author: parsed.author || 'Compartido por enlace',
          spellIds: parsed.spellIds,
          createdAt: new Date().toISOString(),
          isPublic: true,
        };
      }
    }
  } catch (e) {
    console.warn('Could not decode list from URL', e);
  }
  return null;
}
