import React from 'react';
import { useRouter } from 'next/navigation';
import AsciiHighlight from '@/components/ui/AsciiHighlight';
import { useDualMode } from '@/providers/DualModeProvider';

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

  const handleMenuItemClick = (path: string) => {
    router.push(path);
  };
  
  return (
    <div className="fixed left-0 top-0 h-full w-[250px] p-10 flex flex-col z-50 border-r border-border-color">
      {/* Logo - cambia según el modo actual */}
      <div className="mb-1">
        <h1 className="text-4xl tracking-widest font-light cursor-pointer" onClick={() => router.push('/')}>
          {mode === 'kroko' ? 'kroko' : 'xklokon'}
        </h1>
      </div>
      
      {/* Toggle de modo debajo del logo */}
      <div 
        className="mb-20 cursor-pointer"
        onClick={toggleMode}
      >
        <span className="text-sm tracking-[0.2em] flex items-center text-accent-color hover:opacity-80 transition-all">
          <span className="mr-2">→</span>
          {mode === 'kroko' ? 'xklokon' : 'kroko'}
        </span>
      </div>
      
      {/* Menu items */}
      <div className="space-y-12 flex-1">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path || 
                          (item.path !== '/' && currentPath.startsWith(item.path));
          
          return (
            <div 
              key={item.id}
              className="cursor-pointer"
              onClick={() => handleMenuItemClick(item.path)}
            >
              <AsciiHighlight 
                accentColor="var(--accent-color)"
                font={mode === 'xklokon' ? 'Slant' : 'Standard'}
              >
                <span 
                  className={`text-4xl tracking-widest font-light transition-colors block ${
                    isActive ? 'text-accent-color' : 'hover:text-accent-color'
                  }`}
                >
                  {item.label}
                </span>
              </AsciiHighlight>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;