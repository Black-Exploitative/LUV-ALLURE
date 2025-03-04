// middlewares/shopifyMiddleware.js
const { Shopify } = require('@shopify/shopify-api');
const crypto = require('crypto');

class ShopifyMiddleware {
  // Verify Shopify Webhook Signature
  static verifyWebhook(req, res, next) {
    const hmac = req.get('X-Shopify-Hmac-Sha256');
    const body = req.rawBody;
    const generatedHash = crypto
      .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
      .update(body, 'utf8', 'hex')
      .digest('base64');

    if (generatedHash !== hmac) {
      return res.status(403).send('Invalid webhook');
    }
    next();
  }

  // Shopify API Rate Limiting Middleware
  static rateLimiter(req, res, next) {
    // Basic rate limiting implementation
    const shopifyClient = new Shopify.Clients.Rest(
      process.env.SHOPIFY_SHOP, 
      process.env.SHOPIFY_ACCESS_TOKEN
    );

    try {
      const remaining = shopifyClient.callLimits.remaining;
      
      if (remaining <= 10) {
        return res.status(429).json({
          message: 'Shopify API rate limit reached. Please try again later.'
        });
      }
      
      next();
    } catch (error) {
      res.status(500).json({ 
        message: 'Error checking Shopify API limits',
        error: error.message 
      });
    }
  }

  // Validate Shopify App Proxy Signature
  static validateAppProxySignature(req, res, next) {
    const { signature, ...query } = req.query;
    
    const computedSignature = Object.keys(query)
      .sort()
      .map(key => `${key}=${query[key]}`)
      .join('')
      .concat(process.env.SHOPIFY_API_SECRET);

    const hashedSignature = crypto
      .createHash('md5')
      .update(computedSignature)
      .digest('hex');

    if (hashedSignature !== signature) {
      return res.status(403).send('Invalid app proxy signature');
    }

    next();
  }
}

module.exports = ShopifyMiddleware;