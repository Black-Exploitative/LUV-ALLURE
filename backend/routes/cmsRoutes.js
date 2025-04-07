// routes/cmsRoutes.js
const express = require('express');
const router = express.Router();
const cmsController = require('../controllers/cmsController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes - Admin only
//router.use(authMiddleware);

// Content Section routes
router.route('/sections')
  .get(cmsController.getAllSections)
  .post(cmsController.createSection);

router.route('/sections/:id')
  .get(cmsController.getSection)
  .put(cmsController.updateSection)
  .delete(cmsController.deleteSection);

// Banner routes
router.route('/banners')
  .get(cmsController.getAllBanners)
  .post(cmsController.createBanner);

router.route('/banners/:id')
  .get(cmsController.getBanner)
  .put(cmsController.updateBanner)
  .delete(cmsController.deleteBanner);

// Navigation Image routes
router.route('/nav-images')
  .get(cmsController.getAllNavImages)
  .post(cmsController.createNavImage);

router.route('/nav-images/:id')
  .get(cmsController.getNavImage)
  .put(cmsController.updateNavImage)
  .delete(cmsController.deleteNavImage);

// Product Relationship routes
router.route('/product-relationships')
  .get(cmsController.getProductRelationships)
  .post(cmsController.createProductRelationship);

router.route('/product-relationships/:id')
  .put(cmsController.updateProductRelationship)
  .delete(cmsController.deleteProductRelationship);

// Homepage Layout routes
router.route('/homepage')
  .get(cmsController.getHomepageLayout);

router.route('/layouts')
  .get(cmsController.getAllLayouts)
  .post(cmsController.createHomepageLayout);

router.route('/layouts/:id')
  .put(cmsController.updateHomepageLayout)
  .delete(cmsController.deleteHomepageLayout);

// Media routes
router.route('/media')
  .get(cmsController.getAllMedia)
  .post(cmsController.uploadMedia);

router.route('/media/:id')
  .get(cmsController.getMediaById)
  .put(cmsController.updateMedia)
  .delete(cmsController.deleteMedia);

  router.route('/shop-headers')
  .get(async (req, res, next) => {
    try {
      const shopHeaders = await ContentSection.find({ type: 'shop-header' })
        .sort({ order: 1, createdAt: -1 });
      
      res.status(200).json({ 
        success: true, 
        count: shopHeaders.length,
        data: shopHeaders 
      });
    } catch (error) {
      next(error);
    }
  });

// Promo Section routes
router.route('/promo-sections')
  .get(async (req, res, next) => {
    try {
      const promoSections = await ContentSection.find({ type: 'promo-section' })
        .sort({ order: 1, createdAt: -1 });
      
      res.status(200).json({ 
        success: true, 
        count: promoSections.length,
        data: promoSections 
      });
    } catch (error) {
      next(error);
    }
  });

// Collection Hero routes
router.route('/collection-heroes')
  .get(async (req, res, next) => {
    try {
      const collectionHeroes = await ContentSection.find({ type: 'collection-hero' })
        .sort({ order: 1, createdAt: -1 });
      
      res.status(200).json({ 
        success: true, 
        count: collectionHeroes.length,
        data: collectionHeroes 
      });
    } catch (error) {
      next(error);
    }
  });

// Services routes
router.route('/services')
  .get(async (req, res, next) => {
    try {
      const services = await ContentSection.find({ type: 'services' })
        .sort({ order: 1, createdAt: -1 });
      
      res.status(200).json({ 
        success: true, 
        count: services.length,
        data: services 
      });
    } catch (error) {
      next(error);
    }
  });

module.exports = router;