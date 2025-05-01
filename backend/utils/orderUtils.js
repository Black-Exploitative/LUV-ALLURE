// utils/orderUtils.js
const shopifyClient = require('./shopifyClient');
const Order = require('../models/Order');

// Shared function for creating Shopify orders
// In utils/orderUtils.js
// In utils/orderUtils.js - Revised approach for handling real products
async function createShopifyOrder(order) {
    try {
      // Only create a Shopify order if it doesn't already exist
      if (order.shopifyOrderId) {
        console.log(`Shopify order already exists for order ${order._id}: ${order.shopifyOrderId}`);
        return { id: order.shopifyOrderId };
      }
      
      // First try to get product variants properly formatted
      const lineItems = order.items.map(item => {
        // Strip any format that may have been added to the variant ID 
        // and get just the numeric part
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
        
        console.log(`Original variantId: ${item.variantId}, Formatted: ${formattedVariantId}`);
        
        return {
          variantId: formattedVariantId,
          quantity: item.quantity || 1
        };
      });
      
      // Add packaging as a custom line item if premium packaging is selected
      const customLineItems = [];
      if (order.packagingDetails?.packagingType !== 'normal' && order.packagingDetails?.packagingPrice > 0) {
        customLineItems.push({
          title: order.packagingDetails.packagingName || "Premium Packaging",
          quantity: 1,
          originalUnitPrice: (order.packagingDetails.packagingPrice || 0).toString(),
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
      const shopifyOrderData = {
        lineItems,
        customLineItems: customLineItems.length > 0 ? customLineItems : undefined,
        shippingAddress,
        shippingLine: {
          title: `${order.shippingProvider || "Standard"} Shipping (${order.estimatedDeliveryDays || "3-5"} days)`,
          price: (order.shipping || 0).toString()
        },
        customer: {
          firstName: order.shippingAddress.firstName || "Customer",
          lastName: order.shippingAddress.lastName || "",
          email: order.shippingAddress.email || "customer@example.com"
        },
        customAttributes: [
          { key: "Source", value: "Luv's Allure Website" },
          { key: "Original Order ID", value: order._id.toString() },
          { key: "Payment Gateway", value: order.paymentGateway || "paystack" },
          { key: "Transaction ID", value: order.transactionId || "" },
          { key: "Shipping Provider", value: order.shippingProvider || "Not specified" },
          { key: "Estimated Delivery", value: order.estimatedDeliveryDays || "Not specified" },
          { key: "Packaging Type", value: order.packagingDetails?.packagingName || "Normal Packaging" },
          // If there's a gift message, add it as a custom attribute
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
      
      // Create the order in Shopify
      const shopifyOrder = await shopifyClient.createOrder(shopifyOrderData);
      
      // Update our order with Shopify order ID
      if (shopifyOrder && shopifyOrder.id) {
        order.shopifyOrderId = shopifyOrder.id;
        order.shopifySyncAttempted = true;
        await order.save();
        
        console.log(`Created Shopify order ${shopifyOrder.id} for order ${order._id}`);
        return shopifyOrder;
      } else {
        throw new Error('Failed to create Shopify order: No ID returned');
      }
    } catch (error) {
      console.error(`Error creating Shopify order for order ${order._id}:`, error);
      
      // If the error is about product availability, try creating with just custom line items
      if (error.message && error.message.includes('no longer available')) {
        console.log('Attempting to create order with custom line items only...');
        
        try {
          // Create custom line items for each product in the order
          const customLineItems = order.items.map(item => ({
            title: item.title || 'Product',
            quantity: item.quantity || 1,
            originalUnitPrice: (parseFloat(item.price) || 0).toString(),
            requiresShipping: true,
            taxable: true
          }));
          
          // Add packaging if applicable
          if (order.packagingDetails?.packagingType !== 'normal' && order.packagingDetails?.packagingPrice > 0) {
            customLineItems.push({
              title: order.packagingDetails.packagingName || "Premium Packaging",
              quantity: 1,
              originalUnitPrice: (order.packagingDetails.packagingPrice || 0).toString(),
              requiresShipping: false,
              taxable: false
            });
          }
          
          // Create a new order data object with only custom line items
          const fallbackOrderData = {
            // Use only custom line items
            customLineItems,
            shippingAddress: shopifyOrderData.shippingAddress,
            shippingLine: shopifyOrderData.shippingLine,
            customer: shopifyOrderData.customer,
            customAttributes: shopifyOrderData.customAttributes,
            note: shopifyOrderData.note + '\n\nNote: Original product variants were unavailable, replaced with custom line items.',
            email: shopifyOrderData.email,
            tags: [...(shopifyOrderData.tags || []), "product-unavailable-fallback"]
          };
          
          // Try creating the order again with only custom line items
          const fallbackOrder = await shopifyClient.createOrder(fallbackOrderData);
          
          if (fallbackOrder && fallbackOrder.id) {
            order.shopifyOrderId = fallbackOrder.id;
            order.shopifySyncAttempted = true;
            order.shopifySyncError = 'Created with custom line items due to product availability issues';
            await order.save();
            
            console.log(`Created fallback Shopify order ${fallbackOrder.id} for order ${order._id}`);
            return fallbackOrder;
          }
        } catch (fallbackError) {
          console.error('Error creating fallback order:', fallbackError);
        }
      }
      
      // Mark the order as processed even if Shopify sync fails
      try {
        order.shopifySyncAttempted = true;
        order.shopifySyncError = error.message;
        await order.save();
      } catch (saveError) {
        console.error('Error saving order sync status:', saveError);
      }
      
      throw error;
    }
  }

module.exports = {
  createShopifyOrder
};