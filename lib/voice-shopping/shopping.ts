import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getProduct, searchProducts } from './catalog';
import type { CartQuote, ShoppingSession } from './shopping-types';

export class ShoppingError extends Error {
  constructor(public code: string, public status = 400) { super(code); }
}

interface Ledger { sessions: ShoppingSession[] }
// One local process serializes read/modify/write operations, including stock reservations.
const processState = globalThis as typeof globalThis & { voiceShoppingWrite?: Promise<unknown> };
function transaction<T>(update: (ledger: Ledger) => T | Promise<T>, save = true): Promise<T> {
  const operation = (processState.voiceShoppingWrite ?? Promise.resolve()).then(async () => {
    const file = process.env.SHOPPING_DATA_FILE ?? path.join(process.cwd(), '.scenario-data', 'shopping.json');
    let ledger: Ledger;
    try {
      ledger = JSON.parse(await readFile(file, 'utf8'));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      ledger = { sessions: [] };
    }
    const result = await update(ledger);
    if (save) {
      await mkdir(path.dirname(file), { recursive: true });
      const temporary = `${file}.${randomUUID()}.tmp`;
      await writeFile(temporary, JSON.stringify(ledger), { mode: 0o600 });
      await rename(temporary, file);
    }
    return result;
  });
  processState.voiceShoppingWrite = operation.catch(() => {});
  return operation;
}

function sessionFrom(ledger: Ledger, id: string) {
  const session = ledger.sessions.find((entry) => entry.session_id === id);
  if (!session) throw new ShoppingError('shopping_session_not_found', 404);
  return session;
}

function availableStock(ledger: Ledger, productId: string) {
  const product = getProduct(productId);
  if (!product) throw new ShoppingError('product_not_found', 404);
  const reserved = ledger.sessions.flatMap((entry) => entry.orders)
    .filter((order) => order.status === 'unpaid')
    .flatMap((order) => order.items)
    .filter((item) => item.product_id === product.productId)
    .reduce((total, item) => total + item.quantity, 0);
  return Math.max(0, product.stock - reserved);
}

function priceCart(ledger: Ledger, items: { product_id: string; quantity: number }[]): CartQuote {
  const priced = items.map((item) => {
    const product = getProduct(item.product_id);
    if (!product) throw new ShoppingError('product_not_found', 404);
    if (item.quantity > availableStock(ledger, product.productId)) {
      throw new ShoppingError(`insufficient_stock:${product.productId}`, 409);
    }
    return {
      product_id: product.productId, name: product.name, quantity: item.quantity,
      unit_price: product.price, subtotal: Math.round(product.price * 100) * item.quantity / 100,
    };
  });
  return {
    quote_id: randomUUID(), items: priced,
    total: priced.reduce((total, item) => total + Math.round(item.subtotal * 100), 0) / 100,
    currency: 'USD',
  };
}

export function createShoppingSession() {
  return transaction((ledger) => {
    const session: ShoppingSession = { session_id: randomUUID(), cart: null, orders: [], simulated: true };
    ledger.sessions.push(session);
    return session;
  });
}

export function getShoppingSession(id: string) {
  return transaction((ledger) => sessionFrom(ledger, id), false);
}

export function listProducts(query = '', category?: string, maxPrice?: number) {
  return transaction((ledger) => searchProducts(query, category, maxPrice)
    .map((product) => ({ ...product, stock: availableStock(ledger, product.productId) })), false);
}

export function getInventory(productId: string) {
  return transaction((ledger) => {
    const product = getProduct(productId);
    if (!product) throw new ShoppingError('product_not_found', 404);
    return { product_id: product.productId, price: product.price, currency: product.currency,
      stock: availableStock(ledger, productId), order_supported: true, simulated: true };
  }, false);
}

export function setCartItem(sessionId: string, productId: unknown, quantity: unknown) {
  if (typeof productId !== 'string' || !Number.isInteger(quantity) || (quantity as number) < 0 || (quantity as number) > 10) {
    throw new ShoppingError('product_id_and_quantity_0_to_10_required');
  }
  return transaction((ledger) => {
    const session = sessionFrom(ledger, sessionId);
    const product = getProduct(productId);
    if (!product) throw new ShoppingError('product_not_found', 404);
    const items = (session.cart?.items ?? []).filter((item) => item.product_id !== product.productId);
    if ((quantity as number) > 0) items.push({ product_id: product.productId, quantity: quantity as number, name: product.name, unit_price: 0, subtotal: 0 });
    session.cart = items.length ? priceCart(ledger, items) : null;
    return session;
  });
}

export function confirmOrder(sessionId: string, quoteId: unknown, confirmed: unknown) {
  if (confirmed !== true || typeof quoteId !== 'string' || !quoteId) {
    throw new ShoppingError('explicit_confirmation_and_quote_id_required');
  }
  return transaction((ledger) => {
    const session = sessionFrom(ledger, sessionId);
    // Retried confirmation of the same quote returns the original order, even after cancellation.
    if (session.orders.some((order) => order.quote_id === quoteId)) return session;
    if (!session.cart || session.cart.quote_id !== quoteId) throw new ShoppingError('cart_changed_review_again', 409);
    const current = priceCart(ledger, session.cart.items);
    if (current.total !== session.cart.total) throw new ShoppingError('price_changed_review_again', 409);
    session.orders.unshift({ ...session.cart, order_id: `VS-${randomUUID().slice(0, 8).toUpperCase()}`,
      status: 'unpaid', created_at: new Date().toISOString() });
    session.cart = null;
    return session;
  });
}

export function cancelOrder(sessionId: string, orderId: string, confirmed: unknown) {
  if (confirmed !== true) throw new ShoppingError('explicit_cancellation_confirmation_required');
  return transaction((ledger) => {
    const session = sessionFrom(ledger, sessionId);
    const order = session.orders.find((entry) => entry.order_id === orderId);
    if (!order) throw new ShoppingError('order_not_found', 404);
    if (order.status !== 'cancelled') {
      order.status = 'cancelled';
      order.cancelled_at = new Date().toISOString();
    }
    return session;
  });
}
