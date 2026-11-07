# Read-Only Shopping Acceptance

## Local regression

- Run pnpm run verify.
- A mocked Agent starts with only requester_id and channel_name and exposes only the two read-only Shopify Catalog adapters.
- The actual SDK Agent receives static waiting fillers with a 1500 ms fixed-time trigger. This configuration check does not establish audible playback.
- Former business-tool origin variables cannot enable custom cart/order tools. Retired simulated routes return HTTP 410.
- Synthetic HTTP fixtures verify required UCP metadata, U.S./USD context, minor-unit budgets, variant price selection, unknown price/stock, safe URLs, JSON/SSE replies, empty results, explicit 429 with Retry-After, malformed replies and deadlines.

## Browser checks

- Desktop/mobile open directly without an introductory overlay. Retain persistent identity, initial voice action and no microphone/product query on page load.
- Confirm there is no manual product search, product-card area or purchase control. The shared start action and scenario identity remain prominent.
- Confirm the upper-right header shows FAQ beside Inspector and Build. There is no FAQ section below the workspace or secondary link beside the start action. The FAQ drawer is closed on initial entry.
- Open FAQ from the header. Confirm a right-side drawer on desktop and a full-width drawer on mobile. Expand and collapse answers by pointer and keyboard, including the example request, wait explanation and microphone troubleshooting. Opening, reading or closing FAQ must not start a session or make a Catalog query.
- Check Escape, the close button and backdrop dismissal. Focus remains inside the open drawer and returns to FAQ when it closes. Inspector and Build still open from their own controls.
- Inspect collapsed and expanded answers at desktop/mobile widths. Long content scrolls inside the drawer while its heading and close control stay available. There is no horizontal overflow, clipped answer or hidden focus ring.
- Inspect inline synthetic startup failure and retry states. Keep synthetic responses distinct from real microphone and provider acceptance.

## Real voice checks

- Say: Find a USB microphone for video calls under 150 dollars.
- The assistant calls Shopify, checks the selected variant and explains one recommendation with a specific reason.
- Correct the budget or compatibility requirement; the assistant revises its search without inventing missing specifications.
- Verify that the assistant identifies products and merchants by name without referring to removed page buttons or claiming that it displayed a purchase link.
- Exercise a response wait longer than 1500 ms and verify a short spoken filler, the subsequent recommendation and user interruption. Include TTS and transport time when measuring audible onset; the threshold is not an end-to-end latency guarantee.
- Ask to order two and guarantee delivery tomorrow. The assistant provides a merchant handoff without claiming an order, payment, reservation or delivery promise.
- Exercise both transcript roles, interruption, mute/unmute and clean stop.

HTTP checks and screenshots do not establish real speech or hosted acceptance.

## Transcript scrolling

At desktop and mobile widths, check new completed turns and a growing live turn. Hide the conversation, receive more transcript text, then show it: a transcript that was following must return to the latest text and continue following. When the user scrolls up to read history, preserve that paused position, including across hide/show. Scroll to end must restore following for later text. Check that the voice controls remain visible and the page does not scroll or overflow horizontally. Use rendered synthetic fixtures only for UI acceptance; record live speech separately.


## Public identity acceptance — 2026-11-05

At 1440x1000 and 390x844, compare the header, main heading and browser title: all must use the same public name. Confirm that the internal numbered scenario ID is absent from visible page text, including after reload and a failed start/retry. Open Build and its assistant prompt; use the public name there as well. Check wrapping, control visibility and horizontal overflow. The real source URL and machine diagnostic IDs are not renamed by this display change.
