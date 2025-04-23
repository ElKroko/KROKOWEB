import { BlogPost, BlogComment } from '@/types/blog';

// API URLs
const API_POSTS = '/api/blog/posts';
const API_COMMENTS = '/api/blog/comments';
const API_IMAGES = '/api/blog/images';

// Funciones para los posts del blog
export const getAllBlogPosts = async (publishedOnly = true): Promise<BlogPost[]> => {
  try {
    const url = `${API_POSTS}?published=${publishedOnly}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const posts = await getAllBlogPosts(false);
    return posts.find(post => post.slug === slug) || null;
  } catch (error) {
    console.error('Error getting blog post by slug:', error);
    throw error;
  }
};

export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    const response = await fetch(`${API_POSTS}/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting blog post by ID:', error);
    throw error;
  }
};

export const createBlogPost = async (postData: Omit<BlogPost, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const response = await fetch(API_POSTS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

export const updateBlogPost = async (id: string, postData: Partial<BlogPost>): Promise<void> => {
  try {
    const response = await fetch(`${API_POSTS}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_POSTS}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};

// Funciones para los comentarios del blog
export const getCommentsForPost = async (postId: string): Promise<BlogComment[]> => {
  try {
    const response = await fetch(`${API_COMMENTS}?postId=${postId}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting comments for post:', error);
    throw error;
  }
};

export const addCommentToPost = async (comment: Omit<BlogComment, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const response = await fetch(API_COMMENTS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error adding comment to post:', error);
    throw error;
  }
};

export const deleteComment = async (postId: string, commentId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_COMMENTS}/${postId}/${commentId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// Funciones para manejar imágenes
export const uploadBlogImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(API_IMAGES, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error('Error uploading blog image:', error);
    throw error;
  }
};

export const deleteBlogImage = async (imageUrl: string): Promise<void> => {
  try {
    const response = await fetch(`${API_IMAGES}?imageUrl=${encodeURIComponent(imageUrl)}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting blog image:', error);
    throw error;
  }
};