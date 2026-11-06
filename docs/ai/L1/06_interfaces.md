# 06 Interfaces

- GET /api/generate-agora-token accepts optional uid/channel and returns token, uid and channel.
- POST /api/invite-agent requires requester_id and channel_name; it enables only the read-only Shopify HTTP-to-MCP allowlist.
- POST /api/stop-conversation accepts agent_id and retains idempotent stop behavior.
- POST /api/chat/completions remains an optional, unwired custom-LLM proxy.
- GET /api/catalog/search?q=...&budget=150 performs a fresh U.S./USD search. Budget is optional, positive and at most 100,000 USD.
- GET /api/catalog/product?id=... retrieves a returned Shopify product/variant GID.
- Catalog routes return no-store JSON; invalid input returns 400, rate limiting 429 plus Retry-After, upstream failures 502 and deadlines 504.
- Retired app/api/scenarios cart/order/session/inventory routes continue to return HTTP 410 without operations.

The managed Agent uses https://catalog.shopify.com/api/ucp/mcp directly with SearchShopifyProducts and GetShopifyProduct. The adapter supplies meta.ucp-agent.profile and a catalog object for each upstream JSON-RPC request; the model supplies only query/budget or product ID. Browser product lookups are independent of voice tool results; Discuss by voice explicitly sends a selected identifier through RTM.

## Related Deep Dives

- [Lifecycle](L2/conversation_lifecycle.md)
- [Tokens](L2/token_model.md)
- [Agent configuration](L2/invite_agent_config.md)
