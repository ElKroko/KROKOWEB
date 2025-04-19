'use client';

import Typography from '@/components/ui/Typography';
import SectionLayout from '@/components/ui/SectionLayout';
import Highlight from '@/components/ui/Highlight';
import { useAccentColor } from '@/providers/AccentColorProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AboutRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirigir de /about a /me
    router.replace('/me');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl">Redirigiendo a ME...</p>
    </div>
  );
}

export function TypographyShowcase() {
  const { accentColor, setAccentColor } = useAccentColor();
  const router = useRouter();

  // Function to change the accent color via URL query param
  const changeAccentColor = (color) => {
    router.push(`/about?accent=${encodeURIComponent(color)}`);
  };

  // Sample colors
  const sampleColors = [
    '#3B82F6', // Blue
    '#EC4899', // Pink
    '#8B5CF6', // Purple
    '#10B981', // Green
    '#F59E0B', // Amber
    '#6366F1', // Indigo
    '#06B6D4', // Cyan
    '#F97316', // Orange
  ];

  return (
    <>
      <SectionLayout fullWidth>
        <div className="px-4 md:px-8">
          <Typography variant="h1" className="mb-8" colorClass="primary">
            Sobre{' '}
            <span className="text-accent-color">
              KROKO
            </span>
          </Typography>
          
          <div className="grid-content mb-16">
            <Typography variant="lead" className="mb-12">
              Soy un{' '}
              <Highlight 
                word="desarrollador multidisciplinario" 
                contentType="text"
              >
                Combino programación, diseño, y pensamiento creativo para desarrollar soluciones digitales innovadoras.
              </Highlight>{' '}
              que fusiona el arte, la tecnología y el conocimiento para crear experiencias digitales{' '}
              <Highlight 
                word="inmersivas" 
                contentType="image"
                src="/images/art/placeholder_1.png"
                alt="Arte inmersivo"
              />{' '}
              y proyectos que combinan múltiples disciplinas.
            </Typography>
          </div>
        </div>
      </SectionLayout>

      <SectionLayout title="Paleta Tipográfica" accentColor={accentColor}>
        <div className="space-y-8 mb-12">
          <div>
            <Typography variant="h2" className="mb-4" colorClass="secondary">Titulares</Typography>
            <div className="space-y-6 border-l-4 pl-6 border-accent">
              <Typography variant="h1" colorClass="primary">Heading 1</Typography>
              <Typography variant="h2" colorClass="secondary">Heading 2</Typography>
              <Typography variant="h3" accent>Heading 3</Typography>
              <Typography variant="h4" colorClass="muted">Heading 4</Typography>
            </div>
          </div>
          
          <div>
            <Typography variant="h2" className="mb-4" colorClass="secondary">Párrafos y texto</Typography>
            <div className="space-y-6 border-l-4 pl-6 border-accent">
              <Typography variant="lead">
                Este es un texto Lead, utilizado para introducciones destacadas y resúmenes.
                Tiene un tamaño más grande que el párrafo estándar.
              </Typography>
              
              <Typography variant="p">
                Este es un párrafo estándar. La base de cualquier contenido textual extenso.
                Utiliza una escala fluida para adaptarse a diferentes tamaños de pantalla,
                manteniendo siempre una excelente legibilidad.
              </Typography>
              
              <Typography variant="small">
                Este es un texto pequeño, útil para notas, pies de foto o contenido secundario
                que no necesita tanto protagonismo en la jerarquía visual.
              </Typography>
              
              <Typography variant="caption">
                Caption: Para información metadatos, créditos y textos muy pequeños.
              </Typography>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <Typography variant="h2" className="mb-6" colorClass="primary">Componente Highlight</Typography>
          <div className="space-y-8 p-6 bg-primary-dark/30 rounded-lg">
            <Typography variant="p">
              El componente Highlight permite crear{' '}
              <Highlight 
                word="interacciones sutiles" 
                contentType="text"
              >
                Muestran información adicional o contexto al hacer hover sobre palabras clave.
              </Highlight>{' '}
              en el texto. También puede mostrar{' '}
              <Highlight 
                word="imágenes" 
                contentType="image"
                src="/images/art/placeholder_2.png"
                alt="Ejemplo de imagen"
              />{' '}
              o incluso reproducir{' '}
              <Highlight 
                word="audio" 
                contentType="audio"
                src="/audio/BOTANIKAL.mp3"
              />
              {' '}al hacer hover.
            </Typography>
          </div>
        </div>
        
        <div className="mb-12">
          <Typography variant="h2" className="mb-6" colorClass="accent">Colores de Acento Dinámicos</Typography>
          <div className="mb-4">
            <Typography variant="p">
              Haz clic en un color para cambiar el acento de toda la página:
            </Typography>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {sampleColors.map((color) => (
              <button
                key={color}
                onClick={() => changeAccentColor(color)}
                className="w-12 h-12 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
                style={{ backgroundColor: color }}
                aria-label={`Cambiar a color ${color}`}
              />
            ))}
          </div>
        </div>
      </SectionLayout>
      
      <SectionLayout title="Espaciado y Composición" accentColor={accentColor}>
        <div className="mb-8">
          <Typography variant="p" className="mb-8">
            Este sistema usa márgenes verticales amplios para separar secciones y una 
            composición basada en un grid minimalista con un ancho máximo de lectura
            óptimo de 60 caracteres.
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-[1fr_minmax(auto,60ch)_1fr] gap-8 border border-dashed border-accent p-6 rounded-lg">
            <div className="hidden md:flex md:items-center md:justify-center border border-dashed border-primary-mid/50 rounded p-4">
              <Typography variant="small" className="text-center text-gray-400">Columna Lateral</Typography>
            </div>
            
            <div className="border border-dashed border-accent rounded p-4">
              <Typography variant="p">
                Esta columna central tiene un ancho máximo de <strong>60ch</strong>, la medida
                óptima para una legibilidad cómoda. Este ancho se adapta fluidamente en
                dispositivos móviles.
              </Typography>
            </div>
            
            <div className="hidden md:flex md:items-center md:justify-center border border-dashed border-primary-mid/50 rounded p-4">
              <Typography variant="small" className="text-center text-gray-400">Columna Lateral</Typography>
            </div>
          </div>
        </div>
      </SectionLayout>
    </>
  );
}