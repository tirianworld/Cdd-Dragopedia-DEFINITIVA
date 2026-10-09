import React from 'react';

interface MarkdownTextProps {
  content: string | null | undefined;
  className?: string;
  paragraphClassName?: string;
}

interface InlineToken {
  type: 'text' | 'bold-italic' | 'bold' | 'italic' | 'code';
  content: string;
}

/**
 * Tokenizes an inline line of text into bold, italic, bold-italic, code, and text tokens.
 */
function tokenizeInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  // Matches:
  // 1. **_bold italic_** or ***bold italic***
  // 2. **bold** or __bold__
  // 3. *italic* or _italic_
  // 4. `code`
  const regex = /(\*\*_[^_]+_\*\*|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|__[^_]+__|(?<!\w)_[^_]+_(?!\w)|(?<!\*)\*[^*]+\*(?!\*)|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    const raw = match[0];
    if (raw.startsWith('**_') && raw.endsWith('_**')) {
      tokens.push({ type: 'bold-italic', content: raw.slice(3, -3) });
    } else if (raw.startsWith('***') && raw.endsWith('***')) {
      tokens.push({ type: 'bold-italic', content: raw.slice(3, -3) });
    } else if (raw.startsWith('**') && raw.endsWith('**')) {
      tokens.push({ type: 'bold', content: raw.slice(2, -2) });
    } else if (raw.startsWith('__') && raw.endsWith('__')) {
      tokens.push({ type: 'bold', content: raw.slice(2, -2) });
    } else if (raw.startsWith('*') && raw.endsWith('*')) {
      tokens.push({ type: 'italic', content: raw.slice(1, -1) });
    } else if (raw.startsWith('_') && raw.endsWith('_')) {
      tokens.push({ type: 'italic', content: raw.slice(1, -1) });
    } else if (raw.startsWith('`') && raw.endsWith('`')) {
      tokens.push({ type: 'code', content: raw.slice(1, -1) });
    } else {
      tokens.push({ type: 'text', content: raw });
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return tokens;
}

/**
 * Renders an inline text token with appropriate styling.
 */
function renderInlineTokens(tokens: InlineToken[], keyPrefix: string): React.ReactNode {
  return tokens.map((token, index) => {
    const key = `${keyPrefix}-${index}`;
    switch (token.type) {
      case 'bold-italic':
        return (
          <strong key={key} className="font-bold italic text-[#bafafd]">
            {token.content}
          </strong>
        );
      case 'bold':
        return (
          <strong key={key} className="font-bold text-slate-100">
            {token.content}
          </strong>
        );
      case 'italic':
        return (
          <em key={key} className="italic text-slate-300">
            {token.content}
          </em>
        );
      case 'code':
        return (
          <code
            key={key}
            className="px-1.5 py-0.5 rounded bg-[#16252e] text-[#bafafd] font-mono text-xs border border-[#213744]"
          >
            {token.content}
          </code>
        );
      default:
        return <span key={key}>{token.content}</span>;
    }
  });
}

/**
 * Strips all markdown symbols from a string for plain excerpts and summaries.
 */
export function stripMarkdown(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .replace(/\*\*_\s*([^_]+)\s*_\*\*/g, '$1')
    .replace(/\*\*\*\s*([^*]+)\s*\*\*\*/g, '$1')
    .replace(/\*\*\s*([^*]+)\s*\*\*/g, '$1')
    .replace(/__\s*([^_]+)\s*__/g, '$1')
    .replace(/(?<!\w)_\s*([^_]+)\s*_(?!\w)/g, '$1')
    .replace(/(?<!\*)\*\s*([^*]+)\s*\*(?!\*)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#+\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Main Formatted Markdown Component
 * Renders paragraphs, headings, bullet lists, blockquotes, and rich inline text.
 */
export const MarkdownText: React.FC<MarkdownTextProps> = ({
  content,
  className = '',
  paragraphClassName = '',
}) => {
  if (!content) return null;

  // Split into block sections separated by double newlines or more
  const blocks = content.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);

  return (
    <div className={`space-y-3 ${className}`}>
      {blocks.map((block, blockIndex) => {
        const key = `block-${blockIndex}`;

        // 1. Headings: ### Header or ## Header or # Header
        if (block.startsWith('#')) {
          const match = block.match(/^(#{1,6})\s+(.*)$/);
          if (match) {
            const level = match[1].length;
            const headingText = match[2];
            const tokens = tokenizeInline(headingText);
            if (level <= 2) {
              return (
                <h3 key={key} className="font-heading text-lg font-bold text-slate-100 tracking-wide mt-3 mb-1">
                  {renderInlineTokens(tokens, key)}
                </h3>
              );
            }
            return (
              <h4 key={key} className="font-heading text-sm font-bold uppercase tracking-wider text-[#bafafd] mt-2.5 mb-1">
                {renderInlineTokens(tokens, key)}
              </h4>
            );
          }
        }

        // 2. Blockquote: lines starting with >
        if (block.startsWith('>')) {
          const quoteLines = block
            .split('\n')
            .map((line) => line.replace(/^>\s?/, ''))
            .join(' ');
          const tokens = tokenizeInline(quoteLines);
          return (
            <blockquote
              key={key}
              className="border-l-2 border-[#bafafd]/70 pl-3.5 py-1.5 my-2 italic text-slate-300 bg-[#12222b]/50 rounded-r-lg"
            >
              {renderInlineTokens(tokens, key)}
            </blockquote>
          );
        }

        // 3. Bullet list: lines starting with - or * (and not bold like **text**)
        const lines = block.split('\n');
        const isBulletList = lines.length > 0 && lines.every((line) => /^[-*]\s+/.test(line.trim()));
        if (isBulletList) {
          return (
            <ul key={key} className="space-y-1.5 my-2 pl-1">
              {lines.map((line, lineIndex) => {
                const itemText = line.trim().replace(/^[-*]\s+/, '');
                const tokens = tokenizeInline(itemText);
                return (
                  <li key={`${key}-item-${lineIndex}`} className="flex items-start gap-2 text-sm text-slate-200">
                    <span className="text-[#bafafd] select-none text-xs mt-1">✦</span>
                    <span className="flex-1 leading-relaxed">
                      {renderInlineTokens(tokens, `${key}-item-${lineIndex}`)}
                    </span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // 4. Numbered list: lines starting with 1. , 2. , etc.
        const isNumberedList = lines.length > 0 && lines.every((line) => /^\d+\.\s+/.test(line.trim()));
        if (isNumberedList) {
          return (
            <ol key={key} className="space-y-1.5 my-2 pl-1">
              {lines.map((line, lineIndex) => {
                const match = line.trim().match(/^(\d+)\.\s+(.*)$/);
                const num = match ? match[1] : `${lineIndex + 1}`;
                const itemText = match ? match[2] : line.trim();
                const tokens = tokenizeInline(itemText);
                return (
                  <li key={`${key}-num-${lineIndex}`} className="flex items-start gap-2 text-sm text-slate-200">
                    <span className="text-[#bafafd] font-mono font-bold text-xs mt-0.5 min-w-4 text-right">
                      {num}.
                    </span>
                    <span className="flex-1 leading-relaxed">
                      {renderInlineTokens(tokens, `${key}-num-${lineIndex}`)}
                    </span>
                  </li>
                );
              })}
            </ol>
          );
        }

        // 5. Special Callout Paragraph: e.g. "**_A niveles superiores._**" or "**A niveles superiores:**"
        const isHigherLevelsCallout =
          block.startsWith('**_A niveles superiores') ||
          block.startsWith('***A niveles superiores') ||
          block.startsWith('**A niveles superiores');

        if (isHigherLevelsCallout) {
          const tokens = tokenizeInline(block);
          return (
            <div
              key={key}
              className="p-3 my-2 rounded-xl bg-[#12222a] border border-[#bafafd]/30 text-sm leading-relaxed text-slate-200"
            >
              {renderInlineTokens(tokens, key)}
            </div>
          );
        }

        // 6. Regular paragraph with internal line breaks preserved
        return (
          <p
            key={key}
            className={`leading-relaxed text-slate-200 text-sm sm:text-base font-serif-body ${paragraphClassName}`}
          >
            {lines.map((line, lineIndex) => {
              const tokens = tokenizeInline(line);
              return (
                <React.Fragment key={`${key}-line-${lineIndex}`}>
                  {renderInlineTokens(tokens, `${key}-line-${lineIndex}`)}
                  {lineIndex < lines.length - 1 && <br />}
                </React.Fragment>
              );
            })}
          </p>
        );
      })}
    </div>
  );
};
