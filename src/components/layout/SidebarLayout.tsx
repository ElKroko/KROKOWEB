'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import TopMusicPlayer from '@/components/layout/TopMusicPlayer';
import { useMusic } from '@/providers/MusicProvider';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

// Función para obtener el nombre de la página actual desde la ruta
const getPageNameFromPath = (path: string): string => {
  // Eliminar la barra inicial y cualquier subruta
  const mainPath = path.split('/')[1];
  return mainPath || 'home';
};

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const pathname = usePathname() || ''; // Asegurar que pathname sea siempre string
  const { tracks, currentTrackIndex } = useMusic();
  
  // Define menu items that will appear in the sidebar
  const menuItems = [
    { 
      id: 'code', 
      label: 'CODE', 
      path: '/programming',
      pageName: 'programming'
    },
    { 
      id: 'trade', 
      label: 'TRADE', 
      path: '/trading',
      pageName: 'trading'
    },
    { 
      id: 'art', 
      label: 'ART', 
      path: '/art',
      pageName: 'art'
    },
    { 
      id: 'blog', 
      label: 'BLOG', 
      path: '/blog',
      pageName: 'blog'
    },
    { 
      id: 'create', 
      label: 'CREATE', 
      path: '/create',
      pageName: 'create'
    },
    { 
      id: 'me', 
      label: 'ME', 
      path: '/me',
      pageName: 'me'
    },
    { 
      id: 'contact', 
      label: 'CONTACT', 
      path: '/contact',
      pageName: 'contact'
    }
  ];

  // Set the data-page attribute based on the current route
  useEffect(() => {
    const pageName = getPageNameFromPath(pathname);
    document.documentElement.setAttribute('data-section', pageName);
    
    // También aplicar al body para mayor compatibilidad
    document.body.setAttribute('data-section', pageName);
  }, [pathname]);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar containing the logo and menu */}
      <Sidebar 
        menuItems={menuItems} 
        currentPath={pathname}
      />
      
      {/* Reproductor de música en la parte superior */}
      <TopMusicPlayer 
        tracks={tracks} 
        initialTrackIndex={currentTrackIndex} 
      />
      
      {/* Main content area with left margin to accommodate the sidebar and top margin for the player */}
      <main className="flex-1 ml-56 pt-12 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default SidebarLayout;