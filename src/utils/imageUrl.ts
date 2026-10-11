/**
 * Utility to process and sanitize image URLs throughout Dragopedia.
 * Bypasses hotlink protection (e.g. Fandom/Wikia Cloudflare 403 blocks)
 * by proxying through our server-side image proxy, filters regional geo-blocked
 * placeholders, and provides multi-tier reliable fallbacks.
 */

import {
  isBlockedGeoImage,
  checkAndRemoveIfGeoBlockedImage,
  GEO_BLOCK_MD5,
  GEO_BLOCK_FILE_SIZE,
  GEO_BLOCK_WIDTH,
  GEO_BLOCK_HEIGHT
} from "./blockedImages";

export {
  isBlockedGeoImage,
  checkAndRemoveIfGeoBlockedImage,
  GEO_BLOCK_MD5,
  GEO_BLOCK_FILE_SIZE,
  GEO_BLOCK_WIDTH,
  GEO_BLOCK_HEIGHT
};

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/tirianworld/Cdd-Dragopedia-DEFINITIVA/main/public";
const GITHUB_V4_RAW_BASE = "https://raw.githubusercontent.com/tirianworld/Cdd-wiki-V4/main/public";
const GITHUB_V3_RAW_BASE = "https://raw.githubusercontent.com/tirianworld/Cdd-wiki-V3/main/public";

export function getSafeImageUrl(url?: string | null): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  // If this URL is known to be a regional geo-blocked placeholder, immediately reject it
  if (isBlockedGeoImage(trimmed)) {
    return "";
  }

  // Data URLs and blob URLs are used directly
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  // If running on GitHub Pages (static hosting with no local node server),
  // route local /images/ paths directly to raw GitHub CDN
  if (typeof window !== "undefined" && window.location.hostname.includes("github.io")) {
    if (trimmed.startsWith("/images/")) {
      return `${GITHUB_RAW_BASE}${trimmed}`;
    }
  }

  // Local absolute paths are safe to use directly
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  // Already proxied
  if (trimmed.startsWith("/api/proxy-image")) {
    return trimmed;
  }

  // Known domains with strict hotlink protections / CORS policies
  if (
    trimmed.includes("wikia.nocookie.net") ||
    trimmed.includes("fandom.com") ||
    trimmed.includes("artstation.com") ||
    trimmed.includes("deviantart.net") ||
    trimmed.includes("deviantart.com") ||
    trimmed.includes("wixmp.com") ||
    trimmed.includes("gamerantimages.com") ||
    trimmed.includes("dndbeyond.com") ||
    trimmed.includes("wargamer.com") ||
    trimmed.includes("dungeonnexus.com") ||
    trimmed.includes("arcpublishing.com") ||
    trimmed.includes("imgur.com")
  ) {
    return `/api/proxy-image?url=${encodeURIComponent(trimmed)}`;
  }

  return trimmed;
}

/**
 * Returns an alternative proxied URL if a direct image URL fails to load.
 */
export function getProxiedFallbackUrl(url: string): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }
  if (isBlockedGeoImage(trimmed)) {
    return "";
  }
  if (trimmed.startsWith("/api/proxy-image")) {
    return trimmed;
  }
  return `/api/proxy-image?url=${encodeURIComponent(trimmed)}`;
}

/**
 * Common fallback handler for <img> elements:
 * Multi-tier recovery:
 * 1. Filter out regional geo-blocked placeholders immediately
 * 2. Server-side proxy for external blocked images
 * 3. GitHub Raw CDN fallback (DEFINITIVA -> V4 -> V3)
 * 4. Graceful hiding / fallback placeholder so no broken image icon is shown
 */
export function handleImageErrorWithFallback(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  originalUrl?: string,
  fallbackSrc?: string
) {
  const target = event.currentTarget;
  if (!target) return;

  const currentSrc = target.src || "";

  // If already flagged as geo-blocked or URL is blocked, stop retries immediately
  if (target.dataset.geoBlocked === "true" || isBlockedGeoImage(currentSrc) || isBlockedGeoImage(originalUrl)) {
    target.dataset.exhausted = "true";
    target.style.display = "none";
    return;
  }

  const step = Number(target.dataset.fallbackStep || 0);
  target.dataset.fallbackStep = String(step + 1);

  // Preserve the true original path
  if (!target.dataset.originalPath && originalUrl) {
    target.dataset.originalPath = originalUrl;
  }

  const extractImagesPath = (src: string) => {
    const idx = src.indexOf("/images/");
    return idx !== -1 ? src.substring(idx) : null;
  };

  const trueOriginal = target.dataset.originalPath || originalUrl || currentSrc;
  const imgPath = extractImagesPath(trueOriginal) || extractImagesPath(currentSrc);

  // Step 0: If external URL, try proxying
  if (step === 0 && trueOriginal.startsWith("http") && !trueOriginal.includes("/api/proxy-image") && !trueOriginal.includes("raw.githubusercontent.com")) {
    target.src = getProxiedFallbackUrl(trueOriginal);
    return;
  }

  // Step 1: GitHub Raw CDN fallback (DEFINITIVA)
  if (step <= 1 && imgPath && !isBlockedGeoImage(imgPath)) {
    target.src = `${GITHUB_RAW_BASE}${imgPath}`;
    return;
  }

  // Step 2: GitHub Raw CDN fallback (V4)
  if (step <= 2 && imgPath && !isBlockedGeoImage(imgPath)) {
    target.src = `${GITHUB_V4_RAW_BASE}${imgPath}`;
    return;
  }

  // Step 3: GitHub Raw CDN fallback (V3)
  if (step <= 3 && imgPath && !isBlockedGeoImage(imgPath)) {
    target.src = `${GITHUB_V3_RAW_BASE}${imgPath}`;
    return;
  }

  // Step 4: Custom fallbackSrc if provided
  if (fallbackSrc && target.src !== fallbackSrc && !isBlockedGeoImage(fallbackSrc)) {
    target.src = fallbackSrc;
    return;
  }

  // Step 5: All attempts exhausted.
  target.dataset.exhausted = "true";
  target.style.display = "none";
}
