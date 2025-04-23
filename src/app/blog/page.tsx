import React from 'react';
import BlogList from '@/components/blog/BlogList';

export const metadata = {
  title: 'Blog | KROKOWEB',
  description: 'Artículos, tutoriales y noticias sobre programación, trading, arte y más.',
};

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Artículos, tutoriales y noticias sobre programación, trading, arte y más.
        </p>
      </header>
      
      <BlogList />
    </div>
  );
}