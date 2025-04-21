'use client';

import React from 'react';
import Typography from '@/components/ui/Typography';

export default function GenerativeArt() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[400px] p-8 border-2 border-accent-strong rounded-lg">
      <div className="text-6xl mb-4 opacity-30">🚧</div>
      <Typography variant="h2" className="mb-2">Arte Generativo</Typography>
      <Typography variant="p" className="text-center max-w-lg mb-6 opacity-70">
        Genera patrones y obras de arte algorítmicas. Esta herramienta creativa estará disponible pronto.
      </Typography>
      <div className="p-3 border border-accent-bg rounded-md bg-accent-bg/30 font-mono text-sm">
        {`// Arte Generativo: En desarrollo`}
      </div>
    </div>
  );
}