// Source guidance only. Never bundle live product results or merchant images.
export const SCENARIO_KNOWLEDGE = {
  source: {
    kind: 'Live Shopify Global Catalog, queried through read-only MCP tools',
    documentation: 'https://shopify.dev/docs/agents/catalog/global-catalog',
    revision: '2026-11-05',
  },
  timeZone: 'America/New_York',
  market: { country: 'US', currency: 'USD', language: 'en-US' },
  comparisonGuide: {
    microphones: 'Ask about calls versus recording, noise, connection needs and budget. USB alone does not establish connector, phone or OS compatibility.',
    cameras: 'Ask about calls versus recording, desk versus room use and budget. Resolution alone does not establish frame rate or low-light quality.',
    prices: 'Prices use minor currency units: USD 5699 means USD 56.99. Tax, shipping and discounts remain unconfirmed.',
    availability: 'Use the returned variant availability. Unknown availability is not in stock; in stock does not guarantee delivery.',
    provenance: 'Catalog descriptions and technical attributes can be inferred. Do not present inferred attributes as independently verified manufacturer specifications.',
  },
} as const;
