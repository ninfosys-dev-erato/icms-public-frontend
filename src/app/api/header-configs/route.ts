import { NextRequest, NextResponse } from 'next/server';

// Dummy data for fallback
const mockHeaderConfigs = [
  {
    id: '1',
    title: {
      ne: 'स्थानीय सरकार कार्यालय',
      en: 'Local Government Office'
    },
    description: {
      ne: 'नागरिकहरूका लागि डिजिटल सेवा',
      en: 'Digital Services for Citizens'
    },
    logo: {
      id: 'logo-1',
      url: '/icons/nepal-emblem.svg',
      altText: {
        ne: 'नेपाल सरकारको छाप',
        en: 'Nepal Government Emblem'
      },
      filename: 'nepal-emblem.svg',
      mimeType: 'image/svg+xml',
      size: 15420,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    isActive: true,
    isPublished: true,
    settings: {
      showSearch: true,
      showLanguageSwitcher: true,
      showUserMenu: false
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive');
    const isPublished = searchParams.get('isPublished');

    // Filter data based on query parameters
    let filteredConfigs = [...mockHeaderConfigs];

    if (search) {
      filteredConfigs = filteredConfigs.filter(config => 
        config.title.en.toLowerCase().includes(search.toLowerCase()) ||
        config.title.ne.includes(search)
      );
    }

    if (isActive !== null) {
      filteredConfigs = filteredConfigs.filter(config => 
        config.isActive === (isActive === 'true')
      );
    }

    if (isPublished !== null) {
      filteredConfigs = filteredConfigs.filter(config => 
        config.isPublished === (isPublished === 'true')
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedConfigs = filteredConfigs.slice(startIndex, endIndex);

    const response = {
      success: true,
      data: paginatedConfigs,
      meta: {
        total: filteredConfigs.length,
        page,
        limit,
        totalPages: Math.ceil(filteredConfigs.length / limit),
        hasNext: endIndex < filteredConfigs.length,
        hasPrev: page > 1,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Header configs API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch header configurations'
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }
      },
      { status: 500 }
    );
  }
}