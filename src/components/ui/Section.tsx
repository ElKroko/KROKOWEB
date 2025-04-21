"use client";

import React from 'react';

type SectionProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  id?: string;
  fullWidth?: boolean;
  background?: 'white' | 'light' | 'dark';
};

export default function Section({
  children,
  title,
  subtitle,
  className = '',
  id,
  fullWidth = false,
  background = 'white'
}: SectionProps) {
  
  const backgroundClasses = {
    white: 'bg-white dark:bg-gray-900',
    light: 'bg-gray-50 dark:bg-gray-800',
    dark: 'bg-gray-800 dark:bg-gray-950 text-white'
  };
  
  return (
    <section 
      id={id} 
      className={`${backgroundClasses[background]} ${className}`}
    >
      <div className={`${fullWidth ? 'w-full' : 'w-full'}`}>
        {(title || subtitle) && (
          <div className="mb-8">
            {title && <h2 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h2>}
            {subtitle && <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}