'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface TooltipBarProps {
  defaultMessage?: string;
  className?: string;
}

const TooltipBar: React.FC<TooltipBarProps> = ({ defaultMessage = '¡Bienvenido a mi sitio web!', className = '' }) => {
  const [messages, setMessages] = useState<{text: string, timestamp: number}[]>([]);
  const [currentMessage, setCurrentMessage] = useState(defaultMessage);
  const pathname = usePathname();

  // Función para añadir un nuevo mensaje al chat
  const addMessage = (message: string) => {
    if (!message) return;
    
    // Añadir el mensaje a la lista de mensajes con un timestamp
    setMessages(prev => {
      // Si el último mensaje es igual al nuevo, no lo añadimos
      if (prev.length > 0 && prev[prev.length - 1].text === message) {
        return prev;
      }
      return [...prev, { text: message, timestamp: Date.now() }];
    });
  };

  // Cuando cambia la página, añadir mensaje según la ruta
  useEffect(() => {
    let routeMessage = defaultMessage;
    
    // Determinar mensaje según la página actual
    if (pathname === '/') {
      routeMessage = '¡Bienvenido a mi sitio web!';
    } else if (pathname.startsWith('/art')) {
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
    } else if (pathname.startsWith('/create')) {
      routeMessage = 'Proyectos creativos y experimentales';
    } else if (pathname.startsWith('/me')) {
      routeMessage = 'Sobre mí y mi trabajo';
    }
    
    // Actualizar mensaje actual
    setCurrentMessage(routeMessage);
    
    // Añadir a la lista de mensajes
    addMessage(routeMessage);
  }, [pathname, defaultMessage]);

  // Escuchar eventos de actualización de tooltip
  useEffect(() => {
    // Método para que otros componentes puedan actualizar el mensaje
    const handleCustomMessage = (event: CustomEvent) => {
      if (event.detail && event.detail.message) {
        setCurrentMessage(event.detail.message);
        addMessage(event.detail.message);
      }
    };

    // Añadir listener para eventos personalizados
    window.addEventListener('updateTooltip' as any, handleCustomMessage);
    
    return () => {
      window.removeEventListener('updateTooltip' as any, handleCustomMessage);
    };
  }, []);
  
  // Manejar actualizaciones a través del atributo data-message
  useEffect(() => {
    const tooltipBar = document.getElementById('tooltip-bar');
    if (tooltipBar) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-message') {
            const newMessage = tooltipBar.getAttribute('data-message');
            if (newMessage) {
              setCurrentMessage(newMessage);
              addMessage(newMessage);
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

  // Limitar mensajes a los últimos 5
  useEffect(() => {
    if (messages.length > 5) {
      setMessages(prev => prev.slice(-5));
    }
  }, [messages]);

  // Si no hay mensajes, no mostrar nada
  if (messages.length === 0) {
    return null;
  }

  return (
    <div 
      id="tooltip-bar"
      className={`rpg-companion ${className}`}
      data-message={currentMessage}
    >
      <div className="rpg-messages">
        {messages.map((msg, index) => (
          <div key={index} className="rpg-message">
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TooltipBar;