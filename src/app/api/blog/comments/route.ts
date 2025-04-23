import { NextRequest, NextResponse } from 'next/server';
import { getCommentsForPost, addCommentToPost } from '@/lib/localdb/blog-service';

// GET /api/blog/comments?postId=XXX - Obtener comentarios de un post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    
    if (!postId) {
      return NextResponse.json(
        { error: 'El parámetro postId es requerido' },
        { status: 400 }
      );
    }
    
    const comments = getCommentsForPost(postId);
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Error al obtener los comentarios' },
      { status: 500 }
    );
  }
}

// POST /api/blog/comments - Crear un nuevo comentario
export async function POST(request: NextRequest) {
  try {
    const commentData = await request.json();
    
    if (!commentData.postId || !commentData.author || !commentData.content) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }
    
    const id = addCommentToPost(commentData);
    
    return NextResponse.json({ id, success: true });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Error al crear el comentario' },
      { status: 500 }
    );
  }
}