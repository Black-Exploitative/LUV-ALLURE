// backend/routes/collectionRoutes.js
const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', collectionController.getAllCollections);
router.get('/:handle', collectionController.getCollectionByHandle);
router.get('/:handle/products', collectionController.getCollectionProducts);

// Protected routes (Admin only)
// router.use(authMiddleware);
router.post('/', collectionController.createCollection);
router.put('/:id', collectionController.updateCollection);
router.delete('/:id', collectionController.deleteCollection);

module.exports = router;