// controllers/productController.js
const shopifyConfig = require('../config/shopify');
const shopifyService = require("../services/shopifyService");

exports.createProduct = async (req, res) => {
  try {
    const { 
      title, 
      body_html, 
      vendor, 
      product_type,
      tags,
      variants,
      options
    } = req.body;

    // Create Product with Extended Attributes
    const newProduct = await shopifyConfig.product.create({
      title,
      body_html,
      vendor,
      product_type,
      tags: tags.join(','),
      variants,
      options: [
        { name: 'Color', values: variants.map(v => v.color) },
        { name: 'Size', values: variants.map(v => v.size) }
      ],
      metafields: [
        {
          key: 'style_category',
          value: req.body.styleCategory,
          type: 'single_line_text_field',
          namespace: 'fashion'
        }
      ]
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkoutProduct = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const checkoutUrl = await shopifyService.createCheckout(productId, quantity);
    res.json({ checkoutUrl });
  } catch (error) {
    res.status(500).json({ error: "Checkout failed" });
  }
};
