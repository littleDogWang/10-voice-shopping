# Voice Shopping Assistant Architecture

## Voice

The browser uses Agora RTC for audio and RTM for transcript and Agent events. The managed Agent connects directly to Shopify Global Catalog MCP with only search and product-detail HTTP adapters. Next.js signs Agora credentials, starts/stops the Agent and proxies fresh Catalog queries for the on-page product browser. No public callback tunnel, database, result store or application-managed cart is needed.

The original token, invite, RTM setup, guarded RTC mount, renewal and stop paths retain their ownership. Agent startup requires requester_id and channel_name only. lib/agent-tools.ts configures the HTTP-to-MCP endpoint and only SearchShopifyProducts and GetShopifyProduct; the optional bearer token never reaches the browser.

## Product browser

components/ShopifyCatalog.tsx calls GET /api/catalog/search and GET /api/catalog/product on explicit actions. lib/shopify-catalog.ts validates inputs, injects the UCP profile and U.S. context, applies a 12-second deadline and normalizes current product/variant information. Both routes and upstream fetches use no-store.

The page displays the selected variant's price and availability and renders merchant images directly. View at store and Continue to merchant navigate to returned HTTPS links. The application creates no cart or checkout.

## Product handoff

Page and voice searches are independent. During an active voice session, Discuss by voice sends a selected product/variant ID and the on-page budget using the existing toolkit's sendText over RTM. The prompt requires a fresh GetShopifyProduct lookup and preserves uncertainty about unsupported specifications.

## State and failures

Only current-page rendering and conversation state are retained. There is no catalog cache, database or persistent business session. Retired simulated routes return 410. Invalid Catalog input returns 400; 429 preserves Retry-After; upstream/malformed responses return 502 and deadline expiry returns 504. Errors never fall back to fictional products.

## Verification

pnpm run verify includes actual HTTP client requests to a synthetic local upstream and mocked Agent startup with a read-only HTTP allowlist. Real Catalog traffic, rendered UI, Docker and real voice acceptance are distinct evidence scopes.

## MCP reply compatibility

Shopify can return a JSON-RPC result containing structuredContent without a content array. A real test Agent reached Shopify and received HTTP 200, but Agora's native MCP client's CallToolResult validator rejected that reply with content: Field required. The two explicit synchronous HTTP tools send JSON-RPC directly to the same official Shopify MCP endpoint and return the original JSON to the model, avoiding that incompatible validator. Profile and U.S./USD arguments are fixed in the adapter; the model supplies only search/budget or a product ID. No proxy host or callback tunnel is added.
