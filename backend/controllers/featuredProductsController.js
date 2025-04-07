// controllers/featuredProductsController.js
const FeaturedProducts = require('../models/FeaturedProducts');
const shopifyClient = require('../utils/shopifyClient');

// Get featured products for a section
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const { section } = req.query;
    
    if (!section) {
      return res.status(400).json({ 
        success: false, 
        message: 'Section identifier is required' 
      });
    }
    
    // Find the featured products configuration for this section
    const featuredConfig = await FeaturedProducts.findOne({ sectionId: section });
    
    // If no configuration exists or no products are configured
    if (!featuredConfig || !featuredConfig.productIds || featuredConfig.productIds.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: 'No featured products configured for this section',
        products: [],
        title: featuredConfig?.title || null
      });
    }
    
    // Fetch product details from Shopify using the IDs
    const productDetails = [];
    
    for (const productId of featuredConfig.productIds) {
      try {
        // Fetch product from Shopify
        const product = await shopifyClient.getProductById(productId);
        
        if (product) {
          // Transform the product data to a simpler structure
          const transformedProduct = {
            id: productId,
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
          
          productDetails.push(transformedProduct);
        }
      } catch (err) {
        console.error(`Error fetching product ${productId}:`, err);
        // Continue with other products if one fails
      }
    }
    
    res.status(200).json({
      success: true,
      title: featuredConfig.title,
      products: productDetails
    });
  } catch (error) {
    next(error);
  }
};

// Create or update featured products for a section
exports.updateFeaturedProducts = async (req, res, next) => {
  try {
    const { sectionId } = req.params;
    const { productIds, title } = req.body;
    
    if (!sectionId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Section identifier is required' 
      });
    }
    
    if (!productIds || !Array.isArray(productIds)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product IDs array is required' 
      });
    }
    
    // Find existing config or create a new one
    let featuredConfig = await FeaturedProducts.findOne({ sectionId });
    
    if (!featuredConfig) {
      featuredConfig = new FeaturedProducts({
        sectionId,
        title: title || `Featured Products (${sectionId})`,
        productIds
      });
    } else {
      featuredConfig.productIds = productIds;
      if (title) featuredConfig.title = title;
    }
    
    await featuredConfig.save();
    
    res.status(200).json({
      success: true,
      message: 'Featured products updated successfully',
      data: featuredConfig
    });
  } catch (error) {
    next(error);
  }
};

// Delete featured products configuration
exports.deleteFeaturedProducts = async (req, res, next) => {
  try {
    const { sectionId } = req.params;
    
    if (!sectionId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Section identifier is required' 
      });
    }
    
    const result = await FeaturedProducts.deleteOne({ sectionId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Featured products configuration not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Featured products configuration deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Add this function to featuredProductsController.js
exports.getAllSections = async (req, res, next) => {
    try {
      // Find all featured products configurations
      const featuredConfigs = await FeaturedProducts.find().sort({ createdAt: -1 });
      
      res.status(200).json({
        success: true,
        sections: featuredConfigs
      });
    } catch (error) {
      next(error);
    }
  };