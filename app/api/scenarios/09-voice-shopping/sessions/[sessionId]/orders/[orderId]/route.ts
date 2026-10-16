import { cancelOrder, getShoppingSession, ShoppingError } from '@/scenarios/09-voice-shopping/shopping';
import { shoppingResponse, readShoppingBody } from '@/scenarios/09-voice-shopping/http';

type Context = { params: Promise<{ sessionId: string; orderId: string }> };
export async function GET(_request: Request, context: Context) {
  return shoppingResponse(async () => {
    const { sessionId, orderId } = await context.params;
    const order = (await getShoppingSession(sessionId)).orders.find((entry) => entry.order_id === orderId);
    if (!order) throw new ShoppingError('order_not_found', 404);
    return { order, simulated: true };
  });
}

export async function POST(request: Request, context: Context) {
  return shoppingResponse(async () => {
    const { sessionId, orderId } = await context.params;
    const body = await readShoppingBody(request);
    return cancelOrder(sessionId, orderId, body.confirmed);
  });
}
