// utils/shopifyHelpers.js
const { Shopify } = require('@shopify/shopify-api');
const axios = require('axios');

class ShopifyHelpers {
  // Initialize Shopify REST Client
  static initializeClient() {
    return new Shopify.Clients.Rest(
      process.env.SHOPIFY_SHOP, 
      process.env.SHOPIFY_ACCESS_TOKEN
    );
  }

  // Initialize Shopify GraphQL Client
  static initializeGraphQLClient() {
    return new Shopify.Clients.Graphql(
      process.env.SHOPIFY_SHOP, 
      process.env.SHOPIFY_ACCESS_TOKEN
    );
  }

  // Validate Shopify Resource Existence
  static async validateResource(resourceType, resourceId) {
    try {
      const client = this.initializeClient();
      const response = await client.get({
        path: `${resourceType}/${resourceId}`
      });
      return response.body;
    } catch (error) {
      console.error(`Validation Error for ${resourceType}:`, error);
      return null;
    }
  }

  // Generate Shopify Webhook Signature
  static generateWebhookSignature(body, secret) {
    const crypto = require('crypto');
    return crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('base64');
  }

  // Bulk Operations for Products
  static async bulkUpdateProducts(products) {
    const client = this.initializeGraphQLClient();
    
    const mutations = products.map(product => `
      mutation {
        productUpdate(input: {
          id: "${product.id}"
          title: "${product.title}"
          descriptionHtml: "${product.description}"
          variants: [
            ${product.variants.map(variant => `{
              id: "${variant.id}"
              price: "${variant.price}"
              inventoryQuantity: ${variant.inventoryQuantity}
            }`).join(',')}
          ]
        }) {
          product {
            id
            title
          }
          userErrors {
            field
            message
          }
        }
      }
    `).join('\n');

    try {
      const response = await client.query({ data: mutations });
      return response.body;
    } catch (error) {
      console.error('Bulk Product Update Error:', error);
      throw error;
    }
  }

  // Advanced Product Search
  static async searchProducts(filters = {}) {
    const client = this.initializeGraphQLClient();
    
    const query = `
      query {
        products(
          first: ${filters.limit || 50}
          query: "${this.buildSearchQuery(filters)}"
        ) {
          edges {
            node {
              id
              title
              description
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    price
                    inventoryQuantity
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
      const response = await client.query({ data: query });
      return response.body.data.products.edges.map(edge => edge.node);
    } catch (error) {
      console.error('Product Search Error:', error);
      throw error;
    }
  }

  // Build Complex Search Query
  static buildSearchQuery(filters) {
    const conditions = [];
    
    if (filters.title) conditions.push(`title:${filters.title}*`);
    if (filters.vendor) conditions.push(`vendor:${filters.vendor}`);
    if (filters.productType) conditions.push(`product_type:${filters.productType}`);
    if (filters.tags) conditions.push(`tag:${filters.tags.join(' OR ')}`);
    
    return conditions.join(' ');
  }

  // Comprehensive Error Handler
  static handleShopifyError(error) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.errors || 'Shopify API Error',
        details: error.response.data
      };
    }
    return {
      status: 500,
      message: 'Unexpected Shopify Error',
      details: error.message
    };
  }

  // Inventory Tracking
  static async trackInventory(productId, locationId) {
    const client = this.initializeClient();
    
    try {
      const inventoryResponse = await client.get({
        path: `products/${productId}/inventory_levels`,
        params: { location_ids: locationId }
      });
      
      return inventoryResponse.body.inventory_levels;
    } catch (error) {
      console.error('Inventory Tracking Error:', error);
      throw error;
    }
  }

  // Sync Metafields
  static async syncMetafields(resourceType, resourceId, metafields) {
    const client = this.initializeClient();
    
    try {
      const response = await client.post({
        path: `${resourceType}/${resourceId}/metafields`,
        data: {
          metafields: metafields.map(metafield => ({
            key: metafield.key,
            value: metafield.value,
            type: metafield.type || 'single_line_text_field',
            namespace: metafield.namespace || 'custom'
          }))
        }
      });

      return response.body.metafields;
    } catch (error) {
      console.error('Metafields Sync Error:', error);
      throw error;
    }
  }
}

module.exports = ShopifyHelpers;