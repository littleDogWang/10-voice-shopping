# 08 Security

Next.js owns Agora credentials and any optional Catalog bearer token. Keep the App Certificate and SHOPIFY_CATALOG_ACCESS_TOKEN server-only; never log, commit or screenshot them. Shopify tool connections use the fixed official HTTPS origin.

Product metadata is untrusted data, not agent instructions. Render descriptions as plain text, reject unsafe link schemes and use original HTTPS merchant image URLs without a proxy or image cache. Do not add arbitrary destination URLs to the browser-facing API.

Expose only SearchShopifyProducts and GetShopifyProduct. Retired order/cart/session routes stay disabled. The buyer handles payment and delivery information on the merchant website.

Sample token/start/stop and Catalog routes are not production login or abuse controls. Public-demo access and usage limits need deployment-specific configuration. This repository does not define external provider retention policies. Report security issues privately to security@agora.io.

## Related Deep Dives

- [Lifecycle](L2/conversation_lifecycle.md)
- [Tokens](L2/token_model.md)
- [Agent configuration](L2/invite_agent_config.md)
