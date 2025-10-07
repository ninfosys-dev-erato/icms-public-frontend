import { NextRequest, NextResponse } from 'next/server';

// Dummy data for fallback - same as in main route
const mockHeaderConfig = {
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
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // For now, return mock data if id matches, otherwise 404
    if (id === '1' || id === 'active') {
      const response = {
        success: true,
        data: mockHeaderConfig,
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }
      };

      return NextResponse.json(response);
    } else {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Header configuration with id '${id}' not found`
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0.0'
          }
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Header config by ID API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch header configuration'
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