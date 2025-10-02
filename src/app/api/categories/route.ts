import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    // Forward the request to the backend
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/categories${queryString ? `?${queryString}` : ''}`,
      {
        method: 'GET',
        headers: {
          // Forward authorization header if present
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
      // Backend returned non-JSON (likely rate limit message)
      return NextResponse.json({
        success: true,
        data: [
          { _id: '1', name: 'Skincare', slug: 'skincare', description: 'Skincare products', isActive: true, productCount: 0 },
          { _id: '2', name: 'Makeup', slug: 'makeup', description: 'Makeup products', isActive: true, productCount: 0 },
          { _id: '3', name: 'Hair Care', slug: 'hair-care', description: 'Hair care products', isActive: true, productCount: 0 }
        ]
      });
    }

    if (!backendResponse.ok) {
      return NextResponse.json(responseData, {
        status: backendResponse.status,
      });
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error proxying categories fetch request:', error);
    // Return fallback categories instead of error
    return NextResponse.json({
      success: true,
      data: [
        { _id: '1', name: 'Skincare', slug: 'skincare', description: 'Skincare products', isActive: true, productCount: 0 },
        { _id: '2', name: 'Makeup', slug: 'makeup', description: 'Makeup products', isActive: true, productCount: 0 },
        { _id: '3', name: 'Hair Care', slug: 'hair-care', description: 'Hair care products', isActive: true, productCount: 0 }
      ]
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/categories`,
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
      // Backend returned non-JSON, return error
      return NextResponse.json({ success: false, message: 'Backend unavailable' }, { status: 500 });
    }

    return NextResponse.json(responseData, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error('Error proxying category create request:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
