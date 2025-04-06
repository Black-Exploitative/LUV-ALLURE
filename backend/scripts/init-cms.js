// scripts/init-cms.js
// This script initializes the CMS with default content

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Models
const ContentSection = require('../models/ContentSection');
const Banner = require('../models/Banner');
const NavigationImage = require('../models/NavigationImage');
const ProductRelationship = require('../models/ProductRelationship');
const HomepageLayout = require('../models/HomePageLayout');
const Media = require('../models/Media');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample data
const defaultSections = [
  {
    name: 'Hero Section',
    type: 'hero',
    content: {
      title: 'EXPLORE',
      subtitle: '', // Not needed for current design
      description: '', // Not needed for current design
      buttonText: '', // Not shown in current design
      buttonLink: '#shop',
      alignment: 'center'
    },
    media: {
      imageUrl: '/images/photo3.jpg', // Fallback image
      videoUrl: 'https://cdn.pixabay.com/video/2023/05/15/163117-827112884_large.mp4', // Default video
      altText: 'Hero Background'
    },
    isActive: true,
    order: 0
  },
  {
    name: 'Featured Products',
    type: 'featured-products',
    content: {
      title: "HERE'S WHAT THE SEASON OFFERS",
      description: 'Our collection of trending styles for the season.',
      alignment: 'center'
    },
    isActive: true,
    order: 1
  },
  {
    name: 'Promo Banner',
    type: 'banner',
    content: {
      title: 'Spring Sale',
      description: 'Up to 30% off on selected items.',
      buttonText: 'SHOP THE SALE',
      buttonLink: '/sale',
      alignment: 'center'
    },
    media: {
      imageUrl: '/images/photo4.jpg',
      altText: 'Spring Sale Banner'
    },
    isActive: true,
    order: 2
  }
];

const defaultBanners = [
  {
    name: 'Shop Page Banner',
    page: 'shop',
    title: 'Shop the Latest Trends',
    description: 'Find your perfect style today.',
    imageUrl: '/images/banner.webp',
    altText: 'Shop Banner',
    buttonText: 'EXPLORE',
    buttonLink: '/collections',
    isActive: true
  },
  {
    name: 'Home Page Banner',
    page: 'home',
    title: 'Luxury Fashion',
    description: 'Elevate your style with our exclusive collection.',
    imageUrl: '/images/photo3.jpg',
    altText: 'Home Banner',
    buttonText: 'DISCOVER',
    buttonLink: '/new-arrivals',
    isActive: true
  }
];

const defaultNavImages = [
  {
    name: 'Maxi Dresses',
    category: 'shop',
    imageUrl: '/images/photo6.jpg',
    altText: 'Maxi Dresses',
    link: '/shop/dresses/maxi',
    order: 0,
    isActive: true
  },
  {
    name: 'Mini Dresses',
    category: 'shop',
    imageUrl: '/images/photo4.jpg',
    altText: 'Mini Dresses',
    link: '/shop/dresses/mini',
    order: 1,
    isActive: true
  },
  {
    name: 'Formal Dresses',
    category: 'dresses',
    imageUrl: '/images/photo13.jpg',
    altText: 'Formal Dresses',
    link: '/shop/dresses/formal',
    order: 0,
    isActive: true
  },
  {
    name: 'Wedding Collection',
    category: 'collections',
    imageUrl: '/images/photo11.jpg',
    altText: 'Wedding Collection',
    link: '/collections/wedding',
    order: 0,
    isActive: true
  },
  {
    name: 'New Arrivals',
    category: 'newin',
    imageUrl: '/images/photo7.jpg',
    altText: 'New Arrivals',
    link: '/new-arrivals',
    order: 0,
    isActive: true
  }
];

// Function to initialize the CMS
async function initCMS() {
  try {
    console.log('Initializing CMS with default content...');
    
    // Clear existing data
    await ContentSection.deleteMany({});
    await Banner.deleteMany({});
    await NavigationImage.deleteMany({});
    await HomepageLayout.deleteMany({});
    
    console.log('Cleared existing CMS data');
    
    // Insert default content sections
    const sections = await ContentSection.insertMany(defaultSections);
    console.log(`Added ${sections.length} default content sections`);
    
    // Insert default banners
    const banners = await Banner.insertMany(defaultBanners);
    console.log(`Added ${banners.length} default banners`);
    
    // Insert default navigation images
    const navImages = await NavigationImage.insertMany(defaultNavImages);
    console.log(`Added ${navImages.length} default navigation images`);
    
    // Create default homepage layout
    const homepage = await HomepageLayout.create({
      name: 'Default Layout',
      isActive: true,
      sections: sections.map((section, index) => ({
        sectionId: section._id,
        order: index,
        width: 12 // Full width
      }))
    });
    console.log('Created default homepage layout');
    
    console.log('CMS initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing CMS:', error);
    process.exit(1);
  }
}

// Run the initialization
initCMS();