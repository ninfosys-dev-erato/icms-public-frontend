import { NextRequest, NextResponse } from 'next/server';

// Complete dummy data structure matching HeaderData interface
const mockActiveHeaderData = {
  config: {
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
  },
  navigation: [
    {
      id: '1',
      title: {
        ne: 'गृह पृष्ठ',
        en: 'Home'
      },
      href: '/',
      order: 1,
      isActive: true,
      submenu: []
    },
    {
      id: '2',
      title: {
        ne: 'हाम्रो बारेमा',
        en: 'About Us'
      },
      href: '/about',
      order: 2,
      isActive: true,
      submenu: [
        {
          id: '2-1',
          title: {
            ne: 'परिचय',
            en: 'Introduction'
          },
          href: '/about/introduction',
          order: 1,
          isActive: true
        },
        {
          id: '2-2',
          title: {
            ne: 'उद्देश्य',
            en: 'Objectives'
          },
          href: '/about/objectives',
          order: 2,
          isActive: true
        }
      ]
    },
    {
      id: '3',
      title: {
        ne: 'सूचना',
        en: 'Notices'
      },
      href: '/content/notice-board',
      order: 3,
      isActive: true,
      submenu: []
    },
    {
      id: '4',
      title: {
        ne: 'सेवाहरू',
        en: 'Services'
      },
      href: '/services',
      order: 4,
      isActive: true,
      submenu: []
    },
    {
      id: '5',
      title: {
        ne: 'सम्पर्क',
        en: 'Contact'
      },
      href: '/contact',
      order: 5,
      isActive: true,
      submenu: []
    }
  ],
  socialMedia: [
    {
      id: '1',
      platform: 'facebook',
      url: 'https://facebook.com/localgovnepal',
      title: {
        ne: 'फेसबुक',
        en: 'Facebook'
      },
      order: 1,
      isActive: true
    },
    {
      id: '2',
      platform: 'twitter',
      url: 'https://twitter.com/localgovnepal',
      title: {
        ne: 'ट्विटर',
        en: 'Twitter'
      },
      order: 2,
      isActive: true
    }
  ],
  contactInfo: {
    address: {
      ne: 'काठमाडौं, नेपाल',
      en: 'Kathmandu, Nepal'
    },
    district: {
      ne: 'काठमाडौं जिल्ला',
      en: 'Kathmandu District'
    },
    phone: '+977-1-1234567',
    email: 'info@localgovnepal.gov.np',
    website: 'https://localgovnepal.gov.np'
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    // Add CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    const response = {
      success: true,
      data: mockActiveHeaderData,
      meta: {
        locale,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        source: 'fallback'
      }
    };

    return NextResponse.json(response, { headers });
  } catch (error) {
    console.error('Active header display API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch active header configuration for display'
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

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}