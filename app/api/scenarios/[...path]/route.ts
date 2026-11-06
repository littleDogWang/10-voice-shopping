import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    error: 'business_data_not_available',
    message: 'The simulated shopping API has been retired. Use the read-only catalog endpoints.',
  }, { status: 410 });
}

export const POST = GET;
