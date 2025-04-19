'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import TooltipBar from '@/components/ui/TooltipBar';
import { useDualMode } from '@/providers/DualModeProvider';

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
  const { mode } = useDualMode();
  const pathname = usePathname();
  
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
      
      {/* Main content area with left margin to accommodate the sidebar */}
      <main className="flex-1 ml-[250px] min-h-screen">
        {children}
      </main>
      
      {/* Tooltip bar at the bottom of the page */}
      <TooltipBar />
    </div>
  );
};

export default SidebarLayout;