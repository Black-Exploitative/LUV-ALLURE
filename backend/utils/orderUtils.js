// utils/orderUtils.js
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
    
    // Format line items for Shopify
    const lineItems = order.items.map(item => ({
      variantId: item.variantId.includes('gid://') 
        ? item.variantId 
        : `gid://shopify/ProductVariant/${item.variantId}`,
      quantity: item.quantity,
      title: item.title
    }));
    
    // If using luxe or gift packaging, add it as a separate line item
    if (order.packagingDetails?.packagingType !== 'normal' && order.packagingDetails?.packagingPrice > 0) {
      lineItems.push({
        title: order.packagingDetails.packagingName,
        price: order.packagingDetails.packagingPrice.toString(),
        quantity: 1,
        requires_shipping: false,
        taxable: false
      });
    }
    
    // Prepare shipping address
    const shippingAddress = {
      firstName: order.shippingAddress.firstName,
      lastName: order.shippingAddress.lastName,
      address1: order.shippingAddress.address,
      city: order.shippingAddress.city,
      province: order.shippingAddress.state,
      country: order.shippingAddress.country,
      zip: order.shippingAddress.zipCode,
      phone: order.shippingAddress.phone
    };
    
    // Create draft order in Shopify
    const shopifyOrderData = {
      lineItems,
      shippingAddress,
      customer: {
        firstName: order.shippingAddress.firstName,
        lastName: order.shippingAddress.lastName,
        email: order.shippingAddress.email
      },
      customAttributes: [
        { key: "Source", value: "Luv's Allure Website" },
        { key: "Original Order ID", value: order._id.toString() },
        { key: "Payment Gateway", value: order.paymentGateway },
        { key: "Transaction ID", value: order.transactionId },
        { key: "Shipping Provider", value: order.shippingProvider || "Not specified" },
        { key: "Estimated Delivery", value: order.estimatedDeliveryDays || "Not specified" },
        { key: "Packaging Type", value: order.packagingDetails?.packagingName || "Normal Packaging" },
        // If there's a gift message, add it as a custom attribute
        ...(order.packagingDetails?.giftMessage ? [{ key: "Gift Message", value: order.packagingDetails.giftMessage }] : [])
      ],
      shippingLine: {
        title: `${order.shippingProvider || "Standard"} Shipping (${order.estimatedDeliveryDays || "3-5"} days)`,
        price: order.shipping.toString()
      },
      note: `Order processed through Luv's Allure website. 
      Payment via ${order.paymentGateway.toUpperCase()}. 
      Reference: ${order.reference}.
      Shipping via: ${order.shippingProvider || "Standard delivery"}.
      Estimated delivery: ${order.estimatedDeliveryDays || "3-5"} business days.
      Packaging: ${order.packagingDetails?.packagingName || "Normal Packaging"}
      ${order.packagingDetails?.giftMessage ? `Gift Message: "${order.packagingDetails.giftMessage}"` : ''}
      Customer Email: ${order.shippingAddress.email}
      Customer Phone: ${order.shippingAddress.phone}`
    };
    
    // Create the order in Shopify
    const shopifyOrder = await shopifyClient.createOrder(shopifyOrderData);
    
    // Update our order with Shopify order ID
    if (shopifyOrder && shopifyOrder.id) {
      order.shopifyOrderId = shopifyOrder.id;
      await order.save();
      
      console.log(`Created Shopify order ${shopifyOrder.id} for order ${order._id}`);
      return shopifyOrder;
    } else {
      throw new Error('Failed to create Shopify order: No ID returned');
    }
  } catch (error) {
    console.error(`Error creating Shopify order for order ${order._id}:`, error);
    throw error;
  }
}

module.exports = {
  createShopifyOrder
};