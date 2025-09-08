import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');
    
    if (!imageUrl) {
      return new NextResponse('Missing image URL', { status: 400 });
    }
    
    // Validate that it's a valid URL
    let url;
    try {
      url = new URL(imageUrl);
    } catch (e) {
      return new NextResponse('Invalid image URL', { status: 400 });
    }
    
    // Only allow certain domains for security
    const allowedDomains = [
      'kie.ai',
      'api.kie.ai',
      'file.aiquickdraw.com',
      'r2.cloudflarestorage.com',
      'r2.dev', // Cloudflare R2 public domains
      'pub-caf0ef6125ee4999a8a4bc4c0ec36bca.r2.dev', // Your specific R2 domain
      'pub-ea658a60b7dd4332a2c19d54d6d566c6.r2.dev', // Charlie & Lola R2 domain
    ];
    
    // Check if the domain is allowed
    const isAllowedDomain = allowedDomains.some(domain => 
      url.hostname.includes(domain) || url.hostname.endsWith(domain)
    );
    
    if (!isAllowedDomain) {
      console.error(`Domain not allowed: ${url.hostname}`);
      return new NextResponse('Domain not allowed', { status: 403 });
    }
    
    // Fetch the image
    const imageResponse = await fetch(imageUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'NanoBanana-ImageDownload/1.0',
        'Accept': 'image/*',
      },
    });
    
    if (!imageResponse.ok) {
      console.error(`Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`);
      return new NextResponse(`Failed to fetch image: ${imageResponse.status}`, { 
        status: imageResponse.status 
      });
    }
    
    // Get the image data
    const imageData = await imageResponse.arrayBuffer();
    
    // Determine content type
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    
    // Create response with proper headers for download
    return new NextResponse(imageData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'attachment',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    
  } catch (error) {
    console.error('Error in download-image API:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}