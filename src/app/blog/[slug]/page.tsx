import React from 'react';
import { getBlogPostBySlug } from '@/lib/blog-service';
import BlogPostDetail from '@/components/blog/BlogPostDetail';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: { slug: string }
};

// Generación de metadatos dinámicos
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post no encontrado | KROKOWEB',
      description: 'El post que estás buscando no existe o ha sido eliminado.'
    };
  }
  
  return {
    title: `${post.title} | Blog | KROKOWEB`,
    description: post.summary || post.content.substring(0, 160)
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPostBySlug(params.slug);
  
  // Si el post no existe o no está publicado, mostrar página 404
  if (!post || !post.published) {
    notFound();
  }
  
  return <BlogPostDetail />;
}