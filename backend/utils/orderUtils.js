// backend/utils/orderUtils.js - Fixed Metafields structure
const shopifyClient = require('./shopifyClient');
const Order = require('../models/Order');

// Fixed function for creating Shopify orders
async function createShopifyOrder(order) {
    try {
      // Only create a Shopify order if it doesn't already exist
      if (order.shopifyOrderId) {
        console.log(`Shopify order already exists for order ${order._id}: ${order.shopifyOrderId}`);
        return { id: order.shopifyOrderId };
      }
      
      // Initialize arrays for line items that can be created directly
      const lineItems = [];
      
      // Prepare line items properly formatted for the DraftOrderInput
      for (const item of order.items) {
        // Make sure we're using the correct variant ID format
        let variantId = item.variantId;

        // If it has a format like "gid://shopify/ProductVariant/123456", extract just the ID
        if (typeof variantId === 'string' && variantId.includes('/')) {
          variantId = variantId.split('/').pop();
        }
        
        // If it has a format like "123456-Color-Size", extract just the ID
        if (typeof variantId === 'string' && variantId.includes('-')) {
          variantId = variantId.split('-')[0];
        }
        
        // For all items, add them as regular line items with title, quantity, price
        // This avoids using customLineItems which is not supported
        lineItems.push({
          title: item.title || 'Product',
          quantity: item.quantity || 1,
          originalUnitPrice: parseFloat(item.price).toString(), // Ensure price is a string
          requiresShipping: true,
          taxable: true
        });
      }
      
      // Add packaging if selected as a regular line item
      if (order.packagingDetails?.packagingType !== 'normal' && order.packagingDetails?.packagingPrice > 0) {
        lineItems.push({
          title: order.packagingDetails.packagingName || "Premium Packaging",
          quantity: 1,
          originalUnitPrice: order.packagingDetails.packagingPrice.toString(),
          requiresShipping: false,
          taxable: false
        });
      }
      
      // Prepare shipping address
      const shippingAddress = {
        firstName: order.shippingAddress.firstName || "Customer",
        lastName: order.shippingAddress.lastName || "",
        address1: order.shippingAddress.address || "",
        city: order.shippingAddress.city || "",
        province: order.shippingAddress.state || "",
        country: order.shippingAddress.country || "Nigeria",
        zip: order.shippingAddress.zipCode || "",
        phone: order.shippingAddress.phone || ""
      };
      
      // Create draft order in Shopify with correct input format
      const draftOrderQuery = `
        mutation draftOrderCreate($input: DraftOrderInput!) {
          draftOrderCreate(input: $input) {
            draftOrder {
              id
              name
              totalPrice
              subtotalPrice
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      // Fixed metafields array with proper 'type' field
      const metafields = [
        { 
          namespace: "custom", 
          key: "Source", 
          value: "Luv's Allure Website", 
          type: "single_line_text_field"  // Added type field
        },
        { 
          namespace: "custom", 
          key: "Original_Order_ID", 
          value: order._id.toString(), 
          type: "single_line_text_field"  // Added type field
        },
        { 
          namespace: "custom", 
          key: "Payment_Gateway", 
          value: order.paymentGateway || "paystack", 
          type: "single_line_text_field"  // Added type field
        },
        { 
          namespace: "custom", 
          key: "Transaction_ID", 
          value: order.transactionId || "", 
          type: "single_line_text_field"  // Added type field
        },
        { 
          namespace: "custom", 
          key: "Shipping_Provider", 
          value: order.shippingProvider || "Not specified", 
          type: "single_line_text_field"  // Added type field
        },
        { 
          namespace: "custom", 
          key: "Estimated_Delivery", 
          value: order.estimatedDeliveryDays || "Not specified", 
          type: "single_line_text_field"  // Added type field
        },
        { 
          namespace: "custom", 
          key: "Packaging_Type", 
          value: order.packagingDetails?.packagingName || "Normal Packaging", 
          type: "single_line_text_field"  // Added type field
        }
      ];
      
      // Add gift message as a metafield if it exists
      if (order.packagingDetails?.giftMessage) {
        metafields.push({
          namespace: "custom",
          key: "Gift_Message",
          value: order.packagingDetails.giftMessage,
          type: "multi_line_text_field" // Different type for multi-line text
        });
      }

      // Fixed draft order input with proper metafields
      const draftOrderInput = {
        lineItems: lineItems,
        shippingAddress,
        shippingLine: {
          title: `${order.shippingProvider || "Standard"} Shipping (${order.estimatedDeliveryDays || "3-5"} days)`,
          price: (order.shipping || 0).toString()
        },
        metafields: metafields,
        note: `Order processed through Luv's Allure website. 
        Payment via ${order.paymentGateway?.toUpperCase() || 'PAYSTACK'}. 
        Reference: ${order.reference || 'N/A'}.
        Shipping via: ${order.shippingProvider || "Standard delivery"}.
        Estimated delivery: ${order.estimatedDeliveryDays || "3-5"} business days.
        Packaging: ${order.packagingDetails?.packagingName || "Normal Packaging"}
        ${order.packagingDetails?.giftMessage ? `Gift Message: "${order.packagingDetails.giftMessage}"` : ''}
        Customer Email: ${order.shippingAddress.email || 'Not provided'}
        Customer Phone: ${order.shippingAddress.phone || 'Not provided'}`,
        email: order.shippingAddress.email || "customer@example.com",
        tags: ["website-order"]
      };
      
      // Execute the draft order creation
      const draftOrderResult = await shopifyClient.adminQuery(draftOrderQuery, {
        input: draftOrderInput
      });

      if (draftOrderResult.draftOrderCreate.userErrors.length > 0) {
        throw new Error(
          `Draft order creation errors: ${JSON.stringify(
            draftOrderResult.draftOrderCreate.userErrors
          )}`
        );
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

      const completeResult = await shopifyClient.adminQuery(completeDraftOrderQuery, {
        id: draftOrderId
      });

      if (completeResult.draftOrderComplete.userErrors.length > 0) {
        throw new Error(
          `Draft order completion errors: ${JSON.stringify(
            completeResult.draftOrderComplete.userErrors
          )}`
        );
      }

      const orderId = completeResult.draftOrderComplete.draftOrder.order.id;
      
      // Update our database with the Shopify order ID
      order.shopifyOrderId = orderId;
      await order.save();

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

        const markAsPaidResult = await shopifyClient.adminQuery(markAsPaidQuery, {
          input: {
            id: orderId
          }
        });

        if (markAsPaidResult.orderMarkAsPaid.userErrors.length > 0) {
          console.warn(
            `Warning: Could not mark order as paid: ${JSON.stringify(
              markAsPaidResult.orderMarkAsPaid.userErrors
            )}`
          );
        }
      } catch (paymentError) {
        // Log the error but don't fail the order creation
        console.warn(
          "Warning: Could not mark order as paid:",
          paymentError.message
        );
      }

      // Return the order data regardless of payment marking status
      return {
        id: orderId,
        name: completeResult.draftOrderComplete.draftOrder.order.name,
        processedAt:
          completeResult.draftOrderComplete.draftOrder.order.processedAt,
        totalPrice:
          completeResult.draftOrderComplete.draftOrder.order.totalPrice
      };
    } catch (error) {
      console.error("Error creating Shopify order:", error);
      throw error;
    }
  }

module.exports = {
  createShopifyOrder
};