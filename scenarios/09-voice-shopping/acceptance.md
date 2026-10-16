# Voice Shopping Acceptance

## Automated behavior

Run `pnpm run verify:shopping` and `pnpm run verify:api`.

- Category/attribute/budget filtering returns exact catalog values; zero-stock products remain visible.
- Reject malformed JSON, invalid quantities, missing products, unavailable stock and unknown sessions.
- Ignore caller-provided prices and totals; calculate every line and total on the server.
- Editing a cart invalidates old quotes; reject missing or non-boolean confirmation.
- Confirmed orders have numbers, status unpaid, exact items and totals, and a cleared cart.
- Retried confirmation does not create another order or reactivate a cancelled order.
- A second shopper cannot query, confirm or cancel the first shopper's order using their own session.
- Concurrent confirmations cannot oversell simulated stock. Failed confirmation preserves the basket.
- Cancellation requires confirmation, is idempotent and releases stock.
- Orders remain readable from a fresh Node process using the saved ledger.
- All private/mutation tools bind the current shopping session, and startup rejects an unavailable tool configuration before contacting Agora.

## Browser acceptance

Inspect actual desktop and mobile rendering and capture/view screenshots of:

- Scenario-specific initial Dialog and persistent scenario identity.
- Product comparison, budget/preference filters and no-match state.
- Empty/populated basket, quantity changes, removal and changed-model selection.
- Confirmation summary, Keep Editing, saved unpaid order and refresh/reload persistence.
- Cancellation confirmation and cancelled result.
- Inventory or network failure with no false success.

Use the real local HTTP routes and components. Simulated commerce data must not be described as a real purchase. Mobile browser emulation is not real-device acceptance.

## Live voice acceptance

Requires Agora credentials and a cloud-reachable HTTPS tool origin. Speak through selection, model/quantity changes, explicit confirmation, order lookup and cancellation. Verify actual tool calls, page synchronization, transcript roles, microphone controls and stop/restart behavior. An unclear reply or changed basket must trigger a fresh summary/confirmation. Never claim that route tests or mocked speech validate this behavior.
