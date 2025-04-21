import React from 'react';

export default function ContactPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Contacto</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <p className="text-xl mb-6">
            ¿Interesado en colaborar o saber más sobre mis proyectos? 
            No dudes en contactarme a través del formulario o mis redes sociales.
          </p>
          
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Conéctate conmigo</h2>
            <div className="space-y-3">
              {[
                { platform: "Email", handle: "contacto@kroko.cl", href: "mailto:contacto@kroko.cl" },
                { platform: "Twitter", handle: "@kryptokroks", href: "https://x.com/kryptokroks" },
                { platform: "Instagram", handle: "@kroko.cl", href: "https://www.instagram.com/kroko.cl/" },
                { platform: "LinkedIn", handle: "Vicente Perelli-Tassara", href: "https://www.linkedin.com/in/vicente-perelli-tassara-0b74991b5/" },
                { platform: "GitHub", handle: "ElKroko", href: "https://github.com/ElKroko/" },
                { platform: "SoundCloud", handle: "xklokon", href: "https://soundcloud.com/xklokon" }
              ].map((social, index) => (
                <div key={index} className="flex items-center">
                  <span className="font-medium w-24">{social.platform}:</span>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                    {social.handle}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">Envíame un mensaje</h2>
          
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                placeholder="Tu nombre"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                placeholder="tu@email.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block mb-2 text-sm font-medium">
                Asunto
              </label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                placeholder="Asunto del mensaje"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block mb-2 text-sm font-medium">
                Mensaje
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                placeholder="Tu mensaje aquí..."
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}