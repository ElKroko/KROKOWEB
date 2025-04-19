import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Typography from './Typography';

interface SectionLayoutProps {
  title?: string;
  accentColor?: string;
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  id?: string;
}

export default function SectionLayout({
  title,
  accentColor,
  children,
  className,
  fullWidth = false,
  id,
}: SectionLayoutProps) {
  // Set the accent color as a CSS variable at the section level
  const sectionStyle = accentColor ? { '--accent-color': accentColor } as React.CSSProperties : {};
  
  return (
    <section 
      id={id}
      className={cn(
        "my-16 md:my-24", // Margin vertical amplio
        className
      )}
      style={sectionStyle}
    >
      {title && (
        <Typography variant="h2" className="mb-8 md:mb-12">
          {title}
        </Typography>
      )}
      
      <div className={cn(
        "relative",
        fullWidth 
          ? "w-full" 
          : "grid grid-cols-1 md:grid-cols-[1fr_minmax(auto,60ch)_1fr] gap-8"
      )}>
        {!fullWidth && <div className="hidden md:block" />}
        <div className={fullWidth ? "" : "md:col-span-1"}>
          {children}
        </div>
        {!fullWidth && <div className="hidden md:block" />}
      </div>
    </section>
  );
}