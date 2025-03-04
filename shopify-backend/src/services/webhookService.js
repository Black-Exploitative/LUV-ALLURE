// src/services/webhookService.js
const crypto = require('crypto');
const shopifyConfig = require('../config/shopify');

class WebhookService {
  // Verify Shopify webhook signature
  static verifyWebhook(rawBody, hmacHeader) {
    const calculatedHmac = crypto
      .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
      .update(rawBody)
      .digest('base64');
    
    return calculatedHmac === hmacHeader;
  }

  // Product Create/Update Webhook
  static async handleProductWebhook(payload) {
    try {
      const product = JSON.parse(payload);
      
      // Sync with local database or perform additional processing
      await ProductModel.findOneAndUpdate(
        { shopifyProductId: product.id },
        {
          shopifyProductId: product.id,
          title: product.title,
          description: product.body_html,
          variants: product.variants,
          // Add more fields as needed
        },
        { upsert: true, new: true }
      );

      console.log(`Product ${product.id} synchronized`);
    } catch (error) {
      console.error('Webhook processing error:', error);
    }
  }

  // Order Create Webhook
  static async handleOrderWebhook(payload) {
    const order = JSON.parse(payload);
    
    // Custom order processing logic
    await OrderModel.create({
      shopifyOrderId: order.id,
      customerEmail: order.email,
      totalPrice: order.total_price,
      lineItems: order.line_items,
      fulfillmentStatus: order.fulfillment_status
    });
  }
}

module.exports = WebhookService;