'use client';

import React, { useState } from 'react';
import { useAccentColor } from '@/providers/AccentColorProvider';
import { useDualMode } from '@/providers/DualModeProvider';
import Typography from '@/components/ui/Typography';
import Highlight from '@/components/ui/Highlight';

// Datos simulados para proyectos de código
const codeProjects = [
  {
    id: 1,
    title: 'WebGL Audio Visualizer',
    description: 'Visualizador de audio en tiempo real utilizando WebGL y la API de Web Audio para crear representaciones vibrantes del espectro sonoro.',
    tags: ['JavaScript', 'WebGL', 'Web Audio API'],
    codeSnippet: `
// Fragment shader para visualización de audio
const fragmentShader = \`
  precision mediump float;
  uniform float time;
  uniform float[] audioData;
  
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  
  void main() {
    // Transformación basada en datos de audio
    // ... código adicional
  }
\`
    `
  },
  {
    id: 2,
    title: 'Algorithmic Trading Framework',
    description: 'Framework para la implementación y prueba de algoritmos de trading con soporte para análisis técnico y backtest con datos históricos.',
    tags: ['Python', 'Pandas', 'NumPy', 'TA-Lib'],
    codeSnippet: `
class Strategy:
    def __init__(self, data):
        self.data = data
        self.positions = []
        
    def calculate_indicators(self):
        # Calcular medias móviles
        self.data['sma_20'] = self.data['close'].rolling(window=20).mean()
        self.data['sma_50'] = self.data['close'].rolling(window=50).mean()
        
        # Calcular RSI
        delta = self.data['close'].diff()
        gain = delta.where(delta > 0, 0)
        loss = -delta.where(delta < 0, 0)
        # ... continúa implementación
    
    def generate_signals(self):
        # Lógica para generar señales de compra/venta
        # ... implementación de la estrategia
    `
  },
  {
    id: 3,
    title: 'TypeScript Design Patterns',
    description: 'Colección de implementaciones de patrones de diseño en TypeScript con ejemplos prácticos y casos de uso.',
    tags: ['TypeScript', 'Design Patterns', 'OOP'],
    codeSnippet: `
// Implementación del patrón Observer en TypeScript
interface Observer {
  update(subject: Subject): void;
}

class Subject {
  private observers: Observer[] = [];

  public attach(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (isExist) return;
    this.observers.push(observer);
  }

  public detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) return;
    this.observers.splice(observerIndex, 1);
  }

  public notify(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }
}
    `
  }
];

export default function ProgrammingPage() {
  const { mode } = useDualMode();
  const { accentColor } = useAccentColor();
  const [activeProject, setActiveProject] = useState<number | null>(null);

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <Typography variant="h1" className="text-9xl tracking-widest font-light">
          <span style={{ color: accentColor }}>CODE</span>
        </Typography>
        <Typography variant="body" className="mt-6 text-xl max-w-2xl">
          Desarrollo de software centrado en la experimentación, visualización de datos y las tecnologías web.
          Proyectos que combinan creatividad técnica con funcionalidad práctica.
        </Typography>
      </div>

      {/* Proyectos de código */}
      <div className="space-y-32">
        {codeProjects.map((project) => (
          <div 
            key={project.id}
            className="transition-all duration-500"
          >
            <div className="md:flex md:items-start gap-12">
              <div className="md:w-1/2">
                <Typography variant="h2" className="text-3xl tracking-wider mb-6">
                  <span 
                    style={{ color: activeProject === project.id ? accentColor : 'currentColor' }}
                    onMouseEnter={() => setActiveProject(project.id)}
                    onMouseLeave={() => setActiveProject(null)}
                  >
                    {project.title}
                  </span>
                </Typography>
                
                <Typography variant="body" className="mb-6">
                  {project.description}
                </Typography>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="text-xs tracking-wider py-1 px-3 border border-current"
                      style={{ 
                        borderColor: activeProject === project.id ? accentColor : 'currentColor',
                        color: activeProject === project.id ? accentColor : 'currentColor' 
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="md:w-1/2 font-mono text-sm overflow-x-auto">
                <pre className={`p-6 ${mode === 'xklokon' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
                  <code>{project.codeSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}