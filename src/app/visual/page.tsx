'use client';

import React, { useState } from 'react';
import { useAccentColor } from '@/providers/AccentColorProvider';
import { useDualMode } from '@/providers/DualModeProvider';
import Section from '@/components/ui/Section';
import Typography from '@/components/ui/Typography';
import Highlight from '@/components/ui/Highlight';

// Datos simulados para proyectos de arte
const artProjects = [
  {
    id: 1,
    title: 'Generative Patterns',
    description: 'Colección de patrones generativos basados en algoritmos matemáticos y ruido Perlin.',
    tags: ['Processing', 'Generativo', 'Algoritmos'],
    imageUrl: '/images/art/placeholder_1.png'
  },
  {
    id: 2,
    title: 'Visual Spectrum',
    description: 'Exploración visual de la relación entre el sonido y la forma a través de análisis espectral.',
    tags: ['Audio', 'Visual', 'Espectro'],
    imageUrl: '/images/art/placeholder_2.png'
  },
  {
    id: 3,
    title: 'ASCII Experiments',
    description: 'Arte basado en caracteres ASCII para la exploración de la forma a través de la tipografía.',
    tags: ['ASCII', 'Tipografía', 'Minimalismo'],
    imageUrl: '/images/art/placeholder_3.png'
  }
];

export default function VisualArtPage() {
  const { mode } = useDualMode();
  const { accentColor } = useAccentColor();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  return (
    <div className="p-16 min-h-screen">
      {/* Header */}
      <div className="mb-20">
        <Typography variant="h1" className="text-9xl tracking-widest font-light">
          <Highlight accentColor={accentColor}>ART</Highlight>
        </Typography>
        <Typography variant="body" className="mt-6 text-xl max-w-2xl">
          Explorando la fusión entre lo digital y lo analógico a través de proyectos visuales experimentales.
          Arte generativo, diseño y visualización de datos con un enfoque minimalista.
        </Typography>
      </div>

      {/* Proyectos de arte */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        {artProjects.map((project) => (
          <div 
            key={project.id}
            className={`group transition-all duration-500 cursor-pointer`}
            onMouseEnter={() => setSelectedProject(project.id)}
            onMouseLeave={() => setSelectedProject(null)}
          >
            <div className="relative aspect-square mb-6 overflow-hidden bg-black/5">
              {mode === 'xklokon' ? (
                <pre className="absolute inset-0 text-[0.4rem] text-[var(--accent-color)] opacity-70 overflow-hidden p-2">
                  {Array(100).fill(0).map((_, i) => 
                    `${project.title.repeat(5).substring(0, 200)}${i % 5 === 0 ? '\n' : ''}`
                  ).join('')}
                </pre>
              ) : (
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className={`object-cover w-full h-full transition-all duration-500 ${
                    selectedProject === project.id ? 'opacity-100 scale-105' : 'opacity-80 scale-100'
                  }`} 
                />
              )}
            </div>
            
            <Typography variant="h2" className="text-3xl tracking-wider">
              <Highlight accentColor={accentColor}>
                {project.title}
              </Highlight>
            </Typography>
            
            <Typography variant="body" className="mt-3 max-w-md">
              {project.description}
            </Typography>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="text-xs tracking-wider py-1 px-3 border border-current"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}