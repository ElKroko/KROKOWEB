'use client';

import React, { useState, useEffect } from 'react';
import { getAllBlogPosts, deleteBlogPost } from '@/lib/blog-service';
import { BlogPost } from '@/types/blog';
import Link from 'next/link';

const AdminBlogPanel: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteInProgress, setDeleteInProgress] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Obtener todos los posts, incluyendo los no publicados
        const fetchedPosts = await getAllBlogPosts(false);
        setPosts(fetchedPosts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('No fue posible cargar los posts. Intenta de nuevo más tarde.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este post? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setDeleteInProgress(id);
      await deleteBlogPost(id);
      setPosts(prev => prev.filter(post => post.id !== id));
      setDeleteInProgress(null);
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('No fue posible eliminar el post. Intenta de nuevo más tarde.');
      setDeleteInProgress(null);
    }
  };

  if (loading) {
    return <div className="py-10 text-center">Cargando posts...</div>;
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Posts del Blog</h2>
        <Link 
          href="/admin/blog/new" 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Nuevo Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-8 bg-zinc-800/50 rounded-lg">
          <p>No hay posts disponibles. ¡Crea tu primer post!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-zinc-800/50 rounded-lg overflow-hidden">
            <thead className="bg-zinc-700">
              <tr>
                <th className="py-3 px-4 text-left">Título</th>
                <th className="py-3 px-4 text-left">Autor</th>
                <th className="py-3 px-4 text-left">Fecha</th>
                <th className="py-3 px-4 text-left">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-t border-zinc-700 hover:bg-zinc-700/50">
                  <td className="py-3 px-4">{post.title}</td>
                  <td className="py-3 px-4">{post.author}</td>
                  <td className="py-3 px-4">
                    {typeof post.createdAt === 'string' || typeof post.createdAt === 'number'
                      ? new Date(post.createdAt).toLocaleDateString()
                      : post.createdAt instanceof Date
                        ? post.createdAt.toLocaleDateString()
                        : 'Fecha desconocida'}
                  </td>
                  <td className="py-3 px-4">
                    <span 
                      className={`inline-block px-2 py-1 rounded-full text-xs ${
                        post.published 
                          ? 'bg-green-900/60 text-green-200' 
                          : 'bg-yellow-900/60 text-yellow-200'
                      }`}
                    >
                      {post.published ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-2">
                      <Link 
                        href={`/blog/${post.slug}`} 
                        className="px-3 py-1 bg-zinc-600 hover:bg-zinc-500 text-white rounded transition-colors"
                        target="_blank"
                      >
                        Ver
                      </Link>
                      <Link 
                        href={`/admin/blog/edit/${post.id}`} 
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
                      >
                        Editar
                      </Link>
                      <button 
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded transition-colors disabled:opacity-50"
                        onClick={() => post.id && handleDelete(post.id)}
                        disabled={deleteInProgress === post.id}
                      >
                        {deleteInProgress === post.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBlogPanel;