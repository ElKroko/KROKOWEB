"use client";

import { useState, useEffect } from 'react';
import ImmersiveShowcase from '@/components/gallery/ImmersiveShowcase';
import { motion } from 'framer-motion';

export default function GalleryPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Datos de proyectos (estos podrían venir de una API o CMS)
  const projects = [
    {
      id: "project-1",
      title: "Exploración tridimensional",
      description: "Una experiencia visual e interactiva que combina formas geométricas y gradientes para crear un efecto de profundidad y movimiento. Este proyecto fusiona diseño minimalista con técnicas de animación avanzadas.",
      imagePath: "/images/art/placeholder_1.png",
      category: "Arte digital",
      technologies: ["Three.js", "WebGL", "GLSL", "React"],
      url: "#"
    },
    {
      id: "project-2",
      title: "Secuencia armónica",
      description: "Visualización generativa que responde a algoritmos matemáticos. Las formas y colores evolucionan creando composiciones que están en constante cambio pero siempre mantienen armonía visual.",
      imagePath: "/images/art/placeholder_2.png",
      category: "Visualización de datos",
      technologies: ["D3.js", "Canvas API", "JavaScript", "SVG"],
      url: "#"
    },
    {
      id: "project-3",
      title: "Nebulosa Fractal",
      description: "Exploración de patrones fractales que imitan formaciones estelares. Este trabajo combina matemáticas complejas con estética cósmica para crear una experiencia inmersiva que evoca el espacio profundo.",
      imagePath: "/images/art/placeholder_3.png",
      category: "Arte generativo",
      technologies: ["WebGL", "GLSL Shaders", "Fractal Mathematics"],
      url: "#"
    },
  ];

  // Simulación de carga
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-primary-dark z-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            className="w-12 h-12 mb-4 mx-auto border-t-2 border-accent rounded-full"
          />
          <p className="text-white/80 text-sm">Cargando experiencia visual...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-primary-dark">
      <ImmersiveShowcase projects={projects} />
    </div>
  );
}