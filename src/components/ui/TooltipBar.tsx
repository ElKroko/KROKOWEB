'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface TooltipBarProps {
  defaultMessage?: string;
  className?: string;
}

const TooltipBar: React.FC<TooltipBarProps> = ({ defaultMessage = '¡Bienvenido a mi sitio web!', className = '' }) => {
  const [message, setMessage] = useState(defaultMessage);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  // Configurar mensajes predeterminados según la ruta actual
  useEffect(() => {
    let routeMessage = defaultMessage;
    
    // Determinar mensaje según la página actual
    if (pathname.startsWith('/visual')) {
      routeMessage = 'Aquí encuentras mi arte <3';
    } else if (pathname.startsWith('/programming')) {
      routeMessage = 'Explora mis proyectos de programación';
    } else if (pathname.startsWith('/trading')) {
      routeMessage = 'Analíticos y gráficos de trading';
    } else if (pathname.startsWith('/gallery')) {
      routeMessage = 'Mi colección de creaciones';
    } else if (pathname.startsWith('/about')) {
      routeMessage = 'Conoce más sobre mí y mi trabajo';
    } else if (pathname.startsWith('/contact')) {
      routeMessage = '¡Contáctame!';
    } else if (pathname.startsWith('/music')) {
      routeMessage = 'Escucha mis tracks favoritos';
    } else if (pathname.startsWith('/emed')) {
      routeMessage = 'Proyectos especiales';
    } else if (pathname.startsWith('/create')) {
      routeMessage = 'Proyectos creativos y experimentales';
    } else if (pathname.startsWith('/me')) {
      routeMessage = 'Sobre mí y mi trabajo';
    }
    
    setMessage(routeMessage);
  }, [pathname, defaultMessage]);

  // Función para actualizar el mensaje desde componentes externos
  useEffect(() => {
    // Método para que otros componentes puedan actualizar el mensaje
    const handleCustomMessage = (event: CustomEvent) => {
      if (event.detail && event.detail.message) {
        setMessage(event.detail.message);
        setIsVisible(true);
      }
    };

    // Añadir listener para eventos personalizados
    window.addEventListener('updateTooltip' as any, handleCustomMessage);
    
    return () => {
      window.removeEventListener('updateTooltip' as any, handleCustomMessage);
    };
  }, []);
  
  // Mostrar/ocultar tooltip con atributos de datos
  useEffect(() => {
    const tooltipBar = document.getElementById('tooltip-bar');
    if (tooltipBar) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-message') {
            const newMessage = tooltipBar.getAttribute('data-message');
            if (newMessage) {
              setMessage(newMessage);
            }
          }
        });
      });
      
      observer.observe(tooltipBar, { attributes: true });
      
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <div 
      id="tooltip-bar"
      className={`sidebar-tooltip ${isVisible ? 'has-message' : ''} ${className}`}
    >
      <span className="tooltip-message">{message}</span>
    </div>
  );
};

export default TooltipBar;