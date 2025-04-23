'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';

const BlogHeader = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative h-16 mb-8">
      <h1 className="text-4xl font-bold absolute left-0 top-0">Blog</h1>
      
      {/* Botón fuera de los márgenes del contenido principal, en la esquina superior derecha */}
      {isAuthenticated && (
        <Link 
          href="/admin/blog-editor" 
          className="fixed right-12 top-12 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors text-sm"
        >
          Crear nuevo post
        </Link>
      )}
    </div>
  );
};

export default BlogHeader;