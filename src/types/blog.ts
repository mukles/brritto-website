export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedDate: string;
  readTime: string;
  image: string;
  slug: string;
  featured?: boolean;
  content?: string;
  tags?: { id: number; name: string; slug: string }[];
}

export interface BlogListProps {
  posts: BlogPost[];
  className?: string;
}
