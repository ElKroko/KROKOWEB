'use client';

import React, { useState } from 'react';
import { addCommentToPost } from '@/lib/blog-service';
import { BlogComment } from '@/types/blog';

interface CommentSectionProps {
  postId: string;
  comments: BlogComment[];
  setComments: React.Dispatch<React.SetStateAction<BlogComment[]>>;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, comments, setComments }) => {
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!author.trim() || !content.trim()) {
      setError('Por favor completa todos los campos requeridos.');
      setIsSubmitting(false);
      return;
    }

    try {
      const newComment: Omit<BlogComment, 'id' | 'createdAt'> = {
        postId,
        author: author.trim(),
        content: content.trim(),
        email: email.trim() || undefined
      };

      const commentId = await addCommentToPost(newComment);
      
      // Añadir el comentario al estado local para mostrar inmediatamente
      setComments(prevComments => [
        {
          id: commentId,
          ...newComment,
          createdAt: new Date()
        },
        ...prevComments
      ]);

      // Limpiar el formulario
      setAuthor('');
      setEmail('');
      setContent('');
      setSuccess('Comentario añadido correctamente');
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('No fue posible añadir tu comentario. Intenta de nuevo más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <section className="mt-12 pt-8 border-t border-zinc-700">
      <h2 className="text-2xl font-bold mb-6">Comentarios ({comments.length})</h2>
      
      {/* Lista de comentarios */}
      {comments.length > 0 ? (
        <div className="space-y-6 mb-10">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-zinc-800/50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold">{comment.author}</div>
                <div className="text-sm text-zinc-400">{formatDate(comment.createdAt)}</div>
              </div>
              <p className="text-zinc-300">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-zinc-400 mb-8">No hay comentarios aún. ¡Sé el primero en comentar!</p>
      )}
      
      {/* Formulario para añadir comentarios */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Añadir un comentario</h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-900/50 text-green-200 rounded-lg">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="author" className="block text-sm font-medium mb-1">
                Nombre *
              </label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email (opcional)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Comentario *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70"
            >
              {isSubmitting ? 'Enviando...' : 'Publicar comentario'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CommentSection;