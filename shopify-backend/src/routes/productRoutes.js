const express = require("express");
const router = express.Router();
const { checkoutProduct } = require("../controllers/productController");

router.post("/checkout", checkoutProduct);

module.exports = router;
