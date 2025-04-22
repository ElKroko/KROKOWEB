import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { formatDate } from '@/utils/dateUtils';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="relative h-48 w-full">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-grow flex-col p-6">
        <div className="mb-2 flex items-center">
          <span className="text-sm text-gray-400">{formatDate(post.date)}</span>
          <div className="ml-auto flex gap-2">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{post.title}</h3>
        <p className="mb-4 line-clamp-3 flex-grow text-gray-700 dark:text-gray-300">{post.excerpt}</p>
        <div className="flex items-center">
          <div className="flex items-center">
            {post.author.image && (
              <div className="relative mr-2 h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src={post.author.image}
                  alt={post.author.name}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
            )}
            <span className="text-sm text-gray-700 dark:text-gray-300">{post.author.name}</span>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="ml-auto rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Leer más
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;