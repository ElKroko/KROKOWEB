import React from 'react';
import { FaGithub, FaStar } from 'react-icons/fa';
import { BiGitRepoForked } from 'react-icons/bi';

interface GitHubRepoProps {
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language?: string;
  languageColor?: string;
}

const GitHubRepository: React.FC<GitHubRepoProps> = ({
  name,
  description,
  url,
  stars,
  forks,
  language,
  languageColor = '#f1e05a' // Default to JavaScript yellow
}) => {
  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/30 hover:bg-gray-800/50 transition-all">
      <div className="flex items-center mb-2">
        <FaGithub className="mr-2 text-primary-light" size={20} />
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary-light hover:underline font-medium truncate"
        >
          {name}
        </a>
      </div>
      
      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
        {description || 'Sin descripción disponible'}
      </p>
      
      <div className="flex flex-wrap items-center text-xs text-gray-400 gap-3">
        {language && (
          <div className="flex items-center">
            <span 
              className="w-3 h-3 rounded-full mr-1" 
              style={{ backgroundColor: languageColor }}
            />
            <span>{language}</span>
          </div>
        )}
        <div className="flex items-center">
          <FaStar className="mr-1" />
          <span>{stars}</span>
        </div>
        <div className="flex items-center">
          <BiGitRepoForked className="mr-1" />
          <span>{forks}</span>
        </div>
      </div>
    </div>
  );
};

export default GitHubRepository;