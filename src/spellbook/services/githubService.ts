// GitHub API Integration for Dragopedia Spells & Media Sync
import { Spell } from '../types';

export const GITHUB_CONFIG = {
  DEFAULT_TOKEN: '',
  OWNER: 'theworldoftirian',
  REPO: 'dragopedia',
  BRANCH: 'main',
  SPELLS_PATH: 'src/data/spells.json',
  UPLOADS_PATH: 'public/images/uploads',
};

// Safe UTF-8 to Base64 encoder for browser & node
export function utf8ToBase64(str: string): string {
  try {
    if (typeof window !== 'undefined' && window.btoa) {
      return window.btoa(unescape(encodeURIComponent(str)));
    }
  } catch {
    // fallback below
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'utf-8').toString('base64');
  }
  return btoa(unescape(encodeURIComponent(str)));
}

// Safe Base64 to UTF-8 decoder
export function base64ToUtf8(str: string): string {
  const clean = str.replace(/[\r\n\t\s]/g, '');
  try {
    if (typeof window !== 'undefined' && window.atob) {
      return decodeURIComponent(escape(window.atob(clean)));
    }
  } catch {
    // fallback
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(clean, 'base64').toString('utf-8');
  }
  return decodeURIComponent(escape(atob(clean)));
}

export interface GitHubSaveResult {
  success: boolean;
  message: string;
  commitUrl?: string;
  sha?: string;
  savedSpell?: Spell;
  fileUrl?: string;
  error?: string;
}

export class GitHubService {
  private token: string;
  private owner: string;
  private repo: string;
  private branch: string;

  constructor(token = GITHUB_CONFIG.DEFAULT_TOKEN, owner = GITHUB_CONFIG.OWNER, repo = GITHUB_CONFIG.REPO, branch = GITHUB_CONFIG.BRANCH) {
    this.token = token;
    this.owner = owner;
    this.repo = repo;
    this.branch = branch;
  }

  public setToken(token: string) {
    this.token = token.trim();
  }

  public getToken(): string {
    return this.token;
  }

  public getRepoFullName(): string {
    return `${this.owner}/${this.repo}`;
  }

  private getHeaders(): Record<string, string> {
    return {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Verify repository access and token validity
   */
  public async verifyAccess(): Promise<{ valid: boolean; message: string; username?: string }> {
    try {
      const res = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}`, {
        headers: this.getHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          valid: true,
          message: `Conectado a ${data.full_name} (${data.permissions?.push ? 'Escritura' : 'Lectura'})`,
          username: data.owner?.login,
        };
      }
      if (res.status === 401) {
        return { valid: false, message: 'Token de GitHub no válido o expirado.' };
      }
      if (res.status === 404) {
        return { valid: false, message: `Repositorio ${this.owner}/${this.repo} no encontrado o sin permisos.` };
      }
      return { valid: false, message: `Error GitHub: ${res.statusText}` };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { valid: false, message: `Error de red: ${msg}` };
    }
  }

  /**
   * Fetch current spells.json file from the repository if present
   */
  public async getRemoteSpellsFile(): Promise<{ sha: string | null; spells: Spell[] }> {
    try {
      const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${GITHUB_CONFIG.SPELLS_PATH}?ref=${this.branch}&_t=${Date.now()}`;
      const res = await fetch(url, { headers: this.getHeaders() });
      if (res.status === 404) {
        return { sha: null, spells: [] };
      }
      if (!res.ok) {
        throw new Error(`Error al leer archivo remoto: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      if (!data.content) {
        return { sha: data.sha || null, spells: [] };
      }
      const text = base64ToUtf8(data.content);
      const parsed = JSON.parse(text);
      const spells = Array.isArray(parsed) ? parsed : (parsed.spells || []);
      return { sha: data.sha, spells };
    } catch (err) {
      console.warn('Could not fetch remote spells.json:', err);
      return { sha: null, spells: [] };
    }
  }

  /**
   * Upload an image file (e.g. data URL or base64) to public/images/uploads in GitHub
   */
  public async uploadSpellImage(
    imageDataUrlOrBase64: string,
    suggestedName: string
  ): Promise<{ success: boolean; url?: string; rawUrl?: string; error?: string }> {
    try {
      let base64Data = imageDataUrlOrBase64;
      let extension = 'png';

      if (imageDataUrlOrBase64.startsWith('data:')) {
        const matches = imageDataUrlOrBase64.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
        if (matches) {
          extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
          base64Data = matches[2];
        } else {
          const commaIdx = imageDataUrlOrBase64.indexOf(',');
          base64Data = imageDataUrlOrBase64.substring(commaIdx + 1);
        }
      }

      const cleanSlug = suggestedName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'spell';

      const filename = `${cleanSlug}-${Date.now()}.${extension}`;
      const filePath = `${GITHUB_CONFIG.UPLOADS_PATH}/${filename}`;

      // Check if file somehow exists
      const checkRes = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/contents/${filePath}?ref=${this.branch}`, {
        headers: this.getHeaders(),
      });
      let existingSha: string | undefined;
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        existingSha = checkData.sha;
      }

      const commitRes = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/contents/${filePath}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({
          message: `🖼️ Añadir icono para hechizo "${suggestedName}" [Dracopedia]`,
          content: base64Data,
          branch: this.branch,
          ...(existingSha ? { sha: existingSha } : {}),
        }),
      });

      if (!commitRes.ok) {
        const errJson = await commitRes.json().catch(() => ({}));
        throw new Error(errJson.message || `Error ${commitRes.status}: ${commitRes.statusText}`);
      }

      // Raw GitHub URL for direct embedding and rendering
      const rawUrl = `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${filePath}`;
      const relativePath = `/images/uploads/${filename}`;

      return {
        success: true,
        url: rawUrl,
        rawUrl,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  }

  /**
   * Save or update a spell in the GitHub repository (src/data/spells.json)
   */
  public async saveSpell(
    spell: Spell,
    options: {
      commitMessage?: string;
      customIconBase64?: string;
    } = {}
  ): Promise<GitHubSaveResult> {
    try {
      let updatedSpell: Spell = {
        ...spell,
        isCustom: true,
        isEdited: true,
        updatedAt: new Date().toISOString(),
      };

      // 1. If there is a new custom image upload, upload it to GitHub first
      if (options.customIconBase64) {
        const uploadResult = await this.uploadSpellImage(options.customIconBase64, spell.name);
        if (uploadResult.success && uploadResult.url) {
          updatedSpell.iconUrl = uploadResult.url;
          updatedSpell.bg3IconUrl = uploadResult.url;
        } else if (uploadResult.error) {
          console.warn('Image upload failed, continuing with JSON update:', uploadResult.error);
        }
      }

      // 2. Fetch existing spells file from GitHub
      const { sha, spells: remoteSpells } = await this.getRemoteSpellsFile();

      // 3. Upsert the spell in the array
      const existingIdx = remoteSpells.findIndex((s) => s.id === updatedSpell.id || s.name.toLowerCase() === updatedSpell.name.toLowerCase());
      let newSpellsList: Spell[];
      if (existingIdx >= 0) {
        newSpellsList = [...remoteSpells];
        newSpellsList[existingIdx] = updatedSpell;
      } else {
        newSpellsList = [updatedSpell, ...remoteSpells];
      }

      // 4. Encode to base64
      const jsonContent = JSON.stringify(newSpellsList, null, 2);
      const base64Content = utf8ToBase64(jsonContent);

      // 5. Commit to GitHub
      const message = options.commitMessage || `✨ ${existingIdx >= 0 ? 'Actualizar' : 'Añadir'} hechizo "${updatedSpell.name}" en Dracopedia`;

      const commitRes = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/contents/${GITHUB_CONFIG.SPELLS_PATH}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({
          message,
          content: base64Content,
          branch: this.branch,
          ...(sha ? { sha } : {}),
        }),
      });

      if (!commitRes.ok) {
        const errJson = await commitRes.json().catch(() => ({}));
        throw new Error(errJson.message || `HTTP ${commitRes.status}: ${commitRes.statusText}`);
      }

      const commitData = await commitRes.json();
      const commitUrl = commitData.commit?.html_url || `https://github.com/${this.owner}/${this.repo}/commits/${this.branch}`;
      const fileUrl = `https://github.com/${this.owner}/${this.repo}/blob/${this.branch}/${GITHUB_CONFIG.SPELLS_PATH}`;

      return {
        success: true,
        message: `Hechizo "${updatedSpell.name}" guardado exitosamente en GitHub (${this.owner}/${this.repo}).`,
        commitUrl,
        fileUrl,
        sha: commitData.content?.sha,
        savedSpell: updatedSpell,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        message: `Error al guardar en GitHub: ${msg}`,
        error: msg,
      };
    }
  }
}

// Global default singleton instance
export const githubService = new GitHubService();
