import React from 'react';
import arthoriusTrimmedUrl from '../assets/images/arthorius_silhouette_trimmed.png';

interface ArthoriusSilhouetteProps {
  className?: string;
  size?: number | string;
  opacity?: number;
  color?: string;
}

export const ArthoriusSilhouette: React.FC<ArthoriusSilhouetteProps> = ({
  className = '',
  size = 84,
  opacity = 0.95,
  color = '#1e2a30',
}) => {
  return (
    <div
      className={`inline-block relative select-none pointer-events-auto ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        aspectRatio: '950 / 659',
        backgroundColor: color,
        maskImage: `url(${arthoriusTrimmedUrl})`,
        WebkitMaskImage: `url(${arthoriusTrimmedUrl})`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        opacity,
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.95)) drop-shadow(0 0 1px rgba(186,250,253,0.2))',
      }}
    />
  );
};
