'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useDualMode } from '@/providers/DualModeProvider';
import { useAccentColor } from '@/providers/AccentColorProvider';
import { getRouteMessage } from '@/constants/systemMessages';
import { getResponseMessage } from '@/constants/responseMessages';

interface Message {
  id: string;
  text: string;
  sender: 'system' | 'user';
  timestamp: number;
  hover?: boolean;
}

interface SidebarChatProps {
  defaultMessage?: string;
  className?: string;
}

// Tiempo de vida de cada mensaje en milisegundos (ej. 60s)
const MESSAGE_LIFETIME = 60_000;
// Intervalo para depurar mensajes caducados (ej. cada 5s)
const CLEANUP_INTERVAL = 5_000;
// Intervalo para narraciones aleatorias (ej. cada 30s)
const NARRATION_INTERVAL = 30_000;

const SidebarChat: React.FC<SidebarChatProps> = ({
  defaultMessage = '¡Bienvenido a mi sitio web!',
  className = ''
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const { mode } = useDualMode();
  const { accentColor } = useAccentColor();
  const prevPathRef = useRef(pathname);

  // Lista de frases de narrador aleatorias
  const narrationMessages = [
    'lol',
    '¿qué estaba haciendo?',
    'ZUMBIDO',
    'sas',
    'toc toc'
  ];

  // Contador interno para IDs únicos si no hay crypto.randomUUID
  const idCounterRef = useRef(0);
  const generateId = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    const id = `${Date.now()}-${idCounterRef.current}`;
    idCounterRef.current += 1;
    return id;
  };

  // Añade un mensaje y recorta a 15 entradas
  const addMessage = (
    text: string,
    sender: 'system' | 'user',
    isHover: boolean = false
  ) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newMessage: Message = {
      id: generateId(),
      text: trimmed,
      sender,
      timestamp: Date.now(),
      hover: isHover,
    };

    setMessages(prev => {
      const next = [...prev, newMessage];
      return next.length > 15 ? next.slice(-15) : next;
    });
  };

  // Autoscroll al mensaje más reciente
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mensaje de sistema al cambiar de ruta
  useEffect(() => {
    const routeMessage = getRouteMessage(pathname, defaultMessage);
    if (prevPathRef.current !== pathname) {
      addMessage(routeMessage, 'system');
    }
    prevPathRef.current = pathname;
  }, [pathname, defaultMessage]);

  // Eventos personalizados y hover
  useEffect(() => {
    const handleCustom = (e: CustomEvent) => {
      if (e.detail?.message) addMessage(e.detail.message, 'system');
    };
    const handleHover = (e: CustomEvent) => {
      const m = e.detail?.message;
      if (m && messages[messages.length - 1]?.text !== m) {
        addMessage(m, 'system', true);
      }
    };

    window.addEventListener('chatMessage' as any, handleCustom);
    window.addEventListener('elementHover' as any, handleHover);
    return () => {
      window.removeEventListener('chatMessage' as any, handleCustom);
      window.removeEventListener('elementHover' as any, handleHover);
    };
  }, [messages]);

  // Narraciones aleatorias periódicas
  useEffect(() => {
    const interval = setInterval(() => {
      const index = Math.floor(Math.random() * narrationMessages.length);
      addMessage(narrationMessages[index], 'system');
    }, NARRATION_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Limpieza periódica de mensajes caducados
  useEffect(() => {
    const interval = setInterval(() => {
      setMessages(prev =>
        prev.filter(msg => Date.now() - msg.timestamp < MESSAGE_LIFETIME)
      );
    }, CLEANUP_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Envío de mensaje de usuario y respuesta
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    addMessage(inputValue, 'user');
    setInputValue('');

    const response = getResponseMessage(inputValue);
    addMessage(response, 'system');
  };

  return (
    <div
      className={`minimal-chat ${isChatOpen ? 'chat-open' : 'chat-closed'} ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="chat-header">
        <span className="chat-title">Chat</span>
        <button
          className="chat-toggle"
          onClick={e => { e.stopPropagation(); setIsChatOpen(prev => !prev); }}
          style={{ color: accentColor }}
        >
          {isChatOpen ? '−' : '+'}
        </button>
      </div>

      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className="chat-message">
            {msg.sender === 'system' ? (
              <span style={{ color: msg.hover ? accentColor : 'var(--text-color)' }}>
                [{mode === 'kroko' ? 'kroko' : 'xklokon'}]: {msg.text}
              </span>
            ) : (
              <span style={{ color: 'var(--text-color)' }}>
                [tú]: {msg.text}
              </span>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {isChatOpen && (
        <form className="chat-input-form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="chat-input"
            style={{ borderColor: `${accentColor}40` }}
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="chat-send-button"
            style={{ color: accentColor }}
          >
            →
          </button>
        </form>
      )}
    </div>
  );
};

export default SidebarChat;
