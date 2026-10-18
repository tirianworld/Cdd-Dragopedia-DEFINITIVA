import React, { useState } from 'react';
import { getSchoolTheme } from '../data/schools';

interface OfficialSpellLineIconProps {
  iconUrl: string;
  name?: string;
  school?: string | null;
  color?: string | null;
  className?: string;
  onError?: () => void;
}

interface SchoolGlowStyle {
  core: string; // The vibrant, high-brightness stroke color
  mid: string;  // Saturated midtone for body and halo
  rim: string;  // Deep, intense outline delineation
}

// Authentic Baldur's Gate 3 colored line-art palette matching user's reference images
const BG3_GLOW_STYLES: Record<string, SchoolGlowStyle> = {
  // Evocación (Fuego / Rayo solar / Destrucción)
  'Evocación': {
    core: '#ffaa33',
    mid: '#ff6600',
    rim: '#e62e00',
  },
  // Abjuración (Escudos / Rayo azul eléctrico - como en Imagen 1)
  'Abjuración': {
    core: '#38bdf8',
    mid: '#0284c7',
    rim: '#0369a1',
  },
  // Adivinación (Oro solar / Visión)
  'Adivinación': {
    core: '#fde047',
    mid: '#eab308',
    rim: '#ca8a04',
  },
  // Conjuración (Esmeralda / Menta viva)
  'Conjuración': {
    core: '#4ade80',
    mid: '#16a34a',
    rim: '#15803d',
  },
  // Encantamiento (Rosa fucsia místico / Hechizo)
  'Encantamiento': {
    core: '#f472b6',
    mid: '#db2777',
    rim: '#be185d',
  },
  // Ilusión (Violeta etéreo / Sombras)
  'Ilusión': {
    core: '#c084fc',
    mid: '#9333ea',
    rim: '#7e22ce',
  },
  // Nigromancia (Fucsia necrótico / Amatista oscuro)
  'Nigromancia': {
    core: '#e879f9',
    mid: '#c026d3',
    rim: '#a21caf',
  },
  // Transmutación (Jade alquímico / Metamorfosis)
  'Transmutación': {
    core: '#34d399',
    mid: '#059669',
    rim: '#047857',
  },
  // Reflexión (Cian cristalino / Pluma caída - como en Imagen 2)
  'Reflexión': {
    core: '#67e8f9',
    mid: '#06b6d4',
    rim: '#0e7490',
  },
};

/**
 * Helper to check if an icon URL or spell should receive the authentic BG3 magical glow:
 * 1. Official D&D spellbook line icons (spellbookdnd.com)
 * 2. Custom created or homebrew spells (isCustom, isEdited, Homebrew, Grimorio)
 * 3. Custom uploaded images, data URLs, blob URLs, or custom gallery keys
 */
export function isOfficialDndLineIcon(
  url?: string | null,
  spell?: {
    id?: string;
    isCustom?: boolean;
    isEdited?: boolean;
    source?: string;
  } | null
): boolean {
  if (!url || typeof url !== 'string') return false;

  // 1. Data URLs or blob URLs (uploaded custom images/drawings)
  if (url.startsWith('data:') || url.startsWith('blob:') || url.includes('custom_')) {
    return true;
  }

  // 2. Official D&D spellbook line icons
  if (url.includes('spellbookdnd.com') || url.includes('/spell/')) {
    return true;
  }

  // 3. Spells created/edited by the user or custom homebrew spells
  if (
    spell?.isCustom ||
    spell?.isEdited ||
    spell?.source === 'Homebrew' ||
    (spell?.source && (spell.source.includes('Grimorio') || spell.source.includes('Dracopedia'))) ||
    spell?.id?.startsWith('custom_')
  ) {
    // If it is an authentic external full-color 3D illustration from bg3.wiki, keep full color
    if (url.includes('bg3.wiki/w/images/') && !url.includes('custom')) {
      return false;
    }
    return true;
  }

  return false;
}

/**
 * Renders spell icons with authentic Baldur's Gate 3 colored line-art style:
 * - Entire stroke filled with vibrant thematic magical color (electric blue, cyan, etc.)
 * - Deep, rich saturated outline delineation around the contours
 * - Soft diffuse ambient aura radiating into the dark background
 * - 100% original scale and proportions preserved
 */
export const OfficialSpellLineIcon: React.FC<OfficialSpellLineIconProps> = ({
  iconUrl,
  name = 'Hechizo',
  school,
  color,
  className = 'w-full h-full',
  onError,
}) => {
  const [hasError, setHasError] = useState(false);
  const theme = getSchoolTheme(school);
  const glow = (school && BG3_GLOW_STYLES[school]) || {
    core: color || theme.hexColor,
    mid: color || theme.hexColor,
    rim: color || theme.hexColor,
  };

  if (color) {
    glow.core = color;
    glow.mid = color;
    glow.rim = color;
  }

  if (hasError) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: glow.core }}>
          {school ? String(school).substring(0, 3) : 'D&D'}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center overflow-hidden select-none ${className}`}>
      {/* Hidden img to trigger onError waterfall if network fails */}
      <img
        src={iconUrl}
        alt={name}
        className="hidden"
        onError={() => {
          setHasError(true);
          onError?.();
        }}
      />

      {/* BG3 Subtle Ambient Backlight: gentle, soft aura behind the subject */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glow.mid}20 0%, ${glow.rim}08 45%, transparent 68%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* Layer 1: Soft Ambient Diffuse Glow (Halo exterior difuso) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage: `url("${iconUrl}")`,
          WebkitMaskImage: `url("${iconUrl}")`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          backgroundColor: glow.mid,
          filter: `drop-shadow(0 0 2.5px ${glow.mid}) drop-shadow(0 0 6px ${glow.rim}aa)`,
          opacity: 0.75,
          mixBlendMode: 'screen',
        }}
      />

      {/* Layer 2: Deep Saturated Outline & Contour Delineation (Delineado profundo marcado) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage: `url("${iconUrl}")`,
          WebkitMaskImage: `url("${iconUrl}")`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          backgroundColor: glow.rim,
          filter: `drop-shadow(0 0 1px ${glow.rim}) drop-shadow(0 0 1.8px ${glow.rim})`,
          opacity: 1,
        }}
      />

      {/* Layer 3: Vibrant Luminous Core Stroke (Trazo vivo en color, idéntico a las imágenes de referencia) */}
      <div
        className="relative z-10 w-full h-full pointer-events-none"
        style={{
          maskImage: `url("${iconUrl}")`,
          WebkitMaskImage: `url("${iconUrl}")`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          background: `linear-gradient(135deg, ${glow.core} 0%, ${glow.mid} 100%)`,
          filter: `drop-shadow(0 0 0.8px ${glow.core})`,
          opacity: 0.95,
        }}
      />
    </div>
  );
};
