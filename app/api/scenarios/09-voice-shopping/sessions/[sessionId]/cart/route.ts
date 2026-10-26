import { setCartItem } from '@/lib/voice-shopping/shopping';
import { shoppingResponse, readShoppingBody } from '@/lib/voice-shopping/http';

export async function POST(request: Request, context: { params: Promise<{ sessionId: string }> }) {
  return shoppingResponse(async () => {
    const body = await readShoppingBody(request);
    // HTTP tool placeholders can serialize an integer as a canonical numeric string.
    const quantity = typeof body.quantity === 'string' && /^(0|[1-9][0-9]*)$/.test(body.quantity)
      ? Number(body.quantity) : body.quantity;
    return setCartItem((await context.params).sessionId, body.product_id, quantity);
  });
}
