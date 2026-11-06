# Agent Configuration

lib/agent-config.ts defines source-aware shopping guidance and source-aware product guidance. lib/agent-tools.ts configures Shopify Global Catalog MCP with only SearchShopifyProducts and GetShopifyProduct. app/api/invite-agent/route.ts keeps the existing managed STT/LLM/TTS pipeline and enables read-only tool execution.

The body still requires requester_id and channel_name only. Preserve remoteUids scope, shared Agent UID, turn detection, provider settings and explicit startup failures. No business session or result store is created. The managed Agent calls Shopify directly; localhost needs no public callback tunnel.

Run pnpm run verify:api and pnpm run verify:conversation, then canonical verification. Confirm actual tool-backed speech separately.
