import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { NextRequest } from 'next/server';
import { createShoppingSession, getShoppingSession } from '../lib/voice-shopping/shopping';
import type { ShoppingSession } from '../lib/voice-shopping/shopping-types';
import { getScenarioTools } from '../lib/agent-tools';
import { POST as createSession } from '../app/api/scenarios/09-voice-shopping/sessions/route';
import { GET as sessionRoute } from '../app/api/scenarios/09-voice-shopping/sessions/[sessionId]/route';
import { POST as cartRoute } from '../app/api/scenarios/09-voice-shopping/sessions/[sessionId]/cart/route';
import { POST as orderRoute } from '../app/api/scenarios/09-voice-shopping/sessions/[sessionId]/orders/route';
import { GET as getOrderRoute, POST as cancelRoute } from '../app/api/scenarios/09-voice-shopping/sessions/[sessionId]/orders/[orderId]/route';
import { GET as productsRoute } from '../app/api/scenarios/09-voice-shopping/products/route';
import { GET as inventoryRoute } from '../app/api/scenarios/09-voice-shopping/inventory/route';

const request = (body: unknown) => new NextRequest('http://localhost/api/shopping', {
  method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body), headers: { 'Content-Type': 'application/json' },
});
const context = (sessionId: string, orderId = '') => ({ params: Promise.resolve({ sessionId, orderId }) });
async function body<T>(response: Response, status = 200): Promise<T> {
  const result = await response.json();
  assert.equal(response.status, status, JSON.stringify(result));
  return result;
}

async function main() {
  const directory = await mkdtemp(path.join(tmpdir(), 'voice-shopping-test-'));
  const originalFile = process.env.SHOPPING_DATA_FILE;
  process.env.SHOPPING_DATA_FILE = path.join(directory, 'shopping.json');
  let checks = 0;
  const checked = (name: string) => { checks++; console.log(`PASS ${name}`); };
  try {
    let session = await body<ShoppingSession>(await createSession(), 201);
    const other = await createShoppingSession();
    assert.notEqual(session.session_id, other.session_id);
    await body(await sessionRoute(request({}), context('missing')), 404);
    checked('session creation and missing session');

    const filtered = await body<{ products: { productId: string; price: number }[] }>(await productsRoute(new Request('http://localhost/products?q=usb&category=microphone&max_price=130')));
    assert.equal(filtered.products.length, 2);
    assert(filtered.products.every(product => product.price <= 130));
    await body(await productsRoute(new Request('http://localhost/products?max_price=invalid')), 400);
    checked('category, attribute and numeric budget filtering');

    for (const quantity of [-1, 1.5, 'two', null, 11]) await body(await cartRoute(request({ product_id: 'MIC-100', quantity }), context(session.session_id)), 400);
    await body(await cartRoute(request('{'), context(session.session_id)), 400);
    await body(await cartRoute(request([]), context(session.session_id)), 400);
    await body(await cartRoute(request({ product_id: 'UNKNOWN', quantity: 1 }), context(session.session_id)), 404);
    await body(await cartRoute(request({ product_id: 'CAM-200', quantity: 1 }), context(session.session_id)), 409);
    checked('invalid quantities, malformed JSON, unknown and out-of-stock products');

    session = await body<ShoppingSession>(await cartRoute(request({ product_id: 'MIC-100', quantity: '2', unit_price: 0.01, total: 0.02 }), context(session.session_id)));
    assert.equal(session.cart?.total, 258);
    const oldQuote = session.cart!.quote_id;
    assert.equal((await getShoppingSession(other.session_id)).cart, null);
    session = await body<ShoppingSession>(await cartRoute(request({ product_id: 'CAM-120', quantity: 1 }), context(session.session_id)));
    assert.equal(session.cart?.total, 357);
    checked('server pricing, tool numeric strings, multiple lines and isolated baskets');

    await body(await orderRoute(request({ quote_id: session.cart!.quote_id }), context(session.session_id)), 400);
    await body(await orderRoute(request({ quote_id: session.cart!.quote_id, confirmed: 'true' }), context(session.session_id)), 400);
    await body(await orderRoute(request({ quote_id: oldQuote, confirmed: true }), context(session.session_id)), 409);
    await body(await orderRoute(request({ quote_id: session.cart!.quote_id, confirmed: true }), context(other.session_id)), 409);
    checked('explicit confirmation, stale quotes and cross-session confirmation rejection');

    const quoteId = session.cart!.quote_id;
    session = await body<ShoppingSession>(await orderRoute(request({ quote_id: quoteId, confirmed: true }), context(session.session_id)));
    const order = session.orders[0];
    assert.equal(order.status, 'unpaid'); assert.equal(order.total, 357); assert.equal(session.cart, null);
    const duplicate = await body<ShoppingSession>(await orderRoute(request({ quote_id: quoteId, confirmed: true }), context(session.session_id)));
    assert.equal(duplicate.orders.length, 1); assert.equal(duplicate.orders[0].order_id, order.order_id);
    const inventory = await body<{ stock: number }>(await inventoryRoute(new Request('http://localhost/inventory?product_id=MIC-100')));
    assert.equal(inventory.stock, 10);
    checked('unpaid order result, cleared basket, stock reservation and idempotent confirmation');

    await body(await getOrderRoute(request({}), context(other.session_id, order.order_id)), 404);
    await body(await cancelRoute(request({ confirmed: true }), context(other.session_id, order.order_id)), 404);
    await body(await cancelRoute(request({}), context(session.session_id, order.order_id)), 400);
    const lookedUp = await body<{ order: { order_id: string } }>(await getOrderRoute(request({}), context(session.session_id, order.order_id)));
    assert.equal(lookedUp.order.order_id, order.order_id);
    checked('order lookup, cancellation consent and session isolation');

    session = await body<ShoppingSession>(await cancelRoute(request({ confirmed: true }), context(session.session_id, order.order_id)));
    assert.equal(session.orders[0].status, 'cancelled');
    const cancelledAt = session.orders[0].cancelled_at;
    const repeated = await body<ShoppingSession>(await cancelRoute(request({ confirmed: true }), context(session.session_id, order.order_id)));
    assert.equal(repeated.orders[0].cancelled_at, cancelledAt);
    assert.equal((await body<{ stock: number }>(await inventoryRoute(new Request('http://localhost/inventory?product_id=MIC-100')))).stock, 12);
    const retried = await body<ShoppingSession>(await orderRoute(request({ quote_id: quoteId, confirmed: true }), context(session.session_id)));
    assert.equal(retried.orders[0].status, 'cancelled'); assert.equal(retried.orders.length, 1);
    checked('idempotent cancellation, stock release and no resurrection on retried confirmation');

    const a = await createShoppingSession(); const b = await createShoppingSession();
    const cartA = await body<ShoppingSession>(await cartRoute(request({ product_id: 'CAM-300', quantity: 3 }), context(a.session_id)));
    const cartB = await body<ShoppingSession>(await cartRoute(request({ product_id: 'CAM-300', quantity: 3 }), context(b.session_id)));
    const racing = await Promise.all([
      orderRoute(request({ quote_id: cartA.cart!.quote_id, confirmed: true }), context(a.session_id)),
      orderRoute(request({ quote_id: cartB.cart!.quote_id, confirmed: true }), context(b.session_id)),
    ]);
    assert.deepEqual(racing.map(response => response.status).sort(), [200, 409]);
    const remaining = await getShoppingSession(racing[0].status === 409 ? a.session_id : b.session_id);
    assert.equal(remaining.cart?.items[0].quantity, 3); assert.equal(remaining.orders.length, 0);
    checked('concurrent confirmations cannot oversell; failed order preserves the basket');

    const restored = JSON.parse(await readFile(process.env.SHOPPING_DATA_FILE, 'utf8')) as { sessions: ShoppingSession[] };
    assert.equal(restored.sessions.find(entry => entry.session_id === session.session_id)?.orders[0].status, 'cancelled');
    const output = execFileSync(process.execPath, ['--import', 'tsx', '--eval', `import('./lib/voice-shopping/shopping.ts').then(async m => console.log(JSON.stringify(await (m.getShoppingSession ?? m.default.getShoppingSession)('${session.session_id}'))))`], { encoding: 'utf8', cwd: process.cwd(), env: process.env });
    assert.equal(JSON.parse(output).orders[0].status, 'cancelled');
    checked('persisted results survive a fresh Node process');

    const tools = getScenarioTools('09-voice-shopping', 'https://shopping.example', session.session_id);
    assert.equal(tools.length, 7);
    assert.equal(getScenarioTools('09-voice-shopping', 'https://shopping.example').length, 0);
    for (const tool of tools.slice(2)) assert(JSON.stringify(tool).includes(session.session_id));
    checked('all mutation and order tools are scoped to the current shopper');
    console.log(`Shopping checks passed: ${checks} groups`);
  } finally {
    if (originalFile === undefined) delete process.env.SHOPPING_DATA_FILE; else process.env.SHOPPING_DATA_FILE = originalFile;
    await rm(directory, { recursive: true, force: true });
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
