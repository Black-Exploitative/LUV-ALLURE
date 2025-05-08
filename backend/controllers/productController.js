// backend/controllers/productController.js - Fixed variable redeclaration issue
const shopifyClient = require('../utils/shopifyClient');

// Get all products with comprehensive filter support
exports.getProducts = async (req, res, next) => {
  try {
    const { 
      limit = 20, 
      cursor = null,
      category,
      color,
      size,
      collection,
      sort = 'relevance',
      price,
      tag,
      query: searchQuery,
      featured = false,
      page = 1
    } = req.query;
    
    console.log('Fetching products with filters:', {
      limit, cursor, category, color, size, collection, sort, price, tag, searchQuery, featured, page
    });
    
    // Build combined search filter
    const filterString = buildShopifyFilterString({
      category,
      color, 
      size, 
      collection, 
      price,
      tag,
      query: searchQuery, // Pass as query but renamed in the destructuring
      featured
    });
    
    console.log('Generated filter string:', filterString);
    
    // Get sort configuration
    const { sortKey, sortDirection } = getSortConfig(sort);
    
    // Calculate pagination
    const first = parseInt(limit);
    let after = cursor;
    
    // If page is provided and cursor is not, calculate cursor based on page
    if (page > 1 && !after) {
      // This is a simplified approach - in a real scenario, you'd need to
      // maintain cursor state between requests or use offset-based pagination
      // Shopify uses cursor-based pagination, so this is just an approximation
      after = null; // You would ideally compute this based on the page number
    }
    
    // Build GraphQL query for products
    const productQuery = `
      query GetProducts($queryString: String, $first: Int!, $after: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
        products(query: $queryString, first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              description
              productType
              tags
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              featuredImage {
                url
                altText
              }
              images(first: 10) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              options {
                id
                name
                values
              }
              variants(first: 25) {
                edges {
                  node {
                    id
                    title
                    sku
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                    selectedOptions {
                      name
                      value
                    }
                    availableForSale
                    quantityAvailable
                  }
                }
              }
            }
          }
        }
      }
    `;
    
    // Execute the query
    const result = await shopifyClient.query(productQuery, {
      queryString: filterString,
      first: first,
      after: after,
      sortKey: sortKey,
      reverse: sortDirection === 'desc'
    });
    
    // Transform products for the frontend
    const products = result.products.edges.map(({ node }) => {
      // Get main image or use null if none exists
      const mainImage = node.featuredImage?.url || 
                        (node.images.edges.length > 0 ? node.images.edges[0].node.url : null);
      
      // Get all images
      const images = node.images.edges.map(img => img.node.url);
      
      // Get price range
      const minPrice = node.priceRange.minVariantPrice.amount;
      const maxPrice = node.priceRange.maxVariantPrice.amount;
      const displayPrice = minPrice === maxPrice ? minPrice : `${minPrice} - ${maxPrice}`;
      
      // Extract color and size options
      const options = {};
      node.options.forEach(option => {
        const name = option.name.toLowerCase();
        options[name] = option.values;
      });
      
      // Transform variants
      const variants = node.variants.edges.map(({ node: variant }) => ({
        id: variant.id.split('/').pop(),
        title: variant.title,
        price: variant.price.amount,
        compareAtPrice: variant.compareAtPrice?.amount || null,
        sku: variant.sku || '',
        options: variant.selectedOptions,
        availableForSale: variant.availableForSale,
        quantityAvailable: variant.quantityAvailable || 0
      }));
      
      // Extract product ID, removing the Shopify prefix
      const productId = node.id.split('/').pop();
      
      return {
        id: productId,
        title: node.title,
        handle: node.handle,
        description: node.description,
        productType: node.productType,
        tags: node.tags || [],
        price: minPrice,
        displayPrice,
        priceRange: {
          min: minPrice,
          max: maxPrice
        },
        image: mainImage,
        images: images,
        options: options,
        variants: variants
      };
    });
    
    res.status(200).json({
      success: true,
      products,
      pageInfo: result.products.pageInfo,
      filters: extractAvailableFilters(products)
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    next(error);
  }
};

// Build a Shopify-compatible filter string
function buildShopifyFilterString({ category, color, size, collection, price, tag, query, featured }) {
  const filters = [];
  
  // Add search query if provided
  if (query) {
    filters.push(query);
  }
  
  // Add product type filter
  if (category && category !== 'all') {
    // Convert category names to match Shopify's format
    const mappedCategory = category
      .replace(/-/g, ' ')  // Replace hyphens with spaces
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Title case
      .join(' ');
    
    filters.push(`product_type:"${mappedCategory}"`);
  }
  
  // Add color filter - check in tags, title, and variant options
  if (color) {
    // If multiple colors, OR them together
    if (Array.isArray(color)) {
      const colorFilters = color.map(c => `(tag:${c} OR variants:${c} OR option:${c})`);
      filters.push(`(${colorFilters.join(' OR ')})`);
    } else {
      filters.push(`(tag:${color} OR variants:${color} OR option:${color})`);
    }
  }
  
  // Add size filter - check in tags and variant options
  if (size) {
    // If multiple sizes, OR them together
    if (Array.isArray(size)) {
      const sizeFilters = size.map(s => `(tag:${s} OR variants:${s} OR option:${s})`);
      filters.push(`(${sizeFilters.join(' OR ')})`);
    } else {
      filters.push(`(tag:${size} OR variants:${size} OR option:${size})`);
    }
  }
  
  // Add collection filter
  if (collection) {
    filters.push(`collection:${collection}`);
  }
  
  // Add specific tag filter
  if (tag) {
    // If multiple tags, OR them together
    if (Array.isArray(tag)) {
      const tagFilters = tag.map(t => `tag:${t}`);
      filters.push(`(${tagFilters.join(' OR ')})`);
    } else {
      filters.push(`tag:${tag}`);
    }
  }
  
  // Add price filter
  if (price) {
    const [min, max] = price.split('-');
    if (min && !isNaN(min)) {
      filters.push(`variants.price:>=${min}`);
    }
    if (max && !isNaN(max)) {
      filters.push(`variants.price:<=${max}`);
    }
  }
  
  // Featured products filter based on a specific tag
  if (featured === 'true' || featured === true) {
    filters.push('tag:featured');
  }
  
  // Join all filters with AND operator
  return filters.join(' AND ');
}

// Convert sort parameter to Shopify sort config
function getSortConfig(sort) {
  if (!sort) return { sortKey: 'RELEVANCE', sortDirection: 'desc' };
  
  let sortKey = 'RELEVANCE';
  let sortDirection = 'desc';
  
  switch(sort.toLowerCase()) {
    case 'price-low-high':
      sortKey = 'PRICE';
      sortDirection = 'asc';
      break;
    case 'price-high-low':
      sortKey = 'PRICE';
      sortDirection = 'desc';
      break;
    case 'newest':
    case 'latest':
      sortKey = 'CREATED_AT';
      sortDirection = 'desc';
      break;
    case 'oldest':
      sortKey = 'CREATED_AT';
      sortDirection = 'asc';
      break;
    case 'title-asc':
    case 'alphabetical':
    case 'alphabetical: a-z':
      sortKey = 'TITLE';
      sortDirection = 'asc';
      break;
    case 'title-desc':
    case 'alphabetical: z-a':
      sortKey = 'TITLE';
      sortDirection = 'desc';
      break;
    case 'best-selling':
    case 'most-popular':
      sortKey = 'BEST_SELLING';
      sortDirection = 'desc';
      break;
    default:
      sortKey = 'RELEVANCE';
      sortDirection = 'desc';
  }
  
  return { sortKey, sortDirection };
}

// Extract available filters from products
function extractAvailableFilters(products) {
  const filters = {
    colors: new Set(),
    sizes: new Set(),
    categories: new Set(),
    tags: new Set(),
    priceRange: { min: Number.MAX_VALUE, max: 0 }
  };
  
  // Extract filter values from each product
  products.forEach(product => {
    // Extract categories
    if (product.productType) {
      filters.categories.add(product.productType);
    }
    
    // Extract tags
    if (product.tags && Array.isArray(product.tags)) {
      product.tags.forEach(tag => filters.tags.add(tag));
    }
    
    // Extract color and size options
    if (product.options) {
      // Find color options
      if (product.options.color && Array.isArray(product.options.color)) {
        product.options.color.forEach(color => filters.colors.add(color));
      }
      
      // Find size options
      if (product.options.size && Array.isArray(product.options.size)) {
        product.options.size.forEach(size => filters.sizes.add(size));
      }
    }
    
    // Extract price range
    if (product.priceRange) {
      filters.priceRange.min = Math.min(filters.priceRange.min, parseFloat(product.priceRange.min));
      filters.priceRange.max = Math.max(filters.priceRange.max, parseFloat(product.priceRange.max));
    }
  });
  
  // Convert Sets to Arrays
  return {
    colors: Array.from(filters.colors),
    sizes: Array.from(filters.sizes),
    categories: Array.from(filters.categories),
    tags: Array.from(filters.tags),
    priceRange: {
      min: filters.priceRange.min !== Number.MAX_VALUE ? filters.priceRange.min : 0,
      max: filters.priceRange.max > 0 ? filters.priceRange.max : 1000
    }
  };
}

// Get product by handle with enhanced error handling
exports.getProductByHandle = async (req, res, next) => {
  try {
    const { handle } = req.params;
    const result = await shopifyClient.getProductByHandle(handle);
    
    if (!result.product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    const product = result.product;
    
    // Transform the product into a consistent format
    const transformedProduct = {
      id: product.id.split('/').pop(),
      title: product.title,
      handle: product.handle,
      description: product.description,
      productType: product.productType,
      tags: product.tags || [],
      images: product.images.edges.map(imgEdge => ({
        src: imgEdge.node.url,
        altText: imgEdge.node.altText
      })),
      image: product.featuredImage?.url || 
             (product.images.edges.length > 0 ? product.images.edges[0].node.url : null),
      priceRange: {
        min: product.priceRange?.minVariantPrice?.amount || "0.00",
        max: product.priceRange?.maxVariantPrice?.amount || "0.00"
      },
      price: product.priceRange?.minVariantPrice?.amount || "0.00",
      variants: product.variants.edges.map(variantEdge => ({
        id: variantEdge.node.id.split('/').pop(),
        title: variantEdge.node.title,
        price: variantEdge.node.price?.amount || "0.00",
        compareAtPrice: variantEdge.node.compareAtPrice?.amount || null,
        selectedOptions: variantEdge.node.selectedOptions,
        inventoryQuantity: variantEdge.node.inventoryQuantity || 0,
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
    console.error(`Error fetching product by handle ${req.params.handle}:`, error);
    next(error);
  }
};

// Get product by ID with enhanced error handling
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
      productType: product.productType,
      tags: product.tags || [],
      images: product.images.edges.map(imgEdge => ({
        src: imgEdge.node.url,
        altText: imgEdge.node.altText
      })),
      image: product.featuredImage?.url || 
             (product.images.edges.length > 0 ? product.images.edges[0].node.url : null),
      priceRange: {
        min: product.priceRange?.minVariantPrice?.amount || "0.00",
        max: product.priceRange?.maxVariantPrice?.amount || "0.00"
      },
      price: product.priceRange?.minVariantPrice?.amount || "0.00",
      variants: product.variants.edges.map(variantEdge => ({
        id: variantEdge.node.id.split('/').pop(),
        title: variantEdge.node.title,
        price: variantEdge.node.price.amount,
        compareAtPrice: variantEdge.node.compareAtPrice?.amount || null,
        selectedOptions: variantEdge.node.selectedOptions,
        inventoryQuantity: variantEdge.node.quantityAvailable || 0,
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

// Get products by category
exports.getProductsByCategory = async (req, res, next) => {
  try {
    // Set the category in the query and reuse the getProducts method
    req.query.category = req.params.category;
    await exports.getProducts(req, res, next);
  } catch (error) {
    console.error(`Error fetching products by category ${req.params.category}:`, error);
    next(error);
  }
};

// Get products by color
exports.getProductsByColor = async (req, res, next) => {
  try {
    // Set the color in the query and reuse the getProducts method
    req.query.color = req.params.color;
    await exports.getProducts(req, res, next);
  } catch (error) {
    console.error(`Error fetching products by color ${req.params.color}:`, error);
    next(error);
  }
};

// Get products by tag
exports.getProductsByTag = async (req, res, next) => {
  try {
    // Set the tag in the query and reuse the getProducts method
    req.query.tag = req.params.tag;
    await exports.getProducts(req, res, next);
  } catch (error) {
    console.error(`Error fetching products by tag ${req.params.tag}:`, error);
    next(error);
  }
};