---
recipe_version: 0.2.0
recipe_status: draft
extension_points:
  - id: prompts.system
    name: Scenario role, workflow, guardrails and greeting
  - id: scenario.data
    name: Local business knowledge and fixtures
  - id: api.routes
    name: Scenario routes and optional server-bound tools
  - id: pipeline.providers
    name: Managed speech, model, voice and turn detection
  - id: ui.conversation
    name: Scenario presentation and real session evidence
invariants:
  - id: tokens.rtc-rtm
    summary: Keep combined RTC and RTM token privileges and server-only certificates
  - id: lifecycle.strict-mode
    summary: Preserve the initialization guard and hook-owned cleanup
  - id: transcript.uid-remap
    summary: Remap local user UID zero and retain interrupted turns
  - id: scenario.outcome
    summary: Report business success only from the corresponding successful result
stable_contracts:
  - id: env.required
    summary: Use NEXT_PUBLIC_AGORA_APP_ID and server-only NEXT_AGORA_APP_CERTIFICATE in .env.local
  - id: api.token
    summary: GET /api/generate-agora-token returns token, uid and channel
  - id: api.invite-agent
    summary: Preserve this scenario's startup fields and server-bound tool scope
  - id: api.stop-conversation
    summary: POST /api/stop-conversation accepts agent_id
  - id: verification.canonical
    summary: pnpm run verify covers local contracts and build; Docker and live speech are separate
---

# Quickstart Recipe Profile

For the eight-part user guide, read [Voice Shopping Assistant](../../RECIPE.md).

## Recipe Role

- Role: `base` standalone scenario recipe, derived from the official Agora Next.js voice quickstart.
- Audience: developers running or integrating Voice Shopping Assistant.
- Reuse: inspect this source, configure the documented project, verify default conversation, then enable requested business tools.

## Recipe Scope

A voice shopping experience for six fictional microphones and cameras. Users can compare products, edit a basket through the browser, review a server-priced quote and save or cancel an unpaid simulated order. With tools enabled, the voice assistant uses the same shopping session as the page.

Default conversation: The assistant compares prompt catalog facts and summarizes purchase intent, but cannot edit the basket, generate server quotes or save/cancel orders by voice. Browser business controls remain available independently.

Optional tools: Seven session-bound tools can search products, inspect inventory, read/edit the basket and confirm, look up or cancel an unpaid order.

Limits: There is no real purchase, payment, shipping, tax calculation, fulfillment or refund. Prices are server-derived; any cart edit requires a new quote review and explicit confirmation.

## Baseline Implementation Guidance

The upstream baseline is [AgoraIO-Conversational-AI/agent-quickstart-nextjs](https://github.com/AgoraIO-Conversational-AI/agent-quickstart-nextjs). This repository is its scenario derivative, not a replacement identity for upstream. Use current source and the [code map](L1/03_code_map.md); do not recreate SDK schemas, tokens or lifecycle from memory. [Bootstrap guidance](L1/L2/from_scratch_bootstrap.md) documents the copy map.

## Extension Points

| Surface | Source | Verification |
| --- | --- | --- |
| Catalog and prices | `scenarios/09-voice-shopping/catalog.json` | pnpm run verify:scenario; verify the relevant acceptance case |
| Basket, quotes and orders | `scenarios/09-voice-shopping/shopping.ts` | pnpm run verify:scenario; verify the relevant acceptance case |
| Conversation | `scenarios/09-voice-shopping/config.ts` | pnpm run verify:scenario; verify the relevant acceptance case |

- `scenarios/index.ts`: default/tool prompt assembly.
- `scenarios/tool-contracts.ts`: available REST tools and parameter/call scope.
- `app/api/invite-agent/route.ts`: providers, turn detection and managed Agent lifecycle.
- `scenarios/presentation.ts` and scenario presentation: visible identity, start action and developer paths.
- `components/ScenarioInspector.tsx`, `lib/inspection.ts`: reported session evidence. Preserve missing values and manual outcome provenance.

## Invariants

- Keep `RtcTokenBuilder.buildTokenWithRtm` and the common Agent UID in `lib/agora.ts`.
- Preserve the StrictMode `isReady` guard and toolkit initialization after RTC join.
- Let `useJoin`, `useLocalMicrophoneTrack` and `usePublish` own leave, track cleanup and publication.
- Remap toolkit `uid="0"` to the local user; retain interrupted transcript turns.
- Keep certificates/provider keys on the server and business tools scoped to the appropriate call.
- Never infer a saved result from transcript text or replace failed tools with fixture success.
- There is no real purchase, payment, shipping, tax calculation, fulfillment or refund. Prices are server-derived; any cart edit requires a new quote review and explicit confirmation.

## Stable Contracts

- `GET /api/generate-agora-token` returns `{ token, uid, channel }`.
- `POST /api/invite-agent` starts the scenario Agent. The invite additionally requires `shopping_session_id`, created by the shopping session API and shared with the browser.
- `POST /api/stop-conversation` accepts `{ agent_id }`; already-stopping states are idempotent.
- `search_products`, `get_inventory`, `get_shopping_session`, `set_cart_item`, `confirm_order`, `get_order` and `cancel_order` use the shopping API. `shopping_session_id` is validated by invite and fixed into tool paths. Quantity zero removes an item. Quote changes invalidate earlier confirmation; a repeated confirmed quote returns its original order.
- Local environment: `env.local.example` → `.env.local`; required keys are the public App ID and server-only App Certificate. [All variables](L1/01_setup.md) include optional business-tool/storage paths.
- Node.js 22+, pnpm 9.15.9; canonical checks are `pnpm run verify`. `pnpm run verify:docker` is a separate image/startup/scenario-route check.
- Use one Node process with persistent writable disk for the atomic JSON ledger. `SHOPPING_DATA_FILE` can choose the ledger path. The browser keeps a bearer shopping-session ID in localStorage; it is not customer login. Ephemeral or multi-process hosting cannot provide this store's persistence guarantees.

## Internal / Subject To Change

Component layout, presentation copy, model/provider defaults, UI diagnostics and internal storage implementation are not stable external APIs. Inspect source rather than importing undocumented internals.

## Consumer Onboarding Recipe

1. Clone `https://github.com/littleDogWang/09-voice-shopping.git` and change into `09-voice-shopping`.
2. With Node.js 22+ and pnpm 9.15.9, run `pnpm install --frozen-lockfile`.
3. Copy `env.local.example` to `.env.local` only on a clean clone; fill the two Agora project credentials. Alternatively use the ready CLI's template-aware `agora quickstart env write . --template nextjs --project <your-project> --json`.
4. Run `pnpm run doctor`, then `pnpm run dev`. Open http://localhost:3000 and choose the scenario start action.
5. Verify two-way speech/transcript with a real call. The assistant compares prompt catalog facts and summarizes purchase intent, but cannot edit the basket, generate server quotes or save/cancel orders by voice. Browser business controls remain available independently.
6. If requested, configure this same app's public HTTPS business-tool origin and start a fresh conversation; verify actual callbacks and result state.
7. Run `pnpm run verify`. For containers, follow [README Docker](../../README.md#docker) and run `pnpm run verify:docker`.
8. Customize only supported surfaces, synchronize this contract and the public guide, and repeat relevant checks. Repository edits do not register or publish a recipe automatically.
