// utils/shopifyClient.js - Enhanced version with getProductById
const fetch = require('node-fetch');
const shopifyConfig = require('../config/shopify');

class ShopifyClient {
  constructor() {
    this.shopifyDomain = `https://${shopifyConfig.shopName}.myshopify.com`;
    this.storefrontAccessToken = shopifyConfig.storefrontAccessToken;
    this.apiVersion = shopifyConfig.apiVersion;
  }

  async query(query, variables = {}) {
    try {
      const response = await fetch(
        `${this.shopifyDomain}/api/${this.apiVersion}/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': this.storefrontAccessToken
          },
          body: JSON.stringify({ query, variables })
        }
      );

      const jsonResponse = await response.json();
      
      if (jsonResponse.errors) {
        throw new Error(jsonResponse.errors[0].message);
      }

      return jsonResponse.data;
    } catch (error) {
      console.error('Shopify API error:', error);
      throw error;
    }
  }

  // Helper methods for common queries
  async getProducts(first = 20, after = null) {
    const query = `
      query GetProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              description
              featuredImage {
                url
                altText
              }
              images(first: 100) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              options {
                id
                name
                values
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    selectedOptions {
                      name
                      value
                    }
                    inventoryQuantity: quantityAvailable
                  }
                }
              }
            }
          }
        }
      }
    `;

    return this.query(query, { first, after });
  }

  async getProductByHandle(handle) {
    const query = `
      query GetProductByHandle($handle: String!) {
        product(handle: $handle) {
          id
          title
          handle
          description
          featuredImage {
                url
                altText
          }
          images(first: 100) {
            edges {
              node {
                url
                altText
              }
            }
          }
          options {
            id
            name
            values
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
                inventoryQuantity: quantityAvailable
              }
            }
          }
        }
      }
    `;

    return this.query(query, { handle });
  }

  // New method to get a product by ID
  async getProductById(productId) {
    // If the ID is a Shopify GraphQL ID (starts with "gid://"), use it directly
    // Otherwise, convert it to a GraphQL ID format
    const formattedId = productId.startsWith('gid://') 
      ? productId 
      : `gid://shopify/Product/${productId}`;

    const query = `
      query GetProductById($id: ID!) {
        product(id: $id) {
          id
          title
          handle
          description
          featuredImage {
            url
            altText
          }
          images(first: 100) {
            edges {
              node {
                url
                altText
              }
            }
          }
          options {
            id
            name
            values
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
                inventoryQuantity: quantityAvailable
                availableForSale
              }
            }
          }
        }
      }
    `;

    const result = await this.query(query, { id: formattedId });
    return result.product;
  }

  async createCheckout(lineItems, email) {
    const query = `
      mutation CheckoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
            subtotalPrice {
              amount
              currencyCode
            }
            totalPrice {
              amount
              currencyCode
            }
            completedAt
          }
          checkoutUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        lineItems,
        email
      }
    };

    return this.query(query, variables);
  }

  async checkoutCustomerAssociate(checkoutId, customerAccessToken) {
    const query = `
      mutation CheckoutCustomerAssociate($checkoutId: ID!, $customerAccessToken: String!) {
        checkoutCustomerAssociate(checkoutId: $checkoutId, customerAccessToken: $customerAccessToken) {
          checkout {
            id
          }
          checkoutUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    return this.query(query, { checkoutId, customerAccessToken });
  }

  async customerCreate(email, password, firstName, lastName, birthdate) {
    const query = `
      mutation CustomerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            firstName
            lastName
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        email,
        password,
        firstName,
        lastName,
        acceptsMarketing: true
      }
    };

    return this.query(query, variables);
  }

  async customerAccessTokenCreate(email, password) {
    const query = `
      mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        email,
        password
      }
    };

    return this.query(query, variables);
  }
  
  // Get products from a specific collection
  async getProductsByCollection(collectionId, first = 10) {
    const formattedId = collectionId.startsWith('gid://') 
      ? collectionId 
      : `gid://shopify/Collection/${collectionId}`;
      
    const query = `
      query GetProductsByCollection($collectionId: ID!, $first: Int!) {
        collection(id: $collectionId) {
          title
          products(first: $first) {
            edges {
              node {
                id
                title
                handle
                description
                featuredImage {
                  url
                  altText
                }
                images(first: 10) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                variants(first: 1) {
                  edges {
                    node {
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    return this.query(query, { collectionId: formattedId, first });
  }
}

module.exports = new ShopifyClient();