// controllers/metafieldsController.js
const shopifyConfig = require('../config/shopify');
const Product = require('../models/Product');
const User = require('../models/user');
const ShopifyHelpers = require('../utils/shopifyHelpers');

exports.createMetafield = async (req, res) => {
  try {
    const { 
      namespace, 
      key, 
      value, 
      type = 'single_line_text_field' 
    } = req.body;

    const { productId, customerId } = req.params;

    let shopifyResponse;
    let localUpdateQuery;

    if (productId) {
      // Validate product exists in Shopify
      const productValidation = await ShopifyHelpers.validateResource('products', productId);
      if (!productValidation) {
        return res.status(404).json({ message: 'Product not found in Shopify' });
      }

      // Create Shopify Metafield for Product
      shopifyResponse = await shopifyConfig.product.createMetafield({
        productId,
        namespace,
        key,
        value,
        type
      });

      // Update local product database
      localUpdateQuery = await Product.findOneAndUpdate(
        { shopifyProductId: productId },
        { 
          $push: { 
            metafields: {
              key,
              value,
              namespace,
              shopifyMetafieldId: shopifyResponse.id
            } 
          } 
        },
        { new: true }
      );
    } else if (customerId) {
      // Validate customer exists in Shopify
      const customerValidation = await ShopifyHelpers.validateResource('customers', customerId);
      if (!customerValidation) {
        return res.status(404).json({ message: 'Customer not found in Shopify' });
      }

      // Create Shopify Metafield for Customer
      shopifyResponse = await shopifyConfig.customer.createMetafield({
        customerId,
        namespace,
        key,
        value,
        type
      });

      // Update local user database
      localUpdateQuery = await User.findOneAndUpdate(
        { shopifyCustomerId: customerId },
        { 
          $push: { 
            metafields: {
              key,
              value,
              namespace,
              shopifyMetafieldId: shopifyResponse.id
            } 
          } 
        },
        { new: true }
      );
    } else {
      return res.status(400).json({ message: 'Invalid resource type' });
    }

    res.status(201).json({
      shopifyMetafield: shopifyResponse,
      localUpdate: localUpdateQuery
    });
  } catch (error) {
    const formattedError = ShopifyHelpers.handleShopifyError(error);
    res.status(formattedError.status).json({ 
      message: 'Metafield creation failed', 
      error: formattedError 
    });
  }
};

exports.getMetafields = async (req, res) => {
  try {
    const { productId, customerId } = req.params;
    const { namespace } = req.query;

    let shopifyResponse;
    let localResource;

    if (productId) {
      // Fetch Shopify Product Metafields
      shopifyResponse = await shopifyConfig.product.getMetafields({
        productId,
        ...(namespace && { namespace })
      });

      // Find local product
      localResource = await Product.findOne({ 
        shopifyProductId: productId 
      });
    } else if (customerId) {
      // Fetch Shopify Customer Metafields
      shopifyResponse = await shopifyConfig.customer.getMetafields({
        customerId,
        ...(namespace && { namespace })
      });

      // Find local user
      localResource = await User.findOne({ 
        shopifyCustomerId: customerId 
      });
    } else {
      return res.status(400).json({ message: 'Invalid resource type' });
    }

    res.json({
      shopifyMetafields: shopifyResponse,
      localResource: localResource
    });
  } catch (error) {
    const formattedError = ShopifyHelpers.handleShopifyError(error);
    res.status(formattedError.status).json({ 
      message: 'Fetching metafields failed', 
      error: formattedError 
    });
  }
};

exports.updateMetafield = async (req, res) => {
  try {
    const { productId, customerId, metafieldId } = req.params;
    const { value, type } = req.body;

    let shopifyResponse;
    let localUpdateQuery;

    if (productId) {
      // Update Shopify Product Metafield
      shopifyResponse = await shopifyConfig.product.updateMetafield({
        productId,
        metafieldId,
        value,
        type
      });

      // Update local product database
      localUpdateQuery = await Product.findOneAndUpdate(
        { 
          shopifyProductId: productId, 
          'metafields.shopifyMetafieldId': metafieldId 
        },
        { 
          $set: { 
            'metafields.$.value': value,
            'metafields.$.type': type 
          } 
        },
        { new: true }
      );
    } else if (customerId) {
      // Update Shopify Customer Metafield
      shopifyResponse = await shopifyConfig.customer.updateMetafield({
        customerId,
        metafieldId,
        value,
        type
      });

      // Update local user database
      localUpdateQuery = await User.findOneAndUpdate(
        { 
          shopifyCustomerId: customerId, 
          'metafields.shopifyMetafieldId': metafieldId 
        },
        { 
          $set: { 
            'metafields.$.value': value,
            'metafields.$.type': type 
          } 
        },
        { new: true }
      );
    } else {
      return res.status(400).json({ message: 'Invalid resource type' });
    }

    res.json({
      shopifyMetafield: shopifyResponse,
      localUpdate: localUpdateQuery
    });
  } catch (error) {
    const formattedError = ShopifyHelpers.handleShopifyError(error);
    res.status(formattedError.status).json({ 
      message: 'Metafield update failed', 
      error: formattedError 
    });
  }
};

exports.deleteMetafield = async (req, res) => {
  try {
    const { productId, customerId, metafieldId } = req.params;

    let shopifyResponse;
    let localDeleteQuery;

    if (productId) {
      // Delete Shopify Product Metafield
      shopifyResponse = await shopifyConfig.product.deleteMetafield({
        productId,
        metafieldId
      });

      // Remove from local product database
      localDeleteQuery = await Product.findOneAndUpdate(
        { shopifyProductId: productId },
        { 
          $pull: { 
            metafields: { shopifyMetafieldId: metafieldId } 
          } 
        },
        { new: true }
      );
    } else if (customerId) {
      // Delete Shopify Customer Metafield
      shopifyResponse = await shopifyConfig.customer.deleteMetafield({
        customerId,
        metafieldId
      });

      // Remove from local user database
      localDeleteQuery = await User.findOneAndUpdate(
        { shopifyCustomerId: customerId },
        { 
          $pull: { 
            metafields: { shopifyMetafieldId: metafieldId } 
          } 
        },
        { new: true }
      );
    } else {
      return res.status(400).json({ message: 'Invalid resource type' });
    }

    res.json({
      shopifyMetafield: shopifyResponse,
      localDelete: localDeleteQuery
    });
  } catch (error) {
    const formattedError = ShopifyHelpers.handleShopifyError(error);
    res.status(formattedError.status).json({ 
      message: 'Metafield deletion failed', 
      error: formattedError 
    });
  }
};