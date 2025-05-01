// utils/shopifyClient.js - Updated with password management methods
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

  /**
   * Create an order in Shopify
   * @param {Object} orderData Order data including lineItems, shipping, etc.
   * @returns {Promise<Object>} Created order
   */
  async createOrder(orderData) {
    try {
      // First create a draft order
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
                email
              }
              note
            }
            userErrors {
              field
              message
            }
          }
        }
      `;
      
      // Format line items for GraphQL
      const lineItems = orderData.lineItems.map(item => {
        // Check if this is a variant ID or custom item
        if (item.variantId) {
          return {
            variantId: item.variantId,
            quantity: item.quantity
          };
        } else {
          // Custom item (like packaging)
          return {
            title: item.title,
            price: item.price,
            quantity: item.quantity
          };
        }
      });
      
      // Format shipping line
      const shippingLine = {
        title: orderData.shippingLine.title,
        price: orderData.shippingLine.price
      };
      
      // Format shipping address
      const shippingAddress = {
        address1: orderData.shippingAddress.address1,
        address2: orderData.shippingAddress.address2 || "",
        city: orderData.shippingAddress.city,
        province: orderData.shippingAddress.province,
        country: orderData.shippingAddress.country,
        firstName: orderData.shippingAddress.firstName,
        lastName: orderData.shippingAddress.lastName,
        phone: orderData.shippingAddress.phone,
        zip: orderData.shippingAddress.zip || ""
      };
      
      // Prepare custom note attributes
      const customAttributes = orderData.customAttributes || [];
      
      // Create draft order
      const draftOrderVars = {
        input: {
          lineItems,
          shippingLine,
          shippingAddress,
          note: orderData.note,
          customAttributes,
          email: orderData.customer.email,
          tags: ["website-order"]
        }
      };
      
      // Execute the draft order creation
      const draftOrderResult = await this.query(draftOrderQuery, { input: draftOrderVars.input });
      
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
      
      const completeResult = await this.query(completeDraftOrderQuery, { id: draftOrderId });
      
      if (completeResult.draftOrderComplete.userErrors.length > 0) {
        throw new Error(`Draft order completion errors: ${JSON.stringify(completeResult.draftOrderComplete.userErrors)}`);
      }
      
      const orderId = completeResult.draftOrderComplete.draftOrder.order.id;
      
      // Mark the order as paid
      const fulfillmentOrderQuery = `
        mutation orderMarkAsPaid($id: ID!, $input: OrderMarkAsPaidInput!) {
          orderMarkAsPaid(id: $id, input: $input) {
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
      
      const markAsPaidResult = await this.query(fulfillmentOrderQuery, { 
        id: orderId,
        input: { 
          notifyCustomer: false 
        }
      });
      
      if (markAsPaidResult.orderMarkAsPaid.userErrors.length > 0) {
        throw new Error(`Mark as paid errors: ${JSON.stringify(markAsPaidResult.orderMarkAsPaid.userErrors)}`);
      }
      
      // Return the order data
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