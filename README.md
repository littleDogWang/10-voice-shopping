# Voice Shopping Assistant

Find real microphones and cameras from Shopify merchants, compare products against a USD budget, and continue to the merchant website.

## Scope

This version supports live, read-only Shopify product discovery. Compare returned products against a USD budget and send buyers to merchant websites. No cart changes, order placement, payment collection, stock reservation, saved shopping history or cross-session business records are available. Keep credentials server-only and never claim a purchase, payment or shipment was completed.

The voice Agent uses Shopify Global Catalog MCP directly. The page also offers an independent product browser with search, budget filtering, variant details and merchant links. During a live conversation, Discuss by voice hands the selected product to the assistant for a fresh lookup. Retired simulated cart/order/session APIs remain disabled with HTTP 410.

## Run it

Use Node.js 24 (see .nvmrc) and pnpm 9.15.9. Install with pnpm install --frozen-lockfile. Copy env.local.example to .env.local only when absent and fill the existing required values; never overwrite credentials.

| Variable | Required | Exposure |
| --- | --- | --- |
| NEXT_PUBLIC_AGORA_APP_ID | Yes | Public; build and runtime |
| NEXT_AGORA_APP_CERTIFICATE | Yes | Server runtime only |
| SHOPIFY_CATALOG_ACCESS_TOKEN | No for local trial | Server runtime only |
| SHOPIFY_UCP_AGENT_PROFILE_URL | No for local trial | Public HTTPS profile URL |

Run:

~~~bash
pnpm run doctor
pnpm run dev
~~~

Open http://localhost:3000. The page opens directly without an introductory dialog. Use Search products without a microphone, or choose Start voice shopping and grant microphone permission. Loading the page starts neither a session nor a Catalog query.

An anonymous trial uses [Shopify's hosted example UCP profile](https://shopify.dev/ucp/agent-profiles/examples/2026-08-25/valid-with-capabilities.json). For production, use an owned public profile and Catalog credentials according to [Shopify authentication](https://shopify.dev/docs/agents/get-started/authentication). Bearer tokens expire and need renewal; this local demo does not implement a credential-issuance service.

With a ready Agora CLI, the optional environment command is agora quickstart env write . --template nextjs --project <your-project> --json. Check CLI readiness before configuration.

## Try it

- Search USB microphone with a USD 150 budget, open View details and follow a merchant product link.
- Say: I need a USB microphone for video calls under 150 dollars.
- Say: Find a webcam for recording and compare two options within my budget.
- During a live session, open product details and choose Discuss by voice. The assistant checks that selected product/variant through Shopify.
- Ask for a recap before ending. End conversation stops the session.

The voice and page searches are independent; a spoken search does not automatically replace visible product cards.

## Commands

- pnpm run doctor: checks local setup without printing secrets.
- pnpm run dev: starts the local application.
- pnpm run verify: canonical repository, lint, types, mocked Agora APIs, read-only startup, synthetic Shopify HTTP boundaries, transcript/Inspector, prompt and build checks.
- pnpm run verify:shopify: exercises the real HTTP client against a synthetic local upstream, including empty results, malformed replies, rate limits and timeout.
- pnpm run build and pnpm run start: native production build and server.
- pnpm run verify:docker: separate container build/startup/token checks.

## Deployment

The browser uses Agora RTC for audio and RTM for transcript and Agent events. The managed Agent connects directly to Shopify Global Catalog MCP with only search and product-detail HTTP adapters. Next.js signs Agora credentials, starts/stops the Agent and proxies fresh Catalog queries for the on-page product browser. No public callback tunnel, database, result store or application-managed cart is needed.

Provide NEXT_PUBLIC_AGORA_APP_ID during the client build and at runtime. Keep NEXT_AGORA_APP_CERTIFICATE and any Catalog token server-only. The host needs outbound HTTPS to Shopify and Agora; no public tool callback origin or writable business volume is required.

~~~bash
docker build --build-arg NEXT_PUBLIC_AGORA_APP_ID=<public-app-id> -t agora-scenario/10-voice-shopping .
docker run --rm -p 3000:3000 --env-file .env.local agora-scenario/10-voice-shopping
~~~

The image runs as a non-root user. Docker, public hosting and actual two-way speech acceptance remain separate checks.

## Limits and source handling

Anonymous Shopify access has shared/IP limits and is intended for trials. Public production traffic needs Catalog credentials; [authenticated Global Catalog requests default to five requests per second](https://shopify.dev/docs/agents/profiles/auth-and-rate-limiting). Rate limits and provider errors are surfaced explicitly.

Catalog routes and fetches use no-store. Do not cache search results, copy live listings into test fixtures, or download/re-host merchant images. The page renders original image URLs. Some descriptions and attributes are inferred by Shopify; verify exact compatibility on the merchant page. Missing prices and availability remain unknown. Final tax, shipping and totals are confirmed by the merchant.

Transcript, Inspector and product display state live in page memory and disappear on refresh. This does not define external provider retention. Sample endpoints are not production access/abuse controls.

## Architecture and customization

See [architecture](ARCHITECTURE.md), [the public recipe](RECIPE.md), [the internal contract](docs/ai/RECIPE.md) and [the scenario guide](docs/scenario/README.md). Edit lib/agent-config.ts for voice behavior, lib/agent-tools.ts for the MCP allowlist, lib/shopify-catalog.ts for page data, lib/presentation.ts for copy and lib/runtime-profile.ts for providers.

## Attribution

Derived from [the official Agora Next.js voice quickstart](https://github.com/AgoraIO-Conversational-AI/agent-quickstart-nextjs). Retain [the license](LICENSE) and [third-party notices](THIRD_PARTY_NOTICES.md). Product data comes from [Shopify Global Catalog](https://shopify.dev/docs/agents/catalog/global-catalog).
