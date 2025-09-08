import { NextResponse } from 'next/server';
import { getAllBlogPosts, generateUuid } from '@/lib/blog-parser';
import { insertPost, findPostBySlug, updatePost } from '@/models/post';

export async function POST() {
  try {
    const blogPosts = getAllBlogPosts();
    
    if (blogPosts.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No blog posts found in content directory' 
      });
    }
    
    const results = [];
    
    for (const post of blogPosts) {
      try {
        // Check if post already exists
        const existingPost = await findPostBySlug(post.slug, post.locale);
        
        if (existingPost) {
          // Update existing post
          const updateData = {
            title: post.title,
            description: post.description,
            content: post.content,
            updated_at: new Date(),
            author_name: post.author,
            author_avatar_url: post.authorAvatar,
            cover_url: post.coverImage,
          };
          
          const updatedPost = await updatePost(existingPost.uuid, updateData);
          
          if (updatedPost) {
            results.push({
              slug: post.slug,
              status: 'updated',
              title: post.title,
              message: 'Successfully updated'
            });
          } else {
            results.push({
              slug: post.slug,
              status: 'failed',
              message: 'Failed to update existing post'
            });
          }
          continue;
        }
        
        // Insert new post
        const dbPost = {
          uuid: generateUuid(),
          slug: post.slug,
          title: post.title,
          description: post.description,
          content: post.content,
          created_at: post.publishedDate,
          updated_at: new Date(),
          status: 'online',
          locale: post.locale,
          author_name: post.author,
          author_avatar_url: post.authorAvatar,
          cover_url: post.coverImage,
          category_uuid: null, // Can be set later if needed
        };
        
        const result = await insertPost(dbPost);
        
        if (result) {
          results.push({
            slug: post.slug,
            status: 'created',
            title: post.title,
            message: 'Successfully created'
          });
        } else {
          results.push({
            slug: post.slug,
            status: 'failed',
            message: 'Failed to insert into database'
          });
        }
        
      } catch (error) {
        results.push({
          slug: post.slug,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    const created = results.filter(r => r.status === 'created').length;
    const updated = results.filter(r => r.status === 'updated').length;
    const skipped = results.filter(r => r.status === 'skipped').length;
    const failed = results.filter(r => r.status === 'failed' || r.status === 'error').length;
    
    return NextResponse.json({
      success: true,
      message: `Processed ${blogPosts.length} blog posts`,
      summary: {
        total: blogPosts.length,
        created,
        updated,
        skipped,
        failed
      },
      details: results
    });
    
  } catch (error) {
    console.error('Error syncing blog posts:', error);
    return NextResponse.json({
      success: false,
      message: 'Error syncing blog posts',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET method to just preview what would be synced
export async function GET() {
  try {
    const blogPosts = getAllBlogPosts();
    
    return NextResponse.json({
      success: true,
      message: `Found ${blogPosts.length} blog posts in filesystem`,
      posts: blogPosts.map(post => ({
        slug: post.slug,
        title: post.title,
        description: post.description.substring(0, 100) + '...',
        author: post.author,
        publishedDate: post.publishedDate,
        locale: post.locale,
        coverImage: post.coverImage,
        contentLength: post.content.length
      }))
    });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return NextResponse.json({
      success: false,
      message: 'Error reading blog posts from filesystem',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}