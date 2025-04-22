import React from 'react';
import { useRouter } from 'next/navigation';
import AsciiHighlight from '@/components/ui/AsciiHighlight';
import { useDualMode } from '@/providers/DualModeProvider';
import { useAccentColor } from '@/providers/AccentColorProvider';
import SidebarChat from '@/components/ui/SidebarChat';

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
      
      {/* Chat integrado en el resto del espacio del sidebar */}
      <div className="mt-auto flex-1 flex flex-col min-h-[200px]">
        <SidebarChat />
      </div>
    </div>
  );
};

export default Sidebar;