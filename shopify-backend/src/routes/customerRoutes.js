const express = require("express");
const router = express.Router();
const { getCustomerSegments } = require("../controllers/customerController");

router.get("/segment", getCustomerSegments);

module.exports = router;
