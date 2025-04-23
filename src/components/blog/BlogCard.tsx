'use client';

import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { formatDate } from '@/utils/dateUtils';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <article className="border-b border-gray-200 dark:border-gray-800 py-6 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900">
      <div className="mb-1">
        <span className="text-sm font-mono text-gray-500 dark:text-gray-400">{formatDate(post.date)}</span>
        {post.tags.length > 0 && (
          <span className="mx-2 text-gray-400">·</span>
        )}
        <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
          {post.tags.join(', ')}
        </span>
      </div>
      
      <h3 className="text-xl font-serif mb-3 text-gray-900 dark:text-white">
        <Link href={`/blog/${post.slug}`} className="hover:underline">
          {post.title}
        </Link>
      </h3>
      
      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {post.excerpt}
      </p>
      
      <div className="flex items-center">
        <span className="text-sm text-gray-700 dark:text-gray-300">{post.author.name}</span>
        <Link
          href={`/blog/${post.slug}`}
          className="ml-auto text-sm font-mono underline text-gray-900 dark:text-gray-100"
        >
          Leer más →
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;