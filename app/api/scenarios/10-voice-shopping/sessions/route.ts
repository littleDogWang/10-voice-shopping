import { createShoppingSession } from '@/lib/voice-shopping/shopping';
import { shoppingResponse } from '@/lib/voice-shopping/http';

export async function POST() { return shoppingResponse(createShoppingSession, 201); }
