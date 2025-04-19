import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type TypographyVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'p' 
  | 'small' 
  | 'lead'
  | 'caption';

type TypographyProps = {
  variant: TypographyVariant;
  children: ReactNode;
  className?: string;
  as?: React.ElementType;
  accent?: boolean;
  colorClass?: 'primary' | 'secondary' | 'accent' | 'muted';
};

export default function Typography({
  variant,
  children,
  className,
  as,
  accent = false,
  colorClass,
  ...props
}: TypographyProps & React.HTMLAttributes<HTMLElement>) {
  const Component = as || getElementForVariant(variant);
  
  return (
    <Component
      className={cn(
        getVariantClasses(variant),
        accent && 'text-accent-color',
        colorClass && `text-${colorClass}`,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

function getElementForVariant(variant: TypographyVariant): React.ElementType {
  switch (variant) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
      return variant;
    case 'lead':
      return 'div'; // Changed from 'p' to 'div' to avoid nesting issues
    case 'small':
      return 'span';
    case 'caption':
      return 'span';
    default:
      return 'p';
  }
}

function getVariantClasses(variant: TypographyVariant): string {
  switch (variant) {
    case 'h1':
      return 'font-bold tracking-tight text-[clamp(2.5rem,8vw,6rem)] leading-tight';
    case 'h2':
      return 'font-bold tracking-tight text-[clamp(2rem,6vw,4rem)] leading-tight';
    case 'h3':
      return 'font-semibold text-[clamp(1.5rem,4vw,2.5rem)] leading-snug';
    case 'h4':
      return 'font-semibold text-[clamp(1.2rem,3vw,1.75rem)] leading-snug';
    case 'p':
      return 'text-[clamp(1rem,2.5vw,1.25rem)] leading-relaxed tracking-[0.02em]';
    case 'lead':
      return 'text-[clamp(1.125rem,3vw,1.5rem)] leading-relaxed tracking-[0.02em]';
    case 'small':
      return 'text-sm leading-relaxed';
    case 'caption':
      return 'text-xs leading-relaxed text-gray-400';
    default:
      return '';
  }
}