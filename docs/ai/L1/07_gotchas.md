# 07 Gotchas

> High-impact setup and business-state pitfalls.

## Setup Pitfalls

- pnpm 8 does not match lockfile 9; use declared pnpm 9.15.9.
- Missing .env.local values fail doctor; do not log or paste credentials.
- Docker needs a running engine and the public App ID at build time. A runtime-only ID cannot repair an already-built client bundle.
- A private/localhost callback URL cannot be used as a cloud business-tool origin.

## Runtime Pitfalls

The assistant compares prompt catalog facts and summarizes purchase intent, but cannot edit the basket, generate server quotes or save/cancel orders by voice. Browser business controls remain available independently.

There is no real purchase, payment, shipping, tax calculation, fulfillment or refund. Prices are server-derived; any cart edit requires a new quote review and explicit confirmation.

Use one Node process with persistent writable disk for the atomic JSON ledger. `SHOPPING_DATA_FILE` can choose the ledger path. The browser keeps a bearer shopping-session ID in localStorage; it is not customer login. Ephemeral or multi-process hosting cannot provide this store's persistence guarantees.

Keep combined token privileges, StrictMode initialization, toolkit readiness and hook-owned cleanup. A missing transcript is an RTM/event question, not evidence that the model never responded. Tool failures cannot silently fall back to fixture success.

## Documentation Or Contract Drift

The repository identity must be `littleDogWang/10-voice-shopping`, while upstream attribution remains separate. Keep invite fields, data paths, time zones, Docker volume behavior and pnpm/verification commands synchronized. Run `pnpm run verify:template` for structure/link drift and the canonical checks for source behavior.

## Related Deep Dives

- [Lifecycle](L2/conversation_lifecycle.md)
- [Transcript pipeline](L2/transcript_pipeline.md)
