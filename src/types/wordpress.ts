export interface WPRendered {
  rendered: string;
  protected?: boolean;
}

export interface WPMedia {
  id: number;
  source_url: string;
  alt_text: string;
}

export interface WPAuthor {
  id: number;
  name: string;
  slug: string;
  avatar_urls?: Record<string, string>;
}

export interface WPTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: "category" | "post_tag";
}

export interface WPPost {
  id: number;
  slug: string;
  status: string;
  link: string;

  title: WPRendered;
  content: WPRendered;
  excerpt: WPRendered;

  date: string;
  modified: string;

  categories: number[];
  tags: number[];

  featured_media: number;

  _embedded?: {
    "wp:featuredmedia"?: WPMedia[];
    author?: WPAuthor[];
    "wp:term"?: WPTerm[][];
  };
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface WPTag {
  id: number;
  name: string;
  slug: string;
  count: number;
}
