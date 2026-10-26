import { getInventory, ShoppingError } from '@/lib/voice-shopping/shopping';
import { shoppingResponse } from '@/lib/voice-shopping/http';

export async function GET(request: Request) {
  return shoppingResponse(() => {
    const productId = new URL(request.url).searchParams.get('product_id');
    if (!productId) throw new ShoppingError('product_id is required');
    return getInventory(productId);
  });
}
