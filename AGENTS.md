# Agent Development Guide

This standalone demo helps users find microphones and cameras through live, read-only Shopify Catalog queries.

## Shared scenario UI requirements

1. **Open the main page directly**: show the scenario explanation and task-specific start action inline. Do not add an introductory dialog, automatic welcome overlay, or Preview first step. Connecting, errors and retry feedback stay inline. Loading the page must not start a session or request microphone access.
2. **Keep the public scenario identity visible**: the public scenario name and short purpose remain visible on desktop and mobile from first load and throughout the session. The header and main heading use the same public name. Keep internal numeric IDs out of visible page and Build copy. Activity status must not replace the scenario name.
3. **Use our UIkit components**: adopt actual component source and accompanying theme/styles from [shczhen/agent-ui](https://github.com/shczhen/agent-ui), connected to real session data and actions. Preserve source provenance and RTC/RTM ownership.

Inspect desktop/mobile direct entry, reload and inline startup failure/retry states. Confirm there is no introductory overlay and that the main start control directly starts the existing session flow. Inspect actual screenshots before acceptance. Inspector, Build and the coach phrasebook open only on explicit user actions.

For transcript changes, verify desktop/mobile live text growth, hidden arrivals and showing the conversation again. Restore following only if it was active before hiding; preserve deliberate history reading and verify that Scroll to end resumes following.

This direct-entry rule applies to the base template and all scenarios. It supersedes earlier introductory-dialog requirements and per-scenario exceptions. Keep this self-contained section synchronized with the workspace SCENARIO_UI_RULES.md.

## U.S. scenario content

Use a United States setting for fictional business examples, UI copy, Agent context and sample data. Use U.S. cities and addresses, American English (`en-US`), USD for configured prices, and U.S. local dates and times. Use an explicit IANA time zone and the date-correct UTC offset, including daylight saving time; keep data, prompts, tools, exports and UI labels consistent. Do not introduce East Asian locations, regional currencies or time zones into scenario examples. Keep fictional data clearly distinguished from live business facts. Preserve original source citations and third-party license attribution accurately.

## Repository language

Use English for repository content, including documentation, code comments, UI copy and examples. Keep future additions and edits free of Chinese text.

## Start here

Read [README.md](README.md) for setup and shopping, [ARCHITECTURE.md](ARCHITECTURE.md) for transport/tool ownership, and [RECIPE.md](RECIPE.md) for the public recipe. The [acceptance checklist](docs/scenario/acceptance.md) separates local checks from real voice acceptance.

Use Node.js 24 from .nvmrc and pnpm 9.15.9. Install with pnpm install --frozen-lockfile. Copy env.local.example to .env.local only when absent; never overwrite existing credentials. Run pnpm run doctor, pnpm run dev and pnpm run verify. Container checks use pnpm run verify:docker separately.

## Runtime ownership

- components/LandingPage.tsx owns token/invite bootstrap, RTM, renewal, stop and current-page state.
- components/ConversationComponent.tsx owns guarded RTC/toolkit initialization, transcripts and hook-owned media.
- lib/agent-config.ts, lib/scenario-knowledge.ts and lib/prompt-context.ts own voice guidance and U.S. date context.
- lib/agent-tools.ts exposes only SearchShopifyProducts and GetShopifyProduct.
- lib/shopify-config.ts and lib/shopify-catalog.ts own the fixed official endpoint, profile/token, fresh page queries and normalization.
- components/ShopifyCatalog.tsx owns search, details, variant selection and merchant links.
- app/api owns token/invite/stop and read-only Catalog routes. One scenarios catch-all keeps retired GET/POST requests at HTTP 410.
- Inspector, Build, the adopted UIkit source and Docker remain supported.

## Preserve these contracts

- Voice startup requires only requester_id and channel_name. Do not create a shopping session, cart, local ledger or database.
- Preserve RtcTokenBuilder.buildTokenWithRtm, RTM identity/UID matching and RTM readiness before RTC/toolkit mount.
- Keep the isReady StrictMode guard and stable RTC client ref. useJoin owns leave, the microphone hook owns track cleanup, and usePublish owns publication. Never manually close a hook-owned track or disable React StrictMode.
- Remap the toolkit's local uid=0 sentinel and retain interrupted turns. Product actions keep exact lookup context for the Agent while displaying a readable label in the transcript.
- Use synchronous HTTP tools for Shopify MCP: the native MCP validator rejects successful structuredContent-only replies that omit content. The adapter supplies UCP metadata and U.S./USD context.
- Keep Shopify access read-only. Do not add cart changes, ordering, payment collection, stock reservation, shipping, refunds or persistent shopping history.
- Use fresh Catalog replies, no-store requests/responses and original merchant image URLs. Do not cache results, re-host images or copy live listings into fixtures.
- Prices use currency minor units. Unknown price/stock remains unknown; inferred descriptions are not verified specifications. The merchant confirms final totals and delivery.
- NEXT_PUBLIC_AGORA_APP_ID is public and required at build/runtime. NEXT_AGORA_APP_CERTIFICATE and any optional SHOPIFY_CATALOG_ACCESS_TOKEN stay server-only. Local trials may use Shopify's hosted example UCP profile.
- Retain source attribution, licenses and font notices.

## Public presentation ownership

`lib/presentation.ts` owns the single public `name`, purpose and summary. The header and main heading both render that name; `app/layout.tsx` derives browser metadata from it. There is no separate headline field. Internal IDs stay available for diagnostics and configuration, without being rendered as public identity text.

## Verification and maintenance

Run pnpm run verify for repository checks, lint, types, mocked startup, Shopify HTTP/error cases, transcript/Inspector/prompt checks and build. Keep real Catalog traffic, screenshots, simulated media, human speech and Docker evidence distinct.

Inspect actual desktop/mobile screenshots after visible changes. Transcript changes also need live growth, hidden arrivals, paused history and Scroll to end checks.

Keep README.md, AGENTS.md, RECIPE.md and the affected scenario guide/checklist aligned with behavior. Contributor instructions are consolidated here; no layered AI document tree is required.

## Git Conventions

### Commit messages — conventional commits

- **Format:** `type: description` or `type(scope): description`
- **Types:** `feat:` (new feature), `fix:` (bug fix), `chore:` (maintenance, version bumps), `test:` (test additions/changes), `docs:` (documentation)
- **Scoped variant:** `feat(scope):`, `fix(scope):` — e.g. `feat(api): add stop-conversation status flag`
- **Lowercase after prefix** — `feat: add feature`, not `feat: Add feature`
- **Present tense** — "add feature", not "added feature"
- **PR number appended** — `feat: add feature (#123)`

### Branch names

- **Format:** `type/short-description` — lowercase, hyphen-separated
- **Types match commit types:** `feat/`, `fix/`, `chore/`, `test/`, `docs/`
- **Examples:** `feat/agent-metrics`, `fix/transcript-uid`, `docs/progressive-disclosure`

### General rules

- **No AI tool names** — never mention claude, cursor, copilot, cody, aider, gemini, codex, chatgpt, or gpt-3/4 in commit messages or PR descriptions.
- **No Co-Authored-By trailers** — omit AI attribution lines.
- **No `--no-verify`** — let git hooks run normally.
- **No git config changes** — do not modify `user.name` or `user.email`.

Local edits and verification do not authorize a commit. A commit does not authorize a push or GitHub write; each needs an explicit current-conversation request. Never change Git identity or bypass hooks.
