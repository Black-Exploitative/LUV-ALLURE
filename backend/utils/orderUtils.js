// backend/utils/orderUtils.js - Fixed variable scoping issues
const shopifyClient = require('./shopifyClient');
const Order = require('../models/Order');

// Shared function for creating Shopify orders
async function createShopifyOrder(order) {
    try {
      // Only create a Shopify order if it doesn't already exist
      if (order.shopifyOrderId) {
        console.log(`Shopify order already exists for order ${order._id}: ${order.shopifyOrderId}`);
        return { id: order.shopifyOrderId };
      }
      
      // Initialize arrays for line items and custom line items
      const lineItems = [];
      const customLineItems = []; // Define customLineItems before using it
    
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
        
        // Now format it properly for the Shopify Admin API
        const formattedVariantId = `gid://shopify/ProductVariant/${variantId}`;
        
        try {
          // Verify that this variant exists and is available
          const variant = await shopifyClient.getProductVariantById(variantId);
          
          if (!variant || !variant.availableForSale) {
            console.log(`Variant ${variantId} is not available, will use custom line item instead`);
            // Add as custom line item
            customLineItems.push({
              title: item.title || 'Product',
              quantity: item.quantity || 1,
              originalUnitPrice: parseFloat(item.price).toString(),
              requiresShipping: true,
              taxable: true,
              properties: item.image ? [
                { name: 'Image', value: item.image }
              ] : undefined
            });
          } else {
            // Add as a real product line item with the proper Shopify ID
            lineItems.push({
              variantId: formattedVariantId,
              quantity: item.quantity || 1,
              // Add image URL as property if it's not available through the variant
              properties: item.image ? [
                { name: 'Image', value: item.image }
              ] : undefined
            });
          }
        } catch (error) {
          console.log(`Error verifying variant ${variantId}, will use custom line item instead:`, error);
          // Add as custom line item
          customLineItems.push({
            title: item.title || 'Product',
            quantity: item.quantity || 1,
            originalUnitPrice: parseFloat(item.price).toString(),
            requiresShipping: true,
            taxable: true,
            properties: item.image ? [
              { name: 'Image', value: item.image }
            ] : undefined
          });
        }
      }
      
      // Add packaging if selected
      if (order.packagingDetails?.packagingType !== 'normal' && order.packagingDetails?.packagingPrice > 0) {
        customLineItems.push({
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
      
      // Create draft order in Shopify
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

      // Create draft order input
      const draftOrderInput = {
        lineItems: lineItems,
        customLineItems: customLineItems.length > 0 ? customLineItems : undefined,
        shippingAddress,
        shippingLine: {
          title: `${order.shippingProvider || "Standard"} Shipping (${order.estimatedDeliveryDays || "3-5"} days)`,
          price: (order.shipping || 0).toString()
        },
        customer: {
          id: order.customerId || null
        },
        customAttributes: [
          { key: "Source", value: "Luv's Allure Website" },
          { key: "Original Order ID", value: order._id.toString() },
          { key: "Payment Gateway", value: order.paymentGateway || "paystack" },
          { key: "Transaction ID", value: order.transactionId || "" },
          { key: "Shipping Provider", value: order.shippingProvider || "Not specified" },
          { key: "Estimated Delivery", value: order.estimatedDeliveryDays || "Not specified" },
          { key: "Packaging Type", value: order.packagingDetails?.packagingName || "Normal Packaging" },
          ...(order.packagingDetails?.giftMessage ? [{ key: "Gift Message", value: order.packagingDetails.giftMessage }] : [])
        ],
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