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
};

export const NaturalMagicIcon: React.FC<PrimordialIconProps> = ({
  className = 'w-5 h-5',
  alt = 'Magia Natural',
}) => (
  <img
    src={naturalImg}
    alt={alt}
    referrerPolicy="no-referrer"
    style={{
      filter: 'brightness(1.55) contrast(1.25) drop-shadow(0 0 4px rgba(34,197,94,0.95)) drop-shadow(0 0 9px rgba(74,222,128,0.75))',
    }}
    className={`inline-block object-contain rounded-full select-none pointer-events-none ${className}`}
  />
);

export const WildMagicIcon: React.FC<PrimordialIconProps> = ({
  className = 'w-5 h-5',
  alt = 'Magia Salvaje',
}) => (
  <img
    src={salvajeImg}
    alt={alt}
    referrerPolicy="no-referrer"
    style={{
      filter: 'brightness(1.55) contrast(1.25) drop-shadow(0 0 4px rgba(6,182,212,0.95)) drop-shadow(0 0 9px rgba(34,211,238,0.65))',
    }}
    className={`inline-block object-contain rounded-full select-none pointer-events-none ${className}`}
  />
);

export const ArcaneMagicIcon: React.FC<PrimordialIconProps> = ({
  className = 'w-5 h-5',
  alt = 'Magia Arcana',
}) => (
  <img
    src={arcanaImg}
    alt={alt}
    referrerPolicy="no-referrer"
    style={{
      filter: 'brightness(1.55) contrast(1.25) drop-shadow(0 0 4px rgba(59,130,246,0.95)) drop-shadow(0 0 9px rgba(96,165,250,0.65))',
    }}
    className={`inline-block object-contain rounded-full select-none pointer-events-none ${className}`}
  />
);

export const DivineMagicIcon: React.FC<PrimordialIconProps> = ({
  className = 'w-5 h-5',
  alt = 'Magia Divina',
}) => (
  <img
    src={divinaImg}
    alt={alt}
    referrerPolicy="no-referrer"
    style={{
      filter: 'brightness(1.55) contrast(1.25) drop-shadow(0 0 4px rgba(234,179,8,0.95)) drop-shadow(0 0 9px rgba(253,224,71,0.65))',
    }}
    className={`inline-block object-contain rounded-full select-none pointer-events-none ${className}`}
  />
);

export const ExtraplanarMagicIcon: React.FC<PrimordialIconProps> = ({
  className = 'w-5 h-5',
  alt = 'Magia Extraplanar',
}) => (
  <img
    src={extraplanarImg}
    alt={alt}
    referrerPolicy="no-referrer"
    style={{
      filter: 'brightness(1.55) contrast(1.25) drop-shadow(0 0 4px rgba(236,72,153,0.95)) drop-shadow(0 0 9px rgba(244,114,182,0.65))',
    }}
    className={`inline-block object-contain rounded-full select-none pointer-events-none ${className}`}
  />
);

export const ProfaneMagicIcon: React.FC<PrimordialIconProps> = ({
  className = 'w-5 h-5',
  alt = 'Magia Profana',
}) => (
  <img
    src={profanaImg}
    alt={alt}
    referrerPolicy="no-referrer"
    style={{
      filter: 'brightness(1.55) contrast(1.25) drop-shadow(0 0 4px rgba(168,85,247,0.95)) drop-shadow(0 0 9px rgba(192,132,252,0.65))',
    }}
    className={`inline-block object-contain rounded-full select-none pointer-events-none ${className}`}
  />
);

export const PRIMORDIAL_ICON_MAP = {
  'Magia Natural': NaturalMagicIcon,
  'Magia Salvaje': WildMagicIcon,
  'Magia Arcana': ArcaneMagicIcon,
  'Magia Divina': DivineMagicIcon,
  'Magia Extraplanar': ExtraplanarMagicIcon,
  'Magia Profana': ProfaneMagicIcon,
} as const;

export const PRIMORDIAL_IMAGE_URLS = {
  'Magia Natural': naturalImg,
  'Magia Salvaje': salvajeImg,
  'Magia Arcana': arcanaImg,
  'Magia Divina': divinaImg,
  'Magia Extraplanar': extraplanarImg,
  'Magia Profana': profanaImg,
} as const;
