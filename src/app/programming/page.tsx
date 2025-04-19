import React from 'react';
import GitHubProfileSection from '@/components/github/GitHubProfileSection';

export default function ProgrammingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Programación</h1>
      
      <div className="mb-12">
        <p className="text-xl max-w-3xl">
          Explora mis proyectos de desarrollo web, aplicaciones y soluciones tecnológicas.
        </p>
      </div>
      
      {/* GitHub Profile Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Mi Presencia en GitHub</h2>
        <GitHubProfileSection username="ElKroko" />
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