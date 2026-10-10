/**
 * Safely format any infobox value (string, number, array of objects, nested object)
 * into a human-readable string suitable for React rendering and table displays.
 * Prevents React child rendering errors: "Objects are not valid as a React child".
 */

export function formatInfoboxValue(val: unknown): string {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);

  if (Array.isArray(val)) {
    return val
      .map((item) => formatSingleInfoboxItem(item))
      .filter((s) => s.length > 0)
      .join(", ");
  }

  if (typeof val === "object") {
    return formatSingleInfoboxItem(val);
  }

  return String(val);
}

function formatSingleInfoboxItem(item: unknown): string {
  if (item === null || item === undefined) return "";
  if (typeof item === "string") return item.trim();
  if (typeof item === "number" || typeof item === "boolean") return String(item);

  if (typeof item === "object") {
    const obj = item as Record<string, any>;

    // Check if it's a relation/person object like { Nombre: "...", Relación: "..." }
    const name = obj.Nombre || obj.nombre || obj.Name || obj.name || obj.title || obj.Título;
    const relation =
      obj.Relación ||
      obj.Relacion ||
      obj.relación ||
      obj.relacion ||
      obj.Rol ||
      obj.rol ||
      obj.role ||
      obj.Role;

    if (name) {
      return relation ? `${name} (${relation})` : String(name);
    }

    // Generic object key-values e.g. { Fuerza: 18, Destreza: 16 } or { Pareja: "Lady Elyria" }
    const entries = Object.entries(obj)
      .map(([k, v]) => {
        const formattedVal = typeof v === "object" ? formatInfoboxValue(v) : String(v ?? "");
        return formattedVal ? `${k}: ${formattedVal}` : k;
      })
      .filter(Boolean);

    return entries.join(", ");
  }

  return String(item);
}

/**
 * Normalizes an entire infobox object so every value is a clean string.
 */
export function normalizeInfobox(infobox?: Record<string, any> | null): Record<string, string> {
  if (!infobox || typeof infobox !== "object" || Array.isArray(infobox)) {
    return {};
  }
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(infobox)) {
    if (!key || typeof key !== "string") continue;
    const trimmedKey = key.trim();
    if (!trimmedKey) continue;
    result[trimmedKey] = formatInfoboxValue(value);
  }
  return result;
}
