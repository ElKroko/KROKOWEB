export interface Author {
  name: string;
  image?: string;
  bio?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: Author;
  tags: string[];
  featured?: boolean;
}