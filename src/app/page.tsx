import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Placeholder from "@/components/ui/Placeholder";
import { FaGithub, FaSoundcloud, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

export default function Home() {
  const sections = [
    { 
      title: "Música", 
      path: "/music", 
      description: "Mis composiciones, proyectos musicales y sonidos." 
    },
    { 
      title: "Arte Visual", 
      path: "/visual", 
      description: "Diseño gráfico, ilustraciones y trabajos visuales." 
    },
    { 
      title: "Programación", 
      path: "/programming", 
      description: "Desarrollo web, aplicaciones y soluciones tecnológicas." 
    },
    { 
      title: "Trading", 
      path: "/trading", 
      description: "Análisis de mercados, estrategias y portafolio." 
    },
    { 
      title: "EMED", 
      path: "/emed", 
      description: "Educación, meditación, ejercicio y dieta." 
    },
    { 
      title: "Sobre Mí", 
      path: "/about", 
      description: "Conoce más sobre mi historia y trayectoria." 
    }
  ];

  const socialLinks = [
    { name: "GitHub", icon: <FaGithub size={24} />, url: "https://github.com/yourusername" },
    { name: "SoundCloud", icon: <FaSoundcloud size={24} />, url: "https://soundcloud.com/yourusername" },
    { name: "Twitter", icon: <FaTwitter size={24} />, url: "https://twitter.com/yourusername" },
    { name: "Instagram", icon: <FaInstagram size={24} />, url: "https://instagram.com/yourusername" },
    { name: "LinkedIn", icon: <FaLinkedin size={24} />, url: "https://linkedin.com/in/yourusername" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-dark-text">
      <main className="flex-1 flex flex-col items-center w-full">
        {/* Hero Section */}
        <section className="w-full py-20 px-4 gradient-bg text-white">
          <div className="container-custom flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-5xl sm:text-7xl font-bold">KROKOWEB</h1>
              <p className="text-xl">
                Creador multidisciplinario enfocado en música, arte visual, programación, trading y desarrollo personal. 
                Construyendo puentes entre la tecnología y la creatividad.
              </p>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link, i) => (
                  <a 
                    key={i} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all"
                    aria-label={link.name}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-white/20">
                <Placeholder 
                  width={256} 
                  height={256} 
                  text="Foto de Perfil" 
                  bgColor="#374151" 
                  style={{objectFit: "cover"}}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Música Section */}
        <section className="w-full section-padding bg-dark-bg">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8 flex items-center">
              <span className="mr-2">Música</span>
              <Link href="/music" className="text-sm text-primary-light flex items-center">
                <span className="mr-1">Ver todo</span>
                <FiExternalLink />
              </Link>
            </h2>
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
              <iframe 
                width="100%" 
                height="300" 
                scrolling="no" 
                frameBorder="no" 
                allow="autoplay" 
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/xklokon&color=%237C3AED&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
                className="w-full"
              ></iframe>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-3">Último Lanzamiento</h3>
                <p className="mb-4 text-gray-300">Descripción breve de tu música más reciente y lo que significa para ti.</p>
                <Link href="/music/latest">
                  <Button variant="primary">Escuchar ahora</Button>
                </Link>
              </div>
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-3">Proyectos Musicales</h3>
                <p className="mb-4 text-gray-300">Colaboraciones, bandas y otros proyectos en los que participas.</p>
                <Link href="/music/projects">
                  <Button variant="outline">Explorar proyectos</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Programación Section */}
        <section className="w-full section-padding bg-dark-bg/80">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8 flex items-center">
              <span className="mr-2">Programación</span>
              <Link href="/programming" className="text-sm text-primary-light flex items-center">
                <span className="mr-1">Ver todo</span>
                <FiExternalLink />
              </Link>
            </h2>
            <div className="card p-6 shadow-lg">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Placeholder 
                  width="100%" 
                  height={200} 
                  text="GitHub Stats"
                  bgColor="#1E2A3B" 
                  className="w-full md:w-1/2 rounded-lg"
                />
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Mis Proyectos Destacados</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <FaGithub className="mr-2 text-primary-light" /> 
                      <a href="https://github.com/yourusername/project1" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:underline">
                        project1 - Descripción corta
                      </a>
                    </li>
                    <li className="flex items-center">
                      <FaGithub className="mr-2 text-primary-light" /> 
                      <a href="https://github.com/yourusername/project2" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:underline">
                        project2 - Descripción corta
                      </a>
                    </li>
                    <li className="flex items-center">
                      <FaGithub className="mr-2 text-primary-light" /> 
                      <a href="https://github.com/yourusername/project3" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:underline">
                        project3 - Descripción corta
                      </a>
                    </li>
                  </ul>
                  <Link href="/programming">
                    <Button variant="secondary" size="sm">
                      Ver más proyectos
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Arte Visual Section */}
        <section className="w-full section-padding bg-dark-bg">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8 flex items-center">
              <span className="mr-2">Arte Visual</span>
              <Link href="/visual" className="text-sm text-primary-light flex items-center">
                <span className="mr-1">Ver todo</span>
                <FiExternalLink />
              </Link>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                  <Placeholder 
                    width="100%" 
                    height="100%" 
                    text={`Artwork ${item}`}
                    bgColor="#2D3748" 
                    textColor="#A0AEC0"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/visual">
                <Button variant="outline">Ver galería completa</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Secciones del sitio */}
        <section className="w-full section-padding bg-dark-bg/80">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8 text-center">Explora KROKOWEB</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sections.map((section, index) => (
                <Card 
                  key={index}
                  title={section.title}
                  description={section.description}
                >
                  <Link href={section.path}>
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      Explorar &rarr;
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center border-t border-gray-700 bg-dark-bg">
        <div className="container-custom">
          <div className="mb-6 flex justify-center gap-6">
            {socialLinks.map((link, i) => (
              <a 
                key={i} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary-light transition-colors"
                aria-label={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
          <div className="mb-4">
            <Link href="/contact">
              <Button variant="secondary" size="sm">
                Contacto
              </Button>
            </Link>
          </div>
          <p className="text-gray-300 text-sm">© {new Date().getFullYear()} KROKOWEB - Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
}