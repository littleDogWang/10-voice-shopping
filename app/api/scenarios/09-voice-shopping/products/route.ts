import { listProducts, ShoppingError } from '@/scenarios/09-voice-shopping/shopping';
import { shoppingResponse } from '@/scenarios/09-voice-shopping/http';

export async function GET(request: Request) {
  return shoppingResponse(async () => {
    const params = new URL(request.url).searchParams;
    const rawMax = params.get('max_price');
    const max = rawMax === null || rawMax === '' ? undefined : Number(rawMax);
    if (max !== undefined && (!Number.isFinite(max) || max < 0)) throw new ShoppingError('invalid_max_price');
    return { products: await listProducts(params.get('q') ?? '', params.get('category') || undefined, max), simulated: true };
  });
}
