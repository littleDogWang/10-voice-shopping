import { NextResponse } from 'next/server';
import { searchProducts } from '@/scenarios/09-voice-shopping/catalog';

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q') ?? '';
  return NextResponse.json({ products: searchProducts(query) });
}
