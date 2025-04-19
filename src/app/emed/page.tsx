import React from 'react';

export default function EmedPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">EMED</h1>
      
      <div className="mb-12">
        <p className="text-xl max-w-3xl">
          Educación, Meditación, Ejercicio y Dieta: Mi enfoque integral para el desarrollo personal y el bienestar.
        </p>
      </div>
      
      {/* Secciones EMED */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <section className="border border-gray-200 dark:border-gray-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Educación</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Comparto mi filosofía sobre el aprendizaje continuo, educación autodidacta
            y desarrollo de habilidades a lo largo de la vida.
          </p>
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Áreas de Enfoque:</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Aprendizaje de nuevas tecnologías</li>
              <li>Educación financiera</li>
              <li>Desarrollo creativo</li>
              <li>Estudio de idiomas</li>
            </ul>
          </div>
        </section>
        
        <section className="border border-gray-200 dark:border-gray-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Meditación</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Exploro prácticas de mindfulness, meditación y técnicas para cultivar
            la atención plena y el equilibrio mental.
          </p>
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Prácticas:</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Meditación guiada</li>
              <li>Mindfulness diario</li>
              <li>Ejercicios de respiración</li>
              <li>Journaling y reflexión</li>
            </ul>
          </div>
        </section>
        
        <section className="border border-gray-200 dark:border-gray-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Ejercicio</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Mi rutina de actividad física, entrenamiento y movimiento para mantener
            la salud física y mental.
          </p>
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Actividades:</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Entrenamiento de fuerza</li>
              <li>Cardio y resistencia</li>
              <li>Yoga y flexibilidad</li>
              <li>Deportes y actividades recreativas</li>
            </ul>
          </div>
        </section>
        
        <section className="border border-gray-200 dark:border-gray-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Dieta</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Mi enfoque nutricional, hábitos alimenticios y filosofía sobre
            la alimentación consciente.
          </p>
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Principios:</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Alimentación basada en alimentos reales</li>
              <li>Equilibrio y moderación</li>
              <li>Hidratación adecuada</li>
              <li>Suplementación inteligente</li>
            </ul>
          </div>
        </section>
      </div>
      
      {/* Recursos Recomendados */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Recursos EMED Recomendados</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {[
            {
              category: "Libros",
              items: [
                "Mindfulness in Plain English",
                "Atomic Habits",
                "How to Learn Anything",
                "In Defense of Food"
              ]
            },
            {
              category: "Apps",
              items: [
                "Headspace",
                "Duolingo",
                "Fitbod",
                "Cronometer"
              ]
            },
            {
              category: "Canales y Podcasts",
              items: [
                "The Tim Ferriss Show",
                "Huberman Lab",
                "Ten Percent Happier",
                "The Rich Roll Podcast"
              ]
            },
            {
              category: "Cursos",
              items: [
                "Learning How to Learn",
                "The Science of Well-Being",
                "Yoga with Adriene",
                "Nutrition Fundamentals"
              ]
            }
          ].map((resource, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">{resource.category}</h3>
              <ul className="space-y-2">
                {resource.items.map((item, i) => (
                  <li key={i} className="text-gray-600 dark:text-gray-300">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}