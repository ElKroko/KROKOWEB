import React from 'react';

export default function VisualPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Arte Visual</h1>
      
      <div className="mb-12">
        <p className="text-xl mb-8 max-w-3xl">
          Explora mi trabajo visual que incluye diseño gráfico, ilustraciones, fotografía y proyectos creativos.
        </p>
      </div>
      
      {/* Galería de proyectos visuales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="group relative aspect-square bg-gray-200 dark:bg-gray-800 overflow-hidden rounded-lg">
            {/* Aquí irían tus imágenes reales */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">Imagen {index + 1}</span>
            </div>
            
            {/* Overlay con información */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-white">
              <h3 className="text-xl font-semibold mb-2">Proyecto {index + 1}</h3>
              <p className="text-sm text-center">Breve descripción del proyecto visual</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Categorías de trabajo visual */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Categorías</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: "Diseño Gráfico", description: "Identidad visual, branding, posters y más." },
            { title: "Ilustración", description: "Ilustraciones digitales y tradicionales." },
            { title: "Fotografía", description: "Retratos, paisajes y fotografía experimental." },
            { title: "Proyectos Multimedia", description: "Animaciones, video arte y experiencias interactivas." }
          ].map((category, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-3">{category.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{category.description}</p>
              <button className="text-blue-600 dark:text-blue-400 hover:underline">
                Ver proyectos &rarr;
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}