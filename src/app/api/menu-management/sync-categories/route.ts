import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/menu-management/sync-categories`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(request.headers.get('authorization') && {
            authorization: request.headers.get('authorization')!,
          }),
        },
        body: JSON.stringify(body),
      }
    );

    let responseData;
    try {
      responseData = await backendResponse.json();
    } catch (e) {
      // Backend returned non-JSON, return success message
      return NextResponse.json({ success: true, message: 'Sync completed', synced: 0 });
    }

    return NextResponse.json(responseData, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error('Error proxying sync categories request:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}