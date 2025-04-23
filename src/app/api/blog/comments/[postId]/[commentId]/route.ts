import { NextRequest, NextResponse } from 'next/server';
import { deleteComment } from '@/lib/localdb/blog-service';

// DELETE /api/blog/comments/[postId]/[commentId] - Eliminar un comentario
export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string, commentId: string } }
) {
  try {
    const { postId, commentId } = params;
    
    if (!postId || !commentId) {
      return NextResponse.json(
        { error: 'Se requieren postId y commentId' },
        { status: 400 }
      );
    }
    
    deleteComment(postId, commentId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el comentario' },
      { status: 500 }
    );
  }
}