import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllBlogPosts, 
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
} from '@/lib/localdb/blog-service';

// GET /api/blog/posts - Obtener todos los posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get('published') !== 'false'; // Por defecto, solo posts publicados
    
    const posts = getAllBlogPosts(publishedOnly);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Error al obtener los posts del blog' },
      { status: 500 }
    );
  }
}

// POST /api/blog/posts - Crear un nuevo post
export async function POST(request: NextRequest) {
  try {
    const postData = await request.json();
    
    if (!postData.title || !postData.content || !postData.author || !postData.slug) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }
    
    const id = createBlogPost(postData);
    
    return NextResponse.json({ id, success: true });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Error al crear el post' },
      { status: 500 }
    );
  }
}