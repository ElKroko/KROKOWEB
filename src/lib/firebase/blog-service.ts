import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db, storage } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { BlogPost, BlogComment } from '@/types/blog';
import { v4 as uuidv4 } from 'uuid';

const POSTS_COLLECTION = 'blog_posts';
const COMMENTS_COLLECTION = 'blog_comments';

// Funciones para los posts del blog
export const getAllBlogPosts = async (publishedOnly = true): Promise<BlogPost[]> => {
  try {
    let q;
    if (publishedOnly) {
      q = query(
        collection(db, POSTS_COLLECTION),
        where('published', '==', true),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, POSTS_COLLECTION),
        orderBy('createdAt', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BlogPost[];
  } catch (error) {
    console.error('Error getting blog posts:', error);
    throw error;
  }
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const q = query(
      collection(db, POSTS_COLLECTION),
      where('slug', '==', slug),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as BlogPost;
  } catch (error) {
    console.error('Error getting blog post by slug:', error);
    throw error;
  }
};

export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    const docRef = doc(db, POSTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as BlogPost;
  } catch (error) {
    console.error('Error getting blog post by ID:', error);
    throw error;
  }
};

export const createBlogPost = async (postData: Omit<BlogPost, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const post = {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, POSTS_COLLECTION), post);
    return docRef.id;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

export const updateBlogPost = async (id: string, postData: Partial<BlogPost>): Promise<void> => {
  try {
    const docRef = doc(db, POSTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...postData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, POSTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};

// Funciones para subir imágenes del blog
export const uploadBlogImage = async (file: File): Promise<string> => {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const storageRef = ref(storage, `blog_images/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading blog image:', error);
    throw error;
  }
};

export const deleteBlogImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extraer la ruta de la imagen de la URL
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting blog image:', error);
    throw error;
  }
};

// Funciones para los comentarios del blog
export const getCommentsForPost = async (postId: string): Promise<BlogComment[]> => {
  try {
    const q = query(
      collection(db, COMMENTS_COLLECTION),
      where('postId', '==', postId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BlogComment[];
  } catch (error) {
    console.error('Error getting comments for post:', error);
    throw error;
  }
};

export const addCommentToPost = async (comment: Omit<BlogComment, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const commentData = {
      ...comment,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), commentData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding comment to post:', error);
    throw error;
  }
};

export const deleteComment = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COMMENTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};