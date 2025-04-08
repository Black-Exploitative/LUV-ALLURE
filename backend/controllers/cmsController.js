// controllers/cmsController.js
const ContentSection = require('../models/ContentSection');
const Banner = require('../models/Banner');
const NavigationImage = require('../models/NavigationImage');
const ProductRelationship = require('../models/ProductRelationship');
const HomepageLayout = require('../models/HomePageLayout');
const Media = require('../models/Media');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Create multer upload instance with configuration
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB limit
  fileFilter: function(req, file, cb) {
    // Accept images and videos only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm|mov)$/)) {
      return cb(new Error('Only image and video files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Content Sections Controller
exports.getAllSections = async (req, res, next) => {
  try {
    // Create query object based on request params
    const query = {};
    
    // Filter by section type if provided
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    // Filter by active state if provided
    if (req.query.active !== undefined) {
      query.isActive = req.query.active === 'true';
    }
    
    const sections = await ContentSection.find(query)
      .sort({ order: 1 });
    
    res.status(200).json({ 
      success: true, 
      count: sections.length,
      data: sections 
    });
  } catch (error) {
    next(error);
  }
};

exports.getSection = async (req, res, next) => {
  try {
    const section = await ContentSection.findById(req.params.id);
    
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }
    
    res.status(200).json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

exports.createSection = async (req, res, next) => {
  try {
    // Validate section type
    const validTypes = [
      'hero', 'featured-products', 'banner', 'collection', 
      'testimonial', 'shop-banner', 'collection-hero',
      'promo-section', 'shop-header', 'services', 'custom'
    ];
    
    if (req.body.type && !validTypes.includes(req.body.type)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid section type. Must be one of: ${validTypes.join(', ')}` 
      });
    }
    
    // Create section with sanitized data
    const section = await ContentSection.create({
      ...req.body,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    
    res.status(201).json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

exports.updateSection = async (req, res, next) => {
  try {
    // Validate section type if updating
    if (req.body.type) {
      const validTypes = [
        'hero', 'featured-products', 'banner', 'collection', 
        'testimonial', 'shop-banner', 'collection-hero',
        'promo-section', 'shop-header', 'services', 'custom'
      ];
      
      if (!validTypes.includes(req.body.type)) {
        return res.status(400).json({ 
          success: false, 
          message: `Invalid section type. Must be one of: ${validTypes.join(', ')}` 
        });
      }
    }
    
    // Update section with sanitized data
    const section = await ContentSection.findByIdAndUpdate(
      req.params.id, 
      { 
        ...req.body, 
        updatedAt: Date.now() 
      },
      { new: true, runValidators: true }
    );
    
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }
    
    res.status(200).json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

exports.deleteSection = async (req, res, next) => {
  try {
    const section = await ContentSection.findByIdAndDelete(req.params.id);
    
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }
    
    // Remove references from homepage layouts
    await HomepageLayout.updateMany(
      { 'sections.sectionId': req.params.id },
      { $pull: { sections: { sectionId: req.params.id } } }
    );
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// Banner Controller
exports.getAllBanners = async (req, res, next) => {
  try {
    // Create query object based on request params
    const query = {};
    
    // Filter by page if provided
    if (req.query.page) {
      query.page = req.query.page;
    }
    
    // Filter by active state if provided
    if (req.query.active !== undefined) {
      query.isActive = req.query.active === 'true';
    }
    
    const banners = await Banner.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      count: banners.length,
      data: banners 
    });
  } catch (error) {
    next(error);
  }
};

exports.getBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }
    
    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    next(error);
  }
};

exports.createBanner = async (req, res, next) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    next(error);
  }
};

exports.updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }
    
    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    next(error);
  }
};

exports.deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// Navigation Images Controller
exports.getAllNavImages = async (req, res, next) => {
  try {
    const { category } = req.query;
    
    // Create a filter query object based on category
    const query = category ? { category } : {};
    
    // Use the query to filter results
    const navImages = await NavigationImage.find(query).sort({ category: 1, order: 1 });
    
    res.status(200).json({ 
      success: true, 
      count: navImages.length,
      data: navImages 
    });
  } catch (error) {
    next(error);
  }
};

exports.getNavImage = async (req, res, next) => {
  try {
    const navImage = await NavigationImage.findById(req.params.id);
    
    if (!navImage) {
      return res.status(404).json({ success: false, message: 'Navigation image not found' });
    }
    
    res.status(200).json({ success: true, data: navImage });
  } catch (error) {
    next(error);
  }
};

exports.createNavImage = async (req, res, next) => {
  try {
    const navImage = await NavigationImage.create(req.body);
    res.status(201).json({ success: true, data: navImage });
  } catch (error) {
    next(error);
  }
};

exports.updateNavImage = async (req, res, next) => {
  try {
    const navImage = await NavigationImage.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!navImage) {
      return res.status(404).json({ success: false, message: 'Navigation image not found' });
    }
    
    res.status(200).json({ success: true, data: navImage });
  } catch (error) {
    next(error);
  }
};

exports.deleteNavImage = async (req, res, next) => {
  try {
    const navImage = await NavigationImage.findByIdAndDelete(req.params.id);
    
    if (!navImage) {
      return res.status(404).json({ success: false, message: 'Navigation image not found' });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// Product Relationships Controller
exports.getProductRelationships = async (req, res, next) => {
  try {
    const { sourceProductId, relationType } = req.query;
    
    // Build query based on filters
    const query = {};
    if (sourceProductId) query.sourceProductId = sourceProductId;
    if (relationType) query.relationType = relationType;
    
    const relationships = await ProductRelationship.find(query)
      .sort({ relationType: 1, order: 1 });
    
    res.status(200).json({ 
      success: true, 
      count: relationships.length,
      data: relationships 
    });
  } catch (error) {
    next(error);
  }
};

exports.createProductRelationship = async (req, res, next) => {
  try {
    // Check if relationship already exists
    const existing = await ProductRelationship.findOne({
      sourceProductId: req.body.sourceProductId,
      relatedProductId: req.body.relatedProductId,
      relationType: req.body.relationType
    });
    
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: 'This relationship already exists' 
      });
    }
    
    const relationship = await ProductRelationship.create(req.body);
    res.status(201).json({ success: true, data: relationship });
  } catch (error) {
    next(error);
  }
};

exports.updateProductRelationship = async (req, res, next) => {
  try {
    const relationship = await ProductRelationship.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!relationship) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product relationship not found' 
      });
    }
    
    res.status(200).json({ success: true, data: relationship });
  } catch (error) {
    next(error);
  }
};

exports.deleteProductRelationship = async (req, res, next) => {
  try {
    const relationship = await ProductRelationship.findByIdAndDelete(req.params.id);
    
    if (!relationship) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product relationship not found' 
      });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// Homepage Layout Controller
exports.getHomepageLayout = async (req, res, next) => {
  try {
    // Get the active layout or the most recently created one
    const layout = await HomepageLayout.findOne({ isActive: true })
      .populate({
        path: 'sections.sectionId',
        model: 'ContentSection'
      })
      .sort({ createdAt: -1 });
    
    // If no layout exists, return default structure
    if (!layout) {
      return res.status(200).json({ 
        success: true, 
        data: {
          name: 'Default Layout',
          isActive: true,
          sections: []
        }
      });
    }
    
    res.status(200).json({ success: true, data: layout });
  } catch (error) {
    next(error);
  }
};

exports.getAllLayouts = async (req, res, next) => {
  try {
    const layouts = await HomepageLayout.find()
      .sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      count: layouts.length,
      data: layouts 
    });
  } catch (error) {
    next(error);
  }
};

exports.createHomepageLayout = async (req, res, next) => {
  try {
    // If setting this layout as active, deactivate all others
    if (req.body.isActive) {
      await HomepageLayout.updateMany(
        {}, 
        { isActive: false }
      );
    }
    
    const layout = await HomepageLayout.create(req.body);
    
    res.status(201).json({ success: true, data: layout });
  } catch (error) {
    next(error);
  }
};

exports.updateHomepageLayout = async (req, res, next) => {
  try {
    // If setting this layout as active, deactivate all others
    if (req.body.isActive) {
      await HomepageLayout.updateMany(
        { _id: { $ne: req.params.id } }, 
        { isActive: false }
      );
    }
    
    const layout = await HomepageLayout.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!layout) {
      return res.status(404).json({ 
        success: false, 
        message: 'Homepage layout not found' 
      });
    }
    
    res.status(200).json({ success: true, data: layout });
  } catch (error) {
    next(error);
  }
};

exports.deleteHomepageLayout = async (req, res, next) => {
  try {
    const layout = await HomepageLayout.findByIdAndDelete(req.params.id);
    
    if (!layout) {
      return res.status(404).json({ 
        success: false, 
        message: 'Homepage layout not found' 
      });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// Media Controller with file upload
exports.uploadMedia = [
  // File upload middleware
  upload.single('file'),
  
  // Controller function
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
      
      // Determine media type based on mimetype
      const mediaType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
      
      // Create media entry
      const media = await Media.create({
        name: req.body.name || req.file.originalname,
        type: mediaType,
        url: `/uploads/${req.file.filename}`,
        thumbnailUrl: mediaType === 'image' ? `/uploads/${req.file.filename}` : null,
        altText: req.body.altText || '',
        size: req.file.size,
        tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : []
      });
      
      res.status(201).json({ success: true, data: media });
    } catch (error) {
      next(error);
    }
  }
];

exports.getAllMedia = async (req, res, next) => {
  try {
    const { type, search, tags } = req.query;
    
    // Build query based on filters
    const query = {};
    
    // Filter by media type
    if (type) query.type = type;
    
    // Filter by search term
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { altText: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by tags
    if (tags) {
      const tagList = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagList };
    }
    
    // Get pagination parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    
    // Get sorting parameters
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    // Execute query with pagination and sorting
    const media = await Media.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);
    
    // Count total documents for pagination
    const total = await Media.countDocuments(query);
    
    res.status(200).json({ 
      success: true, 
      count: media.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: media 
    });
  } catch (error) {
    next(error);
  }
};

exports.getMediaById = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }
    
    res.status(200).json({ success: true, data: media });
  } catch (error) {
    next(error);
  }
};

exports.updateMedia = async (req, res, next) => {
  try {
    const media = await Media.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }
    
    res.status(200).json({ success: true, data: media });
  } catch (error) {
    next(error);
  }
};

exports.deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }
    
    // Get file path from URL
    const filePath = path.join(__dirname, '..', media.url);
    
    // Delete file if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Also delete thumbnail if it exists and is different from the main file
    if (media.thumbnailUrl && media.thumbnailUrl !== media.url) {
      const thumbnailPath = path.join(__dirname, '..', media.thumbnailUrl);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }
    
    // Remove from database
    await Media.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};