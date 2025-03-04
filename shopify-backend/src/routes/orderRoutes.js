const express = require("express");
const router = express.Router();
const { getOrders, createOrder, getOrderById } = require("../controllers/orderController");

router.get("/", getOrders);
router.post("/create", createOrder);
router.get("/:id", getOrderById);

module.exports = router;
