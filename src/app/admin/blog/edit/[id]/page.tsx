'use client';

import React from 'react';
import BlogForm from '@/components/admin/BlogForm';
import { useParams } from 'next/navigation';

export default function EditBlogPostPage() {
  const params = useParams();
  const postId = params?.id as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <BlogForm postId={postId} />
    </div>
  );
}