'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getBlogPostBySlug, getCommentsForPost } from '@/lib/blog-service';
import { BlogPost, BlogComment } from '@/types/blog';
import CommentSection from './CommentSection';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

const BlogPostDetail: React.FC = () => {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        if (!slug) {
          setError('Post no encontrado');
          setLoading(false);
          return;
        }

        const fetchedPost = await getBlogPostBySlug(slug);
        
        if (!fetchedPost) {
          setError('Post no encontrado');
          setLoading(false);
          return;
        }
        
        setPost(fetchedPost);
        
        // Ahora que tenemos el post, cargamos los comentarios
        if (fetchedPost.id) {
          const fetchedComments = await getCommentsForPost(fetchedPost.id);
          setComments(fetchedComments);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('No fue posible cargar el post. Intenta de nuevo más tarde.');
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [slug]);

  const formatDate = (date: Date | string | number) => {
    if (typeof date === 'string' || typeof date === 'number') {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else if (date instanceof Date) {
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return 'Fecha desconocida';
  };

  if (loading) {
    return <div className="py-10 text-center">Cargando post...</div>;
  }

  if (error || !post) {
    return <div className="py-10 text-center text-red-500">{error}</div>;
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center text-zinc-400 mb-6">
          <div>Por {post.author}</div>
          <div className="mx-2">•</div>
          <div>{formatDate(post.createdAt)}</div>
        </div>
        
        {post.imageUrl && (
          <div className="w-full h-64 md:h-96 overflow-hidden rounded-lg mb-8">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </header>
      
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
        >
          {post.content}
        </ReactMarkdown>
      </div>
      
      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 pt-4 border-t border-zinc-700">
          <h3 className="text-lg font-semibold mb-2">Etiquetas:</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span 
                key={index}
                className="bg-zinc-800 text-zinc-200 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {post.id && (
        <CommentSection 
          postId={post.id} 
          comments={comments} 
          setComments={setComments} 
        />
      )}
    </article>
  );
};

export default BlogPostDetail;