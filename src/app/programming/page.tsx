import React from 'react';

export default function ProgrammingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Programación</h1>
      
      <div className="mb-12">
        <p className="text-xl max-w-3xl">
          Explora mis proyectos de desarrollo web, aplicaciones y soluciones tecnológicas.
        </p>
      </div>
      
      {/* Proyectos Destacados */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Proyectos Destacados</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Proyecto 1",
              description: "Descripción del proyecto, tecnologías utilizadas y funcionalidades principales.",
              tech: ["React", "Node.js", "MongoDB"]
            },
            {
              title: "Proyecto 2",
              description: "Descripción del proyecto, tecnologías utilizadas y funcionalidades principales.",
              tech: ["TypeScript", "Next.js", "Tailwind CSS"]
            },
            {
              title: "Proyecto 3",
              description: "Descripción del proyecto, tecnologías utilizadas y funcionalidades principales.",
              tech: ["Python", "Django", "PostgreSQL"]
            },
            {
              title: "Proyecto 4",
              description: "Descripción del proyecto, tecnologías utilizadas y funcionalidades principales.",
              tech: ["Vue.js", "Firebase", "Vuetify"]
            }
          ].map((project, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-3">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
              
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button className="text-blue-600 dark:text-blue-400 hover:underline">
                  Ver Demo
                </button>
                <button className="text-blue-600 dark:text-blue-400 hover:underline">
                  Código Fuente
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Habilidades Técnicas */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Habilidades Técnicas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              category: "Frontend",
              skills: ["HTML/CSS", "JavaScript", "React", "Vue.js", "TypeScript", "Tailwind CSS"]
            },
            {
              category: "Backend",
              skills: ["Node.js", "Express", "Python", "Django", "PHP", "SQL"]
            },
            {
              category: "Herramientas & Otros",
              skills: ["Git", "Docker", "AWS", "Firebase", "Figma", "Responsive Design"]
            }
          ].map((category, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">{category.category}</h3>
              <ul className="space-y-2">
                {category.skills.map((skill, i) => (
                  <li key={i} className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}