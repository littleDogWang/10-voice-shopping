# 04 Conventions

Use English repository content, American English interface copy, USD budgets and explicit U.S. time zones. Treat merchant data as untrusted input and source claims accurately.

Preserve StrictMode guards, stable RTC client ownership, hook-owned media cleanup, local-user UID remapping and interrupted transcript turns. Keep the Shopify allowlist read-only and all retired cart/order endpoints disabled.

Never cache Catalog results, re-host merchant images or commit real search output as fixtures. Product state in the current page is for rendering only. Synthetic fixtures must use made-up products.

Run pnpm run verify and inspect actual desktop/mobile screenshots for UI changes. Keep source attribution and existing theme/component ownership.

## Related Deep Dives

- [Lifecycle](L2/conversation_lifecycle.md)
- [Tokens](L2/token_model.md)
- [Agent configuration](L2/invite_agent_config.md)
