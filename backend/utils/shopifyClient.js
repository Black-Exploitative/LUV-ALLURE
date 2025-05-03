// utils/shopifyClient.js - Updated with password management methods
const fetch = require('node-fetch');
const shopifyConfig = require('../config/shopify');

class ShopifyClient {
  constructor() {
    this.shopifyDomain = `https://${shopifyConfig.shopName}.myshopify.com`;
    this.adminAccessToken = shopifyConfig.adminAccessToken;
    this.storefrontAccessToken = shopifyConfig.storefrontAccessToken;
    this.apiVersion = shopifyConfig.apiVersion;
    this.adminApiVersion = shopifyConfig.adminApiVersion; // Added for admin API
  }

  async adminQuery(query, variables = {}) {
    try {
      // Debug output
      console.log("Admin API URL:", `${this.shopifyDomain}/admin/api/${this.adminApiVersion}/graphql.json`);
      console.log("Using Admin Token:", this.adminAccessToken ? "Token exists" : "No token found");
      
      if (!this.adminAccessToken) {
        throw new Error("No admin access token provided. Check your .env file.");
      }
  
      // Using node-fetch for compatibility
      // const fetch = require('node-fetch'); // Uncomment if using node-fetch directly
      
      const response = await fetch(
        `${this.shopifyDomain}/admin/api/${this.adminApiVersion}/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': this.adminAccessToken
          },
          body: JSON.stringify({ query, variables })
        }
      );
  
      // Log HTTP status
      console.log(`Admin API response status: ${response.status} ${response.statusText}`);
      
      // Handle non-200 responses
      if (!response.ok) {
        // Get the text response for better error information
        const errorText = await response.text();
        throw new Error(`Shopify API returned ${response.status}: ${errorText}`);
      }
  
      const jsonResponse = await response.json();
      
      // Check for GraphQL errors
      if (jsonResponse.errors) {
        const errorMsg = JSON.stringify(jsonResponse.errors);
        console.error("GraphQL errors:", errorMsg);
        throw new Error(`GraphQL errors: ${errorMsg}`);
      }
  
      return jsonResponse.data;
    } catch (error) {
      console.error('Shopify Admin API detailed error:', error);
      throw error;
    }
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

  // Method to get a product by ID
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
  
  // Method to get customer by access token
  async getCustomer(customerAccessToken) {
    const query = `
      query GetCustomer($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          id
          email
          firstName
          lastName
          phone
          defaultAddress {
            id
            address1
            address2
            city
            province
            country
            zip
            phone
          }
          addresses(first: 10) {
            edges {
              node {
                id
                address1
                address2
                city
                province
                country
                zip
                phone
              }
            }
          }
        }
      }
    `;

    return this.query(query, { customerAccessToken });
  }

  // Method to update customer profile
  async updateCustomer(customerAccessToken, customer) {
    const query = `
      mutation CustomerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
        customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
          customer {
            id
            email
            firstName
            lastName
            phone
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    return this.query(query, { customerAccessToken, customer });
  }

  // Method to update customer password - new method for updating password directly
  async customerUpdatePassword(customerAccessToken, password) {
    // In Shopify Storefront API, password updating is done through the customerUpdate mutation
    const query = `
      mutation CustomerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
        customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
          customer {
            id
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
      customerAccessToken,
      customer: {
        password
      }
    };

    return this.query(query, variables);
  }

  // Method to recover customer password - send reset email
  async customerRecover(email) {
    const query = `
      mutation CustomerRecover($email: String!) {
        customerRecover(email: $email) {
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    return this.query(query, { email });
  }

  // Method to reset customer password with reset token
  async customerResetByUrl(resetUrl, password) {
    const query = `
      mutation CustomerResetByUrl($resetUrl: URL!, $password: String!) {
        customerResetByUrl(resetUrl: $resetUrl, password: $password) {
          customer {
            id
          }
          customerUserErrors {
            code
            field
            message
          }
          customerAccessToken {
            accessToken
            expiresAt
          }
        }
      }
    `;

    return this.query(query, { resetUrl, password });
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

  // Add this helper function to shopifyClient.js
  async getProductVariantById(variantId) {
    // Clean up the variant ID
    let cleanId = variantId;
    if (typeof cleanId === 'string') {
      if (cleanId.includes('/')) {
        cleanId = cleanId.split('/').pop();
      }
      if (cleanId.includes('-')) {
        cleanId = cleanId.split('-')[0];
      }
    }
    
    // Format as a Shopify GraphQL ID
    const formattedId = `gid://shopify/ProductVariant/${cleanId}`;
    
    const query = `
    query GetNodeById($id: ID!) {
      node(id: $id) {
        ... on ProductVariant {
          id
          title
          product {
            id
            title
            availableForSale
          }
          price {
            amount
          }
          availableForSale
          quantityAvailable
        }
      }
    }
  `;
  
  try {
    const result = await this.query(query, { id: formattedId });
    return result.node;
  } catch (error) {
    console.error(`Error fetching variant ${variantId}:`, error);
    return null;
  }
}

  /**
   * Create an order in Shopify
   * @param {Object} orderData Order data including lineItems, shipping, etc.
   * @returns {Promise<Object>} Created order
   */
  async createOrder(orderData) {
    try {
      // First create a draft order with proper line item handling
      const draftOrderQuery = `
        mutation draftOrderCreate($input: DraftOrderInput!) {
          draftOrderCreate(input: $input) {
            draftOrder {
              id
              name
              totalPrice
              subtotalPrice
              customer {
                id
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;
      
      // Format custom line items using the correct Shopify format
      const formattedLineItems = [...orderData.lineItems];
      
      // If custom line items exist, add them
      if (orderData.customLineItems && orderData.customLineItems.length > 0) {
        orderData.customLineItems.forEach(item => {
          formattedLineItems.push({
            title: item.title,
            quantity: item.quantity,
            originalUnitPrice: item.originalUnitPrice,
            taxable: item.taxable,
            requiresShipping: item.requiresShipping
          });
        });
      }
      
      // Create draft order input with properly formatted line items
      const draftOrderInput = {
        lineItems: formattedLineItems,
        shippingLine: orderData.shippingLine,
        shippingAddress: orderData.shippingAddress,
        note: orderData.note,
        customAttributes: orderData.customAttributes,
        email: orderData.email,
        tags: orderData.tags || ["website-order"],
        // Add payment info
        appliedDiscount: null,
        paymentTerms: null
      };
      
      // Execute the draft order creation
      const draftOrderResult = await this.adminQuery(draftOrderQuery, { input: draftOrderInput });
      
      if (draftOrderResult.draftOrderCreate.userErrors.length > 0) {
        throw new Error(`Draft order creation errors: ${JSON.stringify(draftOrderResult.draftOrderCreate.userErrors)}`);
      }
      
      const draftOrderId = draftOrderResult.draftOrderCreate.draftOrder.id;
      
      // Complete the draft order to create an actual order
      const completeDraftOrderQuery = `
        mutation draftOrderComplete($id: ID!) {
          draftOrderComplete(id: $id) {
            draftOrder {
              id
              order {
                id
                name
                processedAt
                totalPrice
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;
      
      const completeResult = await this.adminQuery(completeDraftOrderQuery, { id: draftOrderId });
      
      if (completeResult.draftOrderComplete.userErrors.length > 0) {
        throw new Error(`Draft order completion errors: ${JSON.stringify(completeResult.draftOrderComplete.userErrors)}`);
      }
      
      const orderId = completeResult.draftOrderComplete.draftOrder.order.id;
      
      // TRY to mark the order as paid, but don't fail if it doesn't work
      try {
        const markAsPaidQuery = `
          mutation orderMarkAsPaid($input: OrderMarkAsPaidInput!) {
            orderMarkAsPaid(input: $input) {
              order {
                id
                name
                displayFinancialStatus
              }
              userErrors {
                field
                message
              }
            }
          }
        `;
  
        const markAsPaidResult = await this.adminQuery(markAsPaidQuery, { 
          input: { 
            id: orderId
          }
        });
        
        if (markAsPaidResult.orderMarkAsPaid.userErrors.length > 0) {
          console.warn(`Warning: Could not mark order as paid: ${JSON.stringify(markAsPaidResult.orderMarkAsPaid.userErrors)}`);
        }
      } catch (paymentError) {
        // Log the error but don't fail the order creation
        console.warn('Warning: Could not mark order as paid:', paymentError.message);
      }
      
      // Return the order data regardless of payment marking status
      return {
        id: orderId,
        name: completeResult.draftOrderComplete.draftOrder.order.name,
        processedAt: completeResult.draftOrderComplete.draftOrder.order.processedAt,
        totalPrice: completeResult.draftOrderComplete.draftOrder.order.totalPrice
      };
    } catch (error) {
      console.error('Error creating Shopify order:', error);
      throw error;
    }
  }
}
module.exports = new ShopifyClient();