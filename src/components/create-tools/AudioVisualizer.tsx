'use client';

import React from 'react';
import Typography from '@/components/ui/Typography';

export default function AudioVisualizer() {
  return (
    <div className="w-full min-h-[400px] p-8 bg-accent-bg/10">
      <div className="flex-col ">
        <Typography variant="h2" className="mb-2">Visualizador de Audio</Typography>
        <Typography variant="p" className="mb-6">
          Crea visualizaciones interactivas basadas en audio. Esta herramienta creativa estará disponible pronto.
        </Typography>
        
        {/* Área de visualización que ocupa todo el ancho */}
        <div className="w-full h-64 bg-black/20 rounded-lg mb-6 flex items-center justify-center">
          <div className="text-6xl opacity-30">🚧</div>
        </div>
        
        <div className="p-3 border border-accent-bg rounded-md bg-accent-bg/30 font-mono text-sm inline-block">
          {`// Visualizador de Audio: En desarrollo`}
        </div>
      </div>
    </div>
  );
}