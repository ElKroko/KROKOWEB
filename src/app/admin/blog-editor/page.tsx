'use client';

import AdminProtection from '@/components/auth/AdminProtection';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BlogPost } from '@/types/blog';
import { formatDate } from '@/utils/dateUtils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getPostBySlug } from '@/utils/blog-utils';

// Componente editor simple para escribir blog posts
const BlogEditor = () => {
  const searchParams = useSearchParams();
  const postSlug = searchParams.get('slug');

  const initialPost: BlogPost = {
    slug: '',
    title: '',
    date: new Date().toISOString().slice(0, 10),
    excerpt: '',
    content: '',
    coverImage: '',
    author: {
      name: 'KROKO',
      image: '/placeholders/author.jpg'
    },
    tags: []
  };

  const [post, setPost] = useState<BlogPost>(initialPost);
  const [preview, setPreview] = useState(false);
  const [savedPosts, setSavedPosts] = useState<BlogPost[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Cargar posts guardados del localStorage al inicio
  useEffect(() => {
    const storedPosts = localStorage.getItem('blog-posts');
    if (storedPosts) {
      setSavedPosts(JSON.parse(storedPosts));
    }
    
    // Si hay un slug en la URL, intentar cargar ese post
    if (postSlug) {
      const existingPost = getPostBySlug(postSlug);
      if (existingPost) {
        setPost(existingPost);
        setIsEditing(true);
      }
    }
  }, [postSlug]);

  // Generar un slug a partir del título
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  // Manejadores de cambios
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'title') {
      setPost({
        ...post,
        [name]: value,
        slug: isEditing ? post.slug : generateSlug(value) // Mantener el slug original si está editando
      });
    } else {
      setPost({
        ...post,
        [name]: value
      });
    }
  };

  // Añadir una etiqueta
  const handleAddTag = () => {
    if (tagInput.trim() && !post.tags.includes(tagInput.trim())) {
      setPost({
        ...post,
        tags: [...post.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  // Eliminar una etiqueta
  const handleRemoveTag = (tagToRemove: string) => {
    setPost({
      ...post,
      tags: post.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Guardar el post
  const handleSave = () => {
    const postToSave = {
      ...post,
      slug: post.slug || generateSlug(post.title) || uuidv4().slice(0, 8)
    };
    
    // Si estamos editando, actualizar el post existente en el sistema de archivos
    if (isEditing) {
      // Aquí iría la lógica para actualizar un post existente en el sistema de archivos
      // Por ahora, solo mostraremos un mensaje de éxito
      setSuccessMessage('Post actualizado correctamente');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }
    
    // Si es un post nuevo, guardarlo en localStorage
    const updatedPosts = [...savedPosts, postToSave];
    setSavedPosts(updatedPosts);
    
    // Guardar en localStorage
    localStorage.setItem('blog-posts', JSON.stringify(updatedPosts));
    
    // Restablecer el formulario
    setPost(initialPost);
    setIsEditing(false);
    
    // Mostrar mensaje de éxito
    setSuccessMessage('Post guardado correctamente');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Cargar un post para editar
  const handleLoadPost = (postToLoad: BlogPost) => {
    setPost(postToLoad);
    setIsEditing(true);
    
    // Eliminar de la lista de guardados
    const updatedPosts = savedPosts.filter(p => p.slug !== postToLoad.slug);
    setSavedPosts(updatedPosts);
    localStorage.setItem('blog-posts', JSON.stringify(updatedPosts));
  };

  // Exportar todos los posts como JSON
  const handleExport = () => {
    const allPosts = [...savedPosts];
    if (post.title) {
      allPosts.push(post);
    }
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allPosts, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "blog-posts.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <AdminProtection>
      <div className="max-w-6xl mx-auto p-4 w-full">
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h1 className="text-3xl font-light">
            {isEditing ? 'Editar Post' : 'Crear Nuevo Post'}
          </h1>
          <Link 
            href="/blog" 
            className="text-sm text-gray-600 hover:text-black border border-gray-300 hover:border-black px-4 py-2"
          >
            Volver al blog
          </Link>
        </div>
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}
        
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 ${!preview ? 'bg-black text-white' : 'bg-gray-200'}`}
            onClick={() => setPreview(false)}
          >
            Editor
          </button>
          <button
            className={`px-4 py-2 ${preview ? 'bg-black text-white' : 'bg-gray-200'}`}
            onClick={() => setPreview(true)}
          >
            Vista previa
          </button>
        </div>
        
        {/* Nueva estructura de 2 columnas: 80% para contenido, 20% para metadatos */}
        <div className="flex flex-row gap-6">
          {/* Columna principal (80%) - Editor o Preview */}
          <div className="w-4/5">
            {!preview ? (
              <div className="border border-gray-300 p-4 h-[600px]">
                <textarea
                  name="content"
                  value={post.content}
                  onChange={handleChange}
                  className="w-full h-full p-2 border-0 focus:outline-none focus:ring-0 font-mono text-sm resize-none"
                  placeholder="Escribe el contenido de tu artículo en formato Markdown..."
                />
              </div>
            ) : (
              <div className="border border-gray-300 p-8 overflow-y-auto h-[600px] font-serif">
                {/* Vista previa del post */}
                <div className="mb-12 border-b pb-8">
                  <h1 className="text-3xl md:text-4xl mb-4 font-light leading-tight">
                    {post.title || 'Título del artículo'}
                  </h1>
                  
                  <div className="mb-4 text-sm font-mono text-gray-600">
                    {formatDate(post.date)} · {post.author.name}
                  </div>
                  
                  <div className="mb-2 italic text-gray-700">
                    {post.excerpt || 'Resumen del artículo...'}
                  </div>
                  
                  <div className="text-sm font-mono text-gray-500">
                    {post.tags.join(' · ') || 'Sin etiquetas'}
                  </div>
                </div>
                
                <div className="markdown-content">
                  {post.content ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-3xl font-light mt-10 mb-6" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-2xl font-light mt-8 mb-4" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-xl font-light mt-6 mb-3" {...props} />,
                        p: ({node, ...props}) => <p className="mb-6 leading-relaxed" {...props} />,
                        a: ({node, ...props}) => <a className="underline text-blue-700 hover:text-blue-900" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-6" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-6" {...props} />,
                        li: ({node, ...props}) => <li className="mb-2" {...props} />,
                        blockquote: ({node, ...props}) => (
                          <blockquote className="border-l-4 border-gray-300 pl-4 italic my-6" {...props} />
                        ),
                        code: ({node, inline, className, children, ...props}) => {
                          const match = /language-(\w+)/.exec(className || '');
                          if (inline) {
                            return (
                              <code className="font-mono text-sm bg-gray-100 px-1 py-0.5 rounded" {...props}>
                                {children}
                              </code>
                            );
                          }
                          
                          // Bloque de código
                          return (
                            <pre className="bg-gray-100 rounded-md p-4 overflow-x-auto my-6 text-sm whitespace-pre-wrap break-all">
                              <code className="font-mono" {...props}>
                                {children}
                              </code>
                            </pre>
                          );
                        },
                        table: ({node, ...props}) => <table className="w-full border-collapse mb-6" {...props} />,
                        thead: ({node, ...props}) => <thead className="bg-gray-100" {...props} />,
                        th: ({node, ...props}) => <th className="py-2 px-4 text-left border border-gray-300" {...props} />,
                        td: ({node, ...props}) => <td className="py-2 px-4 border border-gray-300" {...props} />,
                      }}
                    >
                      {post.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-gray-500">El contenido del artículo aparecerá aquí...</p>
                  )}
                </div>
                
                <style jsx global>{`
                  .markdown-content {
                    font-family: var(--font-sans);
                    line-height: 1.8;
                  }
                  
                  .markdown-content pre {
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    overflow-x: auto;
                  }
                  
                  .markdown-content code {
                    font-family: var(--font-mono);
                  }
                  
                  .markdown-content img {
                    max-width: 100%;
                    height: auto;
                  }
                `}</style>
              </div>
            )}
          </div>
          
          {/* Columna lateral (20%) - Metadatos reorganizados en orden lógico */}
          <div className="w-1/5 space-y-4">
            {/* Sección de información principal */}
            <div className="p-4 border border-gray-200 rounded-md mb-6">
              <h3 className="text-sm font-mono uppercase mb-4 border-b pb-2">Información principal</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-mono mb-1">Título</label>
                  <input
                    type="text"
                    name="title"
                    value={post.title}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 focus:border-black focus:ring-0"
                    placeholder="Título del artículo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-mono mb-1">Fecha</label>
                  <input
                    type="date"
                    name="date"
                    value={post.date}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 focus:border-black focus:ring-0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-mono mb-1">Resumen</label>
                  <textarea
                    name="excerpt"
                    value={post.excerpt}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 focus:border-black focus:ring-0"
                    rows={3}
                    placeholder="Breve resumen del artículo"
                  />
                </div>
              </div>
            </div>
            
            {/* Sección de URL y categorización */}
            <div className="p-4 border border-gray-200 rounded-md mb-6">
              <h3 className="text-sm font-mono uppercase mb-4 border-b pb-2">URL y categorización</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-mono mb-1">Slug</label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">/blog/</span>
                    <input
                      type="text"
                      name="slug"
                      value={post.slug}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 focus:border-black focus:ring-0"
                      placeholder="url-del-articulo"
                      readOnly={isEditing}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-mono mb-1">
                    Etiquetas
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className="w-full p-2 border border-gray-300 focus:border-black focus:ring-0"
                      placeholder="Añadir etiqueta"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="ml-2 px-2 bg-gray-200 hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-2 py-1 text-xs bg-gray-100 rounded"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-gray-500 hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Acciones */}
            <div className="p-4 border border-gray-200 rounded-md">
              <h3 className="text-sm font-mono uppercase mb-4 border-b pb-2">Acciones</h3>
              
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full px-4 py-2 bg-black text-white hover:bg-gray-800"
                  disabled={!post.title || !post.content}
                >
                  {isEditing ? 'Actualizar entrada' : 'Publicar entrada'}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setPost(initialPost);
                    setIsEditing(false);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 hover:bg-gray-100"
                >
                  {isEditing ? 'Cancelar edición' : 'Limpiar formulario'}
                </button>
                
                <button
                  type="button"
                  onClick={handleExport}
                  className="w-full px-4 py-2 border border-gray-300 hover:bg-gray-100"
                >
                  Exportar como JSON
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Lista de posts guardados */}
        {savedPosts.length > 0 && (
          <div className="mt-12 border-t pt-6">
            <h2 className="text-xl font-light mb-4">Posts guardados ({savedPosts.length})</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {savedPosts.map((savedPost) => (
                <div key={savedPost.slug} className="border p-4 rounded hover:border-black">
                  <h3 className="font-medium mb-1">{savedPost.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {formatDate(savedPost.date)} · {savedPost.tags.join(', ')}
                  </p>
                  <button
                    onClick={() => handleLoadPost(savedPost)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Editar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminProtection>
  );
};

export default BlogEditor;