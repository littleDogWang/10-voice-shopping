import { getShoppingSession } from '@/scenarios/09-voice-shopping/shopping';
import { shoppingResponse } from '@/scenarios/09-voice-shopping/http';

export async function GET(_request: Request, context: { params: Promise<{ sessionId: string }> }) {
  return shoppingResponse(async () => getShoppingSession((await context.params).sessionId));
}
