const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  shopName: process.env.SHOPIFY_SHOP_NAME,
  storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  adminAccessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
  apiVersion: '2023-10',
  adminApiVersion: '2025-01'
};