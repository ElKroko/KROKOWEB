import React from 'react';
import { getAllPosts } from '@/utils/blog-utils';
import BlogList from '@/components/blog/BlogList';

export const metadata = {
  title: 'Blog | KROKOWEB',
  description: 'Artículos y pensamientos sobre desarrollo web, arte, música y más',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <BlogList posts={posts} />
    </main>
  );
}