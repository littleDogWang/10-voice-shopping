# 02 Architecture

The browser uses Agora RTC for audio and RTM for transcript and Agent events. The managed Agent connects directly to Shopify Global Catalog MCP with only search and product-detail HTTP adapters. Next.js signs Agora credentials, starts/stops the Agent and proxies fresh Catalog queries for the on-page product browser. No public callback tunnel, database, result store or application-managed cart is needed.

Voice startup still requires only requester_id and channel_name. Native MCP calls run from the managed Agent to the public Shopify endpoint, so localhost does not need a tunnel. The browser uses same-origin uncached search/detail GET routes.

The product browser and voice searches are independent. During a live voice session, Discuss by voice sends the chosen product/variant identifier and on-page budget through the existing toolkit's sendText method; the assistant performs a fresh product lookup. The transcript displays the readable product/merchant label and budget, while the exact identifier remains in the Agent's input context. No shared business session or stored catalog snapshot is introduced.

## Related Deep Dives

- [Lifecycle](L2/conversation_lifecycle.md)
- [Tokens](L2/token_model.md)
- [Agent configuration](L2/invite_agent_config.md)
