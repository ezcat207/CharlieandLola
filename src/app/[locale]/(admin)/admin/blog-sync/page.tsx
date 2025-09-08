'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  publishedDate: string;
  locale: string;
  coverImage: string | null;
  contentLength: number;
}

interface SyncResult {
  slug: string;
  status: 'created' | 'updated' | 'skipped' | 'failed' | 'error';
  title?: string;
  message: string;
}

export default function BlogSyncPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<SyncResult[]>([]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sync-blog-posts', { method: 'GET' });
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.posts);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Error loading posts: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const syncPosts = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/sync-blog-posts', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        setSyncResults(data.details);
        alert(`Sync completed! Created: ${data.summary.created}, Updated: ${data.summary.updated}, Skipped: ${data.summary.skipped}, Failed: ${data.summary.failed}`);
      } else {
        alert('Sync failed: ' + data.message);
      }
    } catch (error) {
      alert('Error syncing posts: ' + error);
    } finally {
      setSyncing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created': return 'text-green-600';
      case 'updated': return 'text-blue-600';
      case 'skipped': return 'text-yellow-600';
      case 'failed':
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Blog Post Sync</h1>
            <p className="text-gray-600 mt-2">
              Sync Markdown files from the filesystem to the database
            </p>
          </div>
          <div className="space-x-2">
            <Button 
              onClick={loadPosts} 
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Loading...' : 'Load Posts'}
            </Button>
            <Button 
              onClick={syncPosts} 
              disabled={syncing || posts.length === 0}
            >
              {syncing ? 'Syncing...' : 'Sync to Database'}
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>1. Place your Markdown (.md) files in the <code className="bg-gray-100 px-2 py-1 rounded">content/blog/</code> directory</p>
              <p>2. Click "Load Posts" to preview the posts that will be synced</p>
              <p>3. Click "Sync to Database" to publish them to the blog</p>
              <p>4. Posts are automatically parsed for title, description, cover image, and content</p>
            </div>
          </CardContent>
        </Card>

        {/* Posts Preview */}
        {posts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Posts Found ({posts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.slug} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{post.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                          <span>Slug: <code className="bg-gray-100 px-1 rounded">{post.slug}</code></span>
                          <span>Author: {post.author}</span>
                          <span>Locale: {post.locale}</span>
                          <span>Length: {post.contentLength.toLocaleString()} chars</span>
                        </div>
                      </div>
                      {post.coverImage && (
                        <div className="ml-4">
                          <img 
                            src={post.coverImage} 
                            alt="Cover" 
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sync Results */}
        {syncResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Sync Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {syncResults.map((result) => (
                  <div key={result.slug} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <span className="font-medium">{result.title || result.slug}</span>
                      <span className="text-sm text-gray-500 ml-2">{result.message}</span>
                    </div>
                    <span className={`text-sm font-medium ${getStatusColor(result.status)}`}>
                      {result.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Blog Posts Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-x-4">
              <Button variant="outline" asChild>
                <a href="/admin/posts" target="_blank">Manage All Posts</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/posts" target="_blank">View Blog</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}