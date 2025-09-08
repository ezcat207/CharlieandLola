import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  coverImage: string | null;
  author: string;
  authorAvatar: string;
  publishedDate: Date;
  tags: string[];
  locale: string;
}

export interface BlogMetadata {
  title?: string;
  description?: string;
  author?: string;
  authorAvatar?: string;
  publishedDate?: string;
  tags?: string[];
  locale?: string;
  coverImage?: string;
  slug?: string;
}

/**
 * Parse a Markdown file and extract blog post data
 */
export function parseBlogPost(filePath: string): BlogPost {
  const fileContent = readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(fileContent) as { data: BlogMetadata; content: string };
  
  // Extract title from first heading if not in frontmatter
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = frontmatter.title || (titleMatch ? titleMatch[1].trim() : 'Untitled Post');
  
  // Extract description from italic text or first paragraph
  let description = frontmatter.description;
  if (!description) {
    const italicMatch = content.match(/\*(.+?)\*/);
    if (italicMatch) {
      description = italicMatch[1];
    } else {
      // Get first paragraph
      const paragraphs = content.split('\n\n').filter(p => !p.startsWith('#') && p.trim());
      description = paragraphs[0]?.replace(/[*_`]/g, '').substring(0, 200) + '...' || '';
    }
  }
  
  // Extract cover image from first image in content
  let coverImage = frontmatter.coverImage;
  if (!coverImage) {
    const imageMatch = content.match(/!\[.*?\]\(([^)]+)\)/);
    if (imageMatch) {
      coverImage = imageMatch[1];
    }
  }
  
  // Generate slug from filename
  const filename = filePath.split('/').pop() || '';
  const slug = frontmatter.slug || filename.replace(/\.md$/, '').toLowerCase().replace(/\s+/g, '-');
  
  // Extract tags from content (look for hashtags or frontmatter)
  const tags = frontmatter.tags || [];
  if (tags.length === 0) {
    const hashtagMatches = content.match(/#(\w+)/g);
    if (hashtagMatches) {
      tags.push(...hashtagMatches.map(tag => tag.replace('#', '')));
    }
  }
  
  return {
    slug,
    title,
    description,
    content,
    coverImage: coverImage || null,
    author: frontmatter.author || 'Charlie and Lola Team',
    authorAvatar: frontmatter.authorAvatar || '/imgs/nano-banana-logo.png',
    publishedDate: frontmatter.publishedDate ? new Date(frontmatter.publishedDate) : new Date(),
    tags,
    locale: frontmatter.locale || 'en'
  };
}

/**
 * Get all blog posts from the content directory
 */
export function getAllBlogPosts(contentDir: string = 'content/blog'): BlogPost[] {
  const fullPath = join(process.cwd(), contentDir);
  
  try {
    const files = readdirSync(fullPath).filter(file => file.endsWith('.md'));
    
    return files.map(file => {
      const filePath = join(fullPath, file);
      return parseBlogPost(filePath);
    });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

/**
 * Get a specific blog post by slug
 */
export function getBlogPostBySlug(slug: string, contentDir: string = 'content/blog'): BlogPost | null {
  const posts = getAllBlogPosts(contentDir);
  return posts.find(post => post.slug === slug) || null;
}

/**
 * Generate a UUID for database insertion
 */
export function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}