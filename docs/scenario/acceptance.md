# Read-Only Shopping Acceptance

## Local regression

- Run pnpm run verify.
- A mocked Agent starts with only requester_id and channel_name and exposes only the two read-only Shopify Catalog adapters.
- Former business-tool origin variables cannot enable custom cart/order tools. Retired simulated routes return HTTP 410.
- Synthetic HTTP fixtures verify required UCP metadata, U.S./USD context, minor-unit budgets, variant price selection, unknown price/stock, safe URLs, JSON/SSE replies, empty results, explicit 429 with Retry-After, malformed replies and deadlines.

## Browser checks

- Desktop/mobile open directly without an introductory overlay. Retain persistent identity, initial voice action and no microphone/product query on page load.
- Search real microphones under USD 150, inspect returned cards, open fresh details, change an available variant and inspect the corresponding merchant link.
- Browse products does not start a voice session. Discuss by voice is disabled until the existing voice session is live.
- Use synthetic responses to inspect loading, empty, long-title and rate-limit/error states. Product images load directly from returned URLs. There is no horizontal overflow.
- Reload clears page results; no localStorage, indexedDB, application database or cached Catalog snapshot stores them.

## Real voice checks

- Say: Find a USB microphone for video calls under 150 dollars.
- The assistant calls Shopify, checks the selected variant and explains one recommendation with a specific reason.
- Correct the budget or compatibility requirement; the assistant revises its search without inventing missing specifications.
- Open a product and choose Discuss by voice. Verify a fresh GetShopifyProduct call for the selected identifier and a response using the on-page budget.
- Ask to order two and guarantee delivery tomorrow. The assistant provides a merchant handoff without claiming an order, payment, reservation or delivery promise.
- Exercise both transcript roles, interruption, mute/unmute and clean stop.

HTTP checks and screenshots do not establish real speech or hosted acceptance.

## Transcript scrolling

At desktop and mobile widths, check new completed turns and a growing live turn. Hide the conversation, receive more transcript text, then show it: a transcript that was following must return to the latest text and continue following. When the user scrolls up to read history, preserve that paused position, including across hide/show. Scroll to end must restore following for later text. Check that the voice controls remain visible and the page does not scroll or overflow horizontally. Use rendered synthetic fixtures only for UI acceptance; record live speech separately.
