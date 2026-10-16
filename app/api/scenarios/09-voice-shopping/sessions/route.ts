import { createShoppingSession } from '@/scenarios/09-voice-shopping/shopping';
import { shoppingResponse } from '@/scenarios/09-voice-shopping/http';

export async function POST() { return shoppingResponse(createShoppingSession, 201); }
