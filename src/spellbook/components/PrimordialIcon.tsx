import React from 'react';
import naturalImg from '../assets/images/magia_natural.png';
import salvajeImg from '../assets/images/magia_salvaje.png';
import arcanaImg from '../assets/images/magia_arcana.png';
import divinaImg from '../assets/images/magia_divina.png';
import extraplanarImg from '../assets/images/magia_extraplanar.png';
import profanaImg from '../assets/images/magia_profana.png';
import { PrimordialMagic } from '../types';

export interface PrimordialIconProps {
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
}

export const PRIMORDIAL_GLOW_COLORS: Record<PrimordialMagic, { primary: string; secondary: string }> = {
  'Magia Natural': {
    primary: 'rgba(34, 197, 94, 0.95)',
    secondary: 'rgba(74, 222, 128, 0.75)',
  },
  'Magia Salvaje': {
    primary: 'rgba(6, 182, 212, 0.95)',
    secondary: 'rgba(34, 211, 238, 0.65)',
  },
  'Magia Arcana': {
    primary: 'rgba(59, 130, 246, 0.95)',
    secondary: 'rgba(96, 165, 250, 0.65)',
  },
  'Magia Divina': {
    primary: 'rgba(234, 179, 8, 0.95)',
    secondary: 'rgba(253, 224, 71, 0.65)',
  },
  'Magia Extraplanar': {
    primary: 'rgba(236, 72, 153, 0.95)',
    secondary: 'rgba(244, 114, 182, 0.65)',
  },
  'Magia Profana': {
    primary: 'rgba(168, 85, 247, 0.95)',
    secondary: 'rgba(192, 132, 252, 0.65)',
  },
  'Magia Áurea': {
    primary: 'rgba(250, 204, 21, 0.95)',
    secondary: 'rgba(234, 179, 8, 0.75)',
  },
};

export const NaturalMagicIcon: React.FC<PrimordialIconProps> = ({
  className = 'w-5 h-5',
  alt = 'Magia Natural',
  style,
}) => (
  <img
    src={naturalImg}
    alt={alt}
    referrerPolicy="no-referrer"
    style={{
      filter: 'brightness(1.55) contrast(1.25) drop-shadow(0 0 4px rgba(34,197,94,0.95)) drop-shadow(0 0 9px rgba(74,222,128,0.75))',
      ...style,
    }}
    className={`inline-block object-contain rounded-full select-none pointer-events-none ${className}`}
  />
);

export const WildMagicIcon: React.FC<PrimordialIconProps> = ({
  className = 'w-5 h-5',
  alt = 'Magia Salvaje',
  style,
}) => (
  <img
    src={salvajeImg}
    alt={alt}
    referrerPolicy="no-referrer"
    style={{
      filter: 'brightness(1.55) contrast(1.25) drop-shadow(0 0 4px rgba(6,182,212,0.95)) drop-shadow(0 0 9px rgba(34,211,238,0.65))',
      ...style,
    }}
    className={`inline-block object-contain rounded-full select-none pointer-events-none ${className}`}
  />
);

export const ArcaneMagicIcon: React.FC<PrimordialIconProps> = ({
  className = 'w-5 h-5',
  alt = 'Magia Arcana',
  style,
}) => (
  <img
    src={arcanaImg}
    alt={alt}
    referrerPolicy="no-referrer"
    style={{
      filter: 'brightness(1.55) contrast(1.25) drop-shadow(0 0 4px rgba(59,130,246,0.95)) drop-shadow(0 0 9px rgba(96,165,250,0.65))',
      ...style,
    }}
    className={`inline-block object-contain rounded-full select-none pointer-events-none ${className}`}
  />
);

export const DivineMagicIcon: React.FC<PrimordialIconProps> = ({
  className = 'w-5 h-5',
  alt = 'Magia Divina',
  style,
}) => (
  <img
    src={divinaImg}
    alt={alt}
    referrerPolicy="no-referrer"
    style={{
      filter: 'brightness(1.55) contrast(1.25) drop-shadow(0 0 4px rgba(234,179,8,0.95)) drop-shadow(0 0 9px rgba(253,224,71,0.65))',
      ...style,
    }}
    className={`inline-block object-contain rounded-full select-none pointer-events-none ${className}`}
  />
);

export const ExtraplanarMagicIcon: React.FC<PrimordialIconProps> = ({
  className = 'w-5 h-5',
  alt = 'Magia Extraplanar',
  style,
}) => (
  <img
    src={extraplanarImg}
    alt={alt}
    referrerPolicy="no-referrer"
    style={{
      filter: 'brightness(1.55) contrast(1.25) drop-shadow(0 0 4px rgba(236,72,153,0.95)) drop-shadow(0 0 9px rgba(244,114,182,0.65))',
      ...style,
    }}
    className={`inline-block object-contain rounded-full select-none pointer-events-none ${className}`}
  />
);

export const ProfaneMagicIcon: React.FC<PrimordialIconProps> = ({
  className = 'w-5 h-5',
  alt = 'Magia Profana',
  style,
}) => (
  <img
    src={profanaImg}
    alt={alt}
    referrerPolicy="no-referrer"
    style={{
      filter: 'brightness(1.55) contrast(1.25) drop-shadow(0 0 4px rgba(168,85,247,0.95)) drop-shadow(0 0 9px rgba(192,132,252,0.65))',
      ...style,
    }}
    className={`inline-block object-contain rounded-full select-none pointer-events-none ${className}`}
  />
);

export const AureaMagicIcon: React.FC<PrimordialIconProps> = ({
  className = 'w-5 h-5',
  alt = 'Magia Áurea',
  style,
}) => (
  <div
    title={alt}
    style={{
      filter: 'drop-shadow(0 0 4px rgba(250,204,21,0.95)) drop-shadow(0 0 9px rgba(234,179,8,0.75))',
      ...style,
    }}
    className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 p-0.5 select-none ${className}`}
  >
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-slate-950">
      <circle cx="12" cy="12" r="10" fill="#fef08a" opacity="0.95" />
      <path d="M12 2L13.2 4.8H10.8L12 2Z" fill="#b45309" />
      <path d="M19 5L17 7.2L16 6L19 5Z" fill="#b45309" />
      <path d="M5 5L8 6L7 7.2L5 5Z" fill="#b45309" />
      <path
        d="M12 18V11M12 11C10.5 9.5 9 10 7.5 11M12 11C13.5 9.5 15 10 16.5 11M12 14C10 13 8.5 13.5 7 15M12 14C14 13 15.5 13.5 17 15M10 20H14"
        stroke="#78350f"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="8" r="2.2" fill="#d97706" />
      <circle cx="12" cy="8" r="1.1" fill="#ffffff" />
    </svg>
  </div>
);

export const PRIMORDIAL_ICON_MAP = {
  'Magia Natural': NaturalMagicIcon,
  'Magia Salvaje': WildMagicIcon,
  'Magia Arcana': ArcaneMagicIcon,
  'Magia Divina': DivineMagicIcon,
  'Magia Extraplanar': ExtraplanarMagicIcon,
  'Magia Profana': ProfaneMagicIcon,
  'Magia Áurea': AureaMagicIcon,
} as const;

export const PRIMORDIAL_IMAGE_URLS = {
  'Magia Natural': naturalImg,
  'Magia Salvaje': salvajeImg,
  'Magia Arcana': arcanaImg,
  'Magia Divina': divinaImg,
  'Magia Extraplanar': extraplanarImg,
  'Magia Profana': profanaImg,
  'Magia Áurea': '',
} as const;
