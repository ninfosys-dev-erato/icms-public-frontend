import { NextRequest, NextResponse } from 'next/server';
import { getJSON, setWithTags } from '@/lib/bff/cache';
import { HomepageService } from '@/domains/homepage/services/homepage-service';

// Cache TTL in seconds
const CACHE_TTL = 300; // 5 minutes
const STALE_WHILE_REVALIDATE = 600; // 10 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const limit = parseInt(searchParams.get('limit') || '3');
    
    // Generate cache key
    const cacheKey = `homepage:${locale}:${limit}`;
    
    // Try to get cached data first
    const cached = await getJSON(cacheKey);
    if (cached) {
      // Return cached data with stale-while-revalidate headers
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': `public, max-age=${CACHE_TTL}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
          'X-Cache': 'HIT',
          'X-Cache-Key': cacheKey,
        },
      });
    }
    
    // Fetch fresh data
    const homepageData = await HomepageService.getHomepageData({ lang: locale as 'en' | 'ne' });
    
    // Prepare response data
    const responseData = {
      success: true,
      data: {
        ...homepageData,
        timestamp: new Date().toISOString(),
        locale,
      },
      message: 'Homepage data fetched successfully',
    };
    
    // Cache the response
    await setWithTags(
      cacheKey, 
      responseData, 
      CACHE_TTL, 
      ['homepage', `locale:${locale}`]
    );
    
    // Return fresh data with cache headers
    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': `public, max-age=${CACHE_TTL}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
        'X-Cache': 'MISS',
        'X-Cache-Key': cacheKey,
      },
    });
    
  } catch (error) {
    console.error('Homepage API Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch homepage data',
        message: 'Internal server error',
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  }
}

// Health check endpoint
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache',
      'X-Health': 'OK',
    },
  });
}
