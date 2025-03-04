// config/shopify.js
const Shopify = require('@shopify/shopify-api');

const shopifyConfig = new Shopify.Shopify.Clients.Rest(
  process.env.SHOPIFY_SHOP,
  process.env.SHOPIFY_ACCESS_TOKEN
);

module.exports = shopifyConfig;