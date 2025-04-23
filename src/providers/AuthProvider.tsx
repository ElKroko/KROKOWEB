'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Comprobar si el usuario está autenticado al cargar
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Función de login simple
  const login = async (username: string, password: string): Promise<boolean> => {
    // En producción, deberías validar estas credenciales con un backend
    // Aquí simplemente usamos unas credenciales hardcodeadas para demostración
    if (username === 'kroko' && password === 'secret-password') {
      // Guardar un token simple en localStorage
      localStorage.setItem('auth_token', 'authenticated');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // Función de logout
  const logout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};