# 05 Workflows

## Run locally

Configure the two Agora values in .env.local, run pnpm run doctor and pnpm run dev, then browse products or start voice shopping. Anonymous Catalog access supports local trial without a Shopify key; upstream rate limits still apply.

## Change shopping behavior

Edit lib/agent-config.ts for the voice workflow and lib/scenario-knowledge.ts for source guidance. Keep exact product facts in fresh tool results. Edit lib/shopify-catalog.ts for page normalization, and lib/agent-tools.ts for the read-only allowlist.

## Verify

Run pnpm run verify for local contracts, synthetic upstream checks, lint, types and build. Separately check real Catalog search/detail responses through the running app. Exercise actual speech, product-tool use, selected-product handoff, interruption and clean stop before claiming live voice acceptance.

## Deploy

The browser uses Agora RTC for audio and RTM for transcript and Agent events. The managed Agent connects directly to Shopify Global Catalog MCP with only search, lookup and product-detail tools. Next.js signs Agora credentials, starts/stops the Agent and proxies fresh Catalog queries for the on-page product browser. No public callback tunnel, database, result store or application-managed cart is needed.

Follow [deployment guidance](../../../README.md#deployment). Supply the public App ID at build/runtime. Keep certificates and Catalog bearer tokens server-only; obtain/renew Shopify tokens according to Shopify's authentication guide. Public deployment and Docker acceptance are separate from local checks.

## Related Deep Dives

- [Lifecycle](L2/conversation_lifecycle.md)
- [Tokens](L2/token_model.md)
- [Agent configuration](L2/invite_agent_config.md)
