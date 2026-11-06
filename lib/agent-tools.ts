import type { LlmTool } from 'agora-agents';
import { getShopifyAgentProfile, getShopifyHeaders, SHOPIFY_CATALOG_ENDPOINT } from './shopify-config';

// Shopify returns structuredContent without content; synchronous HTTP tools preserve that JSON.
// The native MCP client's CallToolResult validator currently rejects this otherwise successful reply.
export function getScenarioTools(..._inactiveOptions: unknown[]): LlmTool[] {
  const meta = { 'ucp-agent': { profile: getShopifyAgentProfile() } };
  const context = { address_country: 'US', currency: 'USD', language: 'en-US' };
  const server = { method: 'POST' as const, url: SHOPIFY_CATALOG_ENDPOINT,
    headers: { ...getShopifyHeaders(), Accept: 'application/json' }, timeout_ms: 12_000 };
  return [
    {
      type: 'function',
      function: {
        name: 'SearchShopifyProducts',
        description: 'Search current microphones and cameras from Shopify merchants in the United States. Returns JSON-RPC result.structuredContent.products with real offers and USD prices in cents. Read-only; does not create a cart or purchase.',
        parameters: {
          type: 'object', additionalProperties: false,
          properties: {
            query: { type: 'string', minLength: 1, maxLength: 180, description: 'Specific product/use-case search, such as USB microphone for video calls.' },
            maxPriceCents: { type: 'integer', minimum: 1, maximum: 10_000_000, description: 'Hard USD price cap in cents: USD 150 is 15000. Use 10000000 only when the caller explicitly has no budget cap.' },
          },
          required: ['query', 'maxPriceCents'],
        },
      },
      server: { ...server, body: { jsonrpc: '2.0', id: '{{tool_call_id}}', method: 'tools/call',
        params: { name: 'search_catalog', arguments: { meta, catalog: {
          query: '{{args.query}}', context, pagination: { limit: 4 },
          filters: { available: true, ships_to: { country: 'US' }, price: { max: '{{args.maxPriceCents}}' } },
        } } } } },
    },
    {
      type: 'function',
      function: {
        name: 'GetShopifyProduct',
        description: 'Retrieve fresh details for a returned Shopify product or variant ID. Returns JSON-RPC result.structuredContent.product with variant price in cents, availability, merchant and purchase links. Read-only.',
        parameters: {
          type: 'object', additionalProperties: false,
          properties: { id: { type: 'string', pattern: '^gid://shopify/(p|Product|ProductVariant)/[A-Za-z0-9_-]+$', description: 'Use an exact product or variant ID from search results or the caller-selected product.' } },
          required: ['id'],
        },
      },
      server: { ...server, body: { jsonrpc: '2.0', id: '{{tool_call_id}}', method: 'tools/call',
        params: { name: 'get_product', arguments: { meta, catalog: { id: '{{args.id}}', context } } } } },
    },
  ];
}

// An obsolete origin variable cannot reactivate the retired simulated cart/order tools.
export function getToolBaseUrl(..._inactiveOptions: unknown[]): null { return null; }
