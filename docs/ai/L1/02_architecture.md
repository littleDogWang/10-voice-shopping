# 02 Architecture

> Topology and state ownership for Voice Shopping Assistant.

## Components

One Next.js App Router process serves the browser and routes. RTC carries audio; RTM carries transcript, Agent state, metrics and errors. The server SDK manages the cloud STT/LLM/TTS Agent. Scenario files define the business behavior.

## Data And Event Flow

The user start action creates any necessary scenario session, fetches the combined RTC/RTM token and bootstraps RTM plus invite. RTC/microphone hooks wait for the StrictMode guard. Toolkit events feed transcript and Inspector. Renew both token identities consistently; end calls stop, logs out RTM and unmounts hook-owned resources.

The invite additionally requires `shopping_session_id`, created by the shopping session API and shared with the browser.

`search_products`, `get_inventory`, `get_shopping_session`, `set_cart_item`, `confirm_order`, `get_order` and `cancel_order` use the shopping API. `shopping_session_id` is validated by invite and fixed into tool paths. Quantity zero removes an item. Quote changes invalidate earlier confirmation; a repeated confirmed quote returns its original order.

## Ownership Boundaries

LandingPage owns pre-call bootstrap/RTM; ConversationComponent owns joined RTC/toolkit subscriptions. Token/invite/stop routes own privileged operations. `scenarios/09-voice-shopping/` owns business rules/data; tool-contracts owns server-bound tool execution scope. Session evidence and manually selected outcomes are not automatic proof of business completion.

## Runtime Modes

Local development runs one Next.js process at http://localhost:3000 using `.env.local`. Native production uses `pnpm run build` then `pnpm run start`. Docker runs the same app as non-root UID 1001 on port 3000, without a reverse proxy inside the image. Use one Node process with persistent writable disk for the atomic JSON ledger. `SHOPPING_DATA_FILE` can choose the ledger path. The browser keeps a bearer shopping-session ID in localStorage; it is not customer login. Ephemeral or multi-process hosting cannot provide this store's persistence guarantees.

Docker embeds the public App ID at build and receives the certificate only at runtime. It copies the actual runtime fixtures and supplies a non-root-owned data directory. File-backed scenarios require a retained writable volume; process-local scenarios require a single long-lived process. See [full architecture](../../../ARCHITECTURE.md).

## Related Deep Dives

- [Lifecycle](L2/conversation_lifecycle.md)
- [Tokens](L2/token_model.md)
