const shopifyService = require("../services/shopifyService");

exports.getOrders = async (req, res) => {
  try {
    const orders = await shopifyService.getOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const newOrder = await shopifyService.createOrder(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: "Order creation failed" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await shopifyService.getOrderById(req.params.id);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Order not found" });
  }
};
