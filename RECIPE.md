# Voice Shopping Assistant

## 1. Overview

Find real microphones and cameras through Shopify Global Catalog and discuss the trade-offs by voice. This version supports live, read-only Shopify product discovery. Compare returned products against a USD budget and send buyers to merchant websites. No cart changes, order placement, payment collection, stock reservation, saved shopping history or cross-session business records are available. Keep credentials server-only and never claim a purchase, payment or shipment was completed.

## 2. Try the Demo

Follow [local setup](README.md#run-it). Search USB microphone with a USD 150 budget, or start voice shopping and describe your needs. Open a returned product to inspect current variant information and merchant links. During a live conversation, Discuss by voice asks the assistant to inspect that selected item.

## 3. Architecture & Tech Stack

The browser uses Agora RTC for audio and RTM for transcript and Agent events. The managed Agent connects directly to Shopify Global Catalog MCP with only search and product-detail HTTP adapters. Next.js signs Agora credentials, starts/stops the Agent and proxies fresh Catalog queries for the on-page product browser. No public callback tunnel, database, result store or application-managed cart is needed.

The existing Next.js 16, React 19, TypeScript, agora-agents, Agora RTC/RTM and adopted agent-ui components remain in use.

## 4. Prerequisites & Configuration

Use Node.js 24 and pnpm 9.15.9. Preserve .env.local and configure NEXT_PUBLIC_AGORA_APP_ID and server-only NEXT_AGORA_APP_CERTIFICATE. Anonymous Shopify local trials need no key; optional SHOPIFY_CATALOG_ACCESS_TOKEN and SHOPIFY_UCP_AGENT_PROFILE_URL are documented in env.local.example. Production needs an owned UCP profile and appropriate Catalog credentials.

## 5. Quick Start

~~~bash
pnpm install --frozen-lockfile
pnpm run doctor
pnpm run dev
~~~

Open http://localhost:3000. Product search works independently of microphone/session startup. The page requests microphone access only after the voice start action.

## 6. How It Works

The Agent connects to Shopify's official Global Catalog MCP with a read-only allowlist. The page uses independent no-store search/detail routes. The existing RTM sendText method hands selected products to a live conversation. Legacy simulated cart/order APIs remain disabled.

## 7. Customize for Your Business

Edit lib/agent-config.ts for conversation flow, lib/agent-tools.ts for the HTTP-to-MCP allowlist, lib/shopify-config.ts for the profile/token and lib/shopify-catalog.ts for page normalization. Keep product data fresh, merchant images direct, USD minor units correct and purchase completion on merchant websites.

## 8. Deployment & Validation

Follow [deployment instructions](README.md#deployment). Run pnpm run verify; run pnpm run verify:docker separately. Mocked Agora checks and synthetic Shopify HTTP tests do not prove actual speech or hosting. Validate real Catalog requests, desktop/mobile UI, real tool-backed conversations, interruption and clean stop separately.
