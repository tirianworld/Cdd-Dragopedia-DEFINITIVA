import blockedFilenamesJson from "../data/blocked_image_filenames.json";

export const GEO_BLOCK_MD5 = "f953f499c9824953791551bfef65fe61";
export const GEO_BLOCK_FILE_SIZE = 34641;
export const GEO_BLOCK_WIDTH = 336;
export const GEO_BLOCK_HEIGHT = 478;

const BLOCKED_FILENAMES_SET = new Set<string>();

if (Array.isArray(blockedFilenamesJson)) {
  for (const item of blockedFilenamesJson) {
    if (typeof item === "string") {
      const lower = item.toLowerCase().trim();
      BLOCKED_FILENAMES_SET.add(lower);
      const fileNameOnly = lower.split("/").pop();
      if (fileNameOnly) {
        BLOCKED_FILENAMES_SET.add(fileNameOnly);
      }
    }
  }
}

/**
 * Checks whether an image URL points to a known regional geo-blocking placeholder
 * ("Content not viewable in your region" from Imgur/hosts).
 */
export function isBlockedGeoImage(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim().toLowerCase();
  if (!trimmed) return false;

  if (
    trimmed.includes("content not viewable") ||
    trimmed.includes("not_viewable") ||
    trimmed.includes("content_not_viewable") ||
    trimmed.includes("blocked_region") ||
    trimmed.includes("geo_block")
  ) {
    return true;
  }

  const cleanPath = trimmed.split("?")[0].split("#")[0];
  const fileNameOnly = cleanPath.split("/").pop() || "";

  if (BLOCKED_FILENAMES_SET.has(fileNameOnly)) {
    return true;
  }

  for (const item of BLOCKED_FILENAMES_SET) {
    if (cleanPath.endsWith(item)) {
      return true;
    }
  }

  return false;
}

/**
 * Checks a loaded HTMLImageElement in the DOM.
 * If its natural dimensions (336x478) and pixel color signature match the
 * "Content not viewable in your region" gradient (purple top, blue bottom, or green badge),
 * it immediately hides the element, marks it as blocked, and executes the callback
 * to remove the image from the article.
 */
export function checkAndRemoveIfGeoBlockedImage(
  imgElement: HTMLImageElement,
  onBlockedDetected?: () => void
): boolean {
  if (!imgElement) return false;

  const w = imgElement.naturalWidth;
  const h = imgElement.naturalHeight;

  // Imgur's "Content not viewable in your region" placeholder is exactly 336x478
  // (aspect ratio ~0.7029)
  const isExactGeoDimensions = w === GEO_BLOCK_WIDTH && h === GEO_BLOCK_HEIGHT;
  const isGeoAspectRatio = w > 0 && h > 0 && Math.abs(w / h - 336 / 478) < 0.015 && w < 400;

  if (!isExactGeoDimensions && !isGeoAspectRatio) {
    // If URL itself is marked blocked, still trigger
    if (isBlockedGeoImage(imgElement.src)) {
      imgElement.style.display = "none";
      imgElement.dataset.geoBlocked = "true";
      onBlockedDetected?.();
      return true;
    }
    return false;
  }

  let confirmedGeoBlock = false;

  try {
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (ctx) {
      ctx.drawImage(imgElement, 0, 0, 16, 16);
      const topPixel = ctx.getImageData(8, 2, 1, 1).data; // Top purple gradient
      const botPixel = ctx.getImageData(8, 14, 1, 1).data; // Bottom indigo/blue gradient
      const cornerPixel = ctx.getImageData(14, 14, 1, 1).data; // Bottom right green badge

      // Top purple: R ~ 100-160, G ~ 50-110, B ~ 220-255
      const isPurpleTop = topPixel[0] >= 80 && topPixel[0] <= 180 && topPixel[1] >= 40 && topPixel[1] <= 120 && topPixel[2] >= 200;
      // Bottom blue: R ~ 60-120, G ~ 60-120, B ~ 200-255
      const isBlueBot = botPixel[0] >= 50 && botPixel[0] <= 140 && botPixel[1] >= 50 && botPixel[1] <= 140 && botPixel[2] >= 190;
      // Green badge: R ~ 0-80, G ~ 160-240, B ~ 80-160
      const isGreenCorner = cornerPixel[0] <= 90 && cornerPixel[1] >= 150 && cornerPixel[2] <= 170;

      if ((isPurpleTop && isBlueBot) || isGreenCorner || (isExactGeoDimensions && (isPurpleTop || isBlueBot))) {
        confirmedGeoBlock = true;
      }
    }
  } catch {
    // If canvas is tainted or cross-origin blocked, the exact 336x478 dimension is definitive
    if (isExactGeoDimensions) {
      confirmedGeoBlock = true;
    }
  }

  // If exact dimensions 336x478 matched
  if (isExactGeoDimensions) {
    confirmedGeoBlock = true;
  }

  if (confirmedGeoBlock) {
    imgElement.style.display = "none";
    imgElement.dataset.geoBlocked = "true";
    if (onBlockedDetected) {
      onBlockedDetected();
    }
    return true;
  }

  return false;
}
