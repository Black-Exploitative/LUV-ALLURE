// backend/utils/sitemap-generator.js
const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const Product = require('../models/Product');
const shopifyClient = require('./shopifyClient');

// Base URL for the site
const BASE_URL = process.env.SITE_URL || 'https://luvsallure.com';

/**
 * Generate a sitemap XML file for the website
 * This includes static pages and dynamic product pages
 */
async function generateSitemap() {
  try {
    console.log('Generating sitemap...');
    
    // Define static pages
    const staticPages = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/shop', changefreq: 'daily', priority: 0.9 },
      { url: '/signup', changefreq: 'monthly', priority: 0.5 },
      { url: '/signin', changefreq: 'monthly', priority: 0.5 },
      { url: '/contact-us', changefreq: 'monthly', priority: 0.7 },
      // Add more static pages as needed
    ];

    // Get all products from Shopify (or database if cached)
    const products = await fetchAllProducts();
    
    // Convert products to sitemap entries
    const productPages = products.map(product => ({
      url: `/product/${product.handle || product.id}`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: product.updatedAt || new Date().toISOString()
    }));

    // Combine static and dynamic pages
    const sitemapEntries = [...staticPages, ...productPages];

    // Create sitemap stream
    const stream = new SitemapStream({ hostname: BASE_URL });
    
    // Write entries to stream
    const data = await streamToPromise(
      Readable.from(sitemapEntries).pipe(stream)
    );
    
    // Write to file
    const sitemapPath = path.join(__dirname, '../../frontend/public/sitemap.xml');
    fs.writeFileSync(sitemapPath, data.toString());
    
    console.log(`Sitemap generated successfully at ${sitemapPath}`);
    return true;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return false;
  }
}

/**
 * Fetch all products from Shopify or from database if cached
 */
async function fetchAllProducts() {
  try {
    // Check if products are cached in the database
    const cachedProducts = await Product.find({}).lean();
    
    if (cachedProducts.length > 0) {
      console.log(`Using ${cachedProducts.length} cached products for sitemap`);
      return cachedProducts;
    }
    
    // If no cached products, fetch from Shopify
    console.log('No cached products found, fetching from Shopify...');
    
    let allProducts = [];
    let hasNextPage = true;
    let cursor = null;
    
    // Fetch all products with pagination
    while (hasNextPage) {
      const result = await shopifyClient.getProducts(100, cursor);
      
      if (!result.products) {
        console.error('No products returned from Shopify');
        break;
      }
      
      const products = result.products.edges.map(({ node }) => ({
        id: node.id.split('/').pop(),
        handle: node.handle,
        title: node.title,
        updatedAt: new Date().toISOString() // Use current date as updated time
      }));
      
      allProducts = [...allProducts, ...products];
      
      // Check if there's a next page
      hasNextPage = result.products.pageInfo.hasNextPage;
      cursor = result.products.pageInfo.endCursor;
      
      console.log(`Fetched ${products.length} products, total: ${allProducts.length}`);
    }
    
    return allProducts;
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
    // Return empty array if fetch fails
    return [];
  }
}

/**
 * Schedule sitemap generation (can be called from server.js)
 * @param {number} intervalHours - Hours between regenerations
 */
function scheduleSitemapGeneration(intervalHours = 24) {
  // Generate sitemap immediately
  generateSitemap();
  
  // Schedule regular updates
  const intervalMs = intervalHours * 60 * 60 * 1000;
  setInterval(generateSitemap, intervalMs);
  
  console.log(`Scheduled sitemap generation every ${intervalHours} hours`);
}

module.exports = {
  generateSitemap,
  scheduleSitemapGeneration
};