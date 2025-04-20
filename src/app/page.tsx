'use client';

import { useState, useEffect } from 'react';
import { useDualMode } from '@/providers/DualModeProvider';
import { useAccentColor } from '@/providers/AccentColorProvider';
import { motion, AnimatePresence } from 'framer-motion';
import Typography from '@/components/ui/Typography';

export default function Home() {
  const { mode, toggleMode } = useDualMode();
  
  // Content variables for both modes
  const krokoContent = {
    heading: "Kroko",
    description: "Mi alias como productor musical de reggaetón, sonidos urbanos y electrónica. Bajo este nombre lancé mi primer álbum en 2023, fusionando ritmos contemporáneos con mi estilo personal. Un universo sonoro que refleja mi pasión por la música que comenzó desde los 11 años con la guitarra.",
    buttonText: "Conocer a Kroko"
  };

  const xklokonContent = {
    heading: "XKLOKON",
    description: "Mi alter ego dedicado a dar vida a sonidos que aún no existen. Experimento con lo visual y lo sonoro: mezclo géneros musicales con texturas y ruidos en TouchDesigner, y exploro entornos 3D y WebGL para crear experiencias inmersivas en la intersección entre tecnología y arte.",
    buttonText: "Explorar XKLOKON"
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
            className={`font-mono tracking-wide mb-6 ${mode === 'xklokon' ? 'console-text' : ''}`}
          >
            {content.heading}
          </Typography>
          
          {/* Description */}
          <Typography 
            variant="lead" 
            className={`mb-12 max-w-2xl mx-auto font-mono ${mode === 'xklokon' ? 'console-text' : ''}`}
          >
            {content.description}
          </Typography>
          
          {/* Button */}
          <div className="mt-8">
            <button 
              onClick={toggleMode}
              className={`
                px-8 py-3 border border-current 
                ${mode === 'kroko' ? 'rounded-md' : 'rounded-none'} 
                transition-all font-mono
                ${mode === 'kroko' ? 'hover:bg-black hover:text-white' : 'hover:bg-white hover:text-black'}
              `}
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
            animate={{ opacity: 0.05 }}
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full"
            style={{ backgroundColor: '#000000', filter: 'blur(80px)' }}
          />
        </div>
      )}
      
      {/* Background elements for XKLOKON mode */}
      {mode === 'xklokon' && (
        <div className="bg-image fixed inset-0 z-[-1] pointer-events-none">
          {/* Digital noise elements */}
          <motion.div 
            className="absolute inset-0 mix-blend-overlay opacity-10"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
              backgroundSize: 'cover'
            }}
          />
          
          {/* Console cursor effect */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 cursor-effect"></div>
        </div>
      )}

      {/* Visual separator based on mode */}
      <div className="absolute bottom-12 w-24 h-px bg-current opacity-30"></div>
      
      {/* Mode indicator */}
      <div className="absolute bottom-6 text-xs font-mono tracking-widest opacity-50">
        {mode.toUpperCase()} MODE
      </div>
    </div>
  );
}