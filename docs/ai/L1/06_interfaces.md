# 06 Interfaces

> Actual scenario API, event and configuration boundaries.

## Browser Or User-Facing APIs

- `GET /api/generate-agora-token`: optional uid/channel; returns `{ token, uid, channel }`; server credential/configuration errors return failure.
- `POST /api/invite-agent`: requester/channel are required. The invite additionally requires `shopping_session_id`, created by the shopping session API and shared with the browser. Returns Agent ID, creation time and state; input and runtime failures are reported explicitly.
- `POST /api/stop-conversation`: requires agent_id; already-stopping/not-found handling is idempotent.
- `POST /api/chat/completions`: optional custom-LLM proxy, not used by the default managed pipeline.

`search_products`, `get_inventory`, `get_shopping_session`, `set_cart_item`, `confirm_order`, `get_order` and `cancel_order` use the shopping API. `shopping_session_id` is validated by invite and fixed into tool paths. Quantity zero removes an item. Quote changes invalidate earlier confirmation; a repeated confirmed quote returns its original order.

The assistant compares prompt catalog facts and summarizes purchase intent, but cannot edit the basket, generate server quotes or save/cancel orders by voice. Browser business controls remain available independently.

Seven session-bound tools can search products, inspect inventory, read/edit the basket and confirm, look up or cancel an unpaid order.

Use the scenario-specific entry and persistent identity; starting voice requires a user action.



See [scenario guide](../../scenario/README.md) and the scenario source for exact business request shapes, validation errors and ownership rules.

## Events And Media

RTC carries microphone and synthesized audio. RTM/toolkit provides TRANSCRIPT_UPDATED, AGENT_STATE_CHANGED, AGENT_METRICS, completed-turn, error and SAL events where reported. Normalize toolkit local uid zero before display and retain interrupted turns. Preserve missing metric fields and data provenance; Inspector outcomes are manually confirmed.

## Environment Contract

Local Next.js reads `.env.local` from tracked `env.local.example`. Hosted/Docker servers inject runtime values; the public App ID must also be supplied to the browser build.

| Variable | Required | Owner / exposure | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_AGORA_APP_ID` | Required | Next.js build and runtime; public | App ID from the selected Agora project; Docker must receive the same value at build and runtime. |
| `NEXT_AGORA_APP_CERTIFICATE` | Required | Next.js server runtime; secret | Signs RTC/RTM credentials and authenticates managed Agent operations; never a build argument. |
| `TOP_TEN_SCENARIO_TOOL_BASE_URL` | Optional | Next.js server; non-secret | This same app's public HTTPS origin. Omit for default conversation; enabling tools requires actual cloud reachability. |
| `SHOPPING_DATA_FILE` | Optional | Next.js server; local path | Optional path to the persistent shopping JSON ledger; use a separate temporary path for checks. |
| `NEXT_DIST_DIR` | Optional | Next.js build/start; non-secret | Defaults to .next. Use one matching output directory for native build/start; the Docker path uses .next. |

## External Services

The server uses agora-agents with the configured managed STT/LLM/TTS providers. The browser uses RTC, Signaling and the Agent Client Toolkit. Optional business tools call this same app over public HTTPS, and their returned success is required before reporting an action complete. Provider BYOK blocks are opt-in, server-only and require separate verification.

## Related Deep Dives

- [Tokens](L2/token_model.md)
- [Transcript pipeline](L2/transcript_pipeline.md)
- [Agent configuration](L2/invite_agent_config.md)
