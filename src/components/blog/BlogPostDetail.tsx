import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { formatDate } from '@/utils/dateUtils';
import Markdown from 'react-markdown';

interface BlogPostDetailProps {
  post: BlogPost;
}

const BlogPostDetail = ({ post }: BlogPostDetailProps) => {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Cabecera del post */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          {post.title}
        </h1>
        
        <div className="flex items-center mb-6">
          {post.author.image && (
            <div className="relative h-10 w-10 mr-4 overflow-hidden rounded-full">
              <Image
                src={post.author.image}
                alt={post.author.name}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
          )}
          
          <div>
            <p className="font-medium">{post.author.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(post.date)}
            </p>
          </div>
        </div>
        
        {post.coverImage && (
          <div className="relative w-full h-[400px] mb-8 overflow-hidden rounded-lg">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority
            />
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <Link 
              key={tag}
              href={`/blog/tag/${tag.toLowerCase()}`}
            >
              <span className="inline-block px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                {tag}
              </span>
            </Link>
          ))}
        </div>
      </header>
      
      {/* Contenido del post */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <Markdown>{post.content}</Markdown>
      </div>
      
      {/* Navegación y acciones */}
      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
        <Link
          href="/blog"
          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Volver al blog
        </Link>
      </div>
    </article>
  );
};

export default BlogPostDetail;