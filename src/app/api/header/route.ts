import { NextRequest, NextResponse } from 'next/server';
import { HeaderService } from '@/domains/content-management/services/HeaderService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const type = searchParams.get('type') || 'full'; // 'full', 'config', 'notices', 'navigation'

    const headerService = new HeaderService();
    let data: any;

    switch (type) {
      case 'config':
        data = await headerService.getActiveHeaderConfig();
        break;
      case 'notices':
        const headerData = await headerService.getHeaderData(locale);
        data = headerData.notices;
        break;
      case 'navigation':
        const navData = await headerService.getHeaderData(locale);
        data = navData.navigation;
        break;
      default:
        data = await headerService.getHeaderData(locale);
    }

    const response = {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        requestId: Math.random().toString(36).substr(2, 9),
        processingTime: 0,
        locale,
        type
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Header API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch header data'
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
