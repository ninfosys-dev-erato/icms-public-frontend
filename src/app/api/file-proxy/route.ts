import { NextRequest, NextResponse } from 'next/server';
import { extractFileIdentifier } from '@/utils/backblazeImageCache';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileUrl = searchParams.get('url');
  const fileId = searchParams.get('fileId');
  
  if (!fileUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  // Validate URL is from iCMS-bucket specifically
  const isValidBackblazeUrl = fileUrl.includes('f003.backblazeb2.com/file/iCMS-bucket/') || 
                              fileUrl.includes('backblazeb2.com/file/iCMS-bucket/');
  
  if (!isValidBackblazeUrl) {
    return NextResponse.json({ error: 'Invalid file source - only iCMS-bucket allowed' }, { status: 400 });
  }

  try {
    // Extract file identifier for consistent caching
    const identifier = fileId || extractFileIdentifier(fileUrl);
    
    // Fetch file from Backblaze
    const fileResponse = await fetch(fileUrl, {
      headers: {
        'User-Agent': 'Nepal-Government-Portal/1.0',
        'Accept': '*/*',
      },
    });

    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch file: ${fileResponse.status}`);
    }

    const fileBuffer = await fileResponse.arrayBuffer();
    const contentType = fileResponse.headers.get('content-type') || 'application/octet-stream';
    const contentLength = fileResponse.headers.get('content-length');
    
    // Determine appropriate content type for common files
    let finalContentType = contentType;
    if (fileUrl.includes('.pdf')) {
      finalContentType = 'application/pdf';
    } else if (fileUrl.match(/\.(jpg|jpeg)$/i)) {
      finalContentType = 'image/jpeg';
    } else if (fileUrl.match(/\.png$/i)) {
      finalContentType = 'image/png';
    } else if (fileUrl.match(/\.webp$/i)) {
      finalContentType = 'image/webp';
    } else if (fileUrl.match(/\.(doc|docx)$/i)) {
      finalContentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    // Create cache key based on file identifier for consistent caching
    const cacheControl = identifier 
      ? 'public, max-age=2592000, stale-while-revalidate=86400' // 30 days cache with 1 day stale
      : 'public, max-age=3600, stale-while-revalidate=1800'; // 1 hour fallback

    // Create response with file-based caching headers
    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': finalContentType,
        'Cache-Control': cacheControl,
        'CDN-Cache-Control': 'public, max-age=2592000', // 30 days on CDN
        'Vercel-CDN-Cache-Control': 'public, max-age=2592000',
        'X-Content-Type-Options': 'nosniff',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'",
        ...(contentLength && { 'Content-Length': contentLength }),
        ...(identifier && { 'X-File-ID': identifier }), // For debugging
      },
    });

    return response;
  } catch (error) {
    console.error('File proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch file' }, 
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      }
    );
  }
}

// Add preflight OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}