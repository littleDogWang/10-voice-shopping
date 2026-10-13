import type { LlmTool } from 'agora-agents';
type Property = Record<string, unknown>;
function tool(baseUrl: string, name: string, description: string, method: 'GET' | 'POST', path: string, properties: Property, required: string[], body?: Record<string, unknown>): LlmTool {
  return { type: 'function', function: { name, description, parameters: { type: 'object', properties, required } }, server: { method, url: `${baseUrl.replace(/\/$/, '')}${path}`, ...(body ? { body } : {}) } };
}
export function getScenarioTools(_scenarioId: string, baseUrl = process.env.TOP_TEN_SCENARIO_TOOL_BASE_URL): LlmTool[] {
  if (!baseUrl) return [];
  const stringProperty = { type: 'string' };
  const integerProperty = { type: 'integer' };
  return [
        tool(baseUrl, 'search_products', 'Search the fixed product catalog.', 'GET', '/api/scenarios/09-voice-shopping/products?q={{args.query}}', { query: stringProperty }, ['query']),
        tool(baseUrl, 'get_inventory', 'Read exact price and stock; this never places an order.', 'GET', '/api/scenarios/09-voice-shopping/inventory?product_id={{args.product_id}}', { product_id: stringProperty }, ['product_id']),
      ];
}
