// controllers/productController.js - Product controller
const shopifyClient = require('../utils/shopifyClient');

// Get all products
exports.getProducts = async (req, res, next) => {
  try {
    const { first = 20, after } = req.query;
    const result = await shopifyClient.getProducts(parseInt(first), after || null);
    
    // Transform the response to match frontend expectations
    const transformedProducts = result.products.edges.map(edge => {
      const product = edge.node;
      return {
        id: product.id.split('/').pop(),
        title: product.title,
        handle: product.handle,
        description: product.description,
        images: product.images.edges.map(imgEdge => ({
          src: imgEdge.node.url,
          altText: imgEdge.node.altText
        })),
        variants: product.variants.edges.map(variantEdge => ({
          id: variantEdge.node.id.split('/').pop(),
          title: variantEdge.node.title,
          price: variantEdge.node.price,
          selectedOptions: variantEdge.node.selectedOptions,
          inventoryQuantity: variantEdge.node.inventoryQuantity
        })),
        options: product.variants.edges.map(variantEdge => ({
          name: variantEdge.node.title,
          values: [variantEdge.node.title]
        }))
      };
    });
    
    res.status(200).json({
      products: transformedProducts,
      pageInfo: result.products.pageInfo
    });
  } catch (error) {
    next(error);
  }
};

// Get product by handle
exports.getProductByHandle = async (req, res, next) => {
  try {
    const { handle } = req.params;
    const result = await shopifyClient.getProductByHandle(handle);
    
    if (!result.product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const product = result.product;
    const transformedProduct = {
      id: product.id.split('/').pop(),
      title: product.title,
      handle: product.handle,
      description: product.description,
      images: product.images.edges.map(imgEdge => ({
        src: imgEdge.node.url,
        altText: imgEdge.node.altText
      })),
      variants: product.variants.edges.map(variantEdge => ({
        id: variantEdge.node.id.split('/').pop(),
        title: variantEdge.node.title,
        price: variantEdge.node.price,
        selectedOptions: variantEdge.node.selectedOptions,
        inventoryQuantity: variantEdge.node.inventoryQuantity
      })),
      options: product.variants.edges.map(variantEdge => ({
        name: variantEdge.node.title,
        values: [variantEdge.node.title]
      }))
    };
    
    res.status(200).json({ product: transformedProduct });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    console.log('Fetching product with ID:', id);

    // Format ID for Shopify if needed
    const formattedId = id.includes('gid://') 
      ? id 
      : `gid://shopify/Product/${id}`;
    
    // Get product from Shopify
    const product = await shopifyClient.getProductById(formattedId);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    
    // Transform the product for frontend
    const transformedProduct = {
      id: product.id.split('/').pop() || id,
      title: product.title,
      handle: product.handle,
      description: product.description,
      images: product.images.edges.map(imgEdge => ({
        src: imgEdge.node.url,
        altText: imgEdge.node.altText
      })),
      variants: product.variants.edges.map(variantEdge => ({
        id: variantEdge.node.id.split('/').pop(),
        title: variantEdge.node.title,
        price: variantEdge.node.price.amount,
        selectedOptions: variantEdge.node.selectedOptions,
        inventoryQuantity: variantEdge.node.inventoryQuantity,
        availableForSale: variantEdge.node.availableForSale
      })),
      options: product.options.map(option => ({
        name: option.name,
        values: option.values
      }))
    };
    
    res.status(200).json({ 
      success: true,
      product: transformedProduct 
    });
  } catch (error) {
    console.error(`Error fetching product ${req.params.id}:`, error);
    next(error);
  }
};