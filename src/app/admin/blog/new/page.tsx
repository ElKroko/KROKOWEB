import React from 'react';
import BlogForm from '@/components/admin/BlogForm';

export const metadata = {
  title: 'Crear Nuevo Post | Admin Blog | KROKOWEB',
  description: 'Crea un nuevo post para el blog',
};

export default function NewBlogPostPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BlogForm />
    </div>
  );
}