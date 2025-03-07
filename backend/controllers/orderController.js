import shopifyAPI from "../config/shopify.js";

export const placeOrder = async (req, res) => {
  try {
    const { customer, line_items } = req.body;

    const orderData = {
      order: {
        email: customer.email,
        line_items: line_items.map(item => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
        })),
        financial_status: "pending",
      },
    };

    const response = await shopifyAPI.post("/orders.json", orderData);
    res.json(response.data.order);
  } catch (error) {
    res.status(500).json({ error: "Error placing order" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const response = await shopifyAPI.get("/orders.json", {
      params: { email: req.user.email },
    });
    res.json(response.data.orders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching orders" });
  }
};
