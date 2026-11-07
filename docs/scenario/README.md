# Voice Shopping Assistant

Updated 2026-11-07 for the shared voice layout, header FAQ drawer and built-in waiting feedback.

## What the assistant helps with

Clarify the caller's equipment use and hard USD budget, search current microphone/camera listings and inspect the strongest candidate before recommending it. Explain one concrete reason and at most one alternative. Preserve corrections without repeating intake.

Use fresh tool facts, check the selected variant's price and availability, and read USD minor units correctly. Unknown price or availability stays unknown. Catalog-inferred descriptions are discovery guidance; exact compatibility must be checked with the merchant.

## Page and voice workflow

The page uses the shared scenario identity, voice start action, conversation workspace, transcript, Inspector and Build guide. FAQ in the upper-right header opens a right-side drawer explaining microphone permission, example requests, U.S./USD scope, lookup waits and merchant-only purchasing. It stays closed until requested and has a scrollable body on narrow or short screens. There is no manual product browser or FAQ section below the workspace. The caller describes requirements by voice; the Agent searches and checks product details before giving a concise recommendation and merchant name.

The Agent enables static filler words after a 1500 ms response wait, including tool waits. This acknowledgement does not shorten the underlying lookup. Verify audible playback and interruption separately from configuration tests.

## Capability boundary

This version supports live, read-only Shopify product discovery. Compare returned products against a USD budget and send buyers to merchant websites. No cart changes, order placement, payment collection, stock reservation, saved shopping history or cross-session business records are available. Keep credentials server-only and never claim a purchase, payment or shipment was completed.

An upstream merchant checkout URL does not establish that this application created an order or collected payment. Spoken answers identify the product and merchant without claiming that purchase controls are displayed. Dates in the prompt calendar do not establish stock or delivery promises.

## Integration contract

The HTTP-to-MCP endpoint is https://catalog.shopify.com/api/ucp/mcp. Only SearchShopifyProducts and GetShopifyProduct are exposed. The adapter supplies meta.ucp-agent.profile, catalog arguments and U.S./USD context for each upstream call. Local trials use Shopify's hosted example profile; optional credentials stay server-only.

The retained diagnostic GET /api/catalog/search and GET /api/catalog/product routes use no-store and are not part of the public page workflow. Retired simulated inventory/cart/session/order routes stay at 410. No database or public local-server callback is required.

## Verification

Run pnpm run verify. Synthetic HTTP tests cover request serialization, budget/variant selection, unknown fields, unsafe links, empty results, malformed data, 429 and timeout. Test real Catalog requests and actual voice/model behavior separately using [acceptance cases](acceptance.md).

Sources: [Shopify Catalog](https://shopify.dev/docs/agents/catalog), [access limits](https://shopify.dev/docs/agents/profiles/auth-and-rate-limiting).
