---
recipe_version: 0.4.0
recipe_status: draft
extension_points:
  - id: prompts.system
    name: Source-aware shopping conversation and live read-only Catalog
  - id: pipeline.providers
    name: Managed speech, model, voice and turn detection
  - id: ui.conversation
    name: Scenario identity, voice controls and current-call evidence
invariants:
  - id: tokens.rtc-rtm
    summary: Preserve combined RTC/RTM privileges and server-only credentials
  - id: lifecycle.strict-mode
    summary: Preserve initialization guards and hook-owned cleanup
  - id: scenario.read-only-shopping
    summary: Only read-only Shopify Catalog tools; no application-managed cart, payment or persistent business records
stable_contracts:
  - id: api.invite-agent
    summary: Only requester_id and channel_name are required for voice startup
  - id: verification.canonical
    summary: pnpm run verify includes read-only startup and synthetic upstream HTTP checks
---

# Read-Only Shopping Recipe Profile

Read [the public recipe](../../RECIPE.md) for Voice Shopping Assistant.

## Recipe Scope

Find real microphones and cameras through Shopify Global Catalog.

This version supports live, read-only Shopify product discovery. Compare returned products against a USD budget and send buyers to merchant websites. No cart changes, order placement, payment collection, stock reservation, saved shopping history or cross-session business records are available. Keep credentials server-only and never claim a purchase, payment or shipment was completed.

## Baseline Implementation Guidance

This independent scenario derives from the [official Agora Next.js voice quickstart](https://github.com/AgoraIO-Conversational-AI/agent-quickstart-nextjs). Preserve the actual SDK, token and lifecycle code. See [the source map](L1/03_code_map.md) and [bootstrap guidance](L1/L2/from_scratch_bootstrap.md).

## Extension Points

- lib/agent-config.ts: role, greeting, workflow, guardrails and source-aware product guidance.
- lib/presentation.ts: inline welcome, visible identity and developer guidance.
- lib/runtime-profile.ts and app/api/invite-agent/route.ts: existing speech/providers and HTTP-to-MCP connection.
- lib/agent-tools.ts: read-only HTTP-to-MCP allowlist; legacy custom business tools stay empty.

## Invariants

Preserve StrictMode guards, hook-owned RTC and microphone cleanup, combined RTC/RTM token privileges, local-user UID remapping and interrupted transcript turns. Start voice without creating a business session. Retain current-call evidence only; a verbal recap is not a stored result.

## Stable Contracts

- GET /api/generate-agora-token returns token, uid and channel.
- POST /api/invite-agent requires requester_id and channel_name and returns the managed Agent ID.
- POST /api/stop-conversation accepts agent_id; retain the existing idempotent stop behavior.
- POST /api/chat/completions is an optional custom-LLM proxy and is not used by the default pipeline.
- Existing app/api/scenarios endpoints return HTTP 410 without invoking business modules.
- env.local.example documents the two required Agora values and optional Shopify profile/bearer token for .env.local.
- pnpm run verify is canonical; Docker and real voice acceptance remain separate.

## Deployment

The browser uses Agora RTC for audio and RTM for transcript and Agent events. The managed Agent connects directly to Shopify Global Catalog MCP with only search and product-detail HTTP adapters. Next.js signs Agora credentials, starts/stops the Agent and proxies fresh Catalog queries for the on-page product browser. No public callback tunnel, database, result store or application-managed cart is needed.

## Consumer Onboarding Recipe

1. Clone https://github.com/littleDogWang/10-voice-shopping and use Node.js 22+ with pnpm 9.15.9.
2. Install with pnpm install --frozen-lockfile.
3. Create .env.local from env.local.example only if absent and configure the two Agora project values.
4. Run pnpm run doctor and pnpm run dev, then choose the scenario start action.
5. Verify actual speech, transcript, interruptions and clean stop.
6. Run pnpm run verify and any separately required deployment checks. A local catalog entry is not evidence of public availability.
