import React, { useState, useEffect, useMemo } from 'react';
import { getOfficialSpellIconUrl, sanitizeBg3Url } from '../data/bg3IconHelper';
import { MagicSchool } from '../types';
import { getSchoolTheme } from '../data/schools';
import { getCachedImageUrl, resolveSpellImageUrl } from '../services/imageService';
import { isOfficialDndLineIcon, OfficialSpellLineIcon } from './OfficialSpellLineIcon';

interface SpellIconProps {
  spell: {
    id?: string;
    name?: string;
    nameEn?: string;
    level?: number;
    school?: MagicSchool | string;
    damageType?: string;
    color?: string;
    bg3IconUrl?: string | null;
    iconUrl?: string | null;
    icon?: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  customClass?: string;
  showSchoolBorder?: boolean;
  className?: string;
}

export const SpellIcon: React.FC<SpellIconProps> = ({
  spell,
  size = 'md',
  customClass = '',
  showSchoolBorder = true,
  className = '',
}) => {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [resolvedBlobUrl, setResolvedBlobUrl] = useState<string | null>(null);

  const schoolTheme = getSchoolTheme(spell.school);
  const schoolColor = spell.color || schoolTheme.hexColor;

  // Build candidate URL waterfall
  const candidates = useMemo(() => {
    const list: string[] = [];

    // 1. Check custom local storage cache (uploaded or edited image)
    const customCached = getCachedImageUrl(spell.bg3IconUrl || spell.iconUrl, spell.id);
    if (customCached) {
      list.push(customCached);
    }

    // 2. Official Baldur's Gate 3 static icon
    const officialBg3 = getOfficialSpellIconUrl(spell);
    if (officialBg3 && !list.includes(officialBg3)) {
      list.push(officialBg3);
    }

    // 3. Fallback to spellbookdnd icon if available and different
    if (spell.iconUrl) {
      const dndUrl = spell.iconUrl.startsWith('http') || spell.iconUrl.startsWith('data:')
        ? spell.iconUrl
        : `https://www.spellbookdnd.com${spell.iconUrl}`;
      const sanitizedDnd = sanitizeBg3Url(dndUrl) || dndUrl;
      if (!list.includes(sanitizedDnd)) {
        list.push(sanitizedDnd);
      }
    }

    return list;
  }, [spell.id, spell.bg3IconUrl, spell.iconUrl, spell.name, spell.school, spell.damageType]);

  // Reset candidate index ONLY when the spell or its key image props change
  useEffect(() => {
    setCandidateIndex(0);
    setResolvedBlobUrl(null);
  }, [spell.id, spell.bg3IconUrl, spell.iconUrl]);

  const currentCandidate = candidateIndex < candidates.length ? candidates[candidateIndex] : null;

  // Resolve GitHub authenticated URLs asynchronously if encountered
  useEffect(() => {
    let isMounted = true;
    if (!currentCandidate || !currentCandidate.includes('github')) {
      return;
    }

    resolveSpellImageUrl(currentCandidate, spell.id).then((url) => {
      if (isMounted) {
        setResolvedBlobUrl(url);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [currentCandidate, spell.id]);

  const activeSrc = (currentCandidate && currentCandidate.includes('github') && resolvedBlobUrl)
    ? resolvedBlobUrl
    : currentCandidate;

  const handleImageError = () => {
    // Advance to next candidate in the waterfall. Never cycles backwards.
    setCandidateIndex((prev) => prev + 1);
  };

  const sizeClasses = {
    sm: 'h-10 w-10 min-w-10 min-h-10 text-xs',
    md: 'h-20 w-20 min-w-20 min-h-20 sm:h-24 sm:w-24 sm:min-w-24 sm:min-h-24',
    lg: 'h-28 w-28 min-w-28 min-h-28 sm:h-32 sm:w-32 sm:min-w-32 sm:min-h-32',
    xl: 'h-36 w-36 min-w-36 min-h-36 sm:h-40 sm:w-40 sm:min-w-40 sm:min-h-40',
    custom: customClass,
  }[size];

  const SchoolIconComponent = schoolTheme.icon;

  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-105 ${sizeClasses} ${className}`}
      style={{
        boxShadow: showSchoolBorder
          ? `0 0 16px -4px ${schoolColor}55, 0 2px 8px rgba(0,0,0,0.5)`
          : undefined,
        borderColor: schoolColor,
      }}
    >
      {/* Background radial glow matching school */}
      <div
        className="absolute inset-0 opacity-25 group-hover:opacity-45 transition-opacity"
        style={{
          background: `radial-gradient(circle at center, ${schoolColor}88 0%, rgba(12,20,28,0.85) 75%)`,
        }}
      />

      {/* Frame border */}
      <div
        className="absolute inset-0 rounded-2xl border pointer-events-none transition-colors"
        style={{
          borderColor: `${schoolColor}88`,
        }}
      />

      {activeSrc ? (
        isOfficialDndLineIcon(activeSrc, spell) ? (
          <OfficialSpellLineIcon
            iconUrl={activeSrc}
            name={spell.name || 'Hechizo'}
            school={spell.school ? String(spell.school) : undefined}
            color={spell.color}
            className="relative z-10 w-full h-full transition-transform duration-300 group-hover:scale-110"
            onError={handleImageError}
          />
        ) : (
          <img
            src={activeSrc}
            alt={spell.name || 'Hechizo'}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={handleImageError}
            className="relative z-10 w-full h-full object-contain filter drop-shadow-md select-none transition-transform duration-300 group-hover:scale-110"
          />
        )
      ) : (
        /* Fallback: School Icon with specific vivid school color */
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-2">
          <SchoolIconComponent
            className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-110"
            style={{ color: schoolColor }}
          />
          <span
            className="text-[9px] uppercase font-bold tracking-widest mt-1 opacity-90 font-heading"
            style={{ color: schoolColor }}
          >
            {spell.school ? String(spell.school).substring(0, 4) : 'MAGIA'}
          </span>
        </div>
      )}
    </div>
  );
};
