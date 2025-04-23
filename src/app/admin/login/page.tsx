'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Comprobar si el usuario ya está autenticado (token en localStorage)
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      // Verificar el token con el servidor
      const checkToken = async () => {
        try {
          const response = await fetch('/api/auth/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });
          
          const data = await response.json();
          
          if (data.authenticated) {
            // Si está autenticado, redirigir al panel de administración
            router.push('/admin/blog');
          } else {
            // Token inválido, eliminarlo
            localStorage.removeItem('auth_token');
            setLoading(false);
          }
        } catch (err) {
          console.error('Error checking session:', err);
          localStorage.removeItem('auth_token');
          setLoading(false);
        }
      };
      
      checkToken();
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    console.log('Intentando iniciar sesión con:', email);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      console.log('Respuesta de login:', data);
      
      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión. Verifica tus credenciales e intenta de nuevo.');
        setIsSubmitting(false);
        return;
      }
      
      // Guardar token en localStorage
      localStorage.setItem('auth_token', data.token);
      console.log('Token guardado en localStorage');
      
      // Redirigir al panel de administración
      router.push('/admin/blog');
    } catch (err: any) {
      console.error('Error signing in:', err);
      setError('Error al iniciar sesión. Verifica tus credenciales e intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 bg-zinc-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Acceso a Administración</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-700 rounded-lg border border-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-700 rounded-lg border border-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70"
            >
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center text-sm text-zinc-400">
          <p>
            Este es un área protegida. Solo para administradores autorizados.
          </p>
          <p className="mt-2">
            Usuario por defecto: admin@example.com<br/>
            Contraseña: admin123
          </p>
        </div>
      </div>
    </div>
  );
}