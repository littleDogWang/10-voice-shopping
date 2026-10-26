# 09 Voice Shopping

Compare fictional electronics and continue through a saved unpaid simulated order. The fixed catalog contains three microphones and three cameras, including an out-of-stock option.

Use the catalog or voice assistant to edit the basket, review a server-priced quote, confirm it, then look up or cancel the resulting order. The page and agent share the same shopping session. Orders survive page reloads in the same browser and a single Node server restart when its disk is retained.

No real payment, shipping, fulfillment or refund is implemented. The local file-backed store requires a single Node process with persistent writable disk. See [architecture](../../ARCHITECTURE.md), [acceptance](acceptance.md) and the root README for setup and API contracts.


## Local conversation and optional tools

Default conversations append catalog.json products, attributes, USD prices and fixed fictional stock to the prompt. The assistant can compare products and summarize purchase intent and estimated totals; it cannot update the browser basket, create server quotes, save/cancel orders or reserve stock. Browser business APIs remain available independently. A public HTTPS tool origin enables the existing seven session-bound tools; tool-mode facts and outcomes require successful responses, with no fixture fallback.

TOP_TEN_SCENARIO_TOOL_BASE_URL is optional. Only an explicitly configured public HTTPS endpoint enables tools; malformed, HTTP, localhost and local/private origins leave tools disabled. URL validation does not prove network reachability. No tunnel, knowledge base or database is needed for the default conversation. Local checks do not establish live speech or cloud callback acceptance.

## Source locations

This guide lives in documentation; executable code uses the standalone Next.js
Quickstart layout. Agent instructions and prompt assembly are in
[lib/agent-config.ts](../../lib/agent-config.ts), optional tool contracts are in
[lib/agent-tools.ts](../../lib/agent-tools.ts), and presentation content is in
[lib/presentation.ts](../../lib/presentation.ts). Business modules and fixtures
live in [lib/voice-shopping/](../../lib/voice-shopping/). File basenames in this guide
refer to these source locations, not to files next to this document.
