'use client';

import React, { useState, useEffect } from 'react';
import { useAccentColor } from '@/providers/AccentColorProvider';
import { useDualMode } from '@/providers/DualModeProvider';
import Typography from '@/components/ui/Typography';
import Highlight from '@/components/ui/Highlight';
import { generateAsciiArt } from '@/lib/ascii-utils';

// Datos simulados para proyectos creativos
const creativeProjects = [
  {
    id: 1,
    title: 'Immersive Audio Experience',
    description: 'Experiencia inmersiva que combina audio espacial y visuales generativos que reaccionan a la música en tiempo real.',
    year: '2023',
    link: '#',
    tags: ['WebGL', 'Audio Reactivo', 'Espacial'],
    imageUrl: '/images/art/placeholder_1.png'
  },
  {
    id: 2,
    title: 'Typographic Experiments',
    description: 'Exploración de posibilidades tipográficas y espaciales utilizando únicamente texto como elemento visual principal.',
    year: '2022',
    link: '#',
    tags: ['Tipografía', 'Minimalismo', 'Interactivo'],
    imageUrl: '/images/art/placeholder_2.png'
  },
  {
    id: 3,
    title: 'Data Sonification',
    description: 'Transformación de conjuntos de datos científicos en composiciones sonoras y visuales que revelan patrones ocultos.',
    year: '2021',
    link: '#',
    tags: ['Sonificación', 'Datos', 'Generativo'],
    imageUrl: '/images/art/placeholder_3.png'
  }
];

export default function GalleryPage() {
  const { accentColor } = useAccentColor();
  const { mode } = useDualMode();
  const [asciiTitle, setAsciiTitle] = useState('');
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Generar título en ASCII art
  useEffect(() => {
    const generateTitle = async () => {
      if (mode === 'xklokon') {
        const art = await generateAsciiArt('CREATE', 'Slant');
        setAsciiTitle(art);
      } else {
        setAsciiTitle('');
      }
    };

    generateTitle();
  }, [mode]);

  const handleProjectClick = (id: number) => {
    if (selectedProject === id) {
      // Deseleccionar
      setIsTransitioning(true);
      setTimeout(() => {
        setSelectedProject(null);
        setIsTransitioning(false);
      }, 300);
    } else {
      // Seleccionar nuevo
      setIsTransitioning(true);
      setTimeout(() => {
        setSelectedProject(id);
        setIsTransitioning(false);
      }, 300);
    }
  };

  // Obtener proyecto activo
  const activeProject = selectedProject ? creativeProjects.find(p => p.id === selectedProject) : null;

  return (
    <div className="p-16 min-h-screen">
      {/* Header */}
      <div className="mb-20">
        {mode === 'xklokon' && asciiTitle ? (
          <pre className="font-mono text-[var(--accent-color)] text-sm md:text-base mb-8">
            {asciiTitle}
          </pre>
        ) : (
          <Typography variant="h1" className="text-9xl tracking-widest font-light">
            <Highlight accentColor={accentColor}>CREATE</Highlight>
          </Typography>
        )}
        <Typography variant="body" className="mt-6 text-xl max-w-2xl">
          Proyectos experimentales que fusionan tecnología, diseño y narración.
          Experiencias inmersivas que exploran nuevas formas de interacción y expresión.
        </Typography>
      </div>

      <div className="relative">
        {/* Grid de proyectos (visible cuando no hay selección) */}
        {!selectedProject && (
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-12 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {creativeProjects.map((project) => (
              <div 
                key={project.id}
                className="cursor-pointer group"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="aspect-square overflow-hidden mb-6 relative">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 tracking-widest">
                      EXPLORAR
                    </span>
                  </div>
                </div>
                
                <Typography variant="h3" className="text-2xl tracking-wider mb-2">
                  <Highlight accentColor={accentColor}>
                    {project.title}
                  </Highlight>
                </Typography>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm opacity-70">{project.year}</div>
                  <div className="flex space-x-1">
                    {project.tags.slice(0, 1).map((tag, index) => (
                      <span key={index} className="text-xs tracking-wider">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vista detallada (visible cuando hay selección) */}
        {selectedProject && activeProject && (
          <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-2/3">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={activeProject.imageUrl} 
                    alt={activeProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="md:w-1/3">
                <Typography variant="h2" className="text-4xl tracking-wider mb-4">
                  <Highlight accentColor={accentColor}>
                    {activeProject.title}
                  </Highlight>
                </Typography>
                
                <div className="text-sm opacity-70 mb-6">{activeProject.year}</div>
                
                <Typography variant="body" className="mb-8">
                  {activeProject.description}
                </Typography>
                
                <div className="flex flex-wrap gap-2 mb-12">
                  {activeProject.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="text-xs tracking-wider py-1 px-3 border border-current"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="space-x-6">
                  <button 
                    className="border border-current py-2 px-6 tracking-widest text-sm hover:bg-black hover:text-white transition-all"
                    onClick={() => handleProjectClick(activeProject.id)}
                  >
                    VOLVER
                  </button>
                  <a 
                    href={activeProject.link} 
                    className="border border-current py-2 px-6 tracking-widest text-sm hover:bg-[var(--accent-color)] hover:border-[var(--accent-color)] hover:text-white transition-all"
                  >
                    EXPLORAR
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}