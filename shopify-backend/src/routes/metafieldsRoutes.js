// routes/metafieldsRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createMetafield,
  getMetafields,
  updateMetafield,
  deleteMetafield
} = require('../controllers/metafieldsController');
const { protect } = require('../middlewares/authMiddleware');

// Metafield Routes for Products
router.post('/products/:productId', 
  protect, 
  createMetafield
);

router.get('/products/:productId', 
  protect, 
  getMetafields
);

router.put('/products/:productId/:metafieldId', 
  protect, 
  updateMetafield
);

router.delete('/products/:productId/:metafieldId', 
  protect, 
  deleteMetafield
);

// Metafield Routes for Customers
router.post('/customers/:customerId', 
  protect, 
  createMetafield
);

router.get('/customers/:customerId', 
  protect, 
  getMetafields
);

module.exports = router;