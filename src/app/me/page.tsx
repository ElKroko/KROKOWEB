'use client';

import React, { useEffect } from 'react';
import SectionLayout from '@/components/ui/SectionLayout';
import Typography from '@/components/ui/Typography';
import Section from '@/components/ui/Section';
import Highlight from '@/components/ui/Highlight';
import { useAccentColor } from '@/providers/AccentColorProvider';
import { useDualMode } from '@/providers/DualModeProvider';

export default function MePage() {
  const { accentColor } = useAccentColor();
  const { mode } = useDualMode();

  // Efecto para aplicar color personalizado a esta página
  useEffect(() => {
    document.documentElement.setAttribute('data-page', 'me');
  }, []);

  return (
    <div className="min-h-screen p-8 color-transition">
      <SectionLayout fullWidth>
        <div className="px-4 md:px-8">
          <Typography variant="h1" className="mb-8 text-accent-strong">
            <span className={mode === 'xklokon' ? 'font-mono tracking-tight' : 'tracking-widest'}>
              KROKO ME
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
      
      {/* Sección Personal */}
      <SectionLayout title="Who I Am" accentColor={accentColor}>
        <div className="mb-8">
          <Typography variant="p" className="mb-8 max-w-2xl">
            Soy un artista interdisciplinar, programador y entusiasta del trading que explora 
            las intersecciones entre arte, tecnología y finanzas. Mi enfoque minimalista y 
            tipográfico refleja mi búsqueda de claridad en la complejidad.
          </Typography>
          
          <div className="grid gap-8 md:grid-cols-2 mb-12">
            <div className="bg-accent-bg p-8 rounded-md border border-accent-strong/20 color-transition">
              <Typography variant="h3" className="mb-4 text-accent-strong">Background</Typography>
              <Typography variant="p" className="mb-4">
                Con formación en tecnología y un interés profundo por las artes visuales y la música,
                mi trabajo busca tender puentes entre diferentes disciplinas para crear experiencias
                únicas y significativas.
              </Typography>
            </div>
            <div className="bg-accent-bg p-8 rounded-md border border-accent-strong/20 color-transition">
              <Typography variant="h3" className="mb-4 text-accent-strong">Philosophy</Typography>
              <Typography variant="p" className="mb-4">
                Creo en la simplicidad intencional. Menos elementos pero con mayor impacto.
                Mi trabajo valora la tipografía y el espacio como elementos fundamentales
                para comunicar claramente conceptos complejos.
              </Typography>
            </div>
          </div>
        </div>
      </SectionLayout>
      
      {/* Sección Skills */}
      <SectionLayout title="Skills & Interests" accentColor={accentColor}>
        <div className="grid gap-8 md:grid-cols-3 mb-12">
          <div className="p-6 border-l-4 border-accent-strong/70 color-transition">
            <Typography variant="h3" className="mb-4 text-accent-strong">Programming</Typography>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="mr-2 text-accent-comp">▪</span>
                React / Next.js
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-accent-comp">▪</span>
                TypeScript
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-accent-comp">▪</span>
                Three.js
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-accent-comp">▪</span>
                Node.js
              </li>
            </ul>
          </div>
          
          <div className="p-6 border-l-4 border-accent-strong/70 color-transition">
            <Typography variant="h3" className="mb-4 text-accent-strong">Creative</Typography>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="mr-2 text-accent-comp">▪</span>
                Diseño Gráfico
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-accent-comp">▪</span>
                Producción Musical
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-accent-comp">▪</span>
                Arte Digital
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-accent-comp">▪</span>
                Tipografía
              </li>
            </ul>
          </div>
          
          <div className="p-6 border-l-4 border-accent-strong/70 color-transition">
            <Typography variant="h3" className="mb-4 text-accent-strong">Trading</Typography>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="mr-2 text-accent-comp">▪</span>
                Análisis Técnico
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-accent-comp">▪</span>
                Mercados Cripto
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-accent-comp">▪</span>
                Estrategias Algorítmicas
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-accent-comp">▪</span>
                Trading Cuantitativo
              </li>
            </ul>
          </div>
        </div>
      </SectionLayout>
      
      {/* Sección Timeline */}
      <SectionLayout title="Journey" accentColor={accentColor}>
        <div className="relative border-l-2 border-accent-strong/50 pl-8 py-4 ml-4 color-transition">
          {/* Eventos cronológicos */}
          <div className="mb-12 relative">
            <div className="absolute -left-12 w-6 h-6 rounded-full bg-accent-strong color-transition"></div>
            <Typography variant="h3" className="text-accent-strong mb-2">2023</Typography>
            <Typography variant="p" className="mb-1">Lanzamiento de KROKOWEB</Typography>
            <Typography variant="small" className="opacity-70">
              Mi plataforma personal que refleja mi enfoque minimalista y tipográfico
            </Typography>
          </div>
          
          <div className="mb-12 relative">
            <div className="absolute -left-12 w-6 h-6 rounded-full bg-accent-strong color-transition"></div>
            <Typography variant="h3" className="text-accent-strong mb-2">2021</Typography>
            <Typography variant="p" className="mb-1">Exploración en Trading Algorítmico</Typography>
            <Typography variant="small" className="opacity-70">
              Desarrollo de sistemas de trading utilizando programación y análisis técnico
            </Typography>
          </div>
          
          <div className="mb-12 relative">
            <div className="absolute -left-12 w-6 h-6 rounded-full bg-accent-strong color-transition"></div>
            <Typography variant="h3" className="text-accent-strong mb-2">2019</Typography>
            <Typography variant="p" className="mb-1">Primeras Producciones Musicales</Typography>
            <Typography variant="small" className="opacity-70">
              Lanzamiento de mis primeras creaciones sonoras experimentales
            </Typography>
          </div>
          
          <div className="relative">
            <div className="absolute -left-12 w-6 h-6 rounded-full bg-accent-strong color-transition"></div>
            <Typography variant="h3" className="text-accent-strong mb-2">2017</Typography>
            <Typography variant="p" className="mb-1">Inmersión en Desarrollo Web</Typography>
            <Typography variant="small" className="opacity-70">
              Comienzo de mi trayectoria como desarrollador front-end y diseñador web
            </Typography>
          </div>
        </div>
      </SectionLayout>
    </div>
  );
}