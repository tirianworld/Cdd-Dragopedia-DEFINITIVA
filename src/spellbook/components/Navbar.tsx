import React from 'react';
import { Menu, Flame, ScrollText, Globe } from 'lucide-react';
import { Character, ViewTab } from '../types';

interface NavbarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  characters?: Character[];
  activeCharacter?: Character | null;
  onSelectCharacter?: (charId: string) => void;
  version?: '2014' | '2024';
  onChangeVersion?: (ver: '2014' | '2024') => void;
  language: 'es' | 'en';
  onChangeLanguage: (lang: 'es' | 'en') => void;
  onQuickLongRest?: () => void;
  totalSpellsCount: number;
  onOpenMobileSidebar: () => void;
  onOpenEmbedModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  language,
  onChangeLanguage,
  onOpenMobileSidebar,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0c1013]/95 backdrop-blur-md border-b border-[#172127]">
      <div className="w-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Mobile Toggle & Dragopedia Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl bg-[#10171d] border border-[#1a2832] text-slate-300 hover:text-white cursor-pointer"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5 text-[#bafafd]" />
          </button>

          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => onSelectTab('catalog')}
          >
            {/* Dragopedia Flame Icon */}
            <div className="w-8 h-8 rounded-lg bg-[#14282c] border border-[#bafafd]/40 flex items-center justify-center text-[#bafafd] shadow-xs group-hover:border-[#bafafd] transition-colors">
              <Flame className="w-4 h-4 fill-[#bafafd]/20 text-[#bafafd]" />
            </div>
            <div>
              <div className="font-heading text-sm sm:text-base font-bold tracking-widest text-slate-100 flex items-center gap-2">
                <span>DRACOPEDIA</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#14282c] text-[#bafafd] border border-[#bafafd]/30 font-mono font-normal hidden sm:inline">
                  CALDO DE DRAGÓN
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center / Right: Spell Lists, Public Gallery, and Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Button: Listas de Hechizos (visible to everyone) */}
          <button
            type="button"
            onClick={() => onSelectTab('spell-lists')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
              currentTab === 'spell-lists'
                ? 'bg-[#14282c] text-[#bafafd] border border-[#bafafd]'
                : 'bg-[#10171d] hover:bg-[#14282c] text-slate-200 hover:text-[#bafafd] border border-[#1d2d38]'
            }`}
            title={language === 'es' ? 'Listas de Hechizos' : 'Spell Lists'}
          >
            <ScrollText className="w-3.5 h-3.5 text-[#bafafd]" />
            <span>{language === 'es' ? 'Listas de Hechizos' : 'Spell Lists'}</span>
          </button>

          {/* Button: Galería Pública (visible to everyone) */}
          <button
            type="button"
            onClick={() => onSelectTab('public-gallery')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
              currentTab === 'public-gallery'
                ? 'bg-[#14282c] text-[#bafafd] border border-[#bafafd]'
                : 'bg-[#10171d] hover:bg-[#14282c] text-slate-200 hover:text-[#bafafd] border border-[#1d2d38]'
            }`}
            title={language === 'es' ? 'Galería Pública' : 'Public Gallery'}
          >
            <Globe className="w-3.5 h-3.5 text-[#bafafd]" />
            <span>{language === 'es' ? 'Galería Pública' : 'Public Gallery'}</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-[#0e1419] p-1 rounded-xl border border-[#1b2832] text-xs">
            <button
              type="button"
              onClick={() => onChangeLanguage('es')}
              className={`px-2 py-1 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                language === 'es'
                  ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/40 shadow-xs'
                  : 'text-[#8a9ba8] hover:text-slate-200'
              }`}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => onChangeLanguage('en')}
              className={`px-2 py-1 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/40 shadow-xs'
                  : 'text-[#8a9ba8] hover:text-slate-200'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
