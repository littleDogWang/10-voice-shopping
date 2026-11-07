# Voice Shopping Assistant Architecture

## Voice

The browser uses Agora RTC for audio and RTM for transcript and Agent events. The managed Agent connects directly to Shopify Global Catalog MCP with only search and product-detail HTTP adapters. Next.js signs Agora credentials and starts/stops the Agent. No public callback tunnel, database, result store or application-managed cart is needed.

The original token, invite, RTM setup, guarded RTC mount, renewal and stop paths retain their ownership. Agent startup requires requester_id and channel_name only. lib/agent-tools.ts configures the HTTP-to-MCP endpoint and only SearchShopifyProducts and GetShopifyProduct; the optional bearer token never reaches the browser.

## Scenario page

The page keeps the shared ScenarioIdentity, QuickstartPreCallCard, ConversationWorkspace, voice controls, transcript, Inspector and Build guide. The header's FAQ trigger and components/ScenarioFaq.tsx share an existing Radix Dialog root in LandingPage. FAQ opens a right-side drawer using the same edge-panel layout as Inspector, with native disclosure items in a scrollable body. Dialog handles focus trapping, Escape, backdrop dismissal and returning focus to the trigger. It is closed by default; there is no FAQ section below the workspace or link beside the start action. Reading or expanding the FAQ starts neither a microphone session nor a Catalog request.

There is no page-owned product browser or product-selection handoff. Voice instructions identify products and merchants by name and do not direct the caller to nonexistent page controls. Purchases happen independently on merchant websites.

## Waiting feedback

The Agent constructor configures fillerWords with enable=true, a fixed_time trigger of 1500 ms and three static phrases selected with shuffle. The SDK serializes this as properties.filler_words. Tool waits reuse the same filler configuration; there is no separate tool-only trigger or extra filler LLM request. failureMessage is a failure fallback, not a waiting trigger. Audible timing and interruption need real voice acceptance.

## Read-only diagnostics

GET /api/catalog/search and GET /api/catalog/product remain available for diagnostics and HTTP regression checks. The public page does not call these routes. lib/shopify-catalog.ts validates inputs, injects the UCP profile and U.S. context, applies a 12-second deadline and normalizes fresh product data. Both routes and upstream fetches use no-store.

## State and failures

Only current-page rendering and conversation state are retained. There is no catalog cache, database or persistent business session. Retired simulated routes return 410. Invalid Catalog input returns 400; 429 preserves Retry-After; upstream/malformed responses return 502 and deadline expiry returns 504. Errors never fall back to fictional products.

## Verification

pnpm run verify includes actual HTTP client requests to a synthetic local upstream and mocked Agent startup with a read-only HTTP allowlist. Real Catalog traffic, rendered UI, Docker and real voice acceptance are distinct evidence scopes.

## MCP reply compatibility

Shopify can return a JSON-RPC result containing structuredContent without a content array. A real test Agent reached Shopify and received HTTP 200, but Agora's native MCP client's CallToolResult validator rejected that reply with content: Field required. The two explicit synchronous HTTP tools send JSON-RPC directly to the same official Shopify MCP endpoint and return the original JSON to the model, avoiding that incompatible validator. Profile and U.S./USD arguments are fixed in the adapter; the model supplies only search/budget or a product ID. No proxy host or callback tunnel is added.
