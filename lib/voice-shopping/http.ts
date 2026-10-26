import { NextResponse } from 'next/server';
import { ShoppingError } from './shopping';

export async function shoppingResponse(action: () => unknown | Promise<unknown>, status = 200) {
  try { return NextResponse.json(await action(), { status }); }
  catch (error) {
    if (error instanceof ShoppingError) return NextResponse.json({ error: error.code }, { status: error.status });
    console.error('Shopping operation failed', error);
    return NextResponse.json({ error: 'shopping_operation_failed' }, { status: 500 });
  }
}

export async function readShoppingBody(request: Request): Promise<Record<string, unknown>> {
  let body: unknown;
  try { body = await request.json(); }
  catch { throw new ShoppingError('invalid_json'); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new ShoppingError('json_object_required');
  return body as Record<string, unknown>;
}
