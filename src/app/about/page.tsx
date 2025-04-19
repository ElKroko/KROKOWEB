import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Sobre Mí</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-4xl">
        <p className="lead text-xl mb-6">
          Soy un creador multidisciplinario apasionado por la música, el arte visual, la programación, 
          el trading y el desarrollo personal a través de EMED (Educación, Meditación, Ejercicio y Dieta).
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Mi Historia</h2>
        <p>
          Aquí puedes compartir tu historia personal, formación, trayectoria y cómo has llegado a 
          desarrollar tus diversas pasiones y habilidades.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Filosofía</h2>
        <p>
          Describe tu filosofía personal, valores, y cómo integras tus diferentes áreas de interés
          en un todo coherente y creativo.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Visión</h2>
        <p>
          Comparte tu visión a futuro, qué esperas lograr con tus proyectos, y cómo buscas
          impactar positivamente a través de tu trabajo.
        </p>
      </div>
    </div>
  );
}