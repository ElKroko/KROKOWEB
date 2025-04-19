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
    <div className="fixed left-0 top-0 h-full w-[250px] p-10 flex flex-col z-10 border-r border-border-color">
      {/* Logo */}
      <div className="mb-24">
        <h1 className="text-4xl tracking-widest font-light cursor-pointer" onClick={() => router.push('/')}>
          kroko
        </h1>
        <p 
          className="text-sm tracking-[0.2em] mt-1 cursor-pointer hover:text-accent-color"
          onClick={toggleMode}
        >
          {mode === 'kroko' ? 'XKLOKON' : 'KROKO'}
        </p>
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