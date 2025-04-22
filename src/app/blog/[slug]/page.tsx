import { getPostBySlug } from '@/utils/blog-utils';
import { notFound } from 'next/navigation';
import BlogPostDetail from '@/components/blog/BlogPostDetail';

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post no encontrado',
      description: 'El post que estás buscando no existe'
    };
  }
  
  return {
    title: `${post.title} | KROKOWEB Blog`,
    description: post.excerpt,
  };
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <main className="container mx-auto px-4 py-12">
      <BlogPostDetail post={post} />
    </main>
  );
}