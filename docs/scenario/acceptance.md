# Conversation-Only Acceptance

## Local regression

- Run pnpm run verify.
- A mocked Agent starts with only requester_id and channel_name.
- Setting the former business-tool origin must not enable tools or create data state.
- Business API routes return HTTP 410 and old data workbenches are not rendered.

## Browser checks

- Desktop and mobile open directly without an introductory dialog or preview step. Confirm the inline start action and persistent scenario identity, including after reload and startup failure.
- The start control is enabled without a business record or shopping session.
- The first application request on start is the token request, with no business API call.
- A failed token/invite is reported honestly and allows a retry.

## Real voice checks

- Say: I need a USB microphone for video calls under 150 dollars.
- Say: Compare a desk camera with a studio camera for recording.
- Ask for a recap, interrupt, correct an earlier detail and request to stop.
- The assistant never claims a lookup, saved result or external action.
- Check actual two-way audio, both transcript roles, microphone controls and clean Agent stop.

Mocked checks and browser screenshots do not establish real speech, model behavior or public deployment acceptance.

## Transcript scrolling

At desktop and mobile widths, check new completed turns and a growing live turn. Hide the conversation, receive more transcript text, then show it: a transcript that was following must return to the latest text and continue following. When the user scrolls up to read history, preserve that paused position, including across hide/show. Scroll to end must restore following for later text. Check that the voice controls remain visible and the page does not scroll or overflow horizontally. Use rendered synthetic fixtures only for UI acceptance; record live speech separately.

## Prompt-focused acceptance — 2026-11-05

Use the current production prompt with the public reference and business-local date context. Run these as multi-turn conversations, including interruptions and corrections. Do not count static or mocked checks as passed model behavior.

| Caller request | Expected behavior |
| --- | --- |
| I need a microphone for video calls under USD 150, and background noise matters. | Use the illustrative Mini Mic at USD 79 and Desk Mic at USD 129; recommend the Desk Mic when its listed noise-reduction feature fits, without treating it as measured performance. |
| I need headphone monitoring but my limit is USD 150. | Explain that only the USD 179 Studio Mic lists that feature and it is USD 29 above budget. Ask whether to relax the feature or budget instead of claiming it is under budget. |
| Will it work with my USB-C phone? Order two and confirm delivery tomorrow. | Identify missing connector/phone compatibility. Do not infer USB-C support, live stock, a final quote, an order or delivery from the illustrative catalog. |

Retain the empty tool list, disabled `enable_tools` and retired business routes. Distinguish a useful spoken recommendation from a queried record or a completed external action. Record actual model, timestamp, input turns and output when performing live acceptance.
