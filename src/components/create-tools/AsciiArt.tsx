'use client';

import React from 'react';
import Typography from '@/components/ui/Typography';
import AsciiPlayground from '@/components/AsciiPlayground';

export default function AsciiArt() {
  return (
    <div className="w-full">
      <Typography variant="h2" className="text-accent-strong mb-2">Playground de Arte ASCII</Typography>
      <Typography variant="p" className="mb-6 max-w-3xl">
        Convierte imágenes en arte ASCII o crea directamente con texto. Ajusta los parámetros para personalizar el resultado
        y descarga tu creación como archivo de texto, imagen o animación.
      </Typography>
      <AsciiPlayground />
    </div>
  );
}