'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Comprobar si el usuario está autenticado (token en localStorage)
    const checkAuth = async () => {
      try {
        // Este código se ejecuta solo en el cliente
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          
          if (!token) {
            // No hay token, redirigir a login
            router.push('/admin/login');
            return;
          }
          
          // Verificar el token con el servidor
          const response = await fetch('/api/auth/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });
          
          const data = await response.json();
          
          if (data.authenticated) {
            setAuthenticated(true);
            setUser(data.user);
          } else {
            // Token inválido, eliminarlo y redirigir
            localStorage.removeItem('auth_token');
            router.push('/admin/login');
          }
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      // Simplemente eliminar el token del localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      
      router.push('/admin/login');
    } catch (err) {
      console.error('Error logging out:', err);
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

  if (!authenticated) {
    return null; // No renderizar nada mientras se redirecciona
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <header className="bg-zinc-800 border-b border-zinc-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">KROKOWEB Admin</h1>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <a 
                    href="/admin/blog" 
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      pathname?.startsWith('/admin/blog') 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-zinc-700'
                    }`}
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="py-6">
        {children}
      </main>
    </div>
  );
}