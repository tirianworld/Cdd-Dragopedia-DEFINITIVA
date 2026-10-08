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

// Authentic Baldur's Gate 3 neon palette for each spell school
const BG3_SCHOOL_COLORS: Record<string, { neon: string; light: string }> = {
  'Abjuración': { neon: '#00e5ff', light: '#e0f7fa' }, // Electric Cyan (Animal Friendship / Escudos)
  'Adivinación': { neon: '#ffc400', light: '#fff8e1' }, // Oro radiante (Guía / Vista Verdadera)
  'Conjuración': { neon: '#00ff88', light: '#e8f5e9' }, // Verde menta vivo (Enredar / Niebla)
  'Encantamiento': { neon: '#ff2a85', light: '#fce4ec' }, // Magenta místico (Hechizar / Sueño)
  'Evocación': { neon: '#ff5500', light: '#fff3e0' }, // Naranja fuego radiante (Descarga / Rayo)
  'Ilusión': { neon: '#b026ff', light: '#f3e5f5' }, // Violeta etéreo (Perdición / Disfraz)
  'Nigromancia': { neon: '#d946ef', light: '#fdf4ff' }, // Fucsia necrótico (Toque Helado / Ceguera)
  'Transmutación': { neon: '#10e78c', light: '#e6fffa' }, // Jade alquímico (Salto / Zancada)
  'Reflexión': { neon: '#67e8f9', light: '#f0fdfa' }, // Diamante Dragón (Aura de Astraea)
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
 * Renders official D&D spellbook and created spell icons with the refined, calibrated
 * Baldur's Gate 3 aesthetic:
 * - Crisp, fine white centerline core
 * - Tight, saturated colored rim hugging the edges (not blurry or blown out)
 * - Gentle ambient falloff mimicking the authentic BG3 in-game spell icons
 * - Subtle floating arcane spark motes
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
  const palette = (school && BG3_SCHOOL_COLORS[school]) || {
    neon: color || theme.hexColor,
    light: '#ffffff',
  };

  const neonColor = color || palette.neon;

  if (hasError) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: neonColor }}>
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

      {/* BG3 Subtle Ambient Backlight: gentle, soft aura behind the subject (calibrated, not blinding) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 45%, ${neonColor}18 0%, ${neonColor}06 42%, transparent 65%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* BG3 Floating Arcane Motes / Mana Dust: delicate, subtle glowing specks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-[20%] left-[16%] w-1 h-1 rounded-full bg-white"
          style={{ boxShadow: `0 0 2px #ffffff, 0 0 4px ${neonColor}`, opacity: 0.55 }}
        />
        <div
          className="absolute top-[34%] right-[15%] w-0.8 h-0.8 rounded-full bg-white"
          style={{ boxShadow: `0 0 2px #ffffff, 0 0 3px ${neonColor}`, opacity: 0.45 }}
        />
        <div
          className="absolute bottom-[22%] left-[24%] w-0.8 h-0.8 rounded-full bg-white"
          style={{ boxShadow: `0 0 1.5px #ffffff, 0 0 3px ${neonColor}`, opacity: 0.4 }}
        />
        <div
          className="absolute bottom-[26%] right-[20%] w-1 h-1 rounded-full bg-white"
          style={{ boxShadow: `0 0 2px #ffffff, 0 0 4px ${neonColor}`, opacity: 0.5 }}
        />
      </div>

      {/* Layer 1: Refined Soft Colored Aura (Tight, subtle falloff matching BG3) */}
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
          backgroundColor: neonColor,
          filter: `drop-shadow(0 0 2.5px ${neonColor}) drop-shadow(0 0 5px ${neonColor}88)`,
          opacity: 0.75,
          mixBlendMode: 'screen',
        }}
      />

      {/* Layer 2: Crisp White Core with Tight Colored Rim (Exact look of BG3 icons) */}
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
          backgroundColor: '#ffffff',
          filter: `drop-shadow(0 0 1.2px ${neonColor})`,
          opacity: 0.92,
        }}
      />
    </div>
  );
};
