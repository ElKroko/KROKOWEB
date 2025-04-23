import fs from 'fs';
import path from 'path';
import { BlogPost, BlogComment } from '@/types/blog';
import { v4 as uuidv4 } from 'uuid';

// Rutas para los archivos de datos
const POSTS_DIR = path.join(process.cwd(), 'src/data/blog/posts');
const COMMENTS_DIR = path.join(process.cwd(), 'src/data/blog/comments');
const IMAGES_DIR = path.join(process.cwd(), 'public/images/blog');

// Asegurar que los directorios existan
if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
}

if (!fs.existsSync(COMMENTS_DIR)) {
  fs.mkdirSync(COMMENTS_DIR, { recursive: true });
}

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Funciones auxiliares
const readAllPosts = (): BlogPost[] => {
  // Leer todos los archivos en el directorio de posts
  const fileNames = fs.readdirSync(POSTS_DIR);
  const allPosts = fileNames.map((fileName) => {
    const fullPath = path.join(POSTS_DIR, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents) as BlogPost;
  });

  // Ordenar los posts por fecha de creación descendente
  return allPosts.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });
};

// Funciones para los posts del blog
export const getAllBlogPosts = (publishedOnly = true): BlogPost[] => {
  try {
    const allPosts = readAllPosts();
    
    if (publishedOnly) {
      return allPosts.filter(post => post.published);
    }
    
    return allPosts;
  } catch (error) {
    console.error('Error getting blog posts:', error);
    return [];
  }
};

export const getBlogPostBySlug = (slug: string): BlogPost | null => {
  try {
    const allPosts = readAllPosts();
    return allPosts.find(post => post.slug === slug) || null;
  } catch (error) {
    console.error('Error getting blog post by slug:', error);
    return null;
  }
};

export const getBlogPostById = (id: string): BlogPost | null => {
  try {
    const filePath = path.join(POSTS_DIR, `${id}.json`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents) as BlogPost;
  } catch (error) {
    console.error('Error getting blog post by ID:', error);
    return null;
  }
};

export const createBlogPost = (postData: Omit<BlogPost, 'id' | 'createdAt'>): string => {
  try {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const post: BlogPost = {
      id,
      ...postData,
      createdAt: now,
      updatedAt: now
    };
    
    const filePath = path.join(POSTS_DIR, `${id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(post, null, 2), 'utf8');
    
    return id;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

export const updateBlogPost = (id: string, postData: Partial<BlogPost>): void => {
  try {
    const filePath = path.join(POSTS_DIR, `${id}.json`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Post with ID ${id} not found`);
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const existingPost = JSON.parse(fileContents) as BlogPost;
    
    const updatedPost: BlogPost = {
      ...existingPost,
      ...postData,
      id, // Asegurar que el ID no cambie
      updatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(filePath, JSON.stringify(updatedPost, null, 2), 'utf8');
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
};

export const deleteBlogPost = (id: string): void => {
  try {
    const filePath = path.join(POSTS_DIR, `${id}.json`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Post with ID ${id} not found`);
    }
    
    // Eliminar el archivo
    fs.unlinkSync(filePath);
    
    // También eliminar comentarios asociados
    const commentsPath = path.join(COMMENTS_DIR, id);
    if (fs.existsSync(commentsPath)) {
      const commentFiles = fs.readdirSync(commentsPath);
      commentFiles.forEach((file) => {
        fs.unlinkSync(path.join(commentsPath, file));
      });
      fs.rmdirSync(commentsPath);
    }
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};

// Funciones para los comentarios del blog
export const getCommentsForPost = (postId: string): BlogComment[] => {
  try {
    const commentsPath = path.join(COMMENTS_DIR, postId);
    
    if (!fs.existsSync(commentsPath)) {
      fs.mkdirSync(commentsPath, { recursive: true });
      return [];
    }
    
    const fileNames = fs.readdirSync(commentsPath);
    const comments = fileNames.map((fileName) => {
      const fullPath = path.join(commentsPath, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(fileContents) as BlogComment;
    });
    
    // Ordenar los comentarios por fecha de creación descendente
    return comments.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error getting comments for post:', error);
    return [];
  }
};

export const addCommentToPost = (comment: Omit<BlogComment, 'id' | 'createdAt'>): string => {
  try {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const newComment: BlogComment = {
      id,
      ...comment,
      createdAt: now
    };
    
    const commentsPath = path.join(COMMENTS_DIR, comment.postId);
    
    if (!fs.existsSync(commentsPath)) {
      fs.mkdirSync(commentsPath, { recursive: true });
    }
    
    const filePath = path.join(commentsPath, `${id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(newComment, null, 2), 'utf8');
    
    return id;
  } catch (error) {
    console.error('Error adding comment to post:', error);
    throw error;
  }
};

export const deleteComment = (postId: string, commentId: string): void => {
  try {
    const filePath = path.join(COMMENTS_DIR, postId, `${commentId}.json`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Comment with ID ${commentId} not found`);
    }
    
    // Eliminar el archivo
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// Nota: Las siguientes funciones necesitarán ser implementadas a través de API Routes
// ya que involucran operaciones del servidor como manejo de archivos

// Placeholder para uploadBlogImage - será implementado a través de API Route
export const uploadBlogImage = async (file: File): Promise<string> => {
  throw new Error('This function must be called from an API route');
};

// Placeholder para deleteBlogImage - será implementado a través de API Route
export const deleteBlogImage = async (imageUrl: string): Promise<void> => {
  throw new Error('This function must be called from an API route');
};