'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  createBlogPost, 
  getBlogPostById, 
  updateBlogPost, 
  uploadBlogImage 
} from '@/lib/blog-service';
import { BlogPost } from '@/types/blog';
import { v4 as uuidv4 } from 'uuid';

interface BlogFormProps {
  postId?: string;
}

const BlogForm: React.FC<BlogFormProps> = ({ postId }) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [published, setPublished] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Función para generar un slug a partir del título
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Remover guiones duplicados
      .trim();
  };

  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        setIsLoading(true);
        try {
          const post = await getBlogPostById(postId);
          if (post) {
            setTitle(post.title);
            setSlug(post.slug);
            setAuthor(post.author);
            setContent(post.content);
            setSummary(post.summary || '');
            setImageUrl(post.imageUrl || '');
            setTags(post.tags?.join(', ') || '');
            setPublished(post.published);
            if (post.imageUrl) {
              setImagePreview(post.imageUrl);
            }
          } else {
            setError('Post no encontrado');
          }
        } catch (err) {
          console.error('Error fetching post:', err);
          setError('Error al cargar el post');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchPost();
    }
  }, [postId]);

  // Actualizar el slug cuando el título cambia, solo si es un post nuevo o el slug no ha sido modificado manualmente
  useEffect(() => {
    if (!postId || slug === generateSlug(title.substring(0, slug.length))) {
      setSlug(generateSlug(title));
    }
  }, [title, postId, slug]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImageFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent, saveAsDraft: boolean = false) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      let finalImageUrl = imageUrl;
      
      // Si hay una imagen nueva, subirla primero
      if (imageFile) {
        finalImageUrl = await uploadBlogImage(imageFile);
      }
      
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      const postData: Omit<BlogPost, 'id' | 'createdAt'> = {
        title: title.trim(),
        slug: slug.trim(),
        author: author.trim(),
        content: content.trim(),
        summary: summary.trim() || undefined,
        imageUrl: finalImageUrl || undefined,
        tags: tagArray.length > 0 ? tagArray : undefined,
        published: saveAsDraft ? false : published
      };
      
      if (postId) {
        // Actualizar post existente
        await updateBlogPost(postId, postData);
      } else {
        // Crear nuevo post
        await createBlogPost(postData);
      }
      
      // Redirigir al panel de administración
      router.push('/admin/blog');
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Error al guardar el post. Intenta de nuevo más tarde.');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-10 text-center">Cargando...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {postId ? 'Editar Post' : 'Nuevo Post'}
      </h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-900/50 text-red-200 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Título *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            required
          />
        </div>
        
        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-1">
            Slug *
          </label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => setSlug(generateSlug(e.target.value))}
            className="w-full px-4 py-2 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            required
          />
          <p className="text-xs text-zinc-400 mt-1">
            URL del post: /blog/{slug}
          </p>
        </div>
        
        <div>
          <label htmlFor="author" className="block text-sm font-medium mb-1">
            Autor *
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
          <label htmlFor="summary" className="block text-sm font-medium mb-1">
            Resumen
          </label>
          <input
            type="text"
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Contenido *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            className="w-full px-4 py-2 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition font-mono"
            required
          />
          <p className="text-xs text-zinc-400 mt-1">
            Soporta formato Markdown
          </p>
        </div>
        
        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-1">
            Etiquetas
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
          />
          <p className="text-xs text-zinc-400 mt-1">
            Separadas por comas (ej: programación, javascript, react)
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-3">
            Imagen de portada
          </label>
          
          {imagePreview && (
            <div className="mb-4">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full max-w-md h-48 object-cover rounded-lg"
              />
            </div>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
          >
            {imageUrl ? 'Cambiar imagen' : 'Subir imagen'}
          </button>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-5 w-5 rounded bg-zinc-800 border-zinc-700 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="published" className="ml-2 text-sm font-medium">
            Publicar post
          </label>
        </div>
        
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            className="px-5 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-lg transition-colors"
          >
            Cancelar
          </button>
          
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSaving}
            className="px-5 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70"
          >
            {isSaving ? 'Guardando...' : 'Guardar como borrador'}
          </button>
          
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70"
          >
            {isSaving ? 'Guardando...' : (postId ? 'Actualizar post' : 'Publicar post')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;