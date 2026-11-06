# 07 Gotchas

The old Shopify /api/mcp endpoint is removed. Use the Global Catalog /api/ucp/mcp endpoint and required UCP agent-profile argument. Do not substitute Shopify's developer-documentation MCP.

Catalog money uses minor units. A USD amount of 5699 means $56.99. A hard USD budget must filter the selected available variant, not merely a parent price range. Missing price or availability remains unknown. Catalog-inferred specifications need merchant verification.

Anonymous access is rate limited by IP and a shared pool; it is for local trials, with no throughput guarantee. Surface 429 and Retry-After honestly. Results and merchant images must not be cached or copied into fixtures.

Keep the combined token, StrictMode guard, RTM identity and interrupted turns. Browser fixtures and HTTP tests do not establish voice acceptance. The date calendar supplies dates, not stock or delivery promises.

When hiding/showing a transcript, restore following only if it was previously active. Preserve history reading and Scroll to end behavior; verify streaming and hidden arrivals at desktop/mobile widths.

ConversationPanel keeps the last visible scroll position and controls the primitive's autoScroll state. Hiding disables primitive auto-scroll; showing restores either the saved history position or following, and Scroll to end explicitly resumes it. A display-only product-reference filter must not alter IDs, roles or streaming status.

## Related Deep Dives

- [Lifecycle](L2/conversation_lifecycle.md)
- [Tokens](L2/token_model.md)
- [Agent configuration](L2/invite_agent_config.md)
