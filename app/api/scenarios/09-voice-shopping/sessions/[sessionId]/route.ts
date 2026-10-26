import { getShoppingSession } from '@/lib/voice-shopping/shopping';
import { shoppingResponse } from '@/lib/voice-shopping/http';

export async function GET(_request: Request, context: { params: Promise<{ sessionId: string }> }) {
  return shoppingResponse(async () => getShoppingSession((await context.params).sessionId));
}
