# 03 Code Map

- components/LandingPage.tsx: unchanged voice bootstrap/teardown ownership and selected-product handoff to the current Agent.
- components/ConversationComponent.tsx: guarded RTC/toolkit integration, transcript and media controls.
- components/agent-ui/conversation-panel.tsx: controlled transcript following, last visible history position and explicit Scroll to end recovery.
- lib/conversation.ts: role/turn normalization and display-only removal of generated Catalog lookup context from local-user product actions.
- components/ShopifyCatalog.tsx and styles/catalog.css: explicit product search, result cards, fresh details, variant selection and merchant links.
- lib/shopify-config.ts: fixed official Catalog endpoint, local example profile and optional server-only bearer header.
- lib/shopify-catalog.ts and types/shopify.ts: MCP request/response handling, validation, USD budgets, missing-field handling and normalized page data.
- lib/agent-tools.ts: read-only HTTP tool allowlist; retired custom cart/order tools remain empty.
- lib/agent-config.ts: source-aware shopping prompt and source-aware product guidance.
- lib/scenario-knowledge.ts and lib/prompt-context.ts: source guidance, conversation rules and U.S. date context, without cached listings.
- app/api/catalog/search/route.ts and app/api/catalog/product/route.ts: no-store browser-facing lookups.
- scripts/verify-shopping-boundary.ts: read-only Agent startup and disabled legacy writes.
- scripts/verify-shopify.ts: actual HTTP requests to a synthetic local upstream, including rate limits, malformed replies and deadlines.
- scripts/verify-api-contracts.ts: token/start/stop and optional custom-LLM route contracts.

## Related Deep Dives

- [Lifecycle](L2/conversation_lifecycle.md)
- [Tokens](L2/token_model.md)
- [Agent configuration](L2/invite_agent_config.md)
