import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/categories/${params.id}/toggle-status`,
      {
        method: 'PATCH',
        headers: {
          ...(request.headers.get('authorization') && {
            authorization: request.headers.get('authorization')!,
          }),
        },
      }
    );

    const responseData = await backendResponse.json();

    return NextResponse.json(responseData, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error('Error proxying category toggle status request:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}