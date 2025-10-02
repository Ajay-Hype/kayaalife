import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/menu-management/menu-items${queryString ? `?${queryString}` : ''}`,
      {
        method: 'GET',
        headers: {
          ...(request.headers.get('authorization') && {
            authorization: request.headers.get('authorization')!,
          }),
        },
      }
    );

    let responseData;
    try {
      responseData = await backendResponse.json();
    } catch (e) {
      // Backend returned non-JSON, return empty menu
      return NextResponse.json({ success: true, data: [] });
    }

    return NextResponse.json(responseData, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error('Error proxying menu items request:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}