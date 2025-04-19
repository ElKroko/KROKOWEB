"use client";
import React, { useEffect, useState } from 'react';
import GitHubCalendar from 'react-github-calendar';
import GitHubRepository from './GitHubRepository';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { fetchGitHubData } from '@/lib/github';
import Image from 'next/image';
import { FaGithub, FaUsers, FaUser, FaCode, FaTrophy } from 'react-icons/fa';

interface GitHubProfileSectionProps {
  username: string;
}

const GitHubProfileSection: React.FC<GitHubProfileSectionProps> = ({ username }) => {
  const [githubData, setGithubData] = useState<{
    profile: {
      avatarUrl: string;
      name: string;
      bio: string;
      followers: number;
      following: number;
      publicRepos: number;
      achievements?: string[];
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
      achievements: []
    },
    repositories: []
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGitHubData() {
      try {
        setIsLoading(true);
        const data = await fetchGitHubData(username);
        setGithubData(data);
      } catch (error) {
        console.error('Error loading GitHub data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadGitHubData();
  }, [username]);

  return (
    <div className="space-y-8">
      {/* Perfil de GitHub */}
      <div className="card p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* Avatar y estadísticas */}
          <div className="flex flex-col items-center">
            {isLoading ? (
              <div className="w-32 h-32 rounded-full bg-gray-800/50 animate-pulse"></div>
            ) : githubData.profile.avatarUrl ? (
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700">
                <Image 
                  src={githubData.profile.avatarUrl} 
                  alt={`${username} GitHub avatar`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-full"
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-800/50 flex items-center justify-center">
                <FaGithub size={48} className="text-gray-500" />
              </div>
            )}
            
            <div className="mt-4 flex flex-col items-center">
              <h3 className="text-xl font-bold">
                {isLoading ? 'Cargando...' : githubData.profile.name}
              </h3>
              <a 
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-light hover:underline text-sm flex items-center"
              >
                <FaGithub className="mr-1" />
                @{username}
              </a>
            </div>
          </div>
          
          {/* Bio y estadísticas */}
          <div className="flex-1 space-y-4">
            <p className="text-gray-300">
              {isLoading ? 
                <span className="bg-gray-800/50 animate-pulse block h-4 w-full rounded"></span>
                : githubData.profile.bio
              }
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              <div className="bg-gray-800/30 p-3 rounded-lg flex items-center">
                <FaUsers className="mr-2 text-primary-light" />
                <div>
                  <div className="text-sm text-gray-400">Seguidores</div>
                  <div className="font-bold">{isLoading ? '-' : githubData.profile.followers}</div>
                </div>
              </div>
              <div className="bg-gray-800/30 p-3 rounded-lg flex items-center">
                <FaUser className="mr-2 text-primary-light" />
                <div>
                  <div className="text-sm text-gray-400">Siguiendo</div>
                  <div className="font-bold">{isLoading ? '-' : githubData.profile.following}</div>
                </div>
              </div>
              <div className="bg-gray-800/30 p-3 rounded-lg flex items-center">
                <FaCode className="mr-2 text-primary-light" />
                <div>
                  <div className="text-sm text-gray-400">Repositorios</div>
                  <div className="font-bold">{isLoading ? '-' : githubData.profile.publicRepos}</div>
                </div>
              </div>
            </div>
            
            {/* Logros */}
            {!isLoading && githubData.profile.achievements && githubData.profile.achievements.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-sm flex items-center mb-2">
                  <FaTrophy className="mr-2 text-yellow-500" />
                  Logros
                </h4>
                <div className="flex flex-wrap gap-2">
                  {githubData.profile.achievements.map((achievement, index) => (
                    <span key={index} className="bg-gray-800/50 text-xs py-1 px-2 rounded-full">
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Sección de actividad */}
      <div className="card p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Actividad en GitHub</h3>
        <div className="bg-gray-800/50 p-4 rounded-lg overflow-hidden">
          <GitHubCalendar 
            username={username}
            blockSize={12}
            blockMargin={4}
            fontSize={12}
            colorScheme="dark"
            labels={{
              totalCount: "{{count}} contribuciones en el último año"
            }}
          />
        </div>
        
        <div className="mt-4 text-gray-300 text-sm">
          <p>Contribuciones recientes a proyectos open source y repositorios personales.</p>
        </div>
      </div>
      
      {/* Sección de repositorios */}
      <div className="card p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Repositorios Destacados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            // Estado de carga
            <>
              <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/30 animate-pulse h-32"></div>
              <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/30 animate-pulse h-32"></div>
              <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/30 animate-pulse h-32"></div>
              <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/30 animate-pulse h-32"></div>
            </>
          ) : githubData.repositories.length > 0 ? (
            // Mostrar repositorios
            githubData.repositories.map((repo, index) => (
              <GitHubRepository
                key={index}
                name={repo.name}
                description={repo.description}
                url={repo.url}
                stars={repo.stars}
                forks={repo.forks}
                language={repo.language}
                languageColor={repo.languageColor}
              />
            ))
          ) : (
            // Fallback si no hay repositorios
            <div className="col-span-2 text-center py-8 text-gray-400">
              No se pudieron cargar los repositorios
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center">
          <Link href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" size="sm">
              Ver todos los repositorios
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GitHubProfileSection;