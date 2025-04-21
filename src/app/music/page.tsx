import React from 'react';

export default function MusicPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Música</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Estos son ejemplos de proyectos musicales que podrías mostrar */}
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="aspect-video bg-gray-200 dark:bg-gray-800">
              {/* Aquí podrías poner una imagen o reproductor */}
            </div>
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-2">Proyecto Musical {item}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Descripción breve del proyecto musical, estilo, fecha de lanzamiento, etc.
              </p>
              <button className="text-blue-600 dark:text-blue-400 hover:underline">
                Escuchar &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-6">Discografía</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-3xl">
          Aquí puedes listar tus lanzamientos musicales, álbumes, EPs, singles o colaboraciones.
        </p>
        
        {/* Lista de lanzamientos */}
        <div className="space-y-4">
          {[2023, 2022, 2021].map((year) => (
            <div key={year} className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="text-xl font-semibold mb-3">{year}</h3>
              <div className="pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                <div className="mb-4">
                  <h4 className="font-medium">Nombre del Lanzamiento</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tipo: Álbum/EP/Single</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}