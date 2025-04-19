import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface TypographicMenuItemProps {
  label: string;
  imageSrc?: string;
  audioSrc?: string;
  accentColor?: string;
  onClick?: () => void;
}

const TypographicMenuItem: React.FC<TypographicMenuItemProps> = ({
  label,
  imageSrc,
  audioSrc,
  accentColor = '#000000',
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    
    if (audioRef.current && audioSrc) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(e => console.log('Audio play prevented:', e));
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  
  useEffect(() => {
    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div 
      className="relative cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Text label */}
      <span 
        className={`text-4xl tracking-[0.1em] font-light transition-all duration-300 hover:tracking-[0.15em] relative z-10`}
        style={{ 
          color: isHovered ? accentColor : 'black',
          letterSpacing: isHovered ? 'var(--letter-spacing-wider)' : 'var(--letter-spacing-wide)'
        }}
      >
        {label}
      </span>
      
      {/* Audio element (hidden) */}
      {audioSrc && (
        <audio ref={audioRef} src={audioSrc} preload="auto" />
      )}
      
      {/* Image element (shown on hover) */}
      {isHovered && imageSrc && (
        <div className="absolute -top-32 left-40 opacity-40 transition-opacity z-0 w-[300px] h-[300px]">
          <Image
            src={imageSrc}
            alt={`${label} preview`}
            fill
            style={{ objectFit: 'contain' }}
            className="opacity-transition"
          />
        </div>
      )}
    </div>
  );
};

export default TypographicMenuItem;