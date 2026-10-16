import { confirmOrder, getShoppingSession } from '@/scenarios/09-voice-shopping/shopping';
import { shoppingResponse, readShoppingBody } from '@/scenarios/09-voice-shopping/http';

export async function GET(_request: Request, context: { params: Promise<{ sessionId: string }> }) {
  return shoppingResponse(async () => ({ orders: (await getShoppingSession((await context.params).sessionId)).orders, simulated: true }));
}

export async function POST(request: Request, context: { params: Promise<{ sessionId: string }> }) {
  return shoppingResponse(async () => {
    const body = await readShoppingBody(request);
    return confirmOrder((await context.params).sessionId, body.quote_id, body.confirmed);
  });
}
