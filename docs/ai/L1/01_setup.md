# 01 Setup

Use Node.js 24 (the repository's .nvmrc), pnpm 9.15.9 and the existing lockfile. Install with pnpm install --frozen-lockfile. Copy env.local.example to .env.local only when absent; preserve existing credentials.

Required: NEXT_PUBLIC_AGORA_APP_ID at build/runtime and server-only NEXT_AGORA_APP_CERTIFICATE. Optional: server-only SHOPIFY_CATALOG_ACCESS_TOKEN and SHOPIFY_UCP_AGENT_PROFILE_URL. Anonymous local trials use Shopify's hosted example profile; production needs an owned public HTTPS profile and appropriate Catalog credentials.

Run pnpm run doctor and pnpm run dev. Shopify is called on demand; loading the page does not request a microphone or query products. No business callback origin or application storage is needed. The optional ready-CLI environment command is agora quickstart env write . --template nextjs --project <your-project> --json.

Run pnpm run verify; Docker and actual hosted speech remain separate checks.

## Related Deep Dives

- [Lifecycle](L2/conversation_lifecycle.md)
- [Tokens](L2/token_model.md)
- [Agent configuration](L2/invite_agent_config.md)
