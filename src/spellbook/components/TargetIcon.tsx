import React from 'react';
import propioImg from '../assets/images/targets/propio.png';
import enemigoImg from '../assets/images/targets/enemigo.png';
import enemigosImg from '../assets/images/targets/enemigos.png';
import aliadosImg from '../assets/images/targets/aliados.png';
import objetoImg from '../assets/images/targets/objeto.png';
import { SpellTarget } from '../types';

export const TARGET_IMAGE_MAP: Record<SpellTarget, string> = {
  'propio': propioImg,
  'enemigo': enemigoImg,
  'enemigos': enemigosImg,
  'aliados': aliadosImg,
  'objeto': objetoImg,
};

export const TARGET_GLOW_MAP: Record<SpellTarget, string> = {
  'propio': 'rgba(56, 189, 248, 0.75)',
  'enemigo': 'rgba(248, 113, 113, 0.75)',
  'enemigos': 'rgba(251, 146, 60, 0.75)',
  'aliados': 'rgba(74, 222, 128, 0.75)',
  'objeto': 'rgba(192, 132, 252, 0.75)',
};

export interface TargetIconProps {
  target: SpellTarget | string;
  className?: string;
  alt?: string;
}

export const TargetIcon: React.FC<TargetIconProps> = ({
  target,
  className = 'w-5 h-5',
  alt,
}) => {
  const clean = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const t = clean(target);
  const matchedKey = (Object.keys(TARGET_IMAGE_MAP) as SpellTarget[]).find(
    (k) => clean(k) === t
  ) || 'propio';

  const src = TARGET_IMAGE_MAP[matchedKey] || propioImg;
  const glow = TARGET_GLOW_MAP[matchedKey] || 'rgba(56, 189, 248, 0.6)';

  return (
    <img
      src={src}
      alt={alt || target}
      referrerPolicy="no-referrer"
      style={{
        filter: `brightness(1.4) contrast(1.2) drop-shadow(0 0 5px ${glow})`,
      }}
      className={`inline-block object-contain rounded-full select-none pointer-events-none ${className}`}
    />
  );
};

export const SelfTargetIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <TargetIcon target="propio" className={className} />
);
export const EnemyTargetIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <TargetIcon target="enemigo" className={className} />
);
export const EnemiesTargetIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <TargetIcon target="enemigos" className={className} />
);
export const AlliesTargetIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <TargetIcon target="aliados" className={className} />
);
export const ObjectTargetIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <TargetIcon target="objeto" className={className} />
);
