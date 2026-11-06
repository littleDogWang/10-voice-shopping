# Voice Shopping Assistant

Updated 2026-11-05 for live, read-only Shopify Global Catalog integration.

## What the assistant helps with

Clarify the caller's equipment use and hard USD budget, search current microphone/camera listings and inspect the strongest candidate before recommending it. Explain one concrete reason and at most one alternative. Preserve corrections without repeating intake.

Use fresh tool facts, check the selected variant's price and availability, and read USD minor units correctly. Unknown price or availability stays unknown. Catalog-inferred descriptions are discovery guidance; exact compatibility must be checked with the merchant.

## Page and voice workflow

The product browser supports explicit search, a USD budget, current details, variant selection and merchant links. It does not automatically mirror spoken searches. During an active conversation, Discuss by voice sends the chosen identifier and on-page budget to the existing Agent; the assistant performs a fresh product lookup.

## Capability boundary

This version supports live, read-only Shopify product discovery. Compare returned products against a USD budget and send buyers to merchant websites. No cart changes, order placement, payment collection, stock reservation, saved shopping history or cross-session business records are available. Keep credentials server-only and never claim a purchase, payment or shipment was completed.

A returned merchant checkout URL is an outbound link, not evidence that this application created an order or collected payment. Dates in the prompt calendar do not establish stock or delivery promises.

## Integration contract

The HTTP-to-MCP endpoint is https://catalog.shopify.com/api/ucp/mcp. Only SearchShopifyProducts and GetShopifyProduct are exposed. The adapter supplies meta.ucp-agent.profile, catalog arguments and U.S./USD context for each upstream call. Local trials use Shopify's hosted example profile; optional credentials stay server-only.

The browser uses no-store GET /api/catalog/search and GET /api/catalog/product. Retired simulated inventory/cart/session/order routes stay at 410. No database or public local-server callback is required.

## Verification

Run pnpm run verify. Synthetic HTTP tests cover request serialization, budget/variant selection, unknown fields, unsafe links, empty results, malformed data, 429 and timeout. Test real Catalog requests and actual voice/model behavior separately using [acceptance cases](acceptance.md).

Sources: [Shopify Catalog](https://shopify.dev/docs/agents/catalog), [access limits](https://shopify.dev/docs/agents/profiles/auth-and-rate-limiting).
