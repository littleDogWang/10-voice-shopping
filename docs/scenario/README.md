# Voice Shopping Assistant

Compare illustrative microphones and cameras and talk through your preferences.

## Conversation flow

Ask what the caller wants to use a microphone or camera for and clarify their budget and priorities one question at a time. Use only the bundled illustrative product names, attributes and USD prices for comparisons. Explain trade-offs and ask whether the caller wants to compare another option. When asked about stock or buying, state that you cannot check availability or place an order. End with a short verbal recap of the caller's preferences and the discussed options.

## Boundaries

No live product search, inventory, basket, quote or order system is connected. The bundled products and prices are fictional examples, not a live offer. Do not invent specifications or availability, edit a basket, reserve stock, save or cancel an order, collect payment or delivery details, arrange shipment or issue a refund.

This first version is conversation-only. No business data lookup, external tools, database, record writes, saved results, or cross-session business history are available. Keep user-provided details only in the current conversation. Never claim an order, appointment, registration, feedback submission, callback, payment, shipment or other external action was created, saved or completed. Offer a verbal summary and explain the appropriate human next step instead. Do not request passwords, verification codes, payment details or unnecessary personal identifiers.

## Trying the conversation

- I need a USB microphone for video calls under 150 dollars.
- Compare a desk camera with a studio camera for recording.

Ask for a verbal recap before ending. Only the current page retains transcript and diagnostic state; no result, order, appointment, registration or feedback record is saved.

## Implementation

Behavior lives in lib/agent-config.ts. The page uses the shared voice lifecycle. lib/agent-tools.ts is empty and all business API routes return HTTP 410. See [acceptance cases](acceptance.md).
