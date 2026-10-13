import { NextResponse } from 'next/server';
import { getProduct } from '@/scenarios/09-voice-shopping/catalog';

export async function GET(request: Request) {
  const productId = new URL(request.url).searchParams.get('product_id');
  if (!productId) {
    return NextResponse.json({ error: 'product_id is required' }, { status: 400 });
  }
  const product = getProduct(productId);
  return product
    ? NextResponse.json({
        product_id: product.productId,
        price: product.price,
        currency: product.currency,
        stock: product.stock,
        order_supported: false,
      })
    : NextResponse.json({ error: 'product_not_found' }, { status: 404 });
}
