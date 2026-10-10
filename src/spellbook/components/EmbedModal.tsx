import React, { useState } from 'react';
import { X, Copy, Check, Code2, ExternalLink, Sparkles, Globe, Monitor, Smartphone, HelpCircle } from 'lucide-react';
import { PrimordialMagic } from '../types';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'es' | 'en';
}

export const EmbedModal: React.FC<EmbedModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'es' | 'en'>(language);
  const [height, setHeight] = useState<string>('800');
  const [embedMode, setEmbedMode] = useState<boolean>(true);
  const [selectedPrimordial, setSelectedPrimordial] = useState<string>('all');

  if (!isOpen) return null;

  // Base URL (current origin and pathname)
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  // Construct iframe source URL
  const queryParams = new URLSearchParams();
  if (embedMode) queryParams.set('embed', 'true');
  if (selectedLang !== 'es') queryParams.set('lang', selectedLang);
  if (selectedPrimordial !== 'all') queryParams.set('primordial', selectedPrimordial);

  const queryString = queryParams.toString();
  const embedUrl = `${origin}${pathname}${queryString ? `?${queryString}` : ''}`;

  const iframeSnippet = `<iframe
  src="${embedUrl}"
  width="100%"
  height="${height}"
  style="border: 1px solid #1a2832; border-radius: 14px; width: 100%; min-height: ${height}px; background: #090d10; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);"
  frameborder="0"
  allow="clipboard-write"
  loading="lazy"
  title="Dracopedia D&D 5e - Compendio de Conjuros">
</iframe>`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(iframeSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(embedUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#10171d] border border-[#1a2832] shadow-2xl p-5 sm:p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#17232b] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#14282c] border border-[#bafafd]/40 flex items-center justify-center text-[#bafafd]">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-base sm:text-lg font-bold tracking-wide text-slate-100 flex items-center gap-2">
                <span>{language === 'es' ? 'INCRUSTAR EN TU WEB' : 'EMBED IN YOUR WEBSITE'}</span>
              </h2>
              <p className="text-xs text-[#8a9ba8]">
                {language === 'es'
                  ? 'Inserta el compendio oficial de Dracopedia en Notion, WordPress, Wix o tu propia web'
                  : 'Embed the official Dracopedia compendium into Notion, WordPress, Wix or any web page'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#15222b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Embed Mode */}
          <div className="p-3 rounded-xl bg-[#0c1217] border border-[#17232b] space-y-1.5">
            <span className="text-[#8a9ba8] font-medium block">
              {language === 'es' ? 'Modo de visualización:' : 'Display Mode:'}
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setEmbedMode(true)}
                className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all ${
                  embedMode
                    ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/40'
                    : 'bg-[#10171d] text-slate-400 hover:text-slate-200 border border-[#1b2832]'
                }`}
              >
                {language === 'es' ? 'Incrustado' : 'Embedded'}
              </button>
              <button
                type="button"
                onClick={() => setEmbedMode(false)}
                className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all ${
                  !embedMode
                    ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/40'
                    : 'bg-[#10171d] text-slate-400 hover:text-slate-200 border border-[#1b2832]'
                }`}
              >
                {language === 'es' ? 'Completo' : 'Full'}
              </button>
            </div>
          </div>

          {/* Language */}
          <div className="p-3 rounded-xl bg-[#0c1217] border border-[#17232b] space-y-1.5">
            <span className="text-[#8a9ba8] font-medium block">
              {language === 'es' ? 'Idioma inicial:' : 'Default Language:'}
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedLang('es')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all ${
                  selectedLang === 'es'
                    ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/40'
                    : 'bg-[#10171d] text-slate-400 hover:text-slate-200 border border-[#1b2832]'
                }`}
              >
                Español
              </button>
              <button
                type="button"
                onClick={() => setSelectedLang('en')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all ${
                  selectedLang === 'en'
                    ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/40'
                    : 'bg-[#10171d] text-slate-400 hover:text-slate-200 border border-[#1b2832]'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Height */}
          <div className="p-3 rounded-xl bg-[#0c1217] border border-[#17232b] space-y-1.5">
            <span className="text-[#8a9ba8] font-medium block">
              {language === 'es' ? 'Altura recomendada:' : 'Recommended Height:'}
            </span>
            <div className="flex gap-1.5">
              {['650', '800', '1000'].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHeight(h)}
                  className={`flex-1 py-1.5 px-1.5 rounded-lg font-medium transition-all ${
                    height === h
                      ? 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/40'
                      : 'bg-[#10171d] text-slate-400 hover:text-slate-200 border border-[#1b2832]'
                  }`}
                >
                  {h}px
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* HTML Iframe Code Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-200 font-medium flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-[#bafafd]" />
              <span>{language === 'es' ? 'Código HTML (Iframe)' : 'HTML Iframe Code'}</span>
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                copiedCode
                  ? 'bg-[#bafafd] text-slate-950 font-bold'
                  : 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/40 hover:bg-[#1a3840]'
              }`}
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? '¡Copiado!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Copiar Código' : 'Copy Code'}</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-3.5 rounded-xl bg-[#0a0e12] border border-[#17232b] text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed select-all">
            {iframeSnippet}
          </pre>
        </div>

        {/* Direct Embed URL */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-200 font-medium flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#bafafd]" />
              <span>{language === 'es' ? 'Enlace Directo (Para Notion o Webview)' : 'Direct Link (For Notion or Webview)'}</span>
            </span>
            <button
              type="button"
              onClick={handleCopyUrl}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                copiedUrl
                  ? 'bg-[#bafafd] text-slate-950 font-bold'
                  : 'bg-[#14282e] text-[#bafafd] border border-[#bafafd]/40 hover:bg-[#1a3840]'
              }`}
            >
              {copiedUrl ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? '¡Copiado!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Copiar Enlace' : 'Copy Link'}</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0a0e12] border border-[#17232b] text-xs">
            <input
              type="text"
              readOnly
              value={embedUrl}
              className="flex-1 bg-transparent text-slate-300 font-mono text-xs focus:outline-none select-all"
            />
            <a
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-400 hover:text-[#bafafd] hover:bg-[#14282c] rounded-lg transition-colors"
              title={language === 'es' ? 'Abrir vista previa' : 'Open preview'}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Integration Instructions */}
        <div className="p-3.5 rounded-xl bg-[#0a0e12] border border-[#17232b] space-y-2 text-xs text-[#8a9ba8]">
          <span className="font-semibold text-slate-200 block">
            {language === 'es' ? '¿Cómo incrustarlo en tu plataforma?' : 'How to embed in your platform?'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-[#0e151b] border border-[#162128]">
              <strong className="text-[#bafafd] block mb-0.5">Notion:</strong>
              {language === 'es'
                ? 'Escribe /embed, pega el Enlace Directo y ajusta el tamaño.'
                : 'Type /embed, paste the Direct Link and adjust block size.'}
            </div>
            <div className="p-2 rounded-lg bg-[#0e151b] border border-[#162128]">
              <strong className="text-[#bafafd] block mb-0.5">WordPress:</strong>
              {language === 'es'
                ? 'Añade un bloque de "HTML Personalizado" y pega el Código Iframe.'
                : 'Add a "Custom HTML" block and paste the Iframe Code.'}
            </div>
            <div className="p-2 rounded-lg bg-[#0e151b] border border-[#162128]">
              <strong className="text-[#bafafd] block mb-0.5">Wix / Webflow:</strong>
              {language === 'es'
                ? 'Añade un elemento de incrustación de código HTML / Iframe.'
                : 'Add an Embed Code / HTML iframe widget to your page.'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-[#17232b]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#14282e] text-[#bafafd] border border-[#bafafd]/40 hover:bg-[#1a3840] transition-colors cursor-pointer"
          >
            {language === 'es' ? 'Listo' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
