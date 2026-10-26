# Voice Shopping Design

## Goal and source

Complete electronics selection through a saved unpaid simulated order. Inspiration: [LiveKit Personal Shopper](https://github.com/livekit-examples/python-agents-examples/tree/main/complex-agents/personal_shopper). The original Python example has customer routing, order items, database order persistence and order history; its return function only emits a confirmation. This implementation reuses the business progression, not its multi-agent architecture or production commerce claims.

## User flow

1. Describe budget, device, intended use and preferences.
2. Search and compare three microphones or three cameras using documented attributes, fixed prices and available simulated stock.
3. Add products, replace models, change quantity or remove items. The server recalculates every quote.
4. Review all items, quantities and the USD total. Any cart edit invalidates the previous quote.
5. Explicitly confirm the exact quote by voice or the confirmation Dialog. Save an unpaid order and display its number and status.
6. Refresh or reopen the same browser session to retrieve saved orders. Confirm cancellation to cancel an unpaid order and release simulated stock.

## Data and ownership

The browser stores a random shopping session identifier in localStorage. Cart/order APIs and voice tools are bound to that same session. Identifiers are capability tokens: possession grants access to that simulated session; this sample does not implement customer identity or login. There is no endpoint for listing all shoppers.

`shopping.ts` reads a local ledger at `.scenario-data/shopping.json`, serializes operations in one Node process and replaces the ledger atomically. `SHOPPING_DATA_FILE` optionally supplies a different file for isolated verification. Server catalog values determine all prices and totals. Confirmed unpaid orders reserve simulated stock; cancellation releases it. Cart quotes do not reserve stock. Confirmation validates availability again. Duplicate confirmation returns the original order; duplicate cancellation preserves its original timestamp.

A single Node process with persistent writable disk is required. Multi-process deployments, serverless ephemeral disk and distributed inventory are outside this release. Do not present local persistence as production order storage.

## Agent tools

`search_products`, `get_inventory`, `get_shopping_session`, `set_cart_item`, `confirm_order`, `get_order`, `cancel_order`. Session-scoped URLs are generated server-side during invite; the model never supplies a shopper identifier. `set_cart_item` sets the total quantity rather than incrementing it. Confirmation/cancellation tools must only be called after explicit user consent. This conversation policy still needs real voice acceptance; HTTP tests cannot establish model compliance.

Agora must be able to reach this application's public HTTPS origin via `TOP_TEN_SCENARIO_TOOL_BASE_URL`. Missing tools or a missing/unknown shopping session reject startup before a voice agent is created.

## Interface

The initial Dialog explains this scenario with Start Voice Shopping and Browse Products actions. Scenario 09 / Voice Shopping remains visible after dismissal. The product catalog, comparison table, basket and saved-order cards remain available before, during and after voice. Poll the real session during a voice call so tool writes appear on the page. Reuse vendored shczhen/agent-ui Dialog, ConversationPanel and VoiceDock with real session callbacks, status, transcript and microphone devices; preserve the source/theme provenance.

## Boundaries and failure handling

All catalog products, prices and inventory are fictional examples. Saved orders stay unpaid; there is no payment, tax, shipping, fulfillment, refund, coupon or real reservation operation. After-sales troubleshooting remains scenario 02, with no automatic handoff implemented here.

Failed writes never produce success copy. Missing products/sessions/orders return 404, invalid input returns 400, stale quotes or insufficient stock return 409, and unavailable storage returns 500. A failed confirmation preserves the basket. Do not auto-substitute, auto-confirm a changed quote or create a replacement order.
