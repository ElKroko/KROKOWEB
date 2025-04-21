'use client';

import React from 'react';
import Typography from '@/components/ui/Typography';
import AsciiTextGenerator from '@/components/ui/AsciiTextGenerator';

export default function AsciiText() {
  return (
    <div className="w-full flex-col">
      <Typography variant="h2" className="text-accent-strong mb-2">Generador de Texto ASCII</Typography>
      <Typography variant="p" className="mb-6 max-w-3xl">
        Convierte texto en arte ASCII con diversos estilos y fuentes. Prueba diferentes fuentes para crear firmas, 
        banners o diseños únicos para tus proyectos.
      </Typography>
      <AsciiTextGenerator initialText="KROKO" />
    </div>
  );
}