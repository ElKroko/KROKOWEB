import React, { useState, ReactNode } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type ContentType = 'image' | 'audio' | 'text';

interface HighlightProps {
  word: string;
  contentType: ContentType;
  src?: string;
  alt?: string;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export default function Highlight({
  word,
  contentType,
  src,
  alt = '',
  children,
  className,
  contentClassName,
}: HighlightProps) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const handleAudioPlay = () => {
    setIsAudioPlaying(true);
  };

  const handleAudioPause = () => {
    setIsAudioPlaying(false);
  };
  
  // Actualizar el tooltip al hacer hover
  const handleMouseEnter = () => {
    const tooltipBar = document.getElementById('tooltip-bar');
    if (tooltipBar) {
      if (contentType === 'image' && alt) {
        tooltipBar.setAttribute('data-message', alt);
        tooltipBar.classList.add('show-message');
      } else if (contentType === 'audio' && src) {
        const audioName = src.split('/').pop()?.replace('.mp3', '') || 'Audio';
        tooltipBar.setAttribute('data-message', `♫ ${audioName} ♫`);
        tooltipBar.classList.add('show-message');
      }
    }
  };
  
  const handleMouseLeave = () => {
    const tooltipBar = document.getElementById('tooltip-bar');
    if (tooltipBar) {
      tooltipBar.classList.remove('show-message');
    }
  };

  return (
    <span 
      className={cn(
        "relative group inline-block cursor-pointer border-b border-current", 
        "transition-colors duration-300 hover:text-accent",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {word}
      <span className={cn(
        "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto",
        "absolute z-10 transition-all duration-300 ease-out",
        "bg-primary-dark/95 backdrop-blur-md p-3 rounded-lg border border-primary-mid/30",
        "shadow-lg transform -translate-y-2 group-hover:translate-y-0 block",
        contentType === 'image' ? "w-[300px] left-1/2 -translate-x-1/2 top-full mt-2" : "",
        contentType === 'audio' ? "w-[280px] left-1/2 -translate-x-1/2 top-full mt-2" : "",
        contentType === 'text' ? "w-[200px] left-1/2 -translate-x-1/2 top-full mt-2" : "",
        contentClassName
      )}>
        {contentType === 'image' && src && (
          <span className="relative aspect-video w-full overflow-hidden rounded block">
            <Image 
              src={src} 
              alt={alt}
              fill
              className="object-cover"
            />
          </span>
        )}

        {contentType === 'audio' && src && (
          <span className="flex flex-col items-center block">
            <audio 
              src={src} 
              controls 
              className="w-full" 
              onPlay={handleAudioPlay}
              onPause={handleAudioPause}
            />
            <span className="mt-2 text-xs text-center text-white/70 block">
              {isAudioPlaying ? 'Now playing' : 'Click to play'}
            </span>
          </span>
        )}

        {contentType === 'text' && children && (
          <span className="text-sm text-white block">{children}</span>
        )}
      </span>
    </span>
  );
}