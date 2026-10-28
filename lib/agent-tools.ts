import type { LlmTool } from 'agora-agents';

export function getToolBaseUrl(value = process.env.TOP_TEN_SCENARIO_TOOL_BASE_URL): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/\.$/, '');
    const localHost = (!host.includes('.') && !host.startsWith('[')) || /(^|\.)(localhost|local|internal)$/.test(host) ||
      /^(0\.|10\.|127\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(host) ||
      /^(\[::|\[f[cd]|\[fe[89ab])/.test(host);
    if (url.protocol !== 'https:' || localHost || url.username || url.password || url.search || url.hash) return null;
    return url.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

export function getScenarioTools(_scenarioId: string, baseUrl = process.env.TOP_TEN_SCENARIO_TOOL_BASE_URL, sessionId?: string): LlmTool[] {
  const origin = getToolBaseUrl(baseUrl);
  if (!origin || !sessionId) return [];
  const root = `${origin}/api/scenarios/10-voice-shopping`;
  const session = `/sessions/${encodeURIComponent(sessionId)}`;
  const text = { type: 'string' };
  function tool(name: string, description: string, method: 'GET' | 'POST', path: string,
    properties: Record<string, unknown> = {}, body?: Record<string, unknown>): LlmTool {
    return { type: 'function', function: { name, description,
      parameters: { type: 'object', properties, required: Object.keys(properties) } },
      server: { method, url: `${root}${path}`, ...(body ? { body } : {}) } };
  }
  return [
    tool('search_products', 'Search the fixed fictional catalog. Query with a category or attribute; compare returned products and prices against the user budget. All stock is simulated.', 'GET', '/products?q={{args.query}}', { query: text }),
    tool('get_inventory', 'Check the exact catalog price and available simulated stock before recommending a purchase.', 'GET', '/inventory?product_id={{args.product_id}}', { product_id: text }),
    tool('get_shopping_session', 'Read this shopper basket, current quote and saved orders. Use before changing the basket and to query order status. Never ask for a session identifier.', 'GET', session),
    tool('set_cart_item', 'Set the total quantity for one product, not an increment. Use 0 to remove it. The returned quote replaces any earlier quote; read back its items and total and ask for explicit confirmation before confirm_order.', 'POST', `${session}/cart`,
      { product_id: text, quantity: { type: 'integer', minimum: 0, maximum: 10 } },
      { product_id: '{{args.product_id}}', quantity: '{{args.quantity}}' }),
    tool('confirm_order', 'Only call after the user explicitly confirms the exact items, quantities and total in the latest quote you read aloud. Saves a simulated UNPAID order; never charges money or arranges shipping. Return the saved order number and status.', 'POST', `${session}/orders`,
      { quote_id: text }, { quote_id: '{{args.quote_id}}', confirmed: true }),
    tool('get_order', 'Look up an order number within this shopping session.', 'GET', `${session}/orders/{{args.order_id}}`, { order_id: text }),
    tool('cancel_order', 'Only call after the user explicitly confirms cancellation of this unpaid simulated order. Cancellation releases simulated stock; no refund is involved.', 'POST', `${session}/orders/{{args.order_id}}`,
      { order_id: text }, { confirmed: true }),
  ];
}
