'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDualMode } from '@/providers/DualModeProvider';
import { useAccentColor } from '@/providers/AccentColorProvider';
import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';

interface SidebarProps {
  menuItems: {
    id: string;
    label: string;
    path: string;
    pageName: string;
  }[];
  currentPath: string;
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, currentPath }) => {
  const router = useRouter();
  const { mode, toggleMode } = useDualMode();
  const { accentColor } = useAccentColor();
  const { isAuthenticated, logout } = useAuth();
  
  const handleMenuItemClick = (path: string) => {
    router.push(path);
  };
  
  return (
    <div 
      className="fixed left-0 top-0 h-full w-56 flex flex-col z-50 px-4 py-6"
      style={{ 
        backgroundColor: 'var(--bg, #ffffff)',
        borderRight: '1px solid var(--accent-color)' 
      }}
    >
      {/* Logo - cambia según el modo actual */}
      <div className="mb-1">
        <h1 
          className="text-2xl tracking-widest font-light cursor-pointer" 
          onClick={() => router.push('/')}
          style={{ color: 'var(--text, #000000)' }}
        >
          {mode === 'kroko' ? 'kroko' : 'xklokon'}
        </h1>
      </div>
      
      {/* Toggle de modo debajo del logo */}
      <div 
        className="mb-8 cursor-pointer"
        onClick={toggleMode}
      >
        <span 
          className="text-sm tracking-[0.2em] flex items-center transition-all"
          style={{ color: 'var(--accent-color)' }}
        >
          <span className="mr-2">→</span>
          {mode === 'kroko' ? 'xklokon' : 'kroko'}
        </span>
      </div>
      
      {/* Menu items */}
      <div className="space-y-6">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path || 
                          (item.path !== '/' && currentPath.startsWith(item.path));
          
          return (
            <div 
              key={item.id}
              className="cursor-pointer"
              onClick={() => handleMenuItemClick(item.path)}
            >
              <span 
                className={`text-xl font-light tracking-widest transition-colors block ${
                  isActive ? 'text-accent-color' : 'hover:text-accent-color'
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Enlace de admin - más visible ahora */}
      <div className="mt-auto border-t border-gray-200 dark:border-gray-800 pt-4 mb-6">
        {isAuthenticated ? (
          <Link 
            href="/admin" 
            className="text-sm opacity-70 hover:opacity-100 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-all flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Admin
          </Link>
        ) : (
          <Link 
            href="/login" 
            className="text-sm opacity-70 hover:opacity-100 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-all flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Acceso
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;