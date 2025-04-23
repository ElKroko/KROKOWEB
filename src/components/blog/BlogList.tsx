'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllBlogPosts } from '@/lib/blog-service';
import { BlogPost } from '@/types/blog';

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getAllBlogPosts();
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

  if (loading) {
    return <div className="py-10 text-center">Cargando posts...</div>;
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">{error}</div>;
  }

  if (posts.length === 0) {
    return <div className="py-10 text-center">No hay posts disponibles actualmente.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link
          href={`/blog/${post.slug}`}
          key={post.id}
          className="block bg-zinc-800/50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300 hover:transform hover:-translate-y-1"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2 text-white">{post.title}</h2>
            {post.imageUrl && (
              <div className="mb-4 h-48 overflow-hidden rounded">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <p className="text-zinc-300 mb-4 line-clamp-3">
              {post.summary || (post.content.length > 150 
                ? `${post.content.substring(0, 150)}...` 
                : post.content)}
            </p>
            <div className="flex justify-between items-center text-sm text-zinc-400">
              <span>{post.author}</span>
              <span>
                {typeof post.createdAt === 'string' || typeof post.createdAt === 'number'
                  ? new Date(post.createdAt).toLocaleDateString()
                  : post.createdAt instanceof Date
                    ? post.createdAt.toLocaleDateString()
                    : 'Fecha desconocida'}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BlogList;