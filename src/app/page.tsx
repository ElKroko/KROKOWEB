'use client';

import { useState, useEffect } from 'react';
import { useDualMode } from '@/providers/DualModeProvider';
import { useAccentColor } from '@/providers/AccentColorProvider';
import { motion, AnimatePresence } from 'framer-motion';
import Typography from '@/components/ui/Typography';

export default function Home() {
  const { mode, toggleMode } = useDualMode();
  const { accentColor } = useAccentColor();
  
  // Background images for XKLOKON mode
  const backgroundImages = [
    '/images/art/placeholder_1.png',
    '/images/art/placeholder_2.png',
    '/images/art/placeholder_3.png',
  ];

  // Content variables for both modes
  const krokoContent = {
    heading: "Kroko",
    subheading: "El ser humano, presente y emocional",
    description: "Canto, escribo y narro mis vivencias personales con calidez y vulnerabilidad.",
    visualStyle: "tracking-wide font-light",
    buttonText: "Conocer a Kroko",
    buttonLink: "/about",
    headerColor: "primary"
  };

  const xklokonContent = {
    heading: "XKLOKON",
    subheading: "El imaginario creador y abstracto",
    description: "Habito lo intangible, produzco sin filtros ni límites desde lo digital y lo onírico.",
    visualStyle: "tracking-superwide font-mono",
    buttonText: "Explorar XKLOKON",
    buttonLink: "/visual",
    headerColor: "secondary"
  };

  // Active content based on mode
  const content = mode === 'kroko' ? krokoContent : xklokonContent;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Main content with animation */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={mode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl px-4 z-10"
        >
          {/* Heading */}
          <Typography 
            variant="h1" 
            className={`${content.visualStyle} mb-6`}
            colorClass={content.headerColor as any}
          >
            {content.heading}
          </Typography>
          
          {/* Subheading */}
          <Typography 
            variant="h3" 
            className={`${content.visualStyle} mb-8`}
            accent
          >
            {content.subheading}
          </Typography>
          
          {/* Description */}
          <Typography 
            variant="lead" 
            className={`mb-12 max-w-2xl mx-auto ${mode === 'xklokon' ? 'font-mono' : 'font-sans'}`}
          >
            {content.description}
          </Typography>
          
          {/* Button */}
          <div className="mt-8">
            <button 
              onClick={toggleMode}
              className={`px-8 py-3 border border-current ${mode === 'kroko' ? 'rounded-md' : 'rounded-none'} transition-all hover:bg-black hover:text-white`}
            >
              Cambiar a {mode === 'kroko' ? 'XKLOKON' : 'Kroko'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Decorative elements for Kroko mode */}
      {mode === 'kroko' && (
        <div className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full"
            style={{ backgroundColor: accentColor, filter: 'blur(80px)' }}
          />
        </div>
      )}
      
      {/* Background images for XKLOKON mode */}
      {mode === 'xklokon' && (
        <div className="bg-image fixed inset-0 z-[-1] pointer-events-none">
          {backgroundImages.map((img, index) => (
            <motion.img 
              key={index}
              initial={{ opacity: 0, rotate: index * 5 }}
              animate={{ 
                opacity: 0.2,
                rotate: index * 10,
                x: Math.sin(index) * 20
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
              src={img} 
              alt=""
              className="absolute transition-all duration-500"
              style={{
                top: `${20 + index * 30}%`,
                left: `${50 + index * 10}%`,
                maxWidth: '40%',
                maxHeight: '40%',
                filter: 'grayscale(0.8) contrast(1.2)'
              }}
            />
          ))}
          
          {/* Digital noise elements */}
          <motion.div 
            className="absolute inset-0 mix-blend-overlay opacity-10"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
              backgroundSize: 'cover'
            }}
          />
        </div>
      )}

      {/* Visual separator based on mode */}
      <div className={`absolute bottom-12 w-24 h-px ${mode === 'kroko' ? 'bg-current opacity-30' : 'bg-accent-color opacity-50'}`}></div>
      
      {/* Mode indicator */}
      <div className="absolute bottom-6 text-xs tracking-widest opacity-50">
        {mode.toUpperCase()} MODE
      </div>
    </div>
  );
}