'use client';

import React, { useState } from 'react';
import Typography from '@/components/ui/Typography';
import { useDualMode } from '@/providers/DualModeProvider';

// Importar los componentes de herramientas creativas
import PhotoEffects from '@/components/create-tools/PhotoEffects';
import AsciiText from '@/components/create-tools/AsciiText';
import AsciiArt from '@/components/create-tools/AsciiArt';
import AudioVisualizer from '@/components/create-tools/AudioVisualizer';
import GenerativeArt from '@/components/create-tools/GenerativeArt';

// Definir tipos para las herramientas creativas
type CreativeTool = {
  id: string;
  name: string;
  icon?: string;
  description: string;
  component: React.ComponentType;
};

export default function CreatePage() {
  // Estado para rastrear la herramienta activa
  const [activeToolId, setActiveToolId] = useState<string>('photo-effects');
  const { mode } = useDualMode();

  // Lista de herramientas creativas
  const creativeTools: CreativeTool[] = [
    {
      id: 'photo-effects',
      name: 'Efectos de Foto',
      description: 'Captura fotos y aplica efectos visuales usando WebGL',
      component: PhotoEffects
    },
    {
      id: 'ascii-text',
      name: 'ASCII Text',
      description: 'Genera texto ASCII con diversos estilos y fuentes',
      component: AsciiText
    },
    {
      id: 'ascii-art',
      name: 'ASCII Art',
      description: 'Convierte imágenes a arte ASCII y crea animaciones',
      component: AsciiArt
    },
    {
      id: 'audio-visualizer',
      name: 'Visualizador de Audio',
      description: 'Crea visualizaciones interactivas basadas en audio',
      component: AudioVisualizer
    },
    {
      id: 'generative-art',
      name: 'Arte Generativo',
      description: 'Genera patrones y obras de arte algorítmicas',
      component: GenerativeArt
    }
  ];

  // Cambiar herramienta activa
  const switchTool = (toolId: string) => {
    setActiveToolId(toolId);
  };

  // Renderizar contenido de la herramienta activa
  const renderToolContent = () => {
    const activeTool = creativeTools.find(tool => tool.id === activeToolId);
    if (activeTool) {
      const ToolComponent = activeTool.component;
      return <ToolComponent />;
    }
    return null;
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Sidebar para herramientas creativas - estilo similar a la sidebar principal */}
      <aside className={`w-[200px] flex-shrink-0 h-[calc(100vh-60px)] sticky top-16 border-r ${
        mode === 'xklokon' ? 'bg-card-bg' : 'bg-accent-color/5'
      } py-4 px-5 flex flex-col`}>
        {/* Título y descripción */}
        <div className="mb-6">
          <Typography variant="h1" className="text-accent-strong text-2xl mb-1">CREATE</Typography>
          <Typography variant="p" className="text-xs opacity-80">
            Herramientas para generar arte y contenido.
          </Typography>
        </div>
        
        <Typography variant="h3" className="text-accent-color mb-3 font-medium text-xs uppercase tracking-wider">HERRAMIENTAS</Typography>
        <nav className="flex flex-col space-y-1">
          {creativeTools.map(tool => (
            <button
              key={tool.id}
              onClick={() => switchTool(tool.id)}
              className={`py-1.5 px-3 text-left rounded-md transition-colors text-sm ${
                activeToolId === tool.id
                  ? `${mode === 'xklokon' ? 'bg-accent-color/30' : 'bg-accent-color/20'} text-accent-color font-medium`
                  : `text-foreground hover:text-accent-color hover:bg-accent-color/10`
              }`}
            >
              {tool.name}
            </button>
          ))}
        </nav>
        
        {/* Espacio flexible para mantener todo en la parte superior */}
        <div className="flex-grow"></div>
        
        {/* Información adicional en la parte inferior */}
        <div className="pt-2 border-t border-accent-color/10">
          <p className="text-[12px] text-foreground/60">Herramientas en desarrollo.</p>
        </div>
      </aside>
      
      {/* Contenido de la herramienta activa - Ahora toma todo el espacio disponible */}
      <main className="flex-2 flex-grow overflow-auto w-full p-6">
        <div className="w-full">
          {renderToolContent()}
        </div>
      </main>
    </div>
  );
}