export interface Project {
  slug: string;
  title: string;
  /** One line, shown in the project archive on the homepage. */
  description: string;
  /** Optional long text for /projects/[slug]; paragraphs separated by blank lines. */
  longDescription: string;
  stack: string[];
  repoUrl: string;
  liveUrl: string;
  year: string;
  /** Listed under "Top projects" instead of "More work". */
  featured: boolean;
  published: boolean;
  order: number;
  updatedAt: string | null;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** Paragraphs separated by blank lines; `**bold**` is supported. */
  content: string;
  tags: string[];
  /** ISO date, YYYY-MM-DD. */
  publishedAt: string;
  published: boolean;
  updatedAt: string | null;
}

export type ProjectInput = Omit<Project, "updatedAt">;
export type BlogPostInput = Omit<BlogPost, "updatedAt">;
