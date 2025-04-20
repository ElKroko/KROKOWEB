'use client';

import React, { useState } from 'react';
import { useAccentColor } from '@/providers/AccentColorProvider';
import Typography from '@/components/ui/Typography';
import Highlight from '@/components/ui/Highlight';
import { useDualMode } from '@/providers/DualModeProvider';

// Datos simulados para proyectos de trading
const tradingProjects = [
  {
    id: 1,
    title: 'Análisis Técnico Algorítmico',
    description: 'Sistema de análisis técnico que utiliza algoritmos para identificar patrones en gráficos de precios y generar señales de trading.',
    tags: ['Análisis Técnico', 'Algoritmos', 'Patrones de Precio'],
    stats: {
      winRate: '68%',
      sharpeRatio: '1.92',
      maxDrawdown: '14.3%',
      avgReturn: '2.4% mensual'
    }
  },
  {
    id: 2,
    title: 'Machine Learning en Mercados',
    description: 'Aplicación de técnicas de machine learning para la predicción de tendencias en mercados financieros con énfasis en reducción de falsos positivos.',
    tags: ['ML', 'Aprendizaje Supervisado', 'Predicción'],
    stats: {
      accuracy: '74%',
      f1Score: '0.71',
      predictionWindow: '3-5 días',
      dataPoints: '10+ años'
    }
  },
  {
    id: 3,
    title: 'Análisis Cuantitativo de Riesgo',
    description: 'Modelos cuantitativos para análisis de riesgo y optimización de carteras con enfoque en mercados volátiles.',
    tags: ['Riesgo', 'Estadística', 'Optimización'],
    stats: {
      varConfidence: '95%',
      portfolioSharpe: '2.14',
      riskAdjustedReturn: '8.7% anual',
      correlationMatrix: 'Multisectorial'
    }
  }
];

export default function TradingPage() {
  const { accentColor } = useAccentColor();
  const { mode } = useDualMode();
  const [activeTab, setActiveTab] = useState('projects');

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="mb-20">
        <Typography variant="h1" className="text-9xl tracking-widest font-light">
          <span style={{ color: accentColor }}>TRADE</span>
        </Typography>
        <Typography variant="body" className="mt-6 text-xl max-w-2xl">
          Enfoque cuantitativo al trading y análisis financiero. Desarrollo de modelos 
          algorítmicos y sistemas de trading basados en datos y métodos estadísticos.
        </Typography>
      </div>

      {/* Tabs */}
      <div className="flex space-x-12 mb-16 border-b border-current pb-4">
        <button 
          onClick={() => setActiveTab('projects')}
          className={`text-xl tracking-wider transition-colors ${activeTab === 'projects' ? 'text-[var(--accent-color)]' : ''}`}
        >
          Proyectos
        </button>
        <button 
          onClick={() => setActiveTab('methodology')}
          className={`text-xl tracking-wider transition-colors ${activeTab === 'methodology' ? 'text-[var(--accent-color)]' : ''}`}
        >
          Metodología
        </button>
        <button 
          onClick={() => setActiveTab('tools')}
          className={`text-xl tracking-wider transition-colors ${activeTab === 'tools' ? 'text-[var(--accent-color)]' : ''}`}
        >
          Herramientas
        </button>
      </div>

      {/* Contenido de la pestaña proyectos */}
      {activeTab === 'projects' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            {tradingProjects.map((project) => (
              <div key={project.id} className="group">
                <Typography variant="h2" className="text-3xl tracking-wider mb-6">
                  <span style={{ color: accentColor }}>
                    {project.title}
                  </span>
                </Typography>
                
                <Typography variant="body" className="mb-6">
                  {project.description}
                </Typography>
                
                <div className="grid grid-cols-2 gap-4 p-6 border border-current bg-black/5">
                  {Object.entries(project.stats).map(([key, value]) => (
                    <div key={key} className="mb-4">
                      <div className="text-xs tracking-widest opacity-70 mb-1">
                        {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                      </div>
                      <div className="text-2xl font-light" style={{ color: mode === 'xklokon' ? accentColor : 'inherit' }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-6">
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
      )}

      {/* Contenido de la pestaña metodología */}
      {activeTab === 'methodology' && (
        <div className="max-w-3xl">
          <Typography variant="h2" className="text-3xl tracking-wider mb-8">
            <span style={{ color: accentColor }}>
              Enfoque Metodológico
            </span>
          </Typography>
          
          <div className="space-y-8">
            <div>
              <Typography variant="h3" className="text-xl tracking-wider mb-3">
                1. Análisis de Datos Históricos
              </Typography>
              <Typography variant="body">
                Recopilación y procesamiento de datos históricos de múltiples fuentes. 
                Limpieza y normalización para crear conjuntos de entrenamiento consistentes.
                Análisis estadístico para identificar anomalías y patrones significativos.
              </Typography>
            </div>
            
            <div>
              <Typography variant="h3" className="text-xl tracking-wider mb-3">
                2. Modelado Cuantitativo
              </Typography>
              <Typography variant="body">
                Desarrollo de modelos estadísticos y algoritmos de machine learning.
                Validación cruzada y backtesting riguroso con prevención de overfitting.
                Evaluación de rendimiento con métricas de riesgo ajustado.
              </Typography>
            </div>
            
            <div>
              <Typography variant="h3" className="text-xl tracking-wider mb-3">
                3. Implementación y Optimización
              </Typography>
              <Typography variant="body">
                Ejecución de estrategias en entornos simulados antes de despliegue real.
                Monitoreo continuo y ajustes basados en cambios en condiciones de mercado.
                Optimización de parámetros y adaptación a nuevos datos.
              </Typography>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de la pestaña herramientas */}
      {activeTab === 'tools' && (
        <div className="max-w-3xl">
          <Typography variant="h2" className="text-3xl tracking-wider mb-8">
            <span style={{ color: accentColor }}>
              Stack Tecnológico
            </span>
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-current">
              <Typography variant="h3" className="text-xl tracking-wider mb-3">
                Análisis y Modelado
              </Typography>
              <ul className="space-y-2">
                <li>Python (NumPy, Pandas)</li>
                <li>R (quantmod, tidyquant)</li>
                <li>MATLAB</li>
                <li>TensorFlow / PyTorch</li>
                <li>Scikit-learn</li>
              </ul>
            </div>
            
            <div className="p-6 border border-current">
              <Typography variant="h3" className="text-xl tracking-wider mb-3">
                Datos y APIs
              </Typography>
              <ul className="space-y-2">
                <li>Interactive Brokers API</li>
                <li>Alpha Vantage</li>
                <li>Quandl</li>
                <li>Refinitiv Eikon</li>
                <li>Bloomberg Terminal</li>
              </ul>
            </div>
            
            <div className="p-6 border border-current">
              <Typography variant="h3" className="text-xl tracking-wider mb-3">
                Visualización
              </Typography>
              <ul className="space-y-2">
                <li>Plotly / Dash</li>
                <li>Matplotlib</li>
                <li>D3.js</li>
                <li>Tableau</li>
                <li>TradingView</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}