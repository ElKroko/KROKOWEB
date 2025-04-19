import React, { useState } from 'react';

interface TypographicSocialItemProps {
  letter: string;
  index: number;
  accentColor?: string;
  onClick?: () => void;
}

const TypographicSocialItem: React.FC<TypographicSocialItemProps> = ({
  letter,
  index,
  accentColor = '#000000',
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Stagger animation delay based on index
  const animationDelay = `${index * 50}ms`;
  
  return (
    <span 
      className="text-4xl tracking-[0.1em] font-light transition-all duration-300 cursor-pointer block"
      style={{ 
        color: isHovered ? accentColor : 'black',
        letterSpacing: isHovered ? 'var(--letter-spacing-wider)' : 'var(--letter-spacing-wide)',
        transitionDelay: isHovered ? animationDelay : '0ms'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {letter}
    </span>
  );
};

export default TypographicSocialItem;