'use client';

import AdminProtection from '@/components/auth/AdminProtection';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';

const AdminPage = () => {
  const { logout } = useAuth();

  return (
    <AdminProtection>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-light mb-2 border-b pb-2">Administración del Sitio</h1>
          <button 
            onClick={logout}
            className="px-4 py-2 text-sm text-gray-600 hover:text-black border border-gray-300 hover:border-black"
          >
            Cerrar sesión
          </button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/blog">
            <div className="p-6 border hover:border-black transition-colors cursor-pointer">
              <h2 className="text-xl font-light mb-2">Blog</h2>
              <p className="text-gray-600">
                Acceder al blog para gestionar artículos existentes o crear nuevos.
              </p>
            </div>
          </Link>
          
          {/* Podemos añadir más opciones de administración aquí en el futuro */}
        </div>
      </div>
    </AdminProtection>
  );
};

export default AdminPage;