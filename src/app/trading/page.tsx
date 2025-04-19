import React from 'react';

export default function TradingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Trading</h1>
      
      <div className="mb-12">
        <p className="text-xl max-w-3xl">
          Explora mi enfoque de trading, análisis de mercados, estrategias y portafolio.
        </p>
      </div>
      
      {/* Secciones de Trading */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        <section className="border border-gray-200 dark:border-gray-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Mi Enfoque</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Aquí puedes describir tu filosofía de trading, timeframes preferidos, 
            mercados en los que operas (cripto, forex, acciones, etc.) y tu estilo 
            general (scalping, swing, position, etc.).
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            También puedes compartir tu journey como trader, lecciones aprendidas
            y cómo has desarrollado tu estrategia actual.
          </p>
        </section>
        
        <section className="border border-gray-200 dark:border-gray-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Análisis y Estrategias</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Detalla tus metodologías de análisis (técnico, fundamental, sentimiento) y 
            las estrategias que has desarrollado o que utilizas regularmente.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Análisis Técnico (patrones, indicadores, etc.)</li>
            <li>Análisis Fundamental</li>
            <li>Gestión de Riesgo</li>
            <li>Psicología del Trading</li>
          </ul>
        </section>
      </div>
      
      {/* Dashboard Ejemplo */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <p className="text-center text-gray-500 dark:text-gray-400 py-16">
            Aquí podrías integrar gráficos, datos de mercado o un portfolio tracker.
          </p>
        </div>
      </section>
      
      {/* Recursos y Educación */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Recursos Recomendados</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              category: "Libros",
              items: [
                "Trading in the Zone - Mark Douglas",
                "Technical Analysis of Financial Markets - John Murphy",
                "The Intelligent Investor - Benjamin Graham"
              ]
            },
            {
              category: "Herramientas",
              items: [
                "TradingView",
                "MetaTrader",
                "Excel/Google Sheets Templates",
                "Aplicaciones de Noticias Financieras"
              ]
            },
            {
              category: "Formación",
              items: [
                "Cursos recomendados",
                "Canales de YouTube",
                "Comunidades de trading",
                "Newsletters financieras"
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