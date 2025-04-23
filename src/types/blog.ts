export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author: string;
  content: string;
  summary?: string;
  imageUrl?: string;
  tags?: string[];
  published: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface BlogComment {
  id: string;
  postId: string;
  author: string;
  content: string;
  email?: string;
  createdAt: string | Date;
}