import React, { useState, useEffect } from 'react';
import { generateAsciiArt } from '@/lib/ascii-utils';
import { useDualMode } from '@/providers/DualModeProvider';

interface AsciiHighlightProps {
  children: React.ReactNode;
  accentColor?: string;
  font?: string;
  className?: string;
}

const AsciiHighlight: React.FC<AsciiHighlightProps> = ({
  children,
  accentColor = 'var(--accent-strong)',
  font = 'Standard',
  className = '',
}) => {
  const [asciiArt, setAsciiArt] = useState<string>('');
  const [isHovering, setIsHovering] = useState(false);
  const { mode } = useDualMode();
  const contentText = typeof children === 'string' ? children : 
                     React.isValidElement(children) && typeof children.props.children === 'string' ? 
                     children.props.children : 'ART';

  // Generate ASCII art on component mount or when the font changes
  useEffect(() => {
    const generateArt = async () => {
      try {
        const art = await generateAsciiArt(
          contentText, 
          (font as any) || 'Standard'
        );
        setAsciiArt(art);
      } catch (error) {
        console.error('Failed to generate ASCII art:', error);
      }
    };

    generateArt();
  }, [contentText, font]);

  // Solo mostrar efectos ASCII en modo XKLOKON
  const showAsciiEffects = mode === 'xklokon';

  return (
    <span
      className={`relative inline-block ${className} color-transition`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {children}
      
      {showAsciiEffects && isHovering && (
        <pre
          className="absolute left-0 -bottom-[10rem] opacity-70 text-[10px] whitespace-pre text-accent-strong pointer-events-none z-10"
          style={{ fontFamily: 'monospace', maxWidth: '300px', overflow: 'hidden' }}
        >
          {asciiArt}
        </pre>
      )}
    </span>
  );
};

export default AsciiHighlight;