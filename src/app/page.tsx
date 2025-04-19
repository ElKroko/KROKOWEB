'use client';

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Placeholder from "@/components/ui/Placeholder";
import { FaGithub, FaSoundcloud, FaTwitter, FaInstagram, FaLinkedin, FaStar, FaUsers, FaCode, FaTrophy } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { BiGitRepoForked } from "react-icons/bi";
import GitHubCalendar from 'react-github-calendar';
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchGitHubData } from "@/lib/github";

export default function Home() {
  const [githubData, setGithubData] = useState<{
    profile: {
      avatarUrl: string;
      name: string;
      bio: string;
      followers: number;
      following: number;
      publicRepos: number;
      achievements?: string[];
      contributionHistory?: Record<number, number>;
    };
    repositories: Array<{
      name: string;
      description: string;
      url: string;
      stars: number;
      forks: number;
      language: string;
      languageColor: string;
    }>;
  }>({
    profile: {
      avatarUrl: '',
      name: '',
      bio: '',
      followers: 0,
      following: 0,
      publicRepos: 0,
      achievements: [],
      contributionHistory: {}
    },
    repositories: []
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGitHubData() {
      try {
        setIsLoading(true);
        const data = await fetchGitHubData('ElKroko');
        setGithubData(data);
      } catch (error) {
        console.error('Error loading GitHub data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadGitHubData();
  }, []);

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
    },
    { 
      title: "Galería Inmersiva", 
      path: "/gallery", 
      description: "Experiencia audiovisual interactiva con arte y música." 
    }
  ];

  const socialLinks = [
    { name: "GitHub", icon: <FaGithub size={24} />, url: "https://github.com/ElKroko/" },
    { name: "SoundCloud", icon: <FaSoundcloud size={24} />, url: "https://soundcloud.com/xklokon" },
    { name: "Twitter", icon: <FaTwitter size={24} />, url: "https://x.com/kryptokroks" },
    { name: "Instagram", icon: <FaInstagram size={24} />, url: "https://www.instagram.com/kroko.cl/" },
    { name: "LinkedIn", icon: <FaLinkedin size={24} />, url: "https://www.linkedin.com/in/vicente-perelli-tassara-0b74991b5/" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-dark-text">
      <main className="flex-1 flex flex-col items-center w-full">
        {/* Hero Section */}
        <section className="w-full py-20 px-4 gradient-bg text-white">
          <div className="container-custom flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-5xl sm:text-7xl font-bold">Kroko</h1>
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
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/752140432&color=%237C3AED&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
                className="w-full"
                title="SoundCloud Player"
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
              {/* Fila con Actividad de GitHub y Perfil */}
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                {/* Actividad de GitHub - Columna izquierda */}
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold mb-3">Actividad en GitHub</h3>
                  <div className="bg-gray-800/50 p-4 rounded-lg overflow-hidden">
                    <GitHubCalendar 
                      username="ElKroko" 
                      blockSize={10}
                      blockMargin={4}
                      fontSize={12}
                      colorScheme="dark"
                      hideColorLegend
                      year={2025} // Mostrar solo el año 2025
                      labels={{
                        totalCount: "{{count}} contribuciones en 2025"
                      }}
                    />
                    
                    {/* Resumen de años anteriores */}
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <h4 className="text-sm font-medium mb-3 text-gray-300">Resumen de actividad histórica</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[2024, 2023, 2022, 2021].map(year => (
                          <div key={year} className="bg-gray-800/30 p-2 rounded-lg text-center">
                            <div className="text-xs text-gray-400">{year}</div>
                            <div className="font-bold">
                              {isLoading ? (
                                <span className="animate-pulse">...</span>
                              ) : (
                                <span>{githubData.profile?.contributionHistory?.[year] || 0}</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-400">contribuciones</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Perfil resumen - Columna derecha */}
                <div className="md:w-1/3 bg-gray-800/30 rounded-lg p-4">
                  <div className="flex flex-col items-center">
                    {isLoading ? (
                      <div className="w-24 h-24 rounded-full bg-gray-800/50 animate-pulse"></div>
                    ) : githubData.profile?.avatarUrl ? (
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-700">
                        <Image 
                          src={githubData.profile.avatarUrl} 
                          alt="GitHub avatar"
                          fill
                          style={{ objectFit: 'cover' }}
                          className="rounded-full"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-800/50 flex items-center justify-center">
                        <FaGithub size={36} className="text-gray-500" />
                      </div>
                    )}
                    
                    <div className="mt-2 flex flex-col items-center">
                      <h4 className="font-bold text-lg mt-2">
                        {isLoading ? 'Cargando...' : githubData.profile?.name || '@ElKroko'}
                      </h4>
                      <a 
                        href="https://github.com/ElKroko"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-light hover:underline text-sm flex items-center mt-1"
                      >
                        <FaGithub className="mr-1" />
                        @ElKroko
                      </a>
                    </div>
                    
                    {/* Estadísticas */}
                    <div className="grid grid-cols-2 gap-3 w-full mt-4">
                      <div className="bg-gray-800/50 p-2 rounded-lg flex items-center justify-center">
                        <FaUsers className="mr-2 text-primary-light" size={14} />
                        <div>
                          <div className="text-xs text-gray-400">Seguidores</div>
                          <div className="font-bold text-center">{isLoading ? '-' : githubData.profile?.followers}</div>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 p-2 rounded-lg flex items-center justify-center">
                        <FaCode className="mr-2 text-primary-light" size={14} />
                        <div>
                          <div className="text-xs text-gray-400">Repos</div>
                          <div className="font-bold text-center">{isLoading ? '-' : githubData.profile?.publicRepos}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Logros */}
                    {!isLoading && githubData.profile?.achievements && githubData.profile.achievements.length > 0 && (
                      <div className="mt-4 w-full">
                        <h4 className="font-semibold text-sm flex items-center mb-2 justify-center">
                          <FaTrophy className="mr-2 text-yellow-500" />
                          Logros
                        </h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {githubData.profile.achievements.slice(0, 2).map((achievement, index) => (
                            <span key={index} className="bg-gray-800/50 text-xs py-1 px-2 rounded-full">
                              {achievement}
                            </span>
                          ))}
                          {githubData.profile.achievements.length > 2 && (
                            <span className="bg-gray-800/50 text-xs py-1 px-2 rounded-full">
                              +{githubData.profile.achievements.length - 2} más
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Repositorios destacados - 4 en lugar de 2 */}
              <div>
                <h3 className="text-xl font-bold mb-3">Repositorios Destacados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {isLoading ? (
                    // Estado de carga para 4 repositorios
                    <>
                      <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/30 animate-pulse h-32"></div>
                      <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/30 animate-pulse h-32"></div>
                      <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/30 animate-pulse h-32"></div>
                      <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/30 animate-pulse h-32"></div>
                    </>
                  ) : githubData.repositories.length > 0 ? (
                    // Mostrar hasta 4 repositorios
                    githubData.repositories.slice(0, 4).map((repo, index) => (
                      <div key={index} className="border border-gray-700 rounded-lg p-4 bg-gray-800/30 hover:bg-gray-800/50 transition-all">
                        <div className="flex items-center mb-2">
                          <FaGithub className="mr-2 text-primary-light" size={20} />
                          <a 
                            href={repo.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-primary-light hover:underline font-medium truncate"
                          >
                            {repo.name}
                          </a>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                          {repo.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center text-xs text-gray-400 gap-3">
                          {repo.language && (
                            <div className="flex items-center">
                              <span 
                                className="w-3 h-3 rounded-full mr-1" 
                                style={{ backgroundColor: repo.languageColor }}
                              />
                              <span>{repo.language}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <FaStar className="mr-1" />
                            <span>{repo.stars}</span>
                          </div>
                          <div className="flex items-center">
                            <BiGitRepoForked className="mr-1" />
                            <span>{repo.forks}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Fallback si no hay repositorios
                    <div className="col-span-2 text-center py-8 text-gray-400">
                      No se pudieron cargar los repositorios
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <Link href="/programming">
                    <Button variant="secondary" size="sm">
                      Ver todos mis proyectos
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
                    width={500} 
                    height={500} 
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
    </div>
  );
}